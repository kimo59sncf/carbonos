const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { User, Company, SharedDocument, AccessLog } = require('../models');
const { Op } = require('sequelize');

// Middleware pour vérifier les rôles
const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ errors: [{ msg: 'Accès non autorisé' }] });
  }
  next();
};

// Route pour obtenir tous les collaborateurs de l'entreprise
router.get('/collaborators', auth, async (req, res) => {
  try {
    // Récupérer l'utilisateur avec son entreprise
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Company, as: 'company' }]
    });

    if (!user || !user.company) {
      return res.status(404).json({ errors: [{ msg: 'Entreprise non trouvée' }] });
    }

    // Récupérer tous les utilisateurs de l'entreprise
    const collaborators = await User.findAll({
      where: { 
        companyId: user.company.id,
        id: { [Op.ne]: req.user.id } // Exclure l'utilisateur actuel
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'lastLogin', 'isActive'],
      order: [['lastName', 'ASC'], ['firstName', 'ASC']]
    });

    // Récupérer les utilisateurs externes avec qui des documents ont été partagés
    const externalCollaborators = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'companyId', 'lastLogin'],
      include: [
        { 
          model: Company, 
          as: 'company',
          attributes: ['id', 'name']
        },
        {
          model: SharedDocument,
          as: 'receivedShares',
          where: { sharedBy: req.user.id },
          required: true
        }
      ]
    });

    // Journaliser l'accès à la liste des collaborateurs
    await AccessLog.create({
      userId: req.user.id,
      action: 'view_collaborators',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json({
      internal: collaborators,
      external: externalCollaborators
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour inviter un collaborateur externe
router.post('/invite', [
  auth,
  check('email', 'Veuillez inclure un email valide').isEmail(),
  check('role', 'Le rôle est requis').isIn(['viewer', 'editor']),
  check('message', 'Le message est requis').optional()
], async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, role, message } = req.body;

  try {
    // Récupérer l'utilisateur avec son entreprise
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Company, as: 'company' }]
    });

    if (!user || !user.company) {
      return res.status(404).json({ errors: [{ msg: 'Entreprise non trouvée' }] });
    }

    // Vérifier si l'utilisateur a le droit d'inviter (admin ou editor)
    if (user.role !== 'admin' && user.role !== 'editor') {
      return res.status(403).json({ errors: [{ msg: 'Vous n\'êtes pas autorisé à inviter des collaborateurs' }] });
    }

    // Vérifier si l'utilisateur existe déjà
    let invitedUser = await User.findOne({ where: { email } });

    if (invitedUser) {
      // L'utilisateur existe déjà, on peut directement partager des documents avec lui
      return res.json({
        success: true,
        message: 'L\'utilisateur existe déjà et peut être ajouté comme collaborateur',
        user: {
          id: invitedUser.id,
          email: invitedUser.email,
          firstName: invitedUser.firstName,
          lastName: invitedUser.lastName
        }
      });
    }

    // Dans une implémentation réelle, on enverrait un email d'invitation
    // Pour l'exemple, on simule la création d'une invitation
    const invitation = {
      id: Math.random().toString(36).substring(2, 15),
      email,
      role,
      message,
      companyId: user.company.id,
      companyName: user.company.name,
      invitedBy: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      },
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
    };

    // Journaliser l'invitation
    await AccessLog.create({
      userId: req.user.id,
      action: 'invite_collaborator',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success',
      details: { invitedEmail: email, role }
    });

    res.json({
      success: true,
      message: 'Invitation envoyée avec succès',
      invitation
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour obtenir tous les documents partagés
router.get('/shared-documents', auth, async (req, res) => {
  try {
    // Récupérer les documents partagés par l'utilisateur
    const sharedByMe = await SharedDocument.findAll({
      where: { sharedBy: req.user.id },
      include: [
        { 
          model: User, 
          as: 'recipient',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Récupérer les documents partagés avec l'utilisateur
    const sharedWithMe = await SharedDocument.findAll({
      where: { sharedWith: req.user.id },
      include: [
        { 
          model: User, 
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Journaliser l'accès aux documents partagés
    await AccessLog.create({
      userId: req.user.id,
      action: 'view_shared_documents',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json({
      sharedByMe,
      sharedWithMe
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour partager un document
router.post('/share', [
  auth,
  check('documentType', 'Le type de document est requis').isIn(['report', 'emissions', 'action_plan']),
  check('documentId', 'L\'ID du document est requis').not().isEmpty(),
  check('sharedWith', 'L\'ID de l\'utilisateur avec qui partager est requis').not().isEmpty(),
  check('accessLevel', 'Le niveau d\'accès est requis').isIn(['view', 'edit'])
], async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { documentType, documentId, sharedWith, accessLevel, expiresAt } = req.body;

  try {
    // Vérifier si l'utilisateur avec qui partager existe
    const recipient = await User.findByPk(sharedWith);
    if (!recipient) {
      return res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
    }

    // Vérifier si le partage existe déjà
    const existingShare = await SharedDocument.findOne({
      where: {
        documentType,
        documentId,
        sharedWith
      }
    });

    if (existingShare) {
      // Mettre à jour le partage existant
      await existingShare.update({
        accessLevel,
        expiresAt: expiresAt || null,
        isActive: true
      });

      // Journaliser la mise à jour d'un partage
      await AccessLog.create({
        userId: req.user.id,
        action: 'update_share',
        resourceType: 'shared_document',
        resourceId: existingShare.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        status: 'success'
      });

      return res.json(existingShare);
    }

    // Créer un nouveau partage
    const sharedDocument = await SharedDocument.create({
      documentType,
      documentId,
      sharedBy: req.user.id,
      sharedWith,
      accessLevel,
      expiresAt: expiresAt || null
    });

    // Journaliser la création d'un partage
    await AccessLog.create({
      userId: req.user.id,
      action: 'create_share',
      resourceType: 'shared_document',
      resourceId: sharedDocument.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json(sharedDocument);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour révoquer un partage
router.delete('/share/:id', auth, async (req, res) => {
  try {
    // Récupérer le partage
    const sharedDocument = await SharedDocument.findOne({
      where: { 
        id: req.params.id,
        sharedBy: req.user.id
      }
    });

    if (!sharedDocument) {
      return res.status(404).json({ errors: [{ msg: 'Partage non trouvé ou accès non autorisé' }] });
    }

    // Soft delete
    await sharedDocument.destroy();

    // Journaliser la révocation d'un partage
    await AccessLog.create({
      userId: req.user.id,
      action: 'revoke_share',
      resourceType: 'shared_document',
      resourceId: req.params.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json({ msg: 'Partage révoqué avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour envoyer un message
router.post('/messages', [
  auth,
  check('content', 'Le contenu du message est requis').not().isEmpty(),
  check('recipients', 'Les destinataires sont requis').isArray()
], async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { content, recipients, attachments } = req.body;

  try {
    // Dans une implémentation réelle, on sauvegarderait le message dans la base de données
    // Pour l'exemple, on simule la création d'un message
    const message = {
      id: Math.random().toString(36).substring(2, 15),
      content,
      sender: {
        id: req.user.id,
        name: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email
      },
      recipients: recipients.map(r => ({ id: r })),
      attachments: attachments || [],
      createdAt: new Date()
    };

    // Journaliser l'envoi d'un message
    await AccessLog.create({
      userId: req.user.id,
      action: 'send_message',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success',
      details: { recipientCount: recipients.length }
    });

    res.json({
      success: true,
      message: 'Message envoyé avec succès',
      data: message
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
