const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');
const Company = require('../models/Company');
const User = require('../models/User');
const rgpdMiddleware = require('../middleware/rgpd');

// @route   GET api/subscription
// @desc    Get current subscription
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ company: req.user.company });

    if (!subscription) {
      return res.status(404).json({ message: 'Aucun abonnement trouvé pour cette entreprise' });
    }

    res.json(subscription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/subscription/payments
// @desc    Get payment history
// @access  Private
router.get('/payments', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ company: req.user.company }).sort({ date: -1 });

    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST api/subscription
// @desc    Subscribe to a plan
// @access  Private
router.post(
  '/',
  [
    auth,
    rgpdMiddleware.logDataAccess,
    [
      check('planId', 'Le plan est requis').not().isEmpty(),
      check('billingInfo', 'Les informations de facturation sont requises').isObject(),
      check('billingInfo.companyName', 'Le nom de l\'entreprise est requis').not().isEmpty(),
      check('billingInfo.address', 'L\'adresse est requise').not().isEmpty(),
      check('billingInfo.city', 'La ville est requise').not().isEmpty(),
      check('billingInfo.postalCode', 'Le code postal est requis').not().isEmpty(),
      check('billingInfo.country', 'Le pays est requis').not().isEmpty(),
      check('billingInfo.contactName', 'Le nom du contact est requis').not().isEmpty(),
      check('billingInfo.contactEmail', 'L\'email du contact est requis').isEmail(),
      check('paymentMethod', 'La méthode de paiement est requise').isIn(['card', 'transfer'])
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { planId, billingInfo, paymentMethod, paymentInfo } = req.body;

    try {
      // Vérifier si l'entreprise existe
      const company = await Company.findById(req.user.company);
      if (!company) {
        return res.status(404).json({ message: 'Entreprise non trouvée' });
      }

      // Vérifier si un abonnement existe déjà
      let subscription = await Subscription.findOne({ company: req.user.company });

      // Déterminer les limites et le prix en fonction du plan
      let limits = {};
      let price = 0;

      switch (planId) {
        case 'starter':
          limits = {
            maxEmissionSources: 20,
            maxReports: 5,
            hasCollaboration: false,
            hasAccountingIntegration: false,
            hasBenchmarking: false
          };
          price = 99;
          break;
        case 'business':
          limits = {
            maxEmissionSources: 100,
            maxReports: -1, // illimité
            hasCollaboration: true,
            hasAccountingIntegration: true,
            hasBenchmarking: true,
            hasBenchmarkingAdvanced: false,
            hasCustomApi: false
          };
          price = 299;
          break;
        case 'enterprise':
          limits = {
            maxEmissionSources: -1, // illimité
            maxReports: -1, // illimité
            hasCollaboration: true,
            hasCollaborationAdvanced: true,
            hasAccountingIntegration: true,
            hasBenchmarking: true,
            hasBenchmarkingAdvanced: true,
            hasCustomApi: true,
            hasDedicatedSupport: true
          };
          price = 499;
          break;
        default:
          return res.status(400).json({ message: 'Plan invalide' });
      }

      // Créer ou mettre à jour l'abonnement
      if (subscription) {
        subscription.plan = planId;
        subscription.price = price;
        subscription.billingInfo = billingInfo;
        subscription.paymentMethod = paymentMethod;
        subscription.limits = limits;
        subscription.status = paymentMethod === 'card' ? 'active' : 'pending';
        subscription.renewalDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // +30 jours
      } else {
        subscription = new Subscription({
          company: req.user.company,
          plan: planId,
          price,
          billingInfo,
          paymentMethod,
          limits,
          status: paymentMethod === 'card' ? 'active' : 'pending',
          startDate: new Date(),
          renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 jours
        });
      }

      // Si paiement par carte, enregistrer les informations de paiement (en production, utiliser un service de paiement sécurisé)
      if (paymentMethod === 'card' && paymentInfo) {
        // En production, ne jamais stocker les informations de carte complètes
        // Utiliser un service comme Stripe, PayPal, etc.
        // Ici, nous simulons juste le processus
        
        // Créer un enregistrement de paiement
        const payment = new Payment({
          company: req.user.company,
          amount: price,
          currency: 'EUR',
          status: 'completed',
          paymentMethod,
          description: `Abonnement ${planId.charAt(0).toUpperCase() + planId.slice(1)}`,
          metadata: {
            planId,
            cardLast4: paymentInfo.cardNumber.slice(-4)
          }
        });

        await payment.save();
      }

      // Mettre à jour le statut de l'entreprise
      company.subscriptionStatus = paymentMethod === 'card' ? 'active' : 'pending';
      company.subscriptionPlan = planId;
      await company.save();

      // Sauvegarder l'abonnement
      await subscription.save();

      res.json({
        currentPlan: {
          id: subscription.plan,
          status: subscription.status,
          startDate: subscription.startDate,
          renewalDate: subscription.renewalDate,
          limits: subscription.limits
        },
        billingInfo: subscription.billingInfo
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
    }
  }
);

// @route   PUT api/subscription/billing
// @desc    Update billing information
// @access  Private
router.put(
  '/billing',
  [
    auth,
    rgpdMiddleware.logDataAccess,
    [
      check('companyName', 'Le nom de l\'entreprise est requis').not().isEmpty(),
      check('address', 'L\'adresse est requise').not().isEmpty(),
      check('city', 'La ville est requise').not().isEmpty(),
      check('postalCode', 'Le code postal est requis').not().isEmpty(),
      check('country', 'Le pays est requis').not().isEmpty(),
      check('contactName', 'Le nom du contact est requis').not().isEmpty(),
      check('contactEmail', 'L\'email du contact est requis').isEmail()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const subscription = await Subscription.findOne({ company: req.user.company });

      if (!subscription) {
        return res.status(404).json({ message: 'Aucun abonnement trouvé pour cette entreprise' });
      }

      subscription.billingInfo = req.body;
      await subscription.save();

      res.json(subscription.billingInfo);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
    }
  }
);

// @route   DELETE api/subscription
// @desc    Cancel subscription
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ company: req.user.company });

    if (!subscription) {
      return res.status(404).json({ message: 'Aucun abonnement trouvé pour cette entreprise' });
    }

    // Mettre à jour le statut plutôt que de supprimer
    subscription.status = 'cancelled';
    subscription.cancellationDate = new Date();
    await subscription.save();

    // Mettre à jour le statut de l'entreprise
    const company = await Company.findById(req.user.company);
    if (company) {
      company.subscriptionStatus = 'cancelled';
      await company.save();
    }

    res.json({ message: 'Abonnement annulé avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
