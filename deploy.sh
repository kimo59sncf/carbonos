#!/bin/bash

# Script de déploiement pour CarbonOS
# Ce script prépare et déploie l'application CarbonOS sur un serveur de production

# Variables d'environnement
ENV_FILE=".env.production"
DEPLOY_DIR="/var/www/carbonos"
BACKUP_DIR="/var/backups/carbonos"
LOG_DIR="/var/log/carbonos"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1"
  exit 1
}

# Vérifier si l'utilisateur est root
if [ "$(id -u)" != "0" ]; then
   error "Ce script doit être exécuté en tant que root"
fi

# Vérifier si les répertoires existent, sinon les créer
log "Création des répertoires nécessaires..."
mkdir -p $DEPLOY_DIR $BACKUP_DIR $LOG_DIR

# Vérifier si le fichier d'environnement existe
if [ ! -f "$ENV_FILE" ]; then
  error "Le fichier $ENV_FILE n'existe pas. Veuillez le créer avant de continuer."
fi

# Sauvegarder l'application existante si elle existe
if [ -d "$DEPLOY_DIR/current" ]; then
  log "Sauvegarde de l'application existante..."
  mkdir -p $BACKUP_DIR/$TIMESTAMP
  cp -r $DEPLOY_DIR/current/* $BACKUP_DIR/$TIMESTAMP/
  log "Sauvegarde terminée dans $BACKUP_DIR/$TIMESTAMP"
fi

# Créer un nouveau répertoire pour le déploiement
log "Préparation du répertoire de déploiement..."
mkdir -p $DEPLOY_DIR/releases/$TIMESTAMP
mkdir -p $DEPLOY_DIR/shared/logs
mkdir -p $DEPLOY_DIR/shared/uploads

# Copier les fichiers de l'application
log "Copie des fichiers de l'application..."
cp -r ./* $DEPLOY_DIR/releases/$TIMESTAMP/
cp $ENV_FILE $DEPLOY_DIR/releases/$TIMESTAMP/.env

# Installation des dépendances
log "Installation des dépendances backend..."
cd $DEPLOY_DIR/releases/$TIMESTAMP/backend
npm install --production

log "Installation des dépendances frontend..."
cd $DEPLOY_DIR/releases/$TIMESTAMP/frontend
npm install --production

# Construction du frontend
log "Construction du frontend..."
npm run build

# Mise à jour des liens symboliques
log "Mise à jour des liens symboliques..."
ln -sfn $DEPLOY_DIR/shared/logs $DEPLOY_DIR/releases/$TIMESTAMP/logs
ln -sfn $DEPLOY_DIR/shared/uploads $DEPLOY_DIR/releases/$TIMESTAMP/uploads
ln -sfn $DEPLOY_DIR/releases/$TIMESTAMP $DEPLOY_DIR/current

# Configuration de la base de données
log "Configuration de la base de données..."
cd $DEPLOY_DIR/current/backend
node src/config/db-setup.js

# Redémarrage des services
log "Redémarrage des services..."
systemctl restart carbonos-backend
systemctl restart carbonos-frontend
systemctl restart nginx

# Vérification du déploiement
log "Vérification du déploiement..."
if curl -s http://localhost:5000/api/health | grep -q "ok"; then
  log "Le backend est opérationnel."
else
  warn "Le backend ne répond pas correctement."
fi

if curl -s http://localhost:3000 | grep -q "CarbonOS"; then
  log "Le frontend est opérationnel."
else
  warn "Le frontend ne répond pas correctement."
fi

# Nettoyage des anciennes versions
log "Nettoyage des anciennes versions..."
cd $DEPLOY_DIR/releases
ls -t | tail -n +6 | xargs rm -rf

log "Déploiement terminé avec succès!"
log "L'application est accessible à l'adresse: https://carbonos.fr"
