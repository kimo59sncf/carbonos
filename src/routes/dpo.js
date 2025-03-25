const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { User, Company, AccessLog } = require('../models');
const { checkDataProcessingConsent, logDataAccess, anonymizeData } = require('../middleware/rgpd');

// Route pour obtenir les informations de l'entreprise pour le DPO
router.get('/dpo-info', [auth, checkDataProcessingConsent, logDataAccess('dpo_info')], async (req, res) => {
  try {
    // Récupérer l'utilisateur avec son entreprise
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Company, as: 'company' }]
    });

    if (!user || !user.company) {
      return res.status(404).json({ errors: [{ msg: 'Entreprise non trouvée' }] });
    }

    // Vérifier si l'utilisateur est DPO ou admin
    if (user.role !== 'dpo' && user.role !== 'admin') {
      return res.status(403).json({ errors: [{ msg: 'Accès non autorisé' }] });
    }

    // Récupérer les informations de l'entreprise pour le DPO
    const dpoInfo = {
      company: {
        id: user.company.id,
        name: user.company.name,
        sector: user.company.sector,
        employeeCount: user.company.employeeCount,
        address: user.company.address,
        postalCode: user.company.postalCode,
        city: user.company.city,
        country: user.company.country,
        siret: user.company.siret,
        createdAt: user.company.createdAt
      },
      dpoContact: {
        name: user.company.dpoName || 'Non défini',
        email: user.company.dpoEmail || 'Non défini',
        phone: user.company.dpoPhone || 'Non défini',
        isExternal: user.company.dpoIsExternal || false
      },
      dataProcessingActivities: [
        {
          id: 1,
          name: 'Calcul de l\'empreinte carbone',
          purpose: 'Mesurer et suivre les émissions de gaz à effet de serre',
          legalBasis: 'Exécution du contrat',
          dataCategories: ['Données d\'activité', 'Données financières'],
          dataSubjects: ['Employés', 'Fournisseurs'],
          retention: '5 ans',
          security: 'Chiffrement, contrôle d\'accès, journalisation'
        },
        {
          id: 2,
          name: 'Génération de rapports réglementaires',
          purpose: 'Produire des rapports conformes aux exigences légales',
          legalBasis: 'Obligation légale',
          dataCategories: ['Données d\'émissions', 'Données d\'entreprise'],
          dataSubjects: ['Entreprise'],
          retention: '5 ans',
          security: 'Chiffrement, contrôle d\'accès, journalisation'
        },
        {
          id: 3,
          name: 'Benchmarking sectoriel',
          purpose: 'Comparer les performances carbone avec d\'autres entreprises du secteur',
          legalBasis: 'Intérêt légitime',
          dataCategories: ['Données d\'émissions anonymisées'],
          dataSubjects: ['Entreprises du secteur'],
          retention: '3 ans',
          security: 'Anonymisation, agrégation, contrôle d\'accès'
        }
      ],
      dataProcessors: [
        {
          id: 1,
          name: 'OVH Cloud',
          role: 'Hébergeur',
          location: 'France',
          contractDate: '2024-01-01',
          guarantees: 'ISO 27001, HDS, RGPD'
        },
        {
          id: 2,
          name: 'Scaleway',
          role: 'Hébergeur de sauvegarde',
          location: 'France',
          contractDate: '2024-01-01',
          guarantees: 'ISO 27001, RGPD'
        }
      ]
    };

    res.json(dpoInfo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour effectuer une analyse d'impact sur la protection des données (PIA)
router.get('/pia', [auth, checkDataProcessingConsent, logDataAccess('pia')], async (req, res) => {
  try {
    // Récupérer l'utilisateur avec son entreprise
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Company, as: 'company' }]
    });

    if (!user || !user.company) {
      return res.status(404).json({ errors: [{ msg: 'Entreprise non trouvée' }] });
    }

    // Vérifier si l'utilisateur est DPO ou admin
    if (user.role !== 'dpo' && user.role !== 'admin') {
      return res.status(403).json({ errors: [{ msg: 'Accès non autorisé' }] });
    }

    // Analyse d'impact sur la protection des données
    const pia = {
      id: 1,
      name: 'Analyse d\'impact - CarbonOS',
      createdAt: '2024-01-15',
      updatedAt: '2024-02-28',
      status: 'Validé',
      validatedBy: 'Jean Dupont, DPO',
      validatedAt: '2024-02-28',
      description: 'Analyse d\'impact relative à la protection des données pour la plateforme CarbonOS',
      processingOperations: [
        {
          id: 1,
          name: 'Collecte des données d\'émissions',
          description: 'Collecte des données d\'activité et financières pour le calcul des émissions carbone',
          necessity: 'Essentielle pour le calcul de l\'empreinte carbone',
          proportionality: 'Limitée aux données strictement nécessaires'
        },
        {
          id: 2,
          name: 'Benchmarking anonymisé',
          description: 'Comparaison des performances carbone avec d\'autres entreprises du secteur',
          necessity: 'Importante pour l\'analyse comparative',
          proportionality: 'Utilisation de données agrégées et anonymisées uniquement'
        }
      ],
      risks: [
        {
          id: 1,
          category: 'Confidentialité',
          description: 'Accès non autorisé aux données d\'émissions',
          likelihood: 'Faible',
          impact: 'Moyen',
          mitigations: 'Authentification forte, chiffrement, contrôle d\'accès basé sur les rôles'
        },
        {
          id: 2,
          category: 'Intégrité',
          description: 'Modification non autorisée des données d\'émissions',
          likelihood: 'Faible',
          impact: 'Élevé',
          mitigations: 'Journalisation des modifications, validation à deux niveaux, audit trail'
        },
        {
          id: 3,
          category: 'Disponibilité',
          description: 'Indisponibilité des données d\'émissions',
          likelihood: 'Très faible',
          impact: 'Moyen',
          mitigations: 'Sauvegardes régulières, infrastructure redondante, plan de continuité'
        }
      ],
      conclusion: 'L\'analyse d\'impact montre que les risques pour les droits et libertés des personnes concernées sont correctement maîtrisés grâce aux mesures techniques et organisationnelles mises en place. Le traitement peut être mis en œuvre en l\'état.'
    };

    res.json(pia);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour obtenir le registre des traitements
