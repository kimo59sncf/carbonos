# Guide d'installation et d'utilisation de CarbonOS

Ce document fournit les instructions détaillées pour installer, configurer et utiliser CarbonOS, la plateforme SaaS de gestion carbone pour les PME/ETI françaises.

## Table des matières

1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Utilisation](#utilisation)
5. [Système d'abonnement](#système-dabonnement)
6. [Support](#support)

## Prérequis

Pour installer et exécuter CarbonOS, vous aurez besoin de :

- Un serveur Linux (Ubuntu 20.04 ou plus récent recommandé)
- Docker et Docker Compose
- Node.js 16 ou plus récent
- npm 7 ou plus récent
- Au moins 2 Go de RAM et 10 Go d'espace disque

## Installation

### Option 1 : Installation automatisée

1. Décompressez l'archive CarbonOS dans le répertoire de votre choix
2. Rendez le script d'installation exécutable :
   ```bash
   chmod +x deploy_demo.sh
   ```
3. Exécutez le script d'installation :
   ```bash
   ./deploy_demo.sh
   ```
4. Suivez les instructions à l'écran

### Option 2 : Installation manuelle

1. Décompressez l'archive CarbonOS dans le répertoire de votre choix
2. Installez les dépendances du frontend :
   ```bash
   cd frontend
   npm install
   ```
3. Installez les dépendances du backend :
   ```bash
   cd backend
   npm install
   ```
4. Configurez la base de données :
   ```bash
   docker-compose up -d postgres mongo
   ```
5. Démarrez le backend :
   ```bash
   cd backend
   npm start
   ```
6. Démarrez le frontend :
   ```bash
   cd frontend
   npm start
   ```

## Configuration

### Configuration de l'environnement

Modifiez le fichier `.env.production` pour configurer les variables d'environnement :

```
# Configuration générale
NODE_ENV=production
PORT=5000

# Configuration de la base de données
DB_HOST=postgres
DB_PORT=5432
DB_NAME=carbonos
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_securise

# Configuration JWT
JWT_SECRET=votre_cle_secrete_jwt
JWT_EXPIRE=24h

# Configuration CORS
CORS_ORIGIN=https://votre-domaine.com
```

### Configuration HTTPS

Pour configurer HTTPS avec Let's Encrypt :

1. Assurez-vous que votre domaine pointe vers votre serveur
2. Exécutez le script d'initialisation Let's Encrypt :
   ```bash
   ./init-letsencrypt.sh
   ```

## Utilisation

### Accès à l'application

Une fois l'installation terminée, vous pouvez accéder à CarbonOS via :

- **Version locale** : http://localhost:3000
- **Version déployée** : https://votre-domaine.com

### Création d'un compte administrateur

Pour créer un compte administrateur :

1. Accédez à l'application
2. Cliquez sur "S'inscrire"
3. Remplissez le formulaire avec vos informations
4. Pour définir le compte comme administrateur, exécutez :
   ```bash
   cd backend
   npm run make-admin -- --email=votre@email.com
   ```

### Tableau de bord

Le tableau de bord vous donne une vue d'ensemble de :

- Vos émissions carbone (Scope 1, 2, 3)
- Les alertes sur les dérives carbone
- Les échéances réglementaires
- Votre performance par rapport au benchmark du secteur

### Calcul des émissions

Pour calculer vos émissions :

1. Accédez à la section "Calculateur d'émissions"
2. Sélectionnez la source d'émission
3. Entrez les données requises
4. Cliquez sur "Calculer"

### Génération de rapports

Pour générer un rapport réglementaire :

1. Accédez à la section "Rapports"
2. Sélectionnez le type de rapport (CSRD, BEGES, etc.)
3. Définissez la période
4. Cliquez sur "Générer"

## Système d'abonnement

CarbonOS propose trois formules d'abonnement :

### Starter (99€/mois)
- Jusqu'à 20 sources d'émission
- Jusqu'à 5 rapports par mois
- Tableau de bord basique
- Support par email

### Business (299€/mois)
- Jusqu'à 100 sources d'émission
- Rapports illimités
- Tableau de bord avancé
- Module collaboratif
- Intégration comptable basique
- Support prioritaire

### Enterprise (499€/mois)
- Sources d'émission illimitées
- Rapports illimités
- Tableau de bord premium
- Module collaboratif avancé
- Intégration comptable complète
- Benchmarking avancé
- API personnalisée
- Support dédié 24/7
- Formation incluse

### Essai gratuit

Un essai gratuit de 30 jours est disponible avec les limitations suivantes :
- Maximum de 5 sources d'émission
- Maximum de 2 rapports générés
- Pas d'accès au module collaboratif
- Pas d'accès aux fonctionnalités de benchmarking

## Support

Pour toute question ou assistance, contactez :

**Mk-dev**  
Téléphone : 0763349311  
Email : contact@carbonos.fr

---

© 2025 CarbonOS. Tous droits réservés.
