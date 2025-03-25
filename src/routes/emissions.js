const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { EmissionData, EmissionDetail, Company, User, AccessLog } = require('../models');
const { Op } = require('sequelize');

// Middleware pour vérifier les rôles
const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ errors: [{ msg: 'Accès non autorisé' }] });
  }
  next();
};

// Middleware pour valider les entrées
const validateEmissionData = [
  check('reportingPeriod', 'La période de reporting est requise').not().isEmpty(),
  check('reportingYear', 'L\'année de reporting est requise').isInt({ min: 2000, max: 2100 }),
  check('companyId', 'L\'ID de l\'entreprise est requis').not().isEmpty()
];

const validateEmissionDetail = [
  check('category', 'La catégorie est requise').not().isEmpty(),
  check('scope', 'Le scope est requis').isIn(['scope1', 'scope2', 'scope3']),
  check('sourceType', 'Le type de source est requis').not().isEmpty(),
  check('quantity', 'La quantité est requise').isFloat({ min: 0 }),
  check('unit', 'L\'unité est requise').not().isEmpty(),
  check('emissionFactor', 'Le facteur d\'émission est requis').isFloat({ min: 0 }),
  check('emissions', 'Les émissions sont requises').isFloat({ min: 0 })
];

// Route pour obtenir toutes les données d'émissions de l'entreprise de l'utilisateur
router.get('/', auth, async (req, res) => {
  try {
    // Récupérer l'utilisateur avec son entreprise
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Company, as: 'company' }]
    });

    if (!user || !user.company) {
      return res.status(404).json({ errors: [{ msg: 'Entreprise non trouvée' }] });
    }

    // Récupérer les données d'émissions de l'entreprise
    const emissionData = await EmissionData.findAll({
      where: { companyId: user.company.id },
      order: [['reportingYear', 'DESC'], ['createdAt', 'DESC']],
      include: [
        { model: User, as: 'submitter', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'validator', attributes: ['id', 'firstName', 'lastName'] }
      ]
    });

    // Journaliser l'accès aux données d'émissions
    await AccessLog.create({
      userId: req.user.id,
      action: 'view_emissions',
      resourceType: 'emission_data',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json(emissionData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour obtenir une donnée d'émission spécifique avec ses détails
router.get('/:id', auth, async (req, res) => {
  try {
    // Récupérer l'utilisateur avec son entreprise
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Company, as: 'company' }]
    });

    if (!user || !user.company) {
      return res.status(404).json({ errors: [{ msg: 'Entreprise non trouvée' }] });
    }

    // Récupérer la donnée d'émission avec ses détails
    const emissionData = await EmissionData.findOne({
      where: { 
        id: req.params.id,
        companyId: user.company.id
      },
      include: [
        { model: EmissionDetail, as: 'details' },
        { model: User, as: 'submitter', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'validator', attributes: ['id', 'firstName', 'lastName'] },
        { model: Company, as: 'company', attributes: ['id', 'name', 'sector'] }
      ]
    });

    if (!emissionData) {
      return res.status(404).json({ errors: [{ msg: 'Données d\'émission non trouvées' }] });
    }

    // Journaliser l'accès à une donnée d'émission spécifique
    await AccessLog.create({
      userId: req.user.id,
      action: 'view_emission_detail',
      resourceType: 'emission_data',
      resourceId: req.params.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json(emissionData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour créer une nouvelle donnée d'émission
router.post('/', [auth, validateEmissionData], async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { reportingPeriod, reportingYear, companyId, methodologyNotes, emissionFactorsVersion } = req.body;

  try {
    // Vérifier si l'utilisateur a le droit de créer des données pour cette entreprise
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
    }

    // Vérifier si l'entreprise existe
    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ errors: [{ msg: 'Entreprise non trouvée' }] });
    }

    // Vérifier si l'utilisateur appartient à cette entreprise ou est admin
    if (user.companyId !== companyId && user.role !== 'admin') {
      return res.status(403).json({ errors: [{ msg: 'Vous n\'êtes pas autorisé à créer des données pour cette entreprise' }] });
    }

    // Créer la donnée d'émission
    const emissionData = await EmissionData.create({
      reportingPeriod,
      reportingYear,
      companyId,
      methodologyNotes: methodologyNotes || '',
      emissionFactorsVersion: emissionFactorsVersion || 'ADEME 2024',
      submittedBy: req.user.id,
      submittedAt: new Date(),
      status: 'draft'
    });

    // Journaliser la création d'une donnée d'émission
    await AccessLog.create({
      userId: req.user.id,
      action: 'create_emission_data',
      resourceType: 'emission_data',
      resourceId: emissionData.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json(emissionData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour mettre à jour une donnée d'émission
router.put('/:id', [auth, validateEmissionData], async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { reportingPeriod, reportingYear, methodologyNotes, emissionFactorsVersion, status } = req.body;

  try {
    // Récupérer la donnée d'émission
    const emissionData = await EmissionData.findByPk(req.params.id);

    if (!emissionData) {
      return res.status(404).json({ errors: [{ msg: 'Données d\'émission non trouvées' }] });
    }

    // Vérifier si l'utilisateur a le droit de modifier cette donnée
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
    }

    // Vérifier si l'utilisateur appartient à cette entreprise ou est admin
    if (user.companyId !== emissionData.companyId && user.role !== 'admin') {
      return res.status(403).json({ errors: [{ msg: 'Vous n\'êtes pas autorisé à modifier ces données' }] });
    }

    // Vérifier si la donnée est en statut "validated" et si l'utilisateur n'est pas admin
    if (emissionData.status === 'validated' && user.role !== 'admin') {
      return res.status(403).json({ errors: [{ msg: 'Les données validées ne peuvent pas être modifiées' }] });
    }

    // Mettre à jour les champs
    const updateData = {};
    if (reportingPeriod) updateData.reportingPeriod = reportingPeriod;
    if (reportingYear) updateData.reportingYear = reportingYear;
    if (methodologyNotes !== undefined) updateData.methodologyNotes = methodologyNotes;
    if (emissionFactorsVersion) updateData.emissionFactorsVersion = emissionFactorsVersion;
    
    // Mise à jour du statut si fourni
    if (status) {
      updateData.status = status;
      
      // Si le statut passe à "submitted"
      if (status === 'submitted' && emissionData.status !== 'submitted') {
        updateData.submittedBy = req.user.id;
        updateData.submittedAt = new Date();
      }
      
      // Si le statut passe à "validated"
      if (status === 'validated' && emissionData.status !== 'validated') {
        // Vérifier si l'utilisateur a le droit de valider (admin ou editor)
        if (user.role !== 'admin' && user.role !== 'editor') {
          return res.status(403).json({ errors: [{ msg: 'Vous n\'êtes pas autorisé à valider ces données' }] });
        }
        
        updateData.validatedBy = req.user.id;
        updateData.validatedAt = new Date();
      }
    }

    await emissionData.update(updateData);

    // Journaliser la mise à jour d'une donnée d'émission
    await AccessLog.create({
      userId: req.user.id,
      action: 'update_emission_data',
      resourceType: 'emission_data',
      resourceId: req.params.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success',
      details: { updatedFields: Object.keys(updateData) }
    });

    // Retourner la donnée mise à jour avec ses détails
    const updatedEmissionData = await EmissionData.findByPk(req.params.id, {
      include: [
        { model: EmissionDetail, as: 'details' },
        { model: User, as: 'submitter', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'validator', attributes: ['id', 'firstName', 'lastName'] }
      ]
    });

    res.json(updatedEmissionData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour ajouter un détail d'émission à une donnée d'émission
router.post('/:id/details', [auth, validateEmissionDetail], async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { category, scope, sourceType, quantity, unit, emissionFactor, emissionFactorSource, emissions, notes, dataQuality, isEstimated } = req.body;

  try {
    // Récupérer la donnée d'émission
    const emissionData = await EmissionData.findByPk(req.params.id);

    if (!emissionData) {
      return res.status(404).json({ errors: [{ msg: 'Données d\'émission non trouvées' }] });
    }

    // Vérifier si l'utilisateur a le droit de modifier cette donnée
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
    }

    // Vérifier si l'utilisateur appartient à cette entreprise ou est admin
    if (user.companyId !== emissionData.companyId && user.role !== 'admin') {
      return res.status(403).json({ errors: [{ msg: 'Vous n\'êtes pas autorisé à modifier ces données' }] });
    }

    // Vérifier si la donnée est en statut "validated" et si l'utilisateur n'est pas admin
    if (emissionData.status === 'validated' && user.role !== 'admin') {
      return res.status(403).json({ errors: [{ msg: 'Les données validées ne peuvent pas être modifiées' }] });
    }

    // Créer le détail d'émission
    const emissionDetail = await EmissionDetail.create({
      emissionDataId: req.params.id,
      category,
      scope,
      sourceType,
      quantity,
      unit,
      emissionFactor,
      emissionFactorSource: emissionFactorSource || 'ADEME',
      emissions,
      notes: notes || '',
      dataQuality: dataQuality || 'medium',
      isEstimated: isEstimated || false
    });

    // Mettre à jour les totaux de la donnée d'émission
    const allDetails = await EmissionDetail.findAll({
      where: { emissionDataId: req.params.id }
    });

    // Calculer les totaux par scope
    let scope1Total = 0;
    let scope2Total = 0;
    let scope3Total = 0;

    allDetails.forEach(detail => {
      if (detail.scope === 'scope1') scope1Total += detail.emissions;
      else if (detail.scope === 'scope2') scope2Total += detail.emissions;
      else if (detail.scope === 'scope3') scope3Total += detail.emissions;
    });

    const totalEmissions = scope1Total + scope2Total + scope3Total;

    // Mettre à jour la donnée d'émission
    await emissionData.update({
      scope1Total,
      scope2Total,
      scope3Total,
      totalEmissions
    });

    // Journaliser l'ajout d'un détail d'émission
    await AccessLog.create({
      userId: req.user.id,
      action: 'add_emission_detail',
      resourceType: 'emission_detail',
      resourceId: emissionDetail.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json(emissionDetail);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour supprimer un détail d'émission
router.delete('/details/:detailId', auth, async (req, res) => {
  try {
    // Récupérer le détail d'émission
    const emissionDetail = await EmissionDetail.findByPk(req.params.detailId);

    if (!emissionDetail) {
      return res.status(404).json({ errors: [{ msg: 'Détail d\'émission non trouvé' }] });
    }

    // Récupérer la donnée d'émission associée
    const emissionData = await EmissionData.findByPk(emissionDetail.emissionDataId);

    if (!emissionData) {
      return res.status(404).json({ errors: [{ msg: 'Données d\'émission non trouvées' }] });
    }

    // Vérifier si l'utilisateur a le droit de modifier cette donnée
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
    }

    // Vérifier si l'utilisateur appartient à cette entreprise ou est admin
    if (user.companyId !== emissionData.companyId && user.role !== 'admin') {
      return res.status(403).json({ errors: [{ msg: 'Vous n\'êtes pas autorisé à modifier ces données' }] });
    }

    // Vérifier si la donnée est en statut "validated" et si l'utilisateur n'est pas admin
    if (emissionData.status === 'validated' && user.role !== 'admin') {
      return res.status(403).json({ errors: [{ msg: 'Les données validées ne peuvent pas être modifiées' }] });
    }

    // Supprimer le détail d'émission
    await emissionDetail.destroy();

    // Mettre à jour les totaux de la donnée d'émission
    const allDetails = await EmissionDetail.findAll({
      where: { emissionDataId: emissionData.id }
    });

    // Calculer les totaux par scope
    let scope1Total = 0;
    let scope2Total = 0;
    let scope3Total = 0;

    allDetails.forEach(detail => {
      if (detail.scope === 'scope1') scope1Total += detail.emissions;
      else if (detail.scope === 'scope2') scope2Total += detail.emissions;
      else if (detail.scope === 'scope3') scope3Total += detail.emissions;
    });

    const totalEmissions = scope1Total + scope2Total + scope3Total;

    // Mettre à jour la donnée d'émission
    await emissionData.update({
      scope1Total,
      scope2Total,
      scope3Total,
      totalEmissions
    });

    // Journaliser la suppression d'un détail d'émission
    await AccessLog.create({
      userId: req.user.id,
      action: 'delete_emission_detail',
      resourceType: 'emission_detail',
      resourceId: req.params.detailId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json({ msg: 'Détail d\'émission supprimé avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