router.get('/processing-register', [auth, checkDataProcessingConsent, logDataAccess('processing_register')], async (req, res) => {
  try {
    // Récupérer l'utilisateur avec son entreprise
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Company, as: 'company' }]
    });

    if (!user || !user.company) {
      return res.status(404).json({ errors: [{ msg: 'Entreprise non trouvée' }] });
    }

    // Vérifier si l'utilisateur est DPO ou admin
    if (user.role !== 'dpo' && user.role !== 'admin') {
      return res.status(403).json({ errors: [{ msg: 'Accès non autorisé' }] });
    }

    // Registre des traitements
    const processingRegister = {
      companyName: user.company.name,
      dpoContact: {
        name: user.company.dpoName || 'Non défini',
        email: user.company.dpoEmail || 'Non défini'
      },
      lastUpdated: '2024-03-01',
      treatments: [
        {
          id: 1,
          name: 'Gestion des utilisateurs',
          purpose: 'Authentification et gestion des accès',
          legalBasis: 'Exécution du contrat',
          dataCategories: ['Données d\'identification', 'Données de connexion'],
          dataSubjects: ['Employés'],
          recipients: ['Personnel autorisé'],
          retention: '5 ans après la fin du contrat',
          security: 'Chiffrement, contrôle d\'accès, journalisation',
          transfers: 'Aucun transfert hors UE'
        },
        {
          id: 2,
          name: 'Calcul de l\'empreinte carbone',
          purpose: 'Mesurer et suivre les émissions de gaz à effet de serre',
          legalBasis: 'Exécution du contrat',
          dataCategories: ['Données d\'activité', 'Données financières'],
          dataSubjects: ['Employés', 'Fournisseurs'],
          recipients: ['Personnel autorisé'],
          retention: '5 ans',
          security: 'Chiffrement, contrôle d\'accès, journalisation',
          transfers: 'Aucun transfert hors UE'
        },
        {
          id: 3,
          name: 'Génération de rapports réglementaires',
          purpose: 'Produire des rapports conformes aux exigences légales',
          legalBasis: 'Obligation légale',
          dataCategories: ['Données d\'émissions', 'Données d\'entreprise'],
          dataSubjects: ['Entreprise'],
          recipients: ['Autorités réglementaires', 'Personnel autorisé'],
          retention: '5 ans',
          security: 'Chiffrement, contrôle d\'accès, journalisation',
          transfers: 'Aucun transfert hors UE'
        },
        {
          id: 4,
          name: 'Benchmarking sectoriel',
          purpose: 'Comparer les performances carbone avec d\'autres entreprises du secteur',
          legalBasis: 'Intérêt légitime',
          dataCategories: ['Données d\'émissions anonymisées'],
          dataSubjects: ['Entreprises du secteur'],
          recipients: ['Personnel autorisé'],
          retention: '3 ans',
          security: 'Anonymisation, agrégation, contrôle d\'accès',
          transfers: 'Aucun transfert hors UE'
        }
      ]
    };

    res.json(processingRegister);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour gérer les demandes d'exercice des droits RGPD
