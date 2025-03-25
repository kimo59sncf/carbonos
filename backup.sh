#!/bin/bash

# Script de sauvegarde automatique pour CarbonOS
# Ce script effectue une sauvegarde complète de l'application et de la base de données

# Variables d'environnement
source /var/www/carbonos/current/.env.production
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="carbonos_backup_$TIMESTAMP"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
LOG_FILE="$LOG_DIR/backup_$TIMESTAMP.log"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log() {
  echo -e "${GREEN}[INFO]${NC} $1" | tee -a $LOG_FILE
}

warn() {
  echo -e "${YELLOW}[WARN]${NC} $1" | tee -a $LOG_FILE
}

error() {
  echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
  exit 1
}

# Vérifier si l'utilisateur est root
if [ "$(id -u)" != "0" ]; then
   error "Ce script doit être exécuté en tant que root"
fi

# Créer les répertoires nécessaires
log "Création des répertoires de sauvegarde..."
mkdir -p $BACKUP_PATH
mkdir -p $LOG_DIR

# Sauvegarde de la base de données
log "Sauvegarde de la base de données PostgreSQL..."
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F c -f $BACKUP_PATH/database.dump 2>> $LOG_FILE
if [ $? -ne 0 ]; then
  error "Erreur lors de la sauvegarde de la base de données"
fi
log "Sauvegarde de la base de données terminée"

# Sauvegarde des fichiers de l'application
log "Sauvegarde des fichiers de l'application..."
cp -r /var/www/carbonos/current $BACKUP_PATH/app 2>> $LOG_FILE
if [ $? -ne 0 ]; then
  error "Erreur lors de la sauvegarde des fichiers de l'application"
fi
log "Sauvegarde des fichiers de l'application terminée"

# Sauvegarde des fichiers de configuration
log "Sauvegarde des fichiers de configuration..."
mkdir -p $BACKUP_PATH/config
cp /etc/nginx/sites-available/carbonos.conf $BACKUP_PATH/config/ 2>> $LOG_FILE
cp /etc/systemd/system/carbonos-backend.service $BACKUP_PATH/config/ 2>> $LOG_FILE
cp /etc/systemd/system/carbonos-frontend.service $BACKUP_PATH/config/ 2>> $LOG_FILE
log "Sauvegarde des fichiers de configuration terminée"

# Compression de la sauvegarde
log "Compression de la sauvegarde..."
cd $BACKUP_DIR
tar -czf $BACKUP_NAME.tar.gz $BACKUP_NAME 2>> $LOG_FILE
if [ $? -ne 0 ]; then
  error "Erreur lors de la compression de la sauvegarde"
fi
log "Compression de la sauvegarde terminée"

# Suppression du répertoire temporaire
log "Nettoyage des fichiers temporaires..."
rm -rf $BACKUP_PATH

# Nettoyage des anciennes sauvegardes
log "Nettoyage des anciennes sauvegardes..."
find $BACKUP_DIR -name "carbonos_backup_*.tar.gz" -type f -mtime +$BACKUP_RETENTION_DAYS -delete
find $LOG_DIR -name "backup_*.log" -type f -mtime +$BACKUP_RETENTION_DAYS -delete

log "Sauvegarde terminée avec succès: $BACKUP_DIR/$BACKUP_NAME.tar.gz"

# Envoi d'une notification par email
if [ -n "$SMTP_HOST" ] && [ -n "$SMTP_USER" ] && [ -n "$SMTP_PASS" ]; then
  log "Envoi d'une notification par email..."
  echo "Sauvegarde CarbonOS terminée avec succès le $(date)" | mail -s "CarbonOS - Sauvegarde réussie" $DPO_EMAIL
fi

exit 0
