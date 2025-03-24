const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

// Middleware d'authentification
module.exports = function(req, res, next) {
  // Récupérer le token du header
  const token = req.header('x-auth-token');

  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({ errors: [{ msg: 'Aucun token, autorisation refusée' }] });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, authConfig.jwtSecret);
    
    // Ajouter l'utilisateur à la requête
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Erreur de vérification du token:', err.message);
    res.status(401).json({ errors: [{ msg: 'Token invalide' }] });
  }
};
