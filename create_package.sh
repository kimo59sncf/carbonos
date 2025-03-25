#!/bin/bash

# Script de création du package téléchargeable CarbonOS
# Ce script rassemble tous les fichiers nécessaires et crée une archive

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
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

header() {
  echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

# Répertoire de travail
WORK_DIR="/home/ubuntu/CarbonOS"
PACKAGE_DIR="/home/ubuntu/CarbonOS_Package"
DIST_DIR="/home/ubuntu/CarbonOS_Dist"

# Création des répertoires
header "Préparation des répertoires"
log "Création des répertoires de travail..."
mkdir -p $PACKAGE_DIR
mkdir -p $DIST_DIR

# Nettoyage des répertoires
log "Nettoyage des répertoires..."
rm -rf $PACKAGE_DIR/*
rm -rf $DIST_DIR/*

# Copie des fichiers sources
header "Copie des fichiers sources"
log "Copie du code source..."
cp -r $WORK_DIR/frontend $PACKAGE_DIR/
cp -r $WORK_DIR/backend $PACKAGE_DIR/

# Nettoyage des fichiers inutiles
log "Nettoyage des fichiers inutiles..."
rm -rf $PACKAGE_DIR/frontend/node_modules
rm -rf $PACKAGE_DIR/backend/node_modules
find $PACKAGE_DIR -name ".git" -type d -exec rm -rf {} +
find $PACKAGE_DIR -name ".gitignore" -type f -delete
find $PACKAGE_DIR -name ".DS_Store" -type f -delete

# Copie des fichiers de configuration
header "Copie des fichiers de configuration"
log "Copie des fichiers de configuration..."
cp $WORK_DIR/.env.production $PACKAGE_DIR/
cp $WORK_DIR/docker-compose.yml $PACKAGE_DIR/
cp $WORK_DIR/docker-compose.prod.yml $PACKAGE_DIR/
cp $WORK_DIR/Dockerfile $PACKAGE_DIR/
cp $WORK_DIR/nginx.conf $PACKAGE_DIR/
cp $WORK_DIR/prometheus.yml $PACKAGE_DIR/

# Copie des scripts
header "Copie des scripts"
log "Copie des scripts d'installation et de déploiement..."
cp $WORK_DIR/install.sh $PACKAGE_DIR/
cp $WORK_DIR/deploy.sh $PACKAGE_DIR/
cp $WORK_DIR/backup.sh $PACKAGE_DIR/
chmod +x $PACKAGE_DIR/*.sh

# Copie de la documentation
header "Copie de la documentation"
log "Copie de la documentation..."
mkdir -p $PACKAGE_DIR/docs
cp -r $WORK_DIR/docs/* $PACKAGE_DIR/docs/

# Création du fichier README
header "Création du fichier README"
log "Création du fichier README..."
cat > $PACKAGE_DIR/README.md << EOF
# CarbonOS - Plateforme SaaS de Gestion Carbone

## Introduction

CarbonOS est une solution SaaS clé en main pour automatiser le calcul, le reporting et la réduction de l'empreinte carbone des PME et ETI françaises, tout en respectant le RGPD et les réglementations locales.

## Installation rapide

Pour installer CarbonOS, exécutez le script d'installation :

\`\`\`bash
sudo ./install.sh
\`\`\`

Ce script guidera l'installation pas à pas.

## Documentation

La documentation complète est disponible dans le répertoire \`docs/\` :

- \`documentation_technique.md\` : Architecture, stack technologique, API, etc.
- \`guide_utilisateur.md\` : Guide d'utilisation de l'application
- \`documentation_rgpd.md\` : Conformité RGPD et protection des données
- \`guide_installation.md\` : Guide détaillé d'installation et de déploiement

## Déploiement avec Docker

Pour déployer avec Docker, utilisez :

\`\`\`bash
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

## Support

Pour toute question ou assistance, contactez-nous :

- Email : support@carbonos.fr
- Site web : https://carbonos.fr

## Licence

CarbonOS est distribué sous licence propriétaire. Tous droits réservés.
EOF

# Création du fichier de version
log "Création du fichier de version..."
cat > $PACKAGE_DIR/VERSION << EOF
CarbonOS v1.0.0
Date de création : $(date +"%d/%m/%Y")
EOF

# Création de l'archive
header "Création de l'archive"
log "Création de l'archive..."
cd $PACKAGE_DIR/..
tar -czf $DIST_DIR/carbonos.tar.gz -C $PACKAGE_DIR .
log "Archive créée : $DIST_DIR/carbonos.tar.gz"

# Création du package ZIP
log "Création du package ZIP..."
cd $PACKAGE_DIR/..
zip -r $DIST_DIR/carbonos.zip $PACKAGE_DIR
log "Package ZIP créé : $DIST_DIR/carbonos.zip"

# Création du fichier d'instructions
header "Création du fichier d'instructions"
log "Création du fichier d'instructions..."
cat > $DIST_DIR/INSTRUCTIONS.md << EOF
# Instructions d'installation de CarbonOS

## Contenu du package

Ce package contient :
- \`carbonos.tar.gz\` : Archive complète de l'application
- \`carbonos.zip\` : Version ZIP de l'application (alternative)
- Ce fichier d'instructions

## Installation

1. Transférez l'archive \`carbonos.tar.gz\` sur votre serveur
2. Extrayez l'archive : \`tar -xzf carbonos.tar.gz\`
3. Exécutez le script d'installation : \`sudo ./install.sh\`
4. Suivez les instructions à l'écran

## Prérequis

- Ubuntu 22.04 LTS ou supérieur
- Minimum 4 Go de RAM
- Minimum 10 Go d'espace disque
- Accès root ou sudo
- Nom de domaine pointant vers votre serveur

## Documentation

Consultez le répertoire \`docs/\` pour la documentation complète.

## Support

Pour toute assistance, contactez-nous à support@carbonos.fr
EOF

# Finalisation
header "Package créé avec succès"
log "Le package CarbonOS a été créé avec succès !"
log "Emplacement : $DIST_DIR/"
log "Contenu :"
ls -la $DIST_DIR/

exit 0
