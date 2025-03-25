#!/bin/bash

# Script d'installation de CarbonOS
# Ce script prépare l'environnement et installe CarbonOS

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

# Vérifier si l'utilisateur est root
if [ "$(id -u)" != "0" ]; then
   error "Ce script doit être exécuté en tant que root"
fi

# Vérifier les prérequis
header "Vérification des prérequis"

# Vérifier la version d'Ubuntu
if [ -f /etc/os-release ]; then
    . /etc/os-release
    if [ "$ID" != "ubuntu" ] || [ "${VERSION_ID%%.*}" -lt 22 ]; then
        error "Ce script nécessite Ubuntu 22.04 ou supérieur"
    fi
    log "Système d'exploitation compatible : $PRETTY_NAME"
else
    error "Impossible de déterminer la version du système d'exploitation"
fi

# Vérifier l'espace disque
AVAILABLE_SPACE=$(df -BG / | awk 'NR==2 {print $4}' | sed 's/G//')
if [ "$AVAILABLE_SPACE" -lt 10 ]; then
    warn "Espace disque disponible insuffisant : ${AVAILABLE_SPACE}G (minimum recommandé : 10G)"
    read -p "Voulez-vous continuer quand même ? (o/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Oo]$ ]]; then
        error "Installation annulée"
    fi
else
    log "Espace disque disponible : ${AVAILABLE_SPACE}G"
fi

# Vérifier la mémoire RAM
TOTAL_RAM=$(free -m | awk 'NR==2 {print $2}')
if [ "$TOTAL_RAM" -lt 4000 ]; then
    warn "Mémoire RAM insuffisante : ${TOTAL_RAM}M (minimum recommandé : 4000M)"
    read -p "Voulez-vous continuer quand même ? (o/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Oo]$ ]]; then
        error "Installation annulée"
    fi
else
    log "Mémoire RAM disponible : ${TOTAL_RAM}M"
fi

# Mise à jour du système
header "Mise à jour du système"
log "Mise à jour des paquets..."
apt update || error "Impossible de mettre à jour les paquets"
apt upgrade -y || warn "Impossible de mettre à jour le système"

# Installation des dépendances
header "Installation des dépendances"
log "Installation des paquets requis..."
apt install -y curl git build-essential nginx postgresql postgresql-contrib certbot python3-certbot-nginx || error "Impossible d'installer les paquets requis"

# Installation de Node.js
if ! command -v node &> /dev/null; then
    log "Installation de Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - || error "Impossible de configurer le dépôt Node.js"
    apt install -y nodejs || error "Impossible d'installer Node.js"
else
    NODE_VERSION=$(node -v)
    log "Node.js est déjà installé : $NODE_VERSION"
fi

# Installation de Docker (optionnel)
read -p "Voulez-vous installer Docker pour le déploiement conteneurisé ? (o/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Oo]$ ]]; then
    log "Installation de Docker..."
    curl -fsSL https://get.docker.com | bash - || error "Impossible d'installer Docker"
    
    log "Installation de Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose || error "Impossible de télécharger Docker Compose"
    chmod +x /usr/local/bin/docker-compose || error "Impossible de rendre Docker Compose exécutable"
    
    log "Docker et Docker Compose ont été installés avec succès"
fi

# Création de l'utilisateur de service
header "Configuration de l'environnement"
log "Création de l'utilisateur de service..."
if id "carbonos" &>/dev/null; then
    log "L'utilisateur carbonos existe déjà"
else
    useradd --system --shell /bin/bash --create-home carbonos || error "Impossible de créer l'utilisateur carbonos"
    log "Utilisateur carbonos créé avec succès"
fi

# Création du répertoire d'installation
log "Création du répertoire d'installation..."
mkdir -p /var/www/carbonos || error "Impossible de créer le répertoire d'installation"
chown -R carbonos:carbonos /var/www/carbonos || error "Impossible de modifier les permissions du répertoire d'installation"

# Extraction de l'archive
header "Installation de CarbonOS"
log "Extraction des fichiers..."
tar -xzf carbonos.tar.gz -C /var/www/carbonos || error "Impossible d'extraire l'archive"
chown -R carbonos:carbonos /var/www/carbonos || error "Impossible de modifier les permissions des fichiers extraits"

# Configuration de la base de données
header "Configuration de la base de données"
log "Création de la base de données PostgreSQL..."

# Générer un mot de passe aléatoire
DB_PASSWORD=$(openssl rand -base64 12)

# Créer la base de données et l'utilisateur
su - postgres -c "psql -c \"CREATE DATABASE carbonos_prod;\"" || error "Impossible de créer la base de données"
su - postgres -c "psql -c \"CREATE USER carbonos_user WITH ENCRYPTED PASSWORD '$DB_PASSWORD';\"" || error "Impossible de créer l'utilisateur de base de données"
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE carbonos_prod TO carbonos_user;\"" || error "Impossible d'accorder les privilèges à l'utilisateur"

log "Base de données configurée avec succès"

# Configuration de l'application
header "Configuration de l'application"
log "Configuration des variables d'environnement..."

# Créer le fichier .env.production
cat > /var/www/carbonos/.env.production << EOF
# Configuration générale
NODE_ENV=production
PORT=5000
API_URL=https://votre-domaine.fr/api
CLIENT_URL=https://votre-domaine.fr

# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=carbonos_prod
DB_USER=carbonos_user
DB_PASSWORD=$DB_PASSWORD

# JWT
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRE=3600
REFRESH_TOKEN_EXPIRE=604800

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
EMAIL_FROM=noreply@example.com

# Sauvegarde
BACKUP_DIR=/var/backups/carbonos
LOG_DIR=/var/log/carbonos
BACKUP_RETENTION_DAYS=30
EOF

