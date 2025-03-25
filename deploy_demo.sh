#!/bin/bash

# Script de déploiement de la version démo de CarbonOS
# Ce script prépare et déploie l'application sur un serveur accessible publiquement

# Variables de configuration
APP_NAME="carbonos-demo"
FRONTEND_PORT=3000
BACKEND_PORT=5000
DB_PORT=5432
DOMAIN="carbonos-demo.example.com"  # À remplacer par votre domaine réel

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_message() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[ATTENTION]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERREUR]${NC} $1"
}

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
  print_error "Docker n'est pas installé. Installation en cours..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo usermod -aG docker $USER
  print_message "Docker a été installé. Veuillez vous déconnecter et vous reconnecter pour appliquer les changements."
  exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
  print_error "Docker Compose n'est pas installé. Installation en cours..."
  sudo curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  print_message "Docker Compose a été installé."
fi

# Créer le répertoire de déploiement
DEPLOY_DIR="/opt/carbonos-demo"
sudo mkdir -p $DEPLOY_DIR
sudo chown $USER:$USER $DEPLOY_DIR

# Copier les fichiers nécessaires
print_message "Copie des fichiers de l'application..."
cp -r frontend backend docker-compose.yml Dockerfile .env.production $DEPLOY_DIR/

# Créer le fichier docker-compose.yml pour la démo
cat > $DEPLOY_DIR/docker-compose.demo.yml << EOL
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "${FRONTEND_PORT}:80"
    environment:
      - REACT_APP_API_URL=http://\${DOMAIN}:${BACKEND_PORT}/api
      - NODE_ENV=production
    depends_on:
      - backend
    restart: always
    networks:
      - carbonos-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "${BACKEND_PORT}:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - JWT_SECRET=carbonos_demo_secret_key
      - MONGO_URI=mongodb://mongo:27017/carbonos
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=carbonos
      - DB_USER=postgres
      - DB_PASSWORD=postgres
    depends_on:
      - postgres
      - mongo
    restart: always
    networks:
      - carbonos-network

  postgres:
    image: postgres:14
    ports:
      - "${DB_PORT}:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=carbonos
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: always
    networks:
      - carbonos-network

  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    restart: always
    networks:
      - carbonos-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - frontend
      - backend
    restart: always
    networks:
      - carbonos-network

  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait \$\${!}; done;'"

volumes:
  postgres-data:
  mongo-data:

networks:
  carbonos-network:
    driver: bridge
EOL

# Créer le fichier nginx.conf
cat > $DEPLOY_DIR/nginx.conf << EOL
server {
    listen 80;
    server_name ${DOMAIN};
    server_tokens off;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name ${DOMAIN};
    server_tokens off;

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOL

# Créer les répertoires pour Certbot
mkdir -p $DEPLOY_DIR/certbot/conf
mkdir -p $DEPLOY_DIR/certbot/www

# Créer un script d'initialisation pour obtenir le certificat SSL
cat > $DEPLOY_DIR/init-letsencrypt.sh << EOL
#!/bin/bash

domains=(${DOMAIN})
rsa_key_size=4096
data_path="./certbot"
email="contact@carbonos.fr" # Remplacer par votre email

if [ -d "\$data_path/conf/live/\$domains" ]; then
  read -p "Les certificats existants pour \$domains seront remplacés. Continuer? (y/N) " decision
  if [ "\$decision" != "Y" ] && [ "\$decision" != "y" ]; then
    exit
  fi
fi

echo "### Création de certificats factices ..."
mkdir -p "\$data_path/conf/live/\$domains"
docker-compose -f docker-compose.demo.yml run --rm --entrypoint "\\
  openssl req -x509 -nodes -newkey rsa:1024 -days 1\\
    -keyout '/etc/letsencrypt/live/\$domains/privkey.pem' \\
    -out '/etc/letsencrypt/live/\$domains/fullchain.pem' \\
    -subj '/CN=localhost'" certbot

echo "### Démarrage de nginx ..."
docker-compose -f docker-compose.demo.yml up --force-recreate -d nginx

echo "### Suppression des certificats factices ..."
docker-compose -f docker-compose.demo.yml run --rm --entrypoint "\\
  rm -Rf /etc/letsencrypt/live/\$domains && \\
  rm -Rf /etc/letsencrypt/archive/\$domains && \\
  rm -Rf /etc/letsencrypt/renewal/\$domains.conf" certbot

echo "### Demande de certificats réels ..."
docker-compose -f docker-compose.demo.yml run --rm --entrypoint "\\
  certbot certonly --webroot -w /var/www/certbot \\
    --email \$email \\
    -d \$domains \\
    --rsa-key-size \$rsa_key_size \\
    --agree-tos \\
    --force-renewal" certbot

echo "### Redémarrage de nginx ..."
docker-compose -f docker-compose.demo.yml exec nginx nginx -s reload
EOL

chmod +x $DEPLOY_DIR/init-letsencrypt.sh

# Créer un Dockerfile pour le frontend
cat > $DEPLOY_DIR/frontend/Dockerfile << EOL
FROM node:16 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOL

# Créer un fichier nginx.conf pour le frontend
cat > $DEPLOY_DIR/frontend/nginx.conf << EOL
server {
    listen 80;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
    
    error_page 500 502 503 504 /50x.html;
    
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOL

# Créer un Dockerfile pour le backend
cat > $DEPLOY_DIR/backend/Dockerfile << EOL
FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
EOL

# Créer un script de démarrage
cat > $DEPLOY_DIR/start.sh << EOL
#!/bin/bash

# Démarrer l'application
docker-compose -f docker-compose.demo.yml up -d

echo "CarbonOS Demo est maintenant accessible à l'adresse: http://${DOMAIN}"
echo "Pour obtenir un certificat SSL, exécutez: ./init-letsencrypt.sh"
EOL

chmod +x $DEPLOY_DIR/start.sh

# Créer un script d'arrêt
cat > $DEPLOY_DIR/stop.sh << EOL
#!/bin/bash

# Arrêter l'application
docker-compose -f docker-compose.demo.yml down
EOL

chmod +x $DEPLOY_DIR/stop.sh

# Créer un fichier README.md
cat > $DEPLOY_DIR/README.md << EOL
# CarbonOS Demo

Cette version de démonstration de CarbonOS permet aux utilisateurs de tester gratuitement la plateforme pendant 30 jours avec des fonctionnalités limitées.

## Fonctionnalités disponibles dans la version démo

- Tableau de bord centralisé pour visualiser les émissions (Scope 1, 2, 3)
- Calcul automatisé des émissions (limité à 5 sources)
- Génération de rapports réglementaires (limité à 2 rapports)
- Système d'abonnement avec trois formules tarifaires

## Déploiement

1. Assurez-vous que Docker et Docker Compose sont installés sur votre serveur
2. Exécutez \`./start.sh\` pour démarrer l'application
3. Pour configurer HTTPS, exécutez \`./init-letsencrypt.sh\`

## Contact

Pour toute question ou pour passer à la version complète, contactez:
Mk-dev au 0763349311

## Formules d'abonnement

- **Starter** (99€/mois) : Idéal pour les TPE et petites PME
- **Business** (299€/mois) : Pour les PME en croissance
- **Enterprise** (499€/mois) : Solution complète pour les ETI
EOL

print_message "Configuration du déploiement terminée !"
print_message "Pour déployer l'application, exécutez les commandes suivantes :"
print_message "cd $DEPLOY_DIR"
print_message "./start.sh"

# Exposer le port pour la démo
print_message "Préparation du déploiement sur le serveur de démonstration..."
