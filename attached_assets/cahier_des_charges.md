# Cahier des Charges : CarbonOS - Plateforme SaaS de Gestion Carbone pour les PME/ETI Françaises

**Conforme au RGPD (Règlement Général sur la Protection des Données) et aux Réglementations Françaises**

## 1. Contexte et Objectifs
**Contexte** :  
Les PME et ETI françaises doivent se conformer aux nouvelles réglementations carbone (CSRD, Taxonomie UE, Loi Climat et Résilience). CarbonOS est une solution SaaS clé en main pour **automatiser le calcul, le reporting et la réduction de l'empreinte carbone**, tout en respectant le RGPD.  

**Objectifs** :  
- Simplifier la conformité réglementaire pour les entreprises.  
- Fournir un outil **hébergé en France/EU**, sécurisé et respectueux des données.  
- Intégrer des fonctionnalités adaptées aux besoins locaux (normes ADEME, BEGES, etc.).  

## 2. Fonctionnalités Principales
### 2.1. Tableau de Bord Centralisé RGPD-Compliant
- Visualisation des émissions (Scope 1, 2, 3) avec données anonymisées pour les benchmarks.  
- Alertes automatisées sur les dérives carbone et les échéances réglementaires.  

### 2.2. Calcul Automatisé des Émissions
- Intégration RGPD-Safe avec les outils comptables (Sage, Cegid) via API chiffrées.  
- Utilisation des **bases de données françaises** (Base Carbone® ADEME, INSEE) pour les coefficients d'émission.  

### 2.3. Reporting Réglementaire
- Génération de rapports CSRD, DSN, et Bilan Carbone® pré-formatés.  
- Export des données en formats standardisés (XBRL, PDF) avec traçabilité des modifications.  

### 2.4. Module Collaboratif Sécurisé
- Partage des données avec les fournisseurs via une interface chiffrée (SSL/TLS).  
- Gestion des droits d'accès (RBAC) pour respecter le principe de minimisation des données (RGPD Art. 5).  

### 2.5. Analytics et Benchmarking
- Comparaison anonymisée avec des entreprises du même secteur (CNAE/NAF).  
- Dashboard conforme au RGPD : pas de données personnelles identifiables.  

## 3. Exigences Techniques
### 3.1. Architecture RGPD
- **Hébergement** : Serveurs en France ou UE (OVH, Scaleway, AWS Paris).  
- **Chiffrement** :  
  - Données en transit (HTTPS, TLS 1.3).  
  - Données au repos (AES-256).  
- **Sauvegarde** : Journalisation des accès et sauvegardes quotidiennes (RGPD Art. 32).  

### 3.2. Stack Technologique
- **Frontend** : React.js avec composants sécurisés (OWASP Top 10).  
- **Backend** : Node.js/Python (Django) + PostgreSQL (chiffrement natif).  
- **API** : RESTful avec authentification OAuth2 et tokens JWT.  

### 3.3. Conformité RGPD
- **Consentement explicite** : Recueil du consentement pour le traitement des données (Formulaire opt-in).  
- **DPO (Délégué à la Protection des Données)** : Désignation obligatoire.  
- **PIA (Privacy Impact Assessment)** : Réalisé pour identifier les risques liés au traitement des données carbone.  

## 4. Gestion des Données
### 4.1. Collecte et Traitement
- **Données collectées** :  
  - Données financières (chiffrées).  
  - Données d'activité (kWh, tonnes de CO2, etc.).  
  - Aucune donnée personnelle sensible stockée sans consentement.  
- **Base légale** : Exécution d'un contrat (RGPD Art. 6.1.b).  

### 4.2. Droits des Utilisateurs
- **Accès et rectification** : Interface utilisateur pour modifier/supprimer les données (RGPD Art. 15-17).  
- **Portabilité** : Export des données en CSV/JSON via l'interface.  

### 4.3. Conservation des Données
- Durée maximale : 5 ans (conformément aux obligations légales françaises).  
- Suppression automatique après désabonnement.  

## 5. Déploiement et Maintenance
### 5.1. Hébergement
- **Infrastructure** : Kubernetes avec clusters en région UE.  
- **Sécurité** : Certifications ISO 27001 et HDS (Hébergement de Données de Santé si applicable).  

### 5.2. Monitoring
- Détection des intrusions (SIEM).  
- Audit RGPD annuel par un tiers indépendant.  

## 6. Modèle Économique
### 6.1. Abonnements
- **Freemium** :  
  - Gratuit pour les TPE (≤ 10 salariés) avec fonctionnalités limitées.  
  - Collecte de données uniquement avec consentement explicite.  
- **Premium** :  
  - À partir de 99€/mois (PME) et 499€/mois (ETI).  
  - Support dédié et formations RGPD incluses.  

### 6.2. Services Additionnels
- Audit carbone certifié (partenariats avec des cabinets français).  
- Accompagnement à la certification ISO 14064.  

## 7. Risques et Atténuation
- **Risque RGPD** : Amendes pour non-conformité.  
  - Atténuation : Audit trimestriel et formation continue de l'équipe.  
- **Risque technique** : Fuite de données.  
  - Atténuation : Chiffrement E2E et tests d'intrusion biannuels.  

## 8. Équipe et Budget
- **Équipe** :  
  - 1 Chef de Projet RGPD.  
  - 3 Développeurs Full-Stack.  
  - 1 Expert Carbone (ADEME certifié).  
  - 1 DPO externe.  
- **Budget** :  
  - Développement : 150 000 €.  
  - Conformité RGPD : 30 000 € (audits, DPO).  

## 9. Calendrier
- **Phase 1 (3 mois)** : Développement MVP + PIA.  
- **Phase 2 (2 mois)** : Tests RGPD et certification CNIL.  
- **Phase 3 (1 mois)** : Lancement commercial.  

## 10. Conclusion
**CarbonOS** répond aux besoins critiques des PME/ETI françaises en matière de conformité carbone, tout en garantissant une protection maximale des données selon le RGPD. La plateforme combine expertise technique, respect des normes locales, et scalabilité pour un marché en pleine croissance.  

**Annexes** :  
- Documentation RGPD complète.  
- Schéma d'architecture technique.  
- Plan de continuité d'activité (PCA).  

✅ **Prêt pour une France bas-carbone et conforme au RGPD !**
