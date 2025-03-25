// Middleware pour la gestion des consentements RGPD
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { User, Consent, AccessLog } = require('../models');

// Route pour obtenir les consentements de l'utilisateur
router.get('/consents', auth, async (req, res) => {
  try {
    // Récupérer tous les consentements de l'utilisateur
    const consents = await Consent.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    // Regrouper les consentements par type (prendre le plus récent pour chaque type)
    const consentsByType = {};
    consents.forEach(consent => {
      if (!consentsByType[consent.type] || new Date(consent.createdAt) > new Date(consentsByType[consent.type].createdAt)) {
        consentsByType[consent.type] = consent;
      }
    });

    // Journaliser l'accès aux consentements
    await AccessLog.create({
      userId: req.user.id,
      action: 'view_consents',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json(Object.values(consentsByType));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour mettre à jour un consentement
router.post('/consents', [
  auth,
  check('type', 'Le type de consentement est requis').isIn(['terms', 'data_processing', 'marketing', 'cookies', 'third_party']),
  check('status', 'Le statut du consentement est requis').isBoolean(),
  check('version', 'La version du document de consentement est requise').not().isEmpty()
], async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { type, status, version } = req.body;

  try {
    // Créer un nouveau consentement (on ne modifie jamais les consentements existants pour garder un historique)
    const consent = await Consent.create({
      userId: req.user.id,
      type,
      status,
      version,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Mettre à jour les champs correspondants dans l'utilisateur si nécessaire
    if (type === 'marketing') {
      await User.update(
        { consentMarketing: status },
        { where: { id: req.user.id } }
      );
    } else if (type === 'data_processing') {
      await User.update(
        { consentDataProcessing: status },
        { where: { id: req.user.id } }
      );
    }

    // Journaliser la mise à jour d'un consentement
    await AccessLog.create({
      userId: req.user.id,
      action: 'update_consent',
      resourceType: 'consent',
      resourceId: consent.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success',
      details: { type, status }
    });

    res.json(consent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour exporter les données personnelles (droit à la portabilité)
router.get('/export-data', auth, async (req, res) => {
  try {
    // Récupérer l'utilisateur avec ses données associées
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'refreshToken', 'passwordResetToken', 'passwordResetExpires'] },
      include: [
        { model: Consent, as: 'consents' },
        { model: AccessLog, as: 'accessLogs', limit: 100, order: [['createdAt', 'DESC']] }
      ]
    });

    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
    }

    // Récupérer les autres données associées à l'utilisateur
    // Dans une implémentation réelle, on récupérerait toutes les données liées à l'utilisateur
    const userData = {
      user: user.toJSON(),
      // Autres données à inclure dans l'export
    };

    // Journaliser l'export des données
    await AccessLog.create({
      userId: req.user.id,
      action: 'export_personal_data',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    // Renvoyer les données au format JSON
    res.json(userData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour supprimer le compte utilisateur (droit à l'oubli)
router.delete('/account', auth, async (req, res) => {
  try {
    // Récupérer l'utilisateur
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
    }

    // Journaliser la demande de suppression
    await AccessLog.create({
      userId: req.user.id,
      action: 'delete_account',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    // Anonymiser les données personnelles
    await user.update({
      firstName: 'Utilisateur',
      lastName: 'Supprimé',
      email: `deleted_${user.id}@example.com`,
      password: null,
      refreshToken: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      isActive: false
    });

    // Soft delete
    await user.destroy();

    res.json({ msg: 'Compte supprimé avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour obtenir les journaux d'accès (droit d'accès)
router.get('/access-logs', auth, async (req, res) => {
  try {
    // Récupérer les journaux d'accès de l'utilisateur
    const accessLogs = await AccessLog.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 100
    });

    // Journaliser l'accès aux journaux
    await AccessLog.create({
      userId: req.user.id,
      action: 'view_access_logs',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.json(accessLogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour obtenir les politiques de confidentialité et mentions légales
router.get('/policies/:type', async (req, res) => {
  const { type } = req.params;
  
  try {
    let policy;
    
    switch (type) {
      case 'privacy':
        policy = {
          title: 'Politique de Confidentialité',
          version: '1.0',
          lastUpdated: '2024-03-01',
          content: `
            # Politique de Confidentialité de CarbonOS

            ## 1. Introduction
            CarbonOS s'engage à protéger la vie privée des utilisateurs de notre plateforme. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos données personnelles.

            ## 2. Données collectées
            Nous collectons les données suivantes :
            - Informations d'identification (nom, prénom, email)
            - Données professionnelles (entreprise, fonction)
            - Données d'émissions carbone
            - Données de connexion et d'utilisation

            ## 3. Utilisation des données
            Vos données sont utilisées pour :
            - Fournir nos services de calcul et reporting carbone
            - Améliorer notre plateforme
            - Respecter nos obligations légales

            ## 4. Base légale
            Nous traitons vos données sur les bases légales suivantes :
            - Exécution du contrat
            - Consentement explicite
            - Intérêt légitime
            - Obligation légale

            ## 5. Durée de conservation
            Vos données sont conservées pendant 5 ans après la fin de votre abonnement, conformément aux obligations légales françaises.

            ## 6. Vos droits
            Conformément au RGPD, vous disposez des droits suivants :
            - Droit d'accès
            - Droit de rectification
            - Droit à l'effacement
            - Droit à la limitation du traitement
            - Droit à la portabilité
            - Droit d'opposition

            ## 7. Sécurité
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données.

            ## 8. Transferts internationaux
            Vos données sont hébergées en France/UE et ne sont pas transférées hors de l'UE.

            ## 9. Sous-traitants
            Nous utilisons des sous-traitants pour certains services, tous conformes au RGPD.

            ## 10. Contact
            Pour toute question concernant cette politique, contactez notre DPO à dpo@carbonos.fr.
          `
        };
        break;
      case 'terms':
        policy = {
          title: 'Conditions Générales d\'Utilisation',
          version: '1.0',
          lastUpdated: '2024-03-01',
          content: `
            # Conditions Générales d'Utilisation de CarbonOS

            ## 1. Objet
            Les présentes CGU régissent l'utilisation de la plateforme CarbonOS.

            ## 2. Acceptation
            L'utilisation de la plateforme implique l'acceptation pleine et entière des présentes CGU.

            ## 3. Description du service
            CarbonOS est une plateforme SaaS de gestion carbone pour les PME/ETI françaises.

            ## 4. Accès au service
            L'accès à la plateforme nécessite la création d'un compte utilisateur.

            ## 5. Obligations de l'utilisateur
            L'utilisateur s'engage à :
            - Fournir des informations exactes
            - Respecter les droits de propriété intellectuelle
            - Ne pas utiliser la plateforme à des fins illicites

            ## 6. Propriété intellectuelle
            La plateforme et son contenu sont protégés par les droits de propriété intellectuelle.

            ## 7. Responsabilité
            CarbonOS ne peut être tenu responsable des dommages indirects résultant de l'utilisation de la plateforme.

            ## 8. Modification des CGU
            CarbonOS se réserve le droit de modifier les présentes CGU à tout moment.

            ## 9. Droit applicable
            Les présentes CGU sont soumises au droit français.

            ## 10. Contact
            Pour toute question concernant ces CGU, contactez-nous à contact@carbonos.fr.
          `
        };
        break;
      case 'cookies':
        policy = {
          title: 'Politique de Cookies',
          version: '1.0',
          lastUpdated: '2024-03-01',
          content: `
            # Politique de Cookies de CarbonOS

            ## 1. Qu'est-ce qu'un cookie ?
            Un cookie est un petit fichier texte stocké sur votre appareil lors de la visite d'un site web.

            ## 2. Types de cookies utilisés
            Nous utilisons les types de cookies suivants :
            - Cookies essentiels
            - Cookies de performance
            - Cookies de fonctionnalité
            - Cookies analytiques

            ## 3. Finalités des cookies
            Nos cookies sont utilisés pour :
            - Assurer le bon fonctionnement de la plateforme
            - Mémoriser vos préférences
            - Analyser l'utilisation de la plateforme
            - Améliorer votre expérience utilisateur

            ## 4. Durée de conservation
            Les cookies essentiels sont conservés pendant la durée de votre session.
            Les autres cookies sont conservés pendant une durée maximale de 13 mois.

            ## 5. Gestion des cookies
            Vous pouvez gérer vos préférences en matière de cookies via notre bandeau de cookies ou les paramètres de votre navigateur.

            ## 6. Modifications
            Nous nous réservons le droit de modifier cette politique à tout moment.

            ## 7. Contact
            Pour toute question concernant cette politique, contactez-nous à contact@carbonos.fr.
          `
        };
        break;
      default:
        return res.status(404).json({ errors: [{ msg: 'Politique non trouvée' }] });
    }

    res.json(policy);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
