# Guide d'Installation et de Déploiement - CarbonOS

## Table des matières

1. [Introduction](#1-introduction)
2. [Prérequis](#2-prérequis)
3. [Installation locale](#3-installation-locale)
4. [Déploiement en production](#4-déploiement-en-production)
5. [Configuration](#5-configuration)
6. [Sécurisation](#6-sécurisation)
7. [Monitoring](#7-monitoring)
8. [Sauvegardes](#8-sauvegardes)
9. [Mise à jour](#9-mise-à-jour)
10. [Résolution des problèmes](#10-résolution-des-problèmes)

## 1. Introduction

Ce guide vous accompagnera dans l'installation et le déploiement de CarbonOS, la plateforme SaaS de gestion carbone pour les PME/ETI françaises. Il couvre l'installation locale pour le développement ainsi que le déploiement en environnement de production.

### 1.1 À propos de CarbonOS

CarbonOS est une application web moderne basée sur une architecture en microservices :
- **Frontend** : Application React.js
- **Backend** : API RESTful Node.js
- **Base de données** : PostgreSQL
- **Serveur web** : Nginx

### 1.2 Options de déploiement

CarbonOS peut être déployé de plusieurs façons :
- Installation manuelle sur un serveur dédié
- Déploiement via Docker et Docker Compose
- Déploiement sur une infrastructure cloud (AWS, OVH, Scaleway)

Ce guide couvre principalement les deux premières options, qui sont les plus courantes pour les déploiements en France/UE.

## 2. Prérequis

### 2.1 Matériel recommandé

Pour un déploiement en production, nous recommandons les spécifications minimales suivantes :

- **CPU** : 4 cœurs
- **RAM** : 8 Go
- **Stockage** : 50 Go SSD
- **Bande passante** : 100 Mbps

Pour une installation locale ou de développement, des spécifications inférieures peuvent suffire.

### 2.2 Logiciels requis

#### 2.2.1 Installation manuelle

- **Système d'exploitation** : Ubuntu 22.04 LTS
- **Node.js** : version 20.x
- **PostgreSQL** : version 15.x
- **Nginx** : version 1.18+
- **Git** : version 2.x

#### 2.2.2 Installation avec Docker

- **Système d'exploitation** : Ubuntu 22.04 LTS ou toute distribution Linux compatible
- **Docker** : version 24.x
- **Docker Compose** : version 2.x
- **Git** : version 2.x

### 2.3 Compétences requises

- Connaissances de base en administration système Linux
- Familiarité avec les lignes de commande
- Compréhension des concepts de base des applications web
- Notions de sécurité informatique

## 3. Installation locale

Cette section décrit l'installation de CarbonOS sur un environnement local pour le développement ou les tests.

### 3.1 Clonage du dépôt

```bash
# Cloner le dépôt
git clone https://github.com/carbonos/carbonos.git
cd carbonos
```

### 3.2 Installation des dépendances

```bash
# Installation des dépendances du backend
cd backend
npm install

# Installation des dépendances du frontend
cd ../frontend
npm install
```

### 3.3 Configuration de la base de données

```bash
# Création de la base de données PostgreSQL
sudo -u postgres psql -c "CREATE DATABASE carbonos;"
sudo -u postgres psql -c "CREATE USER carbonos_user WITH ENCRYPTED PASSWORD 'votre_mot_de_passe';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE carbonos TO carbonos_user;"

# Configuration des variables d'environnement
cd ..
cp .env.example .env
```

Éditez le fichier `.env` pour configurer les paramètres de connexion à la base de données :

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=carbonos
DB_USER=carbonos_user
DB_PASSWORD=votre_mot_de_passe
```

### 3.4 Initialisation de la base de données

```bash
# Exécution des migrations
cd backend
npm run db:migrate

# Chargement des données initiales
npm run db:seed
```

### 3.5 Lancement de l'application

```bash
# Lancement du backend
cd backend
npm run dev

# Dans un autre terminal, lancement du frontend
cd frontend
npm start
```

L'application est maintenant accessible à l'adresse http://localhost:3000, et l'API à l'adresse http://localhost:5000.

### 3.6 Installation avec Docker (alternative)

Pour une installation locale avec Docker :

```bash
# Cloner le dépôt
git clone https://github.com/carbonos/carbonos.git
cd carbonos

# Copier le fichier d'environnement
cp .env.example .env

# Lancer les conteneurs
docker-compose up -d
```

L'application est maintenant accessible à l'adresse http://localhost:3000, et l'API à l'adresse http://localhost:5000.

## 4. Déploiement en production

Cette section décrit le déploiement de CarbonOS sur un environnement de production.

### 4.1 Préparation du serveur

#### 4.1.1 Mise à jour du système

```bash
sudo apt update
sudo apt upgrade -y
```

#### 4.1.2 Installation des dépendances

```bash
# Installation de Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Installation de PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Installation de Nginx
sudo apt install -y nginx

# Installation de certbot pour les certificats SSL
sudo apt install -y certbot python3-certbot-nginx

# Installation de Git
sudo apt install -y git
```

#### 4.1.3 Configuration du pare-feu

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### 4.2 Déploiement manuel

#### 4.2.1 Création de l'utilisateur de service

```bash
sudo adduser --system --group carbonos
sudo mkdir -p /var/www/carbonos
sudo chown -R carbonos:carbonos /var/www/carbonos
```

#### 4.2.2 Clonage du dépôt

```bash
cd /var/www/carbonos
sudo -u carbonos git clone https://github.com/carbonos/carbonos.git .
```

#### 4.2.3 Configuration de l'environnement

```bash
sudo -u carbonos cp .env.production.example .env.production
sudo -u carbonos nano .env.production
```

Éditez le fichier `.env.production` avec les paramètres appropriés pour votre environnement.

#### 4.2.4 Installation des dépendances

```bash
# Installation des dépendances du backend
cd /var/www/carbonos/backend
sudo -u carbonos npm install --production

# Installation des dépendances du frontend
cd /var/www/carbonos/frontend
sudo -u carbonos npm install --production
```

#### 4.2.5 Construction du frontend

```bash
cd /var/www/carbonos/frontend
sudo -u carbonos npm run build
```

#### 4.2.6 Configuration de la base de données

```bash
# Création de la base de données PostgreSQL
sudo -u postgres psql -c "CREATE DATABASE carbonos_prod;"
sudo -u postgres psql -c "CREATE USER carbonos_user WITH ENCRYPTED PASSWORD 'votre_mot_de_passe_securise';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE carbonos_prod TO carbonos_user;"

# Exécution des migrations
cd /var/www/carbonos/backend
sudo -u carbonos NODE_ENV=production npm run db:migrate
```

#### 4.2.7 Configuration des services systemd

Créez le fichier de service pour le backend :

```bash
sudo nano /etc/systemd/system/carbonos-backend.service
```

Contenu du fichier :

```
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
```

Créez le fichier de service pour le frontend (si nécessaire) :

```bash
sudo nano /etc/systemd/system/carbonos-frontend.service
```

Contenu du fichier :

```
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
```

Activez et démarrez les services :

```bash
sudo systemctl enable carbonos-backend.service
sudo systemctl start carbonos-backend.service

sudo systemctl enable carbonos-frontend.service
sudo systemctl start carbonos-frontend.service
```

#### 4.2.8 Configuration de Nginx

Créez le fichier de configuration Nginx :

```bash
sudo nano /etc/nginx/sites-available/carbonos.conf
```

Contenu du fichier :

```nginx
server {
    listen 80;
    server_name votre-domaine.fr www.votre-domaine.fr;
    
    # Redirection vers HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.fr www.votre-domaine.fr;
    
    # Configuration SSL (sera configurée par certbot)
    
    # Racine du site
    root /var/www/carbonos/frontend/build;
    index index.html;
    
    # Configuration pour le frontend React
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Configuration pour l'API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activez la configuration et obtenez un certificat SSL :

```bash
sudo ln -s /etc/nginx/sites-available/carbonos.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Obtention du certificat SSL
sudo certbot --nginx -d votre-domaine.fr -d www.votre-domaine.fr
```

### 4.3 Déploiement avec Docker

#### 4.3.1 Installation de Docker et Docker Compose

```bash
# Installation de Docker
curl -fsSL https://get.docker.com | sudo bash

# Installation de Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Ajout de l'utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker
```

#### 4.3.2 Préparation des fichiers

```bash
# Création du répertoire
sudo mkdir -p /opt/carbonos
cd /opt/carbonos

# Clonage du dépôt
git clone https://github.com/carbonos/carbonos.git .

# Configuration de l'environnement
cp .env.production.example .env.production
nano .env.production
```

Éditez le fichier `.env.production` avec les paramètres appropriés pour votre environnement.

#### 4.3.3 Déploiement avec Docker Compose

```bash
# Lancement des conteneurs
docker-compose -f docker-compose.prod.yml up -d
```

#### 4.3.4 Configuration de Nginx (si nécessaire)

Si vous n'utilisez pas le conteneur Nginx inclus dans Docker Compose, vous pouvez configurer Nginx sur l'hôte :

```bash
sudo nano /etc/nginx/sites-available/carbonos.conf
```

Contenu du fichier :

```nginx
server {
    listen 80;
    server_name votre-domaine.fr www.votre-domaine.fr;
    
    # Redirection vers HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.fr www.votre-domaine.fr;
    
    # Configuration SSL (sera configurée par certbot)
    
    # Configuration pour le frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Configuration pour l'API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activez la configuration et obtenez un certificat SSL :

```bash
sudo ln -s /etc/nginx/sites-available/carbonos.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Obtention du certificat SSL
sudo certbot --nginx -d votre-domaine.fr -d www.votre-domaine.fr
```

### 4.4 Vérification du déploiement

Après le déploiement, vérifiez que l'application fonctionne correctement :

1. Accédez à votre domaine dans un navigateur (https://votre-domaine.fr)
2. Vérifiez que la page d'accueil s'affiche correctement
3. Testez la connexion à l'application
4. Vérifiez que l'API répond correctement (https://votre-domaine.fr/api/health)

## 5. Configuration

### 5.1 Variables d'environnement

Les principales variables d'environnement à configurer sont :

#### 5.1.1 Configuration générale

- `NODE_ENV` : Environnement (production, development)
- `PORT` : Port du serveur backend (par défaut : 5000)
- `API_URL` : URL de l'API (ex: https://votre-domaine.fr/api)
- `CLIENT_URL` : URL du frontend (ex: https://votre-domaine.fr)

#### 5.1.2 Base de données

- `DB_HOST` : Hôte de la base de données
- `DB_PORT` : Port de la base de données (par défaut : 5432)
- `DB_NAME` : Nom de la base de données
- `DB_USER` : Utilisateur de la base de données
- `DB_PASSWORD` : Mot de passe de la base de données

#### 5.1.3 Authentification

- `JWT_SECRET` : Clé secrète pour les tokens JWT
- `JWT_EXPIRE` : Durée de validité des tokens JWT (en secondes)
- `REFRESH_TOKEN_EXPIRE` : Durée de validité des refresh tokens (en secondes)

#### 5.1.4 Email

- `SMTP_HOST` : Serveur SMTP
- `SMTP_PORT` : Port SMTP
- `SMTP_USER` : Utilisateur SMTP
- `SMTP_PASS` : Mot de passe SMTP
- `EMAIL_FROM` : Adresse d'expédition des emails

### 5.2 Configuration avancée

#### 5.2.1 Mise à l'échelle

Pour les déploiements nécessitant une haute disponibilité ou une mise à l'échelle :

- Utilisez un équilibreur de charge (Nginx, HAProxy)
- Configurez plusieurs instances du backend
- Utilisez une base de données répliquée
- Mettez en place un cache distribué (Redis)

#### 5.2.2 Optimisation des performances

Pour optimiser les performances :

- Activez la compression gzip dans Nginx
- Configurez le cache du navigateur pour les ressources statiques
- Utilisez un CDN pour les assets statiques
- Optimisez les requêtes à la base de données

## 6. Sécurisation

### 6.1 Sécurisation du serveur

#### 6.1.1 Mise à jour régulière

```bash
sudo apt update
sudo apt upgrade -y
```

#### 6.1.2 Configuration du pare-feu

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

#### 6.1.3 Sécurisation SSH

Éditez le fichier de configuration SSH :

```bash
sudo nano /etc/ssh/sshd_config
```

Modifications recommandées :

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

Redémarrez le service SSH :

```bash
sudo systemctl restart ssh
```

### 6.2 Sécurisation de l'application

#### 6.2.1 En-têtes de sécurité

Assurez-vous que Nginx est configuré avec les en-têtes de sécurité appropriés :

```nginx
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options SAMEORIGIN;
add_header X-XSS-Protection "1; mode=block";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://api.votre-domaine.fr;";
add_header Referrer-Policy strict-origin-when-cross-origin;
add_header Feature-Policy "camera 'none'; microphone 'none'; geolocation 'none'";
```

#### 6.2.2 Rate limiting

Configurez le rate limiting dans Nginx pour prévenir les attaques par force brute :

```nginx
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    server {
        # ...
        
        location /api {
            limit_req zone=api burst=20 nodelay;
            # ...
        }
    }
}
```

#### 6.2.3 Protection contre les injections SQL

Assurez-vous que l'ORM est correctement configuré pour prévenir les injections SQL. Sequelize, utilisé par CarbonOS, offre une protection par défaut lorsqu'il est utilisé correctement.

### 6.3 Sécurisation de la base de données

#### 6.3.1 Accès restreint

Configurez PostgreSQL pour n'accepter que les connexions locales ou depuis des adresses IP spécifiques :

```bash
sudo nano /etc/postgresql/15/main/pg_hba.conf
```

#### 6.3.2 Chiffrement des données sensibles

Assurez-vous que les données sensibles sont chiffrées dans la base de données. CarbonOS utilise des fonctions de chiffrement pour les données sensibles.

## 7. Monitoring

### 7.1 Configuration de Prometheus

#### 7.1.1 Installation de Prometheus

```bash
# Téléchargement de Prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.linux-amd64.tar.gz
tar xvfz prometheus-2.45.0.linux-amd64.tar.gz
cd prometheus-2.45.0.linux-amd64

# Création de l'utilisateur Prometheus
sudo useradd --no-create-home --shell /bin/false prometheus
sudo mkdir -p /etc/prometheus /var/lib/prometheus
sudo cp prometheus promtool /usr/local/bin/
sudo cp -r consoles/ console_libraries/ /etc/prometheus/
sudo chown -R prometheus:prometheus /etc/prometheus /var/lib/prometheus
```

#### 7.1.2 Configuration de Prometheus

Créez le fichier de configuration :

```bash
sudo nano /etc/prometheus/prometheus.yml
```

Contenu du fichier :

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          # - alertmanager:9093

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: "carbonos-backend"
    static_configs:
      - targets: ["localhost:5000"]
    metrics_path: /api/metrics

  - job_name: "node-exporter"
    static_configs:
      - targets: ["localhost:9100"]

  - job_name: "nginx-exporter"
    static_configs:
      - targets: ["localhost:9113"]

  - job_name: "postgres-exporter"
    static_configs:
      - targets: ["localhost:9187"]
```

#### 7.1.3 Création du service Prometheus

```bash
sudo nano /etc/systemd/system/prometheus.service
```

Contenu du fichier :

```
[Unit]
Description=Prometheus
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/local/bin/prometheus \
    --config.file /etc/prometheus/prometheus.yml \
    --storage.tsdb.path /var/lib/prometheus/ \
    --web.console.templates=/etc/prometheus/consoles \
    --web.console.libraries=/etc/prometheus/console_libraries

[Install]
WantedBy=multi-user.target
```

Activez et démarrez le service :

```bash
sudo systemctl enable prometheus
sudo systemctl start prometheus
```

### 7.2 Configuration de Grafana

#### 7.2.1 Installation de Grafana

```bash
sudo apt-get install -y apt-transport-https software-properties-common
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list
sudo apt-get update
sudo apt-get install -y grafana
```

#### 7.2.2 Configuration de Grafana

```bash
sudo systemctl enable grafana-server
sudo systemctl start grafana-server
```

Accédez à Grafana à l'adresse http://votre-serveur:3000 et connectez-vous avec les identifiants par défaut (admin/admin).

Configurez une source de données Prometheus :
1. Allez dans Configuration > Data Sources
2. Cliquez sur "Add data source"
3. Sélectionnez "Prometheus"
4. Configurez l'URL : http://localhost:9090
5. Cliquez sur "Save & Test"

Importez les tableaux de bord prédéfinis pour CarbonOS.

### 7.3 Alertes

Configurez des alertes dans Grafana pour être notifié en cas de problème :
1. Allez dans Alerting > Alert rules
2. Créez des règles d'alerte pour les métriques importantes
3. Configurez les canaux de notification (email, Slack, etc.)

## 8. Sauvegardes

### 8.1 Sauvegarde de la base de données

Créez un script de sauvegarde :

```bash
sudo nano /opt/carbonos/backup-db.sh
```

Contenu du script :

```bash
#!/bin/bash

# Variables
BACKUP_DIR="/var/backups/carbonos/db"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="carbonos_prod"
DB_USER="carbonos_user"
RETENTION_DAYS=30

# Création du répertoire de sauvegarde
mkdir -p $BACKUP_DIR

# Sauvegarde de la base de données
pg_dump -U $DB_USER -d $DB_NAME -F c -f $BACKUP_DIR/carbonos_$TIMESTAMP.dump

# Suppression des anciennes sauvegardes
find $BACKUP_DIR -name "carbonos_*.dump" -type f -mtime +$RETENTION_DAYS -delete
```

Rendez le script exécutable et configurez une tâche cron :

```bash
sudo chmod +x /opt/carbonos/backup-db.sh
sudo crontab -e
```

Ajoutez la ligne suivante pour une sauvegarde quotidienne à 2h du matin :

```
0 2 * * * /opt/carbonos/backup-db.sh
```

### 8.2 Sauvegarde des fichiers

Créez un script de sauvegarde pour les fichiers :

```bash
sudo nano /opt/carbonos/backup-files.sh
```

Contenu du script :

```bash
#!/bin/bash

# Variables
BACKUP_DIR="/var/backups/carbonos/files"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
APP_DIR="/var/www/carbonos"
RETENTION_DAYS=30

# Création du répertoire de sauvegarde
mkdir -p $BACKUP_DIR

# Sauvegarde des fichiers
tar -czf $BACKUP_DIR/carbonos_files_$TIMESTAMP.tar.gz -C $APP_DIR .

# Suppression des anciennes sauvegardes
find $BACKUP_DIR -name "carbonos_files_*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete
```

Rendez le script exécutable et configurez une tâche cron :

```bash
sudo chmod +x /opt/carbonos/backup-files.sh
sudo crontab -e
```

Ajoutez la ligne suivante pour une sauvegarde hebdomadaire le dimanche à 3h du matin :

```
0 3 * * 0 /opt/carbonos/backup-files.sh
```

### 8.3 Sauvegarde complète

Pour une solution de sauvegarde complète, utilisez le script fourni avec CarbonOS :

```bash
sudo cp /var/www/carbonos/backup.sh /opt/carbonos/
sudo chmod +x /opt/carbonos/backup.sh
sudo crontab -e
```

Ajoutez la ligne suivante pour une sauvegarde complète quotidienne à 1h du matin :

```
0 1 * * * /opt/carbonos/backup.sh
```

## 9. Mise à jour

### 9.1 Mise à jour manuelle

Pour mettre à jour CarbonOS manuellement :

```bash
# Arrêt des services
sudo systemctl stop carbonos-frontend
sudo systemctl stop carbonos-backend

# Sauvegarde
sudo cp -r /var/www/carbonos /var/www/carbonos.bak

# Mise à jour du code
cd /var/www/carbonos
sudo -u carbonos git pull

# Installation des dépendances
cd /var/www/carbonos/backend
sudo -u carbonos npm install --production

cd /var/www/carbonos/frontend
sudo -u carbonos npm install --production

# Construction du frontend
sudo -u carbonos npm run build

# Migration de la base de données
cd /var/www/carbonos/backend
sudo -u carbonos NODE_ENV=production npm run db:migrate

# Redémarrage des services
sudo systemctl start carbonos-backend
sudo systemctl start carbonos-frontend
```

### 9.2 Mise à jour avec Docker

Pour mettre à jour CarbonOS avec Docker :

```bash
# Sauvegarde
docker-compose -f docker-compose.prod.yml exec db pg_dump -U carbonos_user -d carbonos_prod -F c -f /tmp/backup.dump
docker cp $(docker-compose -f docker-compose.prod.yml ps -q db):/tmp/backup.dump /var/backups/carbonos/

# Mise à jour du code
cd /opt/carbonos
git pull

# Reconstruction et redémarrage des conteneurs
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

### 9.3 Utilisation du script de déploiement

CarbonOS inclut un script de déploiement automatisé :

```bash
sudo cp /var/www/carbonos/deploy.sh /opt/carbonos/
sudo chmod +x /opt/carbonos/deploy.sh
sudo /opt/carbonos/deploy.sh
```

## 10. Résolution des problèmes

### 10.1 Problèmes courants

#### 10.1.1 L'application ne démarre pas

Vérifiez les journaux :

```bash
sudo journalctl -u carbonos-backend -n 100
sudo journalctl -u carbonos-frontend -n 100
```

Vérifiez les permissions :

```bash
sudo chown -R carbonos:carbonos /var/www/carbonos
```

#### 10.1.2 Erreurs de base de données

Vérifiez la connexion à la base de données :

```bash
sudo -u postgres psql -c "\l" | grep carbonos
```

Vérifiez les journaux PostgreSQL :

```bash
sudo tail -n 100 /var/log/postgresql/postgresql-15-main.log
```

#### 10.1.3 Problèmes de certificat SSL

Vérifiez la configuration SSL :

```bash
sudo certbot certificates
```

Renouvelez le certificat si nécessaire :

```bash
sudo certbot renew
```

### 10.2 Journaux

#### 10.2.1 Journaux de l'application

```bash
# Journaux du backend
sudo journalctl -u carbonos-backend -f

# Journaux du frontend
sudo journalctl -u carbonos-frontend -f

# Journaux Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

#### 10.2.2 Journaux Docker

```bash
# Journaux de tous les conteneurs
docker-compose -f docker-compose.prod.yml logs

# Journaux d'un conteneur spécifique
docker-compose -f docker-compose.prod.yml logs backend
```

### 10.3 Support

Si vous rencontrez des problèmes que vous ne parvenez pas à résoudre, contactez notre support technique :

- Email : support@carbonos.fr
- Téléphone : +33 1 23 45 67 89
- Portail de support : https://support.carbonos.fr

---

Ce guide d'installation et de déploiement est régulièrement mis à jour pour refléter les évolutions de CarbonOS. Pour toute question ou suggestion, n'hésitez pas à contacter notre équipe technique.

**Version : 1.0**  
**Date de dernière mise à jour : 23 mars 2025**
