const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { EmissionData, Company, User, AccessLog } = require('../models');
const { Op, Sequelize } = require('sequelize');

// Route pour obtenir les données de benchmark par secteur
router.get('/sector', auth, async (req, res) => {
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
    let reportingYear = year ? parseInt(year) : new Date().getFullYear() - 1;

    // Récupérer le secteur de l'entreprise
    const { sector, sectorCode } = user.company;

    // Récupérer les données d'émissions de l'entreprise pour l'année spécifiée
    const companyEmissions = await EmissionData.findOne({
      where: { 
        companyId: user.company.id,
        reportingYear,
        status: 'validated'
      }
    });

    if (!companyEmissions) {
      return res.status(404).json({ errors: [{ msg: 'Aucune donnée d\'émission validée trouvée pour votre entreprise' }] });
    }

    // Récupérer les données d'émissions anonymisées des entreprises du même secteur
    const sectorEmissions = await EmissionData.findAll({
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('scope1Total')), 'avgScope1'],
        [Sequelize.fn('AVG', Sequelize.col('scope2Total')), 'avgScope2'],
        [Sequelize.fn('AVG', Sequelize.col('scope3Total')), 'avgScope3'],
        [Sequelize.fn('AVG', Sequelize.col('totalEmissions')), 'avgTotal'],
        [Sequelize.fn('MIN', Sequelize.col('totalEmissions')), 'minTotal'],
        [Sequelize.fn('MAX', Sequelize.col('totalEmissions')), 'maxTotal'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'companyCount']
      ],
      include: [{
        model: Company,
        as: 'company',
        attributes: [],
        where: { 
          sector,
          id: { [Op.ne]: user.company.id } // Exclure l'entreprise de l'utilisateur
        }
      }],
      where: { 
        reportingYear,
        status: 'validated'
      }
    });

    // Calculer les émissions par employé
    const emissionsPerEmployee = companyEmissions.totalEmissions / user.company.employeeCount;

    // Récupérer les émissions par employé des entreprises du même secteur
    const sectorEmissionsPerEmployee = await EmissionData.findAll({
      attributes: [
        [Sequelize.fn('AVG', Sequelize.literal('totalEmissions / "company"."employeeCount"')), 'avgPerEmployee'],
        [Sequelize.fn('MIN', Sequelize.literal('totalEmissions / "company"."employeeCount"')), 'minPerEmployee'],
        [Sequelize.fn('MAX', Sequelize.literal('totalEmissions / "company"."employeeCount"')), 'maxPerEmployee']
      ],
      include: [{
        model: Company,
        as: 'company',
        attributes: [],
        where: { 
          sector,
          id: { [Op.ne]: user.company.id } // Exclure l'entreprise de l'utilisateur
        }
      }],
      where: { 
        reportingYear,
        status: 'validated'
      }
    });

    // Construire les données de benchmark
    const benchmarkData = {
      reportingYear,
      sector,
      sectorCode,
      companyData: {
        scope1: companyEmissions.scope1Total,
        scope2: companyEmissions.scope2Total,
        scope3: companyEmissions.scope3Total,
        total: companyEmissions.totalEmissions,
        perEmployee: emissionsPerEmployee
      },
      sectorData: {
        avgScope1: sectorEmissions[0].dataValues.avgScope1 || 0,
        avgScope2: sectorEmissions[0].dataValues.avgScope2 || 0,
        avgScope3: sectorEmissions[0].dataValues.avgScope3 || 0,
        avgTotal: sectorEmissions[0].dataValues.avgTotal || 0,
        minTotal: sectorEmissions[0].dataValues.minTotal || 0,
        maxTotal: sectorEmissions[0].dataValues.maxTotal || 0,
        avgPerEmployee: sectorEmissionsPerEmployee[0].dataValues.avgPerEmployee || 0,
        minPerEmployee: sectorEmissionsPerEmployee[0].dataValues.minPerEmployee || 0,
        maxPerEmployee: sectorEmissionsPerEmployee[0].dataValues.maxPerEmployee || 0,
        companyCount: sectorEmissions[0].dataValues.companyCount || 0
      },
      percentiles: {
        // Ces valeurs seraient calculées à partir d'une analyse statistique plus poussée
        // Pour l'exemple, nous utilisons des valeurs simulées
        p25: sectorEmissions[0].dataValues.avgTotal * 0.75,
        p50: sectorEmissions[0].dataValues.avgTotal,
        p75: sectorEmissions[0].dataValues.avgTotal * 1.25
      }
    };

    // Calculer le positionnement de l'entreprise par rapport au secteur
    if (benchmarkData.sectorData.companyCount > 0) {
      // Position relative (percentile) - simulation simplifiée
      const relativePosition = (companyEmissions.totalEmissions - benchmarkData.sectorData.minTotal) / 
                              (benchmarkData.sectorData.maxTotal - benchmarkData.sectorData.minTotal);
      
      benchmarkData.companyPosition = {
        percentile: Math.round(relativePosition * 100),
        relativeTotalEmissions: companyEmissions.totalEmissions / benchmarkData.sectorData.avgTotal,
        relativePerEmployee: emissionsPerEmployee / benchmarkData.sectorData.avgPerEmployee
      };
    }

    // Journaliser l'accès aux données de benchmark
    await AccessLog.create({
      userId: req.user.id,
      action: 'view_sector_benchmark',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json(benchmarkData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour obtenir les tendances d'émissions par secteur
router.get('/trends', auth, async (req, res) => {
  try {
    // Récupérer l'utilisateur avec son entreprise
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Company, as: 'company' }]
    });

    if (!user || !user.company) {
      return res.status(404).json({ errors: [{ msg: 'Entreprise non trouvée' }] });
    }

    // Récupérer le secteur de l'entreprise
    const { sector } = user.company;

    // Récupérer les années disponibles
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5; // 5 dernières années

    // Récupérer les données d'émissions de l'entreprise par année
    const companyEmissionsByYear = await EmissionData.findAll({
      attributes: [
        'reportingYear',
        'totalEmissions'
      ],
      where: { 
        companyId: user.company.id,
        reportingYear: { [Op.gte]: startYear },
        status: 'validated'
      },
      order: [['reportingYear', 'ASC']]
    });

    // Récupérer les données d'émissions moyennes du secteur par année
    const sectorEmissionsByYear = await EmissionData.findAll({
      attributes: [
        'reportingYear',
        [Sequelize.fn('AVG', Sequelize.col('totalEmissions')), 'avgTotalEmissions']
      ],
      include: [{
        model: Company,
        as: 'company',
        attributes: [],
        where: { sector }
      }],
      where: { 
        reportingYear: { [Op.gte]: startYear },
        status: 'validated'
      },
      group: ['reportingYear'],
      order: [['reportingYear', 'ASC']]
    });

    // Construire les données de tendances
    const trendData = {
      sector,
      years: [],
      companyEmissions: [],
      sectorAvgEmissions: []
    };

    // Remplir les années
    for (let year = startYear; year <= currentYear; year++) {
      trendData.years.push(year);
      
      // Trouver les émissions de l'entreprise pour cette année
      const companyData = companyEmissionsByYear.find(d => d.reportingYear === year);
      trendData.companyEmissions.push(companyData ? companyData.totalEmissions : null);
      
      // Trouver les émissions moyennes du secteur pour cette année
      const sectorData = sectorEmissionsByYear.find(d => d.reportingYear === year);
      trendData.sectorAvgEmissions.push(sectorData ? sectorData.dataValues.avgTotalEmissions : null);
    }

    // Journaliser l'accès aux données de tendances
    await AccessLog.create({
      userId: req.user.id,
      action: 'view_emission_trends',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json(trendData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour obtenir les recommandations de réduction d'émissions
router.get('/recommendations', auth, async (req, res) => {
  try {
    // Récupérer l'utilisateur avec son entreprise
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Company, as: 'company' }]
    });

    if (!user || !user.company) {
      return res.status(404).json({ errors: [{ msg: 'Entreprise non trouvée' }] });
    }

    // Récupérer les données d'émissions les plus récentes de l'entreprise
    const latestEmissions = await EmissionData.findOne({
      where: { 
        companyId: user.company.id,
        status: 'validated'
      },
      order: [['reportingYear', 'DESC'], ['createdAt', 'DESC']],
      include: [{ 
        model: EmissionDetail, 
        as: 'details' 
      }]
    });

    if (!latestEmissions) {
      return res.status(404).json({ errors: [{ msg: 'Aucune donnée d\'émission validée trouvée' }] });
    }

    // Analyser les données d'émissions pour générer des recommandations
    const recommendations = [];

    // Recommandations basées sur la répartition des émissions
    if (latestEmissions.scope1Total > latestEmissions.totalEmissions * 0.4) {
      recommendations.push({
        id: 1,
        category: 'scope1',
        title: 'Réduction des émissions directes',
        description: 'Vos émissions directes (Scope 1) représentent une part importante de votre empreinte carbone. Envisagez de remplacer votre flotte de véhicules par des modèles électriques ou hybrides.',
        potentialReduction: '15-30%',
        implementationCost: 'Élevé',
        paybackPeriod: '3-5 ans'
      });
    }

    if (latestEmissions.scope2Total > latestEmissions.totalEmissions * 0.3) {
      recommendations.push({
        id: 2,
        category: 'scope2',
        title: 'Passage à l\'électricité verte',
        description: 'Vos émissions liées à l\'électricité (Scope 2) sont significatives. Envisagez de passer à un fournisseur d\'électricité 100% renouvelable ou d\'installer des panneaux solaires.',
        potentialReduction: '50-100%',
        implementationCost: 'Moyen',
        paybackPeriod: '5-8 ans'
      });
    }

    // Recommandations basées sur les détails d'émissions
    const transportEmissions = latestEmissions.details.filter(d => 
      d.category === 'business_travel' || d.category === 'employee_commuting' || d.category === 'freight_transport'
    );
    
    if (transportEmissions.length > 0 && transportEmissions.reduce((sum, d) => sum + d.emissions, 0) > latestEmissions.totalEmissions * 0.2) {
      recommendations.push({
        id: 3,
        category: 'transport',
        title: 'Optimisation des déplacements',
        description: 'Les émissions liées aux transports représentent une part importante de votre empreinte. Encouragez le télétravail, les visioconférences et les modes de transport doux.',
        potentialReduction: '10-20%',
        implementationCost: 'Faible',
        paybackPeriod: '1-2 ans'
      });
    }

    // Recommandations générales
    recommendations.push({
      id: 4,
      category: 'general',
      title: 'Sensibilisation des employés',
      description: 'Mettez en place des programmes de sensibilisation et de formation pour encourager les comportements éco-responsables au sein de votre entreprise.',
      potentialReduction: '5-10%',
      implementationCost: 'Faible',
      paybackPeriod: '<1 an'
    });

    // Journaliser l'accès aux recommandations
    await AccessLog.create({
      userId: req.user.id,
      action: 'view_recommendations',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json({
      companyName: user.company.name,
      reportingYear: latestEmissions.reportingYear,
      totalEmissions: latestEmissions.totalEmissions,
      recommendations
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
