const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const Company = require('../models/Company');
const { logAccess } = require('../middleware/rgpd');

// @route   POST /api/trial/register
// @desc    Register a new trial user
// @access  Public
router.post(
  '/register',
  [
    // Validation des champs
    check('companyName', 'Le nom de l\'entreprise est requis').not().isEmpty(),
    check('industry', 'Le secteur d\'activité est requis').not().isEmpty(),
    check('employees', 'Le nombre d\'employés est requis').not().isEmpty(),
    check('firstName', 'Le prénom est requis').not().isEmpty(),
    check('lastName', 'Le nom est requis').not().isEmpty(),
    check('position', 'Le poste est requis').not().isEmpty(),
    check('email', 'Veuillez inclure un email valide').isEmail(),
    check('acceptTerms', 'Vous devez accepter les conditions d\'utilisation').equals('true'),
    check('acceptPrivacy', 'Vous devez accepter la politique de confidentialité').equals('true')
  ],
  async (req, res) => {
    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      companyName,
      industry,
      employees,
      firstName,
      lastName,
      position,
      email,
      phone,
      acceptTerms,
      acceptPrivacy
    } = req.body;

    try {
      // Vérifier si l'utilisateur existe déjà
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          errors: [{ msg: 'Cet email est déjà utilisé' }]
        });
      }

      // Créer une nouvelle entreprise
      const company = new Company({
        name: companyName,
        industry,
        employeeCount: employees,
        trialStatus: {
          isTrialActive: true,
          trialStartDate: new Date(),
          trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
          remainingReports: 2,
          remainingEmissionSources: 5
        }
      });

      await company.save();

      // Générer un mot de passe temporaire
      const tempPassword = Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(tempPassword, salt);

      // Créer un nouvel utilisateur
      user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        position,
        phone,
        company: company._id,
        role: 'admin',
        consentInfo: {
          termsAccepted: acceptTerms,
          privacyAccepted: acceptPrivacy,
          marketingAccepted: false,
          consentDate: new Date()
        },
        mustChangePassword: true
      });

      await user.save();

      // Journaliser l'accès RGPD
      logAccess({
        userId: user._id,
        action: 'TRIAL_REGISTRATION',
        details: 'Inscription à l\'essai gratuit',
        ipAddress: req.ip
      });

      // Créer et retourner le JWT
      const payload = {
        user: {
          id: user._id,
          role: user.role,
          companyId: company._id
        }
      };

      jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: config.jwtExpire },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role
            },
            company: {
              id: company._id,
              name: company.name
            },
            tempPassword
          });
        }
      );

      // TODO: Envoyer un email de bienvenue avec les identifiants

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
    }
  }
);

// @route   GET /api/trial/status
// @desc    Get trial status for current company
// @access  Private
router.get('/status', async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId);
    
    if (!company) {
      return res.status(404).json({ msg: 'Entreprise non trouvée' });
    }

    // Vérifier si l'essai est toujours actif
    const now = new Date();
    const trialEndDate = new Date(company.trialStatus.trialEndDate);
    
    if (now > trialEndDate) {
      company.trialStatus.isTrialActive = false;
      await company.save();
    }

    res.json(company.trialStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST /api/trial/extend
// @desc    Extend trial period (admin only)
// @access  Private/Admin
router.post('/extend', async (req, res) => {
  try {
    const { companyId, days } = req.body;
    
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ msg: 'Accès non autorisé' });
    }

    const company = await Company.findById(companyId);
    
    if (!company) {
      return res.status(404).json({ msg: 'Entreprise non trouvée' });
    }

    // Prolonger la période d'essai
    const currentEndDate = new Date(company.trialStatus.trialEndDate);
    const newEndDate = new Date(currentEndDate.getTime() + days * 24 * 60 * 60 * 1000);
    
    company.trialStatus.trialEndDate = newEndDate;
    company.trialStatus.isTrialActive = true;
    
    await company.save();

    // Journaliser l'action
    logAccess({
      userId: req.user.id,
      action: 'TRIAL_EXTENSION',
      details: `Prolongation de l'essai de ${days} jours pour l'entreprise ${company.name}`,
      ipAddress: req.ip
    });

    res.json(company.trialStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST /api/trial/upgrade
// @desc    Upgrade from trial to paid plan
// @access  Private
router.post('/upgrade', async (req, res) => {
  try {
    const { planType } = req.body;
    
    const company = await Company.findById(req.user.companyId);
    
    if (!company) {
      return res.status(404).json({ msg: 'Entreprise non trouvée' });
    }

    // Mettre à jour le statut de l'entreprise
    company.subscription = {
      plan: planType,
      startDate: new Date(),
      status: 'active'
    };
    
    // Désactiver le statut d'essai
    company.trialStatus.isTrialActive = false;
    
    await company.save();

    // Journaliser l'action
    logAccess({
      userId: req.user.id,
      action: 'TRIAL_UPGRADE',
      details: `Passage au plan payant ${planType} pour l'entreprise ${company.name}`,
      ipAddress: req.ip
    });

    res.json({
      msg: 'Mise à niveau vers le plan payant effectuée avec succès',
      subscription: company.subscription
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
