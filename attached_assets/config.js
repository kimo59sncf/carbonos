// Configuration du backend
require('dotenv').config();

module.exports = {
  // Configuration de l'application
  app: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    apiPrefix: '/api',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  
  // Configuration de la base de données
  database: {
    url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/carbonos',
    options: {
      logging: process.env.NODE_ENV === 'development',
      dialect: 'postgres',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      }
    }
  },
  
  // Configuration de l'authentification
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'carbonos_secret_key_change_in_production',
    jwtExpiresIn: '1d',
    jwtRefreshExpiresIn: '7d',
    saltRounds: 10,
  },
  
  // Configuration RGPD
  rgpd: {
    dataRetentionPeriod: 5 * 365 * 24 * 60 * 60 * 1000, // 5 ans en millisecondes
    logRetentionPeriod: 1 * 365 * 24 * 60 * 60 * 1000, // 1 an en millisecondes
    cookieMaxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours en millisecondes
  },
  
  // Configuration des emails
  email: {
    from: process.env.EMAIL_FROM || 'noreply@carbonos.fr',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    },
  },
  
  // Configuration des facteurs d'émission
  emissionFactors: {
    source: 'ADEME', // Source des facteurs d'émission
    updateFrequency: '1m', // Fréquence de mise à jour (1 mois)
    apiUrl: process.env.EMISSION_FACTORS_API || 'https://api.ademe.fr/data/v1/emission-factors',
  },
  
  // Configuration de la sécurité
  security: {
    rateLimiter: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limite chaque IP à 100 requêtes par fenêtre
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'", 'https://api.ademe.fr'],
        },
      },
    },
  },
  
  // Configuration des logs
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? 'json' : 'dev',
  },
};