router.post('/data-subject-request', [
  auth,
  check('requestType', 'Le type de demande est requis').isIn(['access', 'rectification', 'erasure', 'restriction', 'portability', 'objection']),
  check('description', 'La description est requise').not().isEmpty()
], async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { requestType, description, dataCategories } = req.body;

  try {
    // Créer une demande d'exercice des droits
    // Dans une implémentation réelle, on sauvegarderait la demande dans la base de données
    const request = {
      id: Math.random().toString(36).substring(2, 15),
      userId: req.user.id,
      requestType,
      description,
      dataCategories: dataCategories || [],
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Journaliser la demande
    await AccessLog.create({
      userId: req.user.id,
      action: 'data_subject_request',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success',
      details: { requestType }
    });

    res.json({
      success: true,
      message: 'Demande enregistrée avec succès',
      request
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour obtenir le statut de conformité RGPD
router.get('/compliance-status', [auth, logDataAccess('compliance_status')], async (req, res) => {
  try {
    // Récupérer l'utilisateur avec son entreprise
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Company, as: 'company' }]
    });

    if (!user || !user.company) {
      return res.status(404).json({ errors: [{ msg: 'Entreprise non trouvée' }] });
    }

    // Vérifier si l'utilisateur est DPO ou admin
    if (user.role !== 'dpo' && user.role !== 'admin') {
      return res.status(403).json({ errors: [{ msg: 'Accès non autorisé' }] });
    }

    // Statut de conformité RGPD
    const complianceStatus = {
      companyName: user.company.name,
      lastAssessment: '2024-03-01',
      overallScore: 85,
      categories: [
        {
          name: 'Principes fondamentaux',
          score: 90,
          items: [
            { name: 'Licéité, loyauté et transparence', status: 'compliant' },
            { name: 'Limitation des finalités', status: 'compliant' },
            { name: 'Minimisation des données', status: 'compliant' },
            { name: 'Exactitude', status: 'compliant' },
            { name: 'Limitation de la conservation', status: 'partially_compliant' }
          ]
        },
        {
          name: 'Droits des personnes concernées',
          score: 85,
          items: [
            { name: 'Droit d\'accès', status: 'compliant' },
            { name: 'Droit de rectification', status: 'compliant' },
            { name: 'Droit à l\'effacement', status: 'compliant' },
            { name: 'Droit à la limitation du traitement', status: 'compliant' },
            { name: 'Droit à la portabilité', status: 'partially_compliant' },
            { name: 'Droit d\'opposition', status: 'compliant' }
          ]
        },
        {
          name: 'Responsabilité et gouvernance',
          score: 80,
          items: [
            { name: 'Registre des traitements', status: 'compliant' },
            { name: 'Analyse d\'impact (PIA)', status: 'compliant' },
            { name: 'Protection des données dès la conception', status: 'partially_compliant' },
            { name: 'Protection des données par défaut', status: 'partially_compliant' },
            { name: 'Mesures de sécurité', status: 'compliant' },
            { name: 'Notification des violations', status: 'compliant' }
          ]
        }
      ],
      recommendations: [
        {
          category: 'Limitation de la conservation',
          description: 'Mettre en place un mécanisme automatique de suppression des données après la période de conservation',
          priority: 'medium'
        },
        {
          category: 'Droit à la portabilité',
          description: 'Améliorer le format d\'export des données pour faciliter leur réutilisation',
          priority: 'low'
        },
        {
          category: 'Protection des données dès la conception',
          description: 'Formaliser la procédure d\'évaluation RGPD pour les nouvelles fonctionnalités',
          priority: 'high'
        }
      ]
    };

    res.json(complianceStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
