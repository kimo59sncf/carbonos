const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { User, Company, AccessLog } = require('../models');

// Middleware pour vérifier les rôles
const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ errors: [{ msg: 'Accès non autorisé' }] });
  }
  next();
};

// Middleware pour valider les entrées
const validateUserUpdate = [
  check('firstName', 'Le prénom est requis').optional().not().isEmpty(),
  check('lastName', 'Le nom est requis').optional().not().isEmpty(),
  check('email', 'Veuillez inclure un email valide').optional().isEmail()
];

// Route pour obtenir le profil de l'utilisateur connecté
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'refreshToken', 'passwordResetToken', 'passwordResetExpires'] },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'sector', 'employeeCount']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
    }

    // Journaliser l'accès au profil
    await AccessLog.create({
      userId: req.user.id,
      action: 'view_profile',
      resourceType: 'user',
      resourceId: req.user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour mettre à jour le profil de l'utilisateur connecté
router.put('/profile', [auth, validateUserUpdate], async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, consentMarketing } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ errors: [{ msg: 'Cet email est déjà utilisé' }] });
      }
    }

    // Mettre à jour les champs
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (consentMarketing !== undefined) updateData.consentMarketing = consentMarketing;

    await user.update(updateData);

    // Journaliser la mise à jour du profil
    await AccessLog.create({
      userId: req.user.id,
      action: 'update_profile',
      resourceType: 'user',
      resourceId: req.user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success',
      details: { updatedFields: Object.keys(updateData) }
    });

    // Retourner l'utilisateur mis à jour sans les champs sensibles
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'refreshToken', 'passwordResetToken', 'passwordResetExpires'] },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'sector', 'employeeCount']
        }
      ]
    });

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour changer le mot de passe
router.put('/change-password', [
  auth,
  check('currentPassword', 'Le mot de passe actuel est requis').exists(),
  check('newPassword', 'Veuillez entrer un nouveau mot de passe de 8 caractères minimum').isLength({ min: 8 })
], async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
    }

    // Vérifier le mot de passe actuel
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      // Journaliser l'échec de changement de mot de passe
      await AccessLog.create({
        userId: req.user.id,
        action: 'change_password',
        resourceType: 'user',
        resourceId: req.user.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        status: 'failure',
        details: { reason: 'invalid_current_password' }
      });

      return res.status(400).json({ errors: [{ msg: 'Mot de passe actuel incorrect' }] });
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Mettre à jour le mot de passe
    await user.update({ password: hashedPassword });

    // Journaliser le changement de mot de passe
    await AccessLog.create({
      userId: req.user.id,
      action: 'change_password',
      resourceType: 'user',
      resourceId: req.user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json({ msg: 'Mot de passe modifié avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour obtenir tous les utilisateurs (admin seulement)
router.get('/', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'refreshToken', 'passwordResetToken', 'passwordResetExpires'] },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'sector']
        }
      ]
    });

    // Journaliser l'accès à la liste des utilisateurs
    await AccessLog.create({
      userId: req.user.id,
      action: 'view_all_users',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour obtenir un utilisateur par ID (admin seulement)
router.get('/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'refreshToken', 'passwordResetToken', 'passwordResetExpires'] },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'sector', 'employeeCount']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
    }

    // Journaliser l'accès à un utilisateur spécifique
    await AccessLog.create({
      userId: req.user.id,
      action: 'view_user',
      resourceType: 'user',
      resourceId: req.params.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour mettre à jour un utilisateur par ID (admin seulement)
router.put('/:id', [
  auth,
  checkRole(['admin']),
  validateUserUpdate
], async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, role, isActive } = req.body;

  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ errors: [{ msg: 'Cet email est déjà utilisé' }] });
      }
    }

    // Mettre à jour les champs
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    await user.update(updateData);

    // Journaliser la mise à jour d'un utilisateur
    await AccessLog.create({
      userId: req.user.id,
      action: 'update_user',
      resourceType: 'user',
      resourceId: req.params.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success',
      details: { updatedFields: Object.keys(updateData) }
    });

    // Retourner l'utilisateur mis à jour sans les champs sensibles
    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'refreshToken', 'passwordResetToken', 'passwordResetExpires'] },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'sector', 'employeeCount']
        }
      ]
    });

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour supprimer un utilisateur (soft delete) (admin seulement)
router.delete('/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
    }

    // Empêcher la suppression de son propre compte
    if (user.id === req.user.id) {
      return res.status(400).json({ errors: [{ msg: 'Vous ne pouvez pas supprimer votre propre compte' }] });
    }

    // Soft delete
    await user.destroy();

    // Journaliser la suppression d'un utilisateur
    await AccessLog.create({
      userId: req.user.id,
      action: 'delete_user',
      resourceType: 'user',
      resourceId: req.params.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json({ msg: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
