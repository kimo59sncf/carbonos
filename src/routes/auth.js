const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const authConfig = require('../config/auth');
const { User, AccessLog } = require('../models');

// Middleware pour valider les entrées
const validateRegister = [
  check('firstName', 'Le prénom est requis').not().isEmpty(),
  check('lastName', 'Le nom est requis').not().isEmpty(),
  check('email', 'Veuillez inclure un email valide').isEmail(),
  check('password', 'Veuillez entrer un mot de passe de 8 caractères minimum').isLength({ min: 8 }),
  check('companyId', 'L\'ID de l\'entreprise est requis').not().isEmpty(),
  check('consentDataProcessing', 'Le consentement au traitement des données est requis').isBoolean().equals('true')
];

const validateLogin = [
  check('email', 'Veuillez inclure un email valide').isEmail(),
  check('password', 'Le mot de passe est requis').exists()
];

// Route d'inscription
router.post('/register', validateRegister, async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password, companyId, consentMarketing, consentDataProcessing } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'Cet utilisateur existe déjà' }] });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(authConfig.bcrypt.saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      companyId,
      consentMarketing: consentMarketing || false,
      consentDataProcessing
    });

    // Journaliser l'action
    await AccessLog.create({
      userId: user.id,
      action: 'register',
      resourceType: 'user',
      resourceId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    // Générer le token JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiresIn },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route de connexion
router.post('/login', validateLogin, async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Identifiants invalides' }] });
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      return res.status(403).json({ errors: [{ msg: 'Ce compte a été désactivé' }] });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Journaliser l'échec de connexion
      await AccessLog.create({
        userId: user.id,
        action: 'login',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        status: 'failure',
        details: { reason: 'invalid_password' }
      });

      return res.status(400).json({ errors: [{ msg: 'Identifiants invalides' }] });
    }

    // Mettre à jour la date de dernière connexion
    await user.update({ lastLogin: new Date() });

    // Journaliser la connexion réussie
    await AccessLog.create({
      userId: user.id,
      action: 'login',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    // Générer le token JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    // Générer un refresh token
    const refreshToken = jwt.sign(
      { id: user.id },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtRefreshExpiresIn }
    );

    // Sauvegarder le refresh token
    await user.update({ refreshToken });

    jwt.sign(
      payload,
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiresIn },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          refreshToken,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            companyId: user.companyId
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route de rafraîchissement du token
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ errors: [{ msg: 'Refresh token manquant' }] });
  }

  try {
    // Vérifier le refresh token
    const decoded = jwt.verify(refreshToken, authConfig.jwtSecret);
    
    // Trouver l'utilisateur
    const user = await User.findOne({
      where: {
        id: decoded.id,
        refreshToken,
        isActive: true
      }
    });

    if (!user) {
      return res.status(401).json({ errors: [{ msg: 'Token invalide' }] });
    }

    // Générer un nouveau token JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    // Générer un nouveau refresh token
    const newRefreshToken = jwt.sign(
      { id: user.id },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtRefreshExpiresIn }
    );

    // Sauvegarder le nouveau refresh token
    await user.update({ refreshToken: newRefreshToken });

    jwt.sign(
      payload,
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiresIn },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          refreshToken: newRefreshToken
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ errors: [{ msg: 'Token invalide ou expiré' }] });
  }
});

// Route de déconnexion
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ errors: [{ msg: 'Refresh token manquant' }] });
  }

  try {
    // Trouver l'utilisateur par refresh token
    const user = await User.findOne({ where: { refreshToken } });

    if (user) {
      // Invalider le refresh token
      await user.update({ refreshToken: null });

      // Journaliser la déconnexion
      await AccessLog.create({
        userId: user.id,
        action: 'logout',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        status: 'success'
      });
    }

    res.json({ msg: 'Déconnexion réussie' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route de mot de passe oublié
router.post('/forgot-password', [
  check('email', 'Veuillez inclure un email valide').isEmail()
], async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Pour des raisons de sécurité, ne pas indiquer si l'email existe ou non
      return res.json({ msg: 'Si cet email est associé à un compte, un lien de réinitialisation a été envoyé' });
    }

    // Générer un token de réinitialisation
    const resetToken = jwt.sign(
      { id: user.id },
      authConfig.jwtSecret,
      { expiresIn: '1h' }
    );

    // Sauvegarder le token et sa date d'expiration
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);
    
    await user.update({
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires
    });

    // TODO: Envoyer l'email avec le lien de réinitialisation
    // Dans une implémentation réelle, on utiliserait un service d'envoi d'emails

    // Journaliser la demande de réinitialisation
    await AccessLog.create({
      userId: user.id,
      action: 'forgot_password',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json({ msg: 'Si cet email est associé à un compte, un lien de réinitialisation a été envoyé' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route de réinitialisation de mot de passe
router.post('/reset-password/:token', [
  check('password', 'Veuillez entrer un mot de passe de 8 caractères minimum').isLength({ min: 8 })
], async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { password } = req.body;
  const { token } = req.params;

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, authConfig.jwtSecret);
    
    // Trouver l'utilisateur
    const user = await User.findOne({
      where: {
        id: decoded.id,
        passwordResetToken: token,
        passwordResetExpires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Token invalide ou expiré' }] });
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(authConfig.bcrypt.saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Mettre à jour le mot de passe et réinitialiser les champs de réinitialisation
    await user.update({
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null
    });

    // Journaliser la réinitialisation du mot de passe
    await AccessLog.create({
      userId: user.id,
      action: 'reset_password',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json({ msg: 'Mot de passe réinitialisé avec succès' });
  } catch (err) {
    console.error(err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ errors: [{ msg: 'Token invalide' }] });
    }
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
