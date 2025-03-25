// Mise à jour du fichier server.js pour intégrer les routes d'abonnement
const express = require('express');
const connectDB = require('./config/database');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();

// Connecter à la base de données
connectDB();

// Middleware
app.use(express.json({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

// Définir les routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/emissions', require('./routes/emissions'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/benchmarks', require('./routes/benchmarks'));
app.use('/api/collaboration', require('./routes/collaboration'));
app.use('/api/rgpd', require('./routes/rgpd'));
app.use('/api/dpo', require('./routes/dpo'));
app.use('/api/trial', require('./routes/trial'));
app.use('/api/subscription', require('./routes/subscription')); // Nouvelle route pour les abonnements

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {
  // Définir le dossier statique
  app.use(express.static(path.join(__dirname, '../../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'));
  });
}

// Définir le port
const PORT = process.env.PORT || 5000;

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
