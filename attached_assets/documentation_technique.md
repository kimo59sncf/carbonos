# Documentation Technique - CarbonOS

## Table des matières

1. [Introduction](#1-introduction)
2. [Architecture du système](#2-architecture-du-système)
3. [Stack technologique](#3-stack-technologique)
4. [Structure du code](#4-structure-du-code)
5. [Base de données](#5-base-de-données)
6. [API RESTful](#6-api-restful)
7. [Sécurité](#7-sécurité)
8. [Conformité RGPD](#8-conformité-rgpd)
9. [Déploiement](#9-déploiement)
10. [Monitoring et maintenance](#10-monitoring-et-maintenance)

## 1. Introduction

CarbonOS est une plateforme SaaS de gestion carbone conçue pour les PME et ETI françaises. Elle permet d'automatiser le calcul, le reporting et la réduction de l'empreinte carbone, tout en respectant les réglementations françaises et européennes, notamment le RGPD.

Cette documentation technique s'adresse aux développeurs, administrateurs système et autres professionnels techniques qui souhaitent comprendre, déployer, maintenir ou étendre la plateforme CarbonOS.

## 2. Architecture du système

CarbonOS suit une architecture moderne en microservices, avec une séparation claire entre le frontend et le backend.

### 2.1 Vue d'ensemble

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Client         │     │  Serveur Web    │     │  Base de        │
│  (Navigateur)   │◄────┤  (Nginx)        │◄────┤  Données        │
│                 │     │                 │     │  (PostgreSQL)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         ▲                      ▲                        ▲
         │                      │                        │
         │                      │                        │
         ▼                      ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Frontend       │     │  Backend        │     │  Services       │
│  (React.js)     │◄────┤  (Node.js)      │◄────┤  Externes       │
│                 │     │                 │     │  (ADEME, etc.)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                ▲
                                │
                                │
                                ▼
                        ┌─────────────────┐
                        │                 │
                        │  Monitoring     │
                        │  (Prometheus)   │
                        │                 │
                        └─────────────────┘
```

### 2.2 Composants principaux

- **Frontend** : Application React.js qui fournit l'interface utilisateur
- **Backend** : API RESTful Node.js qui gère la logique métier
- **Base de données** : PostgreSQL pour le stockage persistant des données
- **Serveur Web** : Nginx comme proxy inverse et pour servir les fichiers statiques
- **Monitoring** : Prometheus et Grafana pour la surveillance du système

## 3. Stack technologique

### 3.1 Frontend

- **Framework** : React.js 18.x
- **State Management** : Redux avec Redux Toolkit
- **UI Components** : Material-UI (MUI) 5.x
- **Routing** : React Router 6.x
- **Formulaires** : Formik avec Yup pour la validation
- **Visualisation** : Chart.js avec react-chartjs-2
- **HTTP Client** : Axios
- **Build Tool** : Webpack 5.x

### 3.2 Backend

- **Runtime** : Node.js 20.x
- **Framework** : Express.js 4.x
- **ORM** : Sequelize 6.x
- **Authentification** : JWT (jsonwebtoken), Passport.js
- **Validation** : express-validator, Joi
- **Sécurité** : helmet, cors, bcryptjs
- **Logging** : morgan, winston

### 3.3 Base de données

- **SGBD** : PostgreSQL 15.x
- **Migrations** : Sequelize CLI
- **Backup** : Scripts personnalisés (voir section 9.4)

### 3.4 Infrastructure

- **Conteneurisation** : Docker, Docker Compose
- **Serveur Web** : Nginx
- **Monitoring** : Prometheus, Grafana
- **CI/CD** : Scripts de déploiement personnalisés

## 4. Structure du code

### 4.1 Structure du frontend

```
frontend/
├── public/                # Fichiers statiques
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Composants React réutilisables
│   │   ├── dashboard/     # Composants spécifiques au tableau de bord
│   │   ├── security/      # Composants liés à la sécurité
│   │   └── ...
│   ├── context/           # Contextes React
│   ├── hooks/             # Hooks personnalisés
│   ├── pages/             # Composants de page
│   ├── services/          # Services pour les appels API
│   ├── utils/             # Fonctions utilitaires
│   ├── App.js             # Composant racine
│   ├── config.js          # Configuration de l'application
│   ├── index.js           # Point d'entrée
│   └── store.js           # Configuration Redux
└── package.json           # Dépendances et scripts
```

### 4.2 Structure du backend

```
backend/
├── src/
│   ├── config/            # Configuration
│   ├── controllers/       # Contrôleurs
│   ├── middleware/        # Middleware Express
│   │   ├── auth.js        # Middleware d'authentification
│   │   ├── rgpd.js        # Middleware RGPD
│   │   └── ...
│   ├── models/            # Modèles Sequelize
│   ├── routes/            # Routes API
│   ├── utils/             # Fonctions utilitaires
│   └── server.js          # Point d'entrée
├── tests/                 # Tests
│   ├── api.test.js        # Tests API
│   ├── integration.test.js # Tests d'intégration
│   └── performance.test.js # Tests de performance
└── package.json           # Dépendances et scripts
```

## 5. Base de données

### 5.1 Schéma de la base de données

Le schéma de la base de données est organisé autour des entités principales suivantes :

- **User** : Utilisateurs de la plateforme
- **Company** : Entreprises clientes
- **EmissionData** : Données d'émissions carbone
- **EmissionDetail** : Détails des émissions par source
- **Report** : Rapports générés
- **AccessLog** : Journaux d'accès pour la conformité RGPD
- **Consent** : Consentements des utilisateurs
- **SharedDocument** : Documents partagés entre utilisateurs

### 5.2 Modèle de données

#### User

```javascript
{
  id: INTEGER PRIMARY KEY,
  firstName: STRING,
  lastName: STRING,
  email: STRING UNIQUE,
  password: STRING,
  role: ENUM('admin', 'user', 'editor', 'dpo'),
  companyId: INTEGER FOREIGN KEY,
  refreshToken: STRING,
  passwordResetToken: STRING,
  passwordResetExpires: DATE,
  lastLogin: DATE,
  isActive: BOOLEAN,
  consentDataProcessing: BOOLEAN,
  createdAt: DATE,
  updatedAt: DATE
}
```

#### Company

```javascript
{
  id: INTEGER PRIMARY KEY,
  name: STRING,
  sector: STRING,
  sectorCode: STRING,
  employeeCount: INTEGER,
  address: STRING,
  postalCode: STRING,
  city: STRING,
  country: STRING,
  siret: STRING UNIQUE,
  dpoName: STRING,
  dpoEmail: STRING,
  dpoPhone: STRING,
  dpoIsExternal: BOOLEAN,
  createdAt: DATE,
  updatedAt: DATE
}
```

#### EmissionData

```javascript
{
  id: INTEGER PRIMARY KEY,
  reportingPeriod: STRING,
  reportingYear: INTEGER,
  companyId: INTEGER FOREIGN KEY,
  submittedBy: INTEGER FOREIGN KEY,
  submittedAt: DATE,
  validatedBy: INTEGER FOREIGN KEY,
  validatedAt: DATE,
  status: ENUM('draft', 'submitted', 'validated', 'rejected'),
  scope1Total: FLOAT,
  scope2Total: FLOAT,
  scope3Total: FLOAT,
  totalEmissions: FLOAT,
  methodologyNotes: TEXT,
  createdAt: DATE,
  updatedAt: DATE
}
```

### 5.3 Relations

- Un **User** appartient à une **Company**
- Une **Company** a plusieurs **User**
- Une **Company** a plusieurs **EmissionData**
- Un **EmissionData** a plusieurs **EmissionDetail**
- Un **User** peut créer plusieurs **Report**
- Un **Report** peut être partagé avec plusieurs **User** via **SharedDocument**

### 5.4 Indexation

Pour optimiser les performances, les index suivants sont créés :

- `User.email` (unique)
- `Company.siret` (unique)
- `EmissionData.companyId` + `EmissionData.reportingYear` (composite)
- `AccessLog.userId` + `AccessLog.createdAt` (composite)

## 6. API RESTful

### 6.1 Authentification

- `POST /api/auth/register` : Inscription d'un nouvel utilisateur
- `POST /api/auth/login` : Connexion d'un utilisateur
- `POST /api/auth/refresh-token` : Rafraîchissement du token JWT
- `POST /api/auth/forgot-password` : Demande de réinitialisation de mot de passe
- `POST /api/auth/reset-password` : Réinitialisation du mot de passe

### 6.2 Utilisateurs

- `GET /api/users/me` : Récupération des informations de l'utilisateur connecté
- `PUT /api/users/me` : Mise à jour des informations de l'utilisateur connecté
- `GET /api/users/company` : Récupération des informations de l'entreprise de l'utilisateur

### 6.3 Émissions

- `GET /api/emissions` : Liste des données d'émissions
- `GET /api/emissions/:id` : Détails d'une donnée d'émission
- `POST /api/emissions` : Création d'une nouvelle donnée d'émission
- `PUT /api/emissions/:id` : Mise à jour d'une donnée d'émission
- `DELETE /api/emissions/:id` : Suppression d'une donnée d'émission
- `POST /api/emissions/:id/validate` : Validation d'une donnée d'émission
- `POST /api/emissions/:id/reject` : Rejet d'une donnée d'émission

### 6.4 Rapports

- `GET /api/reports` : Liste des rapports
- `GET /api/reports/:id` : Détails d'un rapport
- `POST /api/reports` : Création d'un nouveau rapport
- `PUT /api/reports/:id` : Mise à jour d'un rapport
- `DELETE /api/reports/:id` : Suppression d'un rapport
- `POST /api/reports/:id/share` : Partage d'un rapport
- `GET /api/reports/:id/download` : Téléchargement d'un rapport

### 6.5 Tableau de bord

- `GET /api/dashboard` : Données du tableau de bord
- `GET /api/dashboard/emissions-trend` : Tendance des émissions
- `GET /api/dashboard/alerts` : Alertes réglementaires
- `GET /api/dashboard/benchmarks` : Benchmarks sectoriels

### 6.6 RGPD

- `GET /api/rgpd/consents` : Liste des consentements de l'utilisateur
- `POST /api/rgpd/consents` : Mise à jour d'un consentement
- `GET /api/rgpd/export-data` : Export des données personnelles
- `POST /api/rgpd/data-subject-request` : Demande d'exercice des droits RGPD
- `GET /api/rgpd/policies/privacy` : Politique de confidentialité

### 6.7 DPO

- `GET /api/dpo/dpo-info` : Informations pour le DPO
- `GET /api/dpo/pia` : Analyse d'impact sur la protection des données
- `GET /api/dpo/processing-register` : Registre des traitements
- `GET /api/dpo/compliance-status` : Statut de conformité RGPD

## 7. Sécurité

### 7.1 Authentification et autorisation

- **JWT** : Tokens JWT pour l'authentification avec expiration courte (1 heure)
- **Refresh Tokens** : Tokens de rafraîchissement avec expiration plus longue (7 jours)
- **RBAC** : Contrôle d'accès basé sur les rôles (admin, user, editor, dpo)
- **Hachage des mots de passe** : bcrypt avec un facteur de coût élevé

### 7.2 Protection des données

- **Chiffrement en transit** : HTTPS avec TLS 1.3
- **Chiffrement au repos** : Chiffrement AES-256 pour les données sensibles
- **Validation des entrées** : express-validator et Joi pour prévenir les injections
- **Protection XSS** : helmet pour les en-têtes de sécurité
- **Protection CSRF** : Tokens anti-CSRF pour les opérations sensibles

### 7.3 Mesures de sécurité supplémentaires

- **Rate Limiting** : Limitation du nombre de requêtes par IP
- **Journalisation** : Enregistrement des accès et des actions sensibles
- **Audit Trail** : Suivi des modifications des données sensibles
- **Détection d'intrusion** : Monitoring des comportements suspects
- **Mises à jour régulières** : Processus de mise à jour des dépendances

## 8. Conformité RGPD

### 8.1 Principes fondamentaux

- **Licéité, loyauté et transparence** : Base légale claire pour chaque traitement
- **Limitation des finalités** : Finalités spécifiques et explicites
- **Minimisation des données** : Collecte limitée aux données nécessaires
- **Exactitude** : Mécanismes de mise à jour des données
- **Limitation de la conservation** : Durées de conservation définies

### 8.2 Droits des personnes concernées

- **Droit d'accès** : Export des données personnelles
- **Droit de rectification** : Modification des données personnelles
- **Droit à l'effacement** : Suppression des données personnelles
- **Droit à la limitation du traitement** : Restriction du traitement
- **Droit à la portabilité** : Export des données dans un format standard
- **Droit d'opposition** : Possibilité de s'opposer au traitement

### 8.3 Mesures techniques

- **Consentement explicite** : Recueil et gestion des consentements
- **Journalisation des accès** : Enregistrement des accès aux données sensibles
- **Anonymisation** : Anonymisation des données pour les benchmarks
- **Chiffrement** : Protection des données sensibles
- **Suppression automatique** : Mécanisme de suppression après la période de conservation

### 8.4 Documentation RGPD

- **Registre des traitements** : Documentation des activités de traitement
- **Analyse d'impact (PIA)** : Évaluation des risques pour les droits et libertés
- **Politique de confidentialité** : Information claire sur le traitement des données
- **Procédures de notification** : Processus en cas de violation de données

## 9. Déploiement

### 9.1 Prérequis

- Serveur Linux (Ubuntu 22.04 LTS recommandé)
- Docker et Docker Compose
- Nginx
- PostgreSQL 15.x
- Node.js 20.x
- Certificats SSL/TLS (Let's Encrypt recommandé)

### 9.2 Installation

1. Cloner le dépôt
2. Configurer les variables d'environnement dans `.env.production`
3. Exécuter le script de déploiement : `sudo ./deploy.sh`

### 9.3 Configuration des services

- **Nginx** : Copier `nginx.conf` dans `/etc/nginx/sites-available/`
- **Systemd** : Copier les fichiers `.service` dans `/etc/systemd/system/`
- **Docker** : Utiliser `docker-compose.prod.yml` pour le déploiement conteneurisé

### 9.4 Sauvegardes

- Configurer une tâche cron pour exécuter `backup.sh` quotidiennement
- Vérifier régulièrement l'intégrité des sauvegardes
- Conserver les sauvegardes pendant au moins 30 jours

## 10. Monitoring et maintenance

### 10.1 Monitoring

- **Prometheus** : Collecte des métriques système et applicatives
- **Grafana** : Visualisation des métriques et alertes
- **Dashboards** : Tableaux de bord préconfigurés pour surveiller les performances

### 10.2 Journalisation

- **Winston** : Journalisation structurée
- **Rotation des logs** : Configuration logrotate pour la gestion des fichiers de logs
- **Centralisation** : Option pour envoyer les logs vers un système centralisé

### 10.3 Mises à jour

- Processus de mise à jour documenté
- Tests automatisés avant déploiement
- Stratégie de rollback en cas de problème

### 10.4 Maintenance

- Vérifications régulières des performances
- Optimisation de la base de données
- Revue de sécurité périodique
