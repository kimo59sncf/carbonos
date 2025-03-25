const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { Report, EmissionData, Company, User, AccessLog, SharedDocument } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Middleware pour vérifier les rôles
const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ errors: [{ msg: 'Accès non autorisé' }] });
  }
  next();
};

// Middleware pour valider les entrées
const validateReport = [
  check('title', 'Le titre est requis').not().isEmpty(),
  check('type', 'Le type de rapport est requis').isIn(['beges', 'csrd', 'carbon', 'custom']),
  check('period', 'La période est requise').not().isEmpty(),
  check('format', 'Le format est requis').isIn(['pdf', 'xbrl', 'excel', 'csv']),
  check('emissionDataId', 'L\'ID des données d\'émission est requis').not().isEmpty()
];

// Route pour obtenir tous les rapports de l'entreprise de l'utilisateur
router.get('/', auth, async (req, res) => {
  try {
    // Récupérer l'utilisateur avec son entreprise
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Company, as: 'company' }]
    });

    if (!user || !user.company) {
      return res.status(404).json({ errors: [{ msg: 'Entreprise non trouvée' }] });
    }

    // Récupérer les rapports de l'entreprise
    const reports = await Report.findAll({
      where: { companyId: user.company.id },
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'generator', attributes: ['id', 'firstName', 'lastName'] },
        { model: EmissionData, as: 'emissionData', attributes: ['id', 'reportingPeriod', 'reportingYear', 'totalEmissions'] }
      ]
    });

    // Journaliser l'accès aux rapports
    await AccessLog.create({
      userId: req.user.id,
      action: 'view_reports',
      resourceType: 'report',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour obtenir un rapport spécifique
router.get('/:id', auth, async (req, res) => {
  try {
    // Récupérer l'utilisateur avec son entreprise
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Company, as: 'company' }]
    });

    if (!user || !user.company) {
      return res.status(404).json({ errors: [{ msg: 'Entreprise non trouvée' }] });
    }

    // Récupérer le rapport
    const report = await Report.findOne({
      where: { 
        id: req.params.id,
        [Op.or]: [
          { companyId: user.company.id },
          { '$shares.sharedWith$': req.user.id }
        ]
      },
      include: [
        { model: User, as: 'generator', attributes: ['id', 'firstName', 'lastName'] },
        { model: EmissionData, as: 'emissionData', attributes: ['id', 'reportingPeriod', 'reportingYear', 'totalEmissions'] },
        { model: Company, as: 'company', attributes: ['id', 'name', 'sector'] },
        { 
          model: SharedDocument, 
          as: 'shares',
          required: false,
          where: { documentType: 'report' }
        }
      ]
    });

    if (!report) {
      return res.status(404).json({ errors: [{ msg: 'Rapport non trouvé' }] });
    }

    // Journaliser l'accès à un rapport spécifique
    await AccessLog.create({
      userId: req.user.id,
      action: 'view_report',
      resourceType: 'report',
      resourceId: req.params.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour générer un nouveau rapport
router.post('/', [auth, validateReport], async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, type, period, format, emissionDataId, isPublic } = req.body;

  try {
    // Récupérer les données d'émission
    const emissionData = await EmissionData.findByPk(emissionDataId);

    if (!emissionData) {
      return res.status(404).json({ errors: [{ msg: 'Données d\'émission non trouvées' }] });
    }

    // Vérifier si l'utilisateur a le droit de générer un rapport pour cette entreprise
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
    }

    // Vérifier si l'utilisateur appartient à cette entreprise ou est admin
    if (user.companyId !== emissionData.companyId && user.role !== 'admin') {
      return res.status(403).json({ errors: [{ msg: 'Vous n\'êtes pas autorisé à générer un rapport pour cette entreprise' }] });
    }

    // Créer le rapport
    const report = await Report.create({
      title,
      type,
      period,
      format,
      emissionDataId,
      companyId: emissionData.companyId,
      generatedBy: req.user.id,
      status: 'pending',
      totalEmissions: emissionData.totalEmissions,
      isPublic: isPublic || false
    });

    // Simuler la génération du rapport (dans une implémentation réelle, cela serait fait par un worker)
    setTimeout(async () => {
      try {
        // Créer un répertoire pour les rapports s'il n'existe pas
        const reportsDir = path.join(__dirname, '../../reports');
        if (!fs.existsSync(reportsDir)) {
          fs.mkdirSync(reportsDir, { recursive: true });
        }

        // Générer un nom de fichier
        const fileName = `${type}_${period}_${Date.now()}.${format}`;
        const filePath = path.join(reportsDir, fileName);

        // Simuler la création d'un fichier (dans une implémentation réelle, on générerait le rapport)
        fs.writeFileSync(filePath, 'Contenu simulé du rapport');

        // Mettre à jour le rapport
        await report.update({
          status: 'completed',
          filePath: filePath,
          fileSize: fs.statSync(filePath).size
        });

        // Générer une URL publique si le rapport est public
        if (isPublic) {
          const publicUrl = `/api/reports/public/${report.id}`;
          const publicExpiresAt = new Date();
          publicExpiresAt.setMonth(publicExpiresAt.getMonth() + 3); // Expire dans 3 mois

          await report.update({
            publicUrl,
            publicExpiresAt
          });
        }
      } catch (err) {
        console.error('Erreur lors de la génération du rapport:', err);
        await report.update({
          status: 'failed'
        });
      }
    }, 2000);

    // Journaliser la génération d'un rapport
    await AccessLog.create({
      userId: req.user.id,
      action: 'generate_report',
      resourceType: 'report',
      resourceId: report.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour télécharger un rapport
router.get('/:id/download', auth, async (req, res) => {
  try {
    // Récupérer le rapport
    const report = await Report.findOne({
      where: { 
        id: req.params.id,
        [Op.or]: [
          { '$company.id$': req.user.companyId },
          { '$shares.sharedWith$': req.user.id }
        ]
      },
      include: [
        { model: Company, as: 'company' },
        { 
          model: SharedDocument, 
          as: 'shares',
          required: false,
          where: { documentType: 'report' }
        }
      ]
    });

    if (!report) {
      return res.status(404).json({ errors: [{ msg: 'Rapport non trouvé ou accès non autorisé' }] });
    }

    // Vérifier si le rapport est prêt
    if (report.status !== 'completed') {
      return res.status(400).json({ errors: [{ msg: 'Le rapport n\'est pas encore prêt' }] });
    }

    // Vérifier si le fichier existe
    if (!report.filePath || !fs.existsSync(report.filePath)) {
      return res.status(404).json({ errors: [{ msg: 'Fichier non trouvé' }] });
    }

    // Journaliser le téléchargement d'un rapport
    await AccessLog.create({
      userId: req.user.id,
      action: 'download_report',
      resourceType: 'report',
      resourceId: report.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    // Envoyer le fichier
    res.download(report.filePath);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour accéder à un rapport public
router.get('/public/:id', async (req, res) => {
  try {
    // Récupérer le rapport
    const report = await Report.findOne({
      where: { 
        id: req.params.id,
        isPublic: true,
        publicExpiresAt: { [Op.gt]: new Date() }
      }
    });

    if (!report) {
      return res.status(404).json({ errors: [{ msg: 'Rapport non trouvé ou lien expiré' }] });
    }

    // Vérifier si le rapport est prêt
    if (report.status !== 'completed') {
      return res.status(400).json({ errors: [{ msg: 'Le rapport n\'est pas encore prêt' }] });
    }

    // Vérifier si le fichier existe
    if (!report.filePath || !fs.existsSync(report.filePath)) {
      return res.status(404).json({ errors: [{ msg: 'Fichier non trouvé' }] });
    }

    // Journaliser l'accès public à un rapport
    await AccessLog.create({
      action: 'public_access_report',
      resourceType: 'report',
      resourceId: report.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    // Envoyer le fichier
    res.download(report.filePath);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour partager un rapport
router.post('/:id/share', [
  auth,
  check('sharedWith', 'L\'ID de l\'utilisateur avec qui partager est requis').not().isEmpty(),
  check('accessLevel', 'Le niveau d\'accès est requis').isIn(['view', 'edit'])
], async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { sharedWith, accessLevel, expiresAt } = req.body;

  try {
    // Récupérer le rapport
    const report = await Report.findOne({
      where: { 
        id: req.params.id,
        companyId: req.user.companyId
      }
    });

    if (!report) {
      return res.status(404).json({ errors: [{ msg: 'Rapport non trouvé ou accès non autorisé' }] });
    }

    // Vérifier si l'utilisateur avec qui partager existe
    const sharedWithUser = await User.findByPk(sharedWith);
    if (!sharedWithUser) {
      return res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
    }

    // Vérifier si le partage existe déjà
    const existingShare = await SharedDocument.findOne({
      where: {
        documentType: 'report',
        documentId: report.id,
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
      documentType: 'report',
      documentId: report.id,
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

module.exports = router;