# Demander à l'utilisateur de configurer le domaine
read -p "Entrez le nom de domaine pour CarbonOS (ex: carbonos.fr): " DOMAIN_NAME
if [ -z "$DOMAIN_NAME" ]; then
    DOMAIN_NAME="carbonos.example.com"
    warn "Aucun domaine spécifié, utilisation de la valeur par défaut: $DOMAIN_NAME"
fi

# Mettre à jour le fichier .env.production avec le domaine
sed -i "s/votre-domaine.fr/$DOMAIN_NAME/g" /var/www/carbonos/.env.production

# Créer les répertoires de logs et de sauvegardes
mkdir -p /var/log/carbonos /var/backups/carbonos
chown -R carbonos:carbonos /var/log/carbonos /var/backups/carbonos

log "Configuration terminée avec succès"

# Installation des dépendances de l'application
header "Installation des dépendances"
log "Installation des dépendances du backend..."
su - carbonos -c "cd /var/www/carbonos/backend && npm install --production" || error "Impossible d'installer les dépendances du backend"

log "Installation des dépendances du frontend..."
su - carbonos -c "cd /var/www/carbonos/frontend && npm install --production" || error "Impossible d'installer les dépendances du frontend"

log "Construction du frontend..."
su - carbonos -c "cd /var/www/carbonos/frontend && npm run build" || error "Impossible de construire le frontend"

# Configuration des services systemd
header "Configuration des services"
log "Configuration des services systemd..."

# Service backend
cat > /etc/systemd/system/carbonos-backend.service << EOF
[Unit]
Description=CarbonOS Backend Service
After=network.target postgresql.service

[Service]
Type=simple
User=carbonos
WorkingDirectory=/var/www/carbonos/backend
ExecStart=/usr/bin/node src/server.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=carbonos-backend
Environment=NODE_ENV=production
Environment=PORT=5000

[Install]
WantedBy=multi-user.target
EOF

# Service frontend
cat > /etc/systemd/system/carbonos-frontend.service << EOF
[Unit]
Description=CarbonOS Frontend Service
After=network.target

[Service]
Type=simple
User=carbonos
WorkingDirectory=/var/www/carbonos/frontend
ExecStart=/usr/bin/npx serve -s build -l 3000
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=carbonos-frontend
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Recharger systemd
systemctl daemon-reload || error "Impossible de recharger systemd"

# Activer et démarrer les services
log "Activation et démarrage des services..."
systemctl enable carbonos-backend.service || error "Impossible d'activer le service backend"
systemctl enable carbonos-frontend.service || error "Impossible d'activer le service frontend"
systemctl start carbonos-backend.service || error "Impossible de démarrer le service backend"
systemctl start carbonos-frontend.service || error "Impossible de démarrer le service frontend"

# Configuration de Nginx
header "Configuration du serveur web"
log "Configuration de Nginx..."

# Créer la configuration Nginx
cat > /etc/nginx/sites-available/carbonos.conf << EOF
server {
    listen 80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;
    
    # Redirection vers HTTPS
    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;
    
    # Configuration SSL (sera configurée par certbot)
    
    # Racine du site
    root /var/www/carbonos/frontend/build;
    index index.html;
    
    # En-têtes de sécurité
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://api.$DOMAIN_NAME;";
    add_header Referrer-Policy strict-origin-when-cross-origin;
    add_header Feature-Policy "camera 'none'; microphone 'none'; geolocation 'none'";
    
    # Configuration pour le frontend React
    location / {
        try_files \$uri \$uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public, max-age=3600";
    }
    
    # Configuration pour l'API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Configuration pour les assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }
    
    # Désactiver l'accès aux fichiers cachés
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
EOF

# Activer la configuration Nginx
ln -sf /etc/nginx/sites-available/carbonos.conf /etc/nginx/sites-enabled/ || error "Impossible d'activer la configuration Nginx"

# Vérifier la configuration Nginx
nginx -t || error "La configuration Nginx est invalide"

# Redémarrer Nginx
systemctl restart nginx || error "Impossible de redémarrer Nginx"

# Configuration SSL avec Certbot
header "Configuration SSL"
read -p "Voulez-vous configurer SSL avec Let's Encrypt maintenant ? (o/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Oo]$ ]]; then
    log "Configuration de SSL avec Let's Encrypt..."
    certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME || warn "Impossible de configurer SSL automatiquement"
else
    log "Configuration SSL ignorée. Vous pourrez la configurer plus tard avec la commande:"
    echo "  certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME"
fi

# Configuration des sauvegardes
header "Configuration des sauvegardes"
log "Configuration des sauvegardes automatiques..."

# Rendre le script de sauvegarde exécutable
chmod +x /var/www/carbonos/backup.sh || error "Impossible de rendre le script de sauvegarde exécutable"

# Ajouter une tâche cron pour les sauvegardes quotidiennes
(crontab -l 2>/dev/null; echo "0 1 * * * /var/www/carbonos/backup.sh") | crontab - || warn "Impossible de configurer la tâche cron pour les sauvegardes"

# Finalisation
header "Installation terminée"
log "CarbonOS a été installé avec succès !"
log "Vous pouvez accéder à l'application à l'adresse: https://$DOMAIN_NAME"
log "Informations importantes :"
echo "  - Base de données : carbonos_prod"
echo "  - Utilisateur DB : carbonos_user"
echo "  - Mot de passe DB : $DB_PASSWORD"
echo "  - Répertoire d'installation : /var/www/carbonos"
echo "  - Logs : /var/log/carbonos"
echo "  - Sauvegardes : /var/backups/carbonos"
echo ""
log "Pour plus d'informations, consultez la documentation dans /var/www/carbonos/docs/"

exit 0
