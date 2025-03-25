const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { EmissionData, Company, User, AccessLog } = require('../models');
const { Op, Sequelize } = require('sequelize');

// Route pour obtenir les données du tableau de bord
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
      limit: 5
    });

    // Récupérer les données d'émissions par année pour les tendances
    const emissionsByYear = await EmissionData.findAll({
      attributes: [
        'reportingYear',
        [Sequelize.fn('SUM', Sequelize.col('scope1Total')), 'scope1Total'],
        [Sequelize.fn('SUM', Sequelize.col('scope2Total')), 'scope2Total'],
        [Sequelize.fn('SUM', Sequelize.col('scope3Total')), 'scope3Total'],
        [Sequelize.fn('SUM', Sequelize.col('totalEmissions')), 'totalEmissions']
      ],
      where: { 
        companyId: user.company.id,
        status: 'validated'
      },
      group: ['reportingYear'],
      order: [['reportingYear', 'ASC']]
    });

    // Récupérer les alertes réglementaires
    const currentYear = new Date().getFullYear();
    const regulatoryAlerts = [
      {
        id: 1,
        title: 'Échéance BEGES',
        description: `Le Bilan d'Émissions de Gaz à Effet de Serre (BEGES) pour l'année ${currentYear} doit être soumis avant le 31 décembre ${currentYear}.`,
        dueDate: `${currentYear}-12-31`,
        type: 'regulatory',
        severity: 'high'
      },
      {
        id: 2,
        title: 'Préparation CSRD',
        description: `La préparation pour la Corporate Sustainability Reporting Directive (CSRD) doit commencer pour l'année ${currentYear+1}.`,
        dueDate: `${currentYear}-09-30`,
        type: 'regulatory',
        severity: 'medium'
      },
      {
        id: 3,
        title: 'Mise à jour des facteurs d\'émission',
        description: 'Les facteurs d\'émission de l\'ADEME ont été mis à jour. Pensez à mettre à jour vos calculs.',
        dueDate: null,
        type: 'information',
        severity: 'low'
      }
    ];

    // Récupérer les alertes de dérive carbone
    const carbonAlerts = [];
    
    // Vérifier si les émissions augmentent par rapport à l'année précédente
    if (emissionsByYear.length >= 2) {
      const currentYearData = emissionsByYear[emissionsByYear.length - 1];
      const previousYearData = emissionsByYear[emissionsByYear.length - 2];
      
      if (currentYearData.totalEmissions > previousYearData.totalEmissions * 1.1) {
        // Augmentation de plus de 10%
        carbonAlerts.push({
          id: 4,
          title: 'Augmentation significative des émissions',
          description: `Les émissions totales ont augmenté de plus de 10% par rapport à l'année précédente.`,
          type: 'carbon_drift',
          severity: 'high'
        });
      }
      
      if (currentYearData.scope1Total > previousYearData.scope1Total * 1.15) {
        // Augmentation de plus de 15% pour le scope 1
        carbonAlerts.push({
          id: 5,
          title: 'Augmentation des émissions directes (Scope 1)',
          description: `Les émissions directes (Scope 1) ont augmenté de plus de 15% par rapport à l'année précédente.`,
          type: 'carbon_drift',
          severity: 'medium'
        });
      }
    }

    // Construire les données du tableau de bord
    const dashboardData = {
      companyInfo: {
        id: user.company.id,
        name: user.company.name,
        sector: user.company.sector,
        employeeCount: user.company.employeeCount
      },
      latestEmissions: emissionData,
      emissionTrends: emissionsByYear,
      alerts: [...regulatoryAlerts, ...carbonAlerts],
      summaryStats: {
        totalReports: await getReportCount(user.company.id),
        completedEmissionsData: await getCompletedEmissionsCount(user.company.id),
        pendingValidations: await getPendingValidationsCount(user.company.id)
      }
    };

    // Journaliser l'accès au tableau de bord
    await AccessLog.create({
      userId: req.user.id,
      action: 'view_dashboard',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json(dashboardData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour obtenir les données de répartition des émissions par source
router.get('/emissions-by-source', auth, async (req, res) => {
  try {
    // Récupérer l'utilisateur avec son entreprise
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Company, as: 'company' }]
    });

    if (!user || !user.company) {
      return res.status(404).json({ errors: [{ msg: 'Entreprise non trouvée' }] });
    }

    // Récupérer l'année de reporting demandée ou utiliser l'année la plus récente
    const { year } = req.query;
    let reportingYear = year ? parseInt(year) : null;

    if (!reportingYear) {
      // Trouver l'année la plus récente
      const latestData = await EmissionData.findOne({
        where: { companyId: user.company.id, status: 'validated' },
        order: [['reportingYear', 'DESC']]
      });
      
      if (latestData) {
        reportingYear = latestData.reportingYear;
      } else {
        return res.status(404).json({ errors: [{ msg: 'Aucune donnée d\'émission validée trouvée' }] });
      }
    }

    // Récupérer les détails d'émission pour l'année spécifiée
    const emissionDetails = await EmissionDetail.findAll({
      include: [{
        model: EmissionData,
        as: 'emissionData',
        where: { 
          companyId: user.company.id,
          reportingYear,
          status: 'validated'
        }
      }]
    });

    // Agréger les données par catégorie
    const emissionsByCategory = {};
    emissionDetails.forEach(detail => {
      if (!emissionsByCategory[detail.category]) {
        emissionsByCategory[detail.category] = 0;
      }
      emissionsByCategory[detail.category] += detail.emissions;
    });

    // Convertir en tableau pour le frontend
    const emissionsByCategoryArray = Object.keys(emissionsByCategory).map(category => ({
      category,
      emissions: emissionsByCategory[category]
    }));

    // Journaliser l'accès aux données de répartition des émissions
    await AccessLog.create({
      userId: req.user.id,
      action: 'view_emissions_by_source',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json({
      reportingYear,
      emissionsByCategory: emissionsByCategoryArray
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour obtenir le calendrier réglementaire
router.get('/regulatory-calendar', auth, async (req, res) => {
  try {
    // Récupérer l'utilisateur avec son entreprise
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Company, as: 'company' }]
    });

    if (!user || !user.company) {
      return res.status(404).json({ errors: [{ msg: 'Entreprise non trouvée' }] });
    }

    const currentYear = new Date().getFullYear();
    
    // Déterminer les obligations réglementaires en fonction de la taille de l'entreprise
    const isLargeCompany = user.company.employeeCount > 500;
    const isMediumCompany = user.company.employeeCount > 250 && user.company.employeeCount <= 500;
    
    const regulatoryCalendar = [
      {
        id: 1,
        title: 'BEGES',
        description: 'Bilan d\'Émissions de Gaz à Effet de Serre',
        dueDate: `${currentYear}-12-31`,
        applicable: isLargeCompany || isMediumCompany,
        frequency: 'Tous les 4 ans',
        authority: 'ADEME',
        link: 'https://www.bilans-ges.ademe.fr/'
      },
      {
        id: 2,
        title: 'CSRD',
        description: 'Corporate Sustainability Reporting Directive',
        dueDate: `${currentYear+1}-06-30`,
        applicable: isLargeCompany,
        frequency: 'Annuel',
        authority: 'Union Européenne',
        link: 'https://finance.ec.europa.eu/capital-markets-union-and-financial-markets/company-reporting-and-auditing/company-reporting/corporate-sustainability-reporting_en'
      },
      {
        id: 3,
        title: 'Taxonomie UE',
        description: 'Reporting sur les activités durables selon la Taxonomie européenne',
        dueDate: `${currentYear+1}-06-30`,
        applicable: isLargeCompany,
        frequency: 'Annuel',
        authority: 'Union Européenne',
        link: 'https://ec.europa.eu/info/business-economy-euro/banking-and-finance/sustainable-finance/eu-taxonomy-sustainable-activities_en'
      },
      {
        id: 4,
        title: 'Loi Climat et Résilience',
        description: 'Reporting sur les actions de réduction des émissions',
        dueDate: `${currentYear}-12-31`,
        applicable: isLargeCompany || isMediumCompany,
        frequency: 'Annuel',
        authority: 'Gouvernement Français',
        link: 'https://www.ecologie.gouv.fr/loi-climat-resilience'
      }
    ];

    // Filtrer les obligations applicables à l'entreprise
    const applicableRegulations = regulatoryCalendar.filter(reg => reg.applicable);

    // Journaliser l'accès au calendrier réglementaire
    await AccessLog.create({
      userId: req.user.id,
      action: 'view_regulatory_calendar',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json(applicableRegulations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Fonctions utilitaires
async function getReportCount(companyId) {
  return await Report.count({ where: { companyId } });
}

async function getCompletedEmissionsCount(companyId) {
  return await EmissionData.count({ 
    where: { 
      companyId,
      status: 'validated'
    }
  });
}

async function getPendingValidationsCount(companyId) {
  return await EmissionData.count({ 
    where: { 
      companyId,
      status: 'submitted'
    }
  });
}

module.exports = router;
