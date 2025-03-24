// Middleware pour vérifier le consentement au traitement des données
const checkDataProcessingConsent = async (req, res, next) => {
  try {
    // Vérifier si l'utilisateur est authentifié
    if (!req.user) {
      return next();
    }

    // Récupérer l'utilisateur
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
    }

    // Vérifier si l'utilisateur a donné son consentement au traitement des données
    if (!user.consentDataProcessing) {
      return res.status(403).json({ 
        errors: [{ 
          msg: 'Consentement au traitement des données requis',
          code: 'CONSENT_REQUIRED',
          type: 'data_processing'
        }] 
      });
    }

    next();
  } catch (err) {
    console.error('Erreur lors de la vérification du consentement:', err.message);
    res.status(500).send('Erreur serveur');
  }
};

// Middleware pour journaliser les accès aux données sensibles
const logDataAccess = (resourceType) => async (req, res, next) => {
  try {
    // Vérifier si l'utilisateur est authentifié
    if (!req.user) {
      return next();
    }

    // Journaliser l'accès
    await AccessLog.create({
      userId: req.user.id,
      action: `access_${resourceType}`,
      resourceType,
      resourceId: req.params.id || null,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    next();
  } catch (err) {
    console.error('Erreur lors de la journalisation de l\'accès:', err.message);
    // Ne pas bloquer la requête en cas d'erreur de journalisation
    next();
  }
};

// Middleware pour vérifier l'âge de conservation des données
const checkDataRetention = (model, field = 'createdAt', maxAgeMonths = 60) => async (req, res, next) => {
  try {
    // Calculer la date limite de conservation
    const retentionDate = new Date();
    retentionDate.setMonth(retentionDate.getMonth() - maxAgeMonths);

    // Supprimer les données plus anciennes que la date limite
    await model.destroy({
      where: {
        [field]: {
          [Op.lt]: retentionDate
        }
      },
      force: true // Suppression définitive, pas de soft delete
    });

    next();
  } catch (err) {
    console.error('Erreur lors de la vérification de la conservation des données:', err.message);
    // Ne pas bloquer la requête en cas d'erreur
    next();
  }
};

// Middleware pour anonymiser les données sensibles dans les réponses
const anonymizeData = (fields) => (req, res, next) => {
  // Sauvegarder la fonction json originale
  const originalJson = res.json;

  // Remplacer la fonction json
  res.json = function(obj) {
    // Fonction récursive pour anonymiser les champs sensibles
    const anonymize = (data) => {
      if (!data) return data;
      
      if (Array.isArray(data)) {
        return data.map(item => anonymize(item));
      }
      
      if (typeof data === 'object') {
        const result = { ...data };
        
        // Anonymiser les champs spécifiés
        fields.forEach(field => {
          if (result[field]) {
            if (field.includes('email')) {
              // Anonymiser les emails
              const parts = result[field].split('@');
              if (parts.length === 2) {
                result[field] = `${parts[0].substring(0, 2)}***@${parts[1]}`;
              }
            } else if (field.includes('name') || field.includes('Name')) {
              // Anonymiser les noms
              result[field] = `${result[field].substring(0, 1)}***`;
            } else if (field.includes('phone') || field.includes('Phone')) {
              // Anonymiser les numéros de téléphone
              result[field] = `***${result[field].substring(result[field].length - 4)}`;
            } else {
              // Anonymiser les autres champs
              result[field] = '***';
            }
          }
        });
        
        // Traiter récursivement les objets imbriqués
        Object.keys(result).forEach(key => {
          if (typeof result[key] === 'object' && result[key] !== null) {
            result[key] = anonymize(result[key]);
          }
        });
        
        return result;
      }
      
      return data;
    };

    // Anonymiser les données
    const anonymizedObj = anonymize(obj);
    
    // Appeler la fonction json originale avec les données anonymisées
    return originalJson.call(this, anonymizedObj);
  };

  next();
};

// Middleware pour vérifier le consentement aux cookies
const checkCookieConsent = (req, res, next) => {
  // Vérifier si le consentement aux cookies est présent dans les cookies
  const cookieConsent = req.cookies && req.cookies.cookieConsent;
  
  if (!cookieConsent) {
    // Si pas de consentement, limiter les cookies aux essentiels
    res.locals.cookiesAllowed = {
      essential: true,
      performance: false,
      functionality: false,
      analytics: false,
      marketing: false
    };
  } else {
    // Sinon, utiliser les préférences de l'utilisateur
    try {
      res.locals.cookiesAllowed = JSON.parse(cookieConsent);
    } catch (err) {
      // En cas d'erreur, limiter aux cookies essentiels
      res.locals.cookiesAllowed = {
        essential: true,
        performance: false,
        functionality: false,
        analytics: false,
        marketing: false
      };
    }
  }
  
  next();
};

// Middleware pour gérer les demandes de droit à l'oubli
const handleRightToBeForgotten = async (req, res, next) => {
  try {
    // Vérifier si la demande concerne le droit à l'oubli
    if (req.method === 'DELETE' && req.path.includes('/account')) {
      // Récupérer l'utilisateur
      const user = await User.findByPk(req.user.id);
      
      if (!user) {
        return res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
      }
      
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
      
      // Journaliser la demande de suppression
      await AccessLog.create({
        userId: req.user.id,
        action: 'right_to_be_forgotten',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        status: 'success'
      });
      
      return res.json({ msg: 'Compte supprimé avec succès' });
    }
    
    next();
  } catch (err) {
    console.error('Erreur lors du traitement du droit à l\'oubli:', err.message);
    res.status(500).send('Erreur serveur');
  }
};

module.exports = {
  checkDataProcessingConsent,
  logDataAccess,
  checkDataRetention,
  anonymizeData,
  checkCookieConsent,
  handleRightToBeForgotten
};
