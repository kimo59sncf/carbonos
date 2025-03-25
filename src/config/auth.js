// Configuration JWT et authentification
module.exports = {
  // Secret pour signer les tokens JWT
  jwtSecret: process.env.JWT_SECRET || 'carbonos_secret_key_change_in_production',
  
  // Durée de validité des tokens
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  // Configuration OAuth2
  oauth: {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
    },
    microsoft: {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: process.env.MICROSOFT_CALLBACK_URL || 'http://localhost:5000/api/auth/microsoft/callback'
    }
  },
  
  // Options de hachage des mots de passe
  bcrypt: {
    saltRounds: 10
  }
};
