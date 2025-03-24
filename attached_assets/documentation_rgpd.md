# Documentation RGPD - CarbonOS

## Table des matières

1. [Introduction](#1-introduction)
2. [Principes fondamentaux du RGPD](#2-principes-fondamentaux-du-rgpd)
3. [Données traitées par CarbonOS](#3-données-traitées-par-carbonos)
4. [Base légale des traitements](#4-base-légale-des-traitements)
5. [Droits des personnes concernées](#5-droits-des-personnes-concernées)
6. [Mesures techniques et organisationnelles](#6-mesures-techniques-et-organisationnelles)
7. [Registre des activités de traitement](#7-registre-des-activités-de-traitement)
8. [Analyse d'impact relative à la protection des données (PIA)](#8-analyse-dimpact-relative-à-la-protection-des-données-pia)
9. [Procédure en cas de violation de données](#9-procédure-en-cas-de-violation-de-données)
10. [Transferts de données hors UE](#10-transferts-de-données-hors-ue)

## 1. Introduction

Cette documentation RGPD présente les mesures mises en place par CarbonOS pour assurer la conformité avec le Règlement Général sur la Protection des Données (RGPD) de l'Union Européenne. Elle s'adresse aux Délégués à la Protection des Données (DPO), aux responsables de la conformité et à toute personne souhaitant comprendre comment CarbonOS protège les données personnelles.

### 1.1 Engagement de conformité

CarbonOS s'engage à respecter pleinement les principes et exigences du RGPD. Notre approche de la protection des données est basée sur les principes de "Privacy by Design" et "Privacy by Default", intégrant la protection des données dès la conception et par défaut dans tous nos processus.

### 1.2 Rôle des parties

Dans le cadre de l'utilisation de CarbonOS :

- **Votre entreprise** est le "responsable de traitement" au sens du RGPD
- **CarbonOS** agit en tant que "sous-traitant" au sens du RGPD
- **Vos utilisateurs, employés et fournisseurs** sont les "personnes concernées" au sens du RGPD

## 2. Principes fondamentaux du RGPD

CarbonOS respecte les principes fondamentaux du RGPD dans toutes ses opérations :

### 2.1 Licéité, loyauté et transparence

- Tous les traitements de données sont effectués sur une base légale claire
- Les personnes concernées sont informées de manière transparente sur l'utilisation de leurs données
- Une politique de confidentialité claire et accessible est disponible

### 2.2 Limitation des finalités

- Les données sont collectées pour des finalités déterminées, explicites et légitimes
- Aucun traitement ultérieur incompatible avec ces finalités n'est effectué

### 2.3 Minimisation des données

- Seules les données strictement nécessaires aux finalités spécifiées sont collectées
- Les champs obligatoires sont limités au minimum requis

### 2.4 Exactitude

- Des mécanismes de mise à jour et de correction des données sont disponibles
- Les utilisateurs peuvent facilement mettre à jour leurs informations

### 2.5 Limitation de la conservation

- Les données sont conservées pour une durée limitée et proportionnée
- Des mécanismes automatiques de suppression sont implémentés

### 2.6 Intégrité et confidentialité

- Des mesures techniques et organisationnelles appropriées garantissent la sécurité des données
- Le chiffrement et les contrôles d'accès protègent les données sensibles

### 2.7 Responsabilité

- CarbonOS peut démontrer sa conformité au RGPD à tout moment
- Des audits réguliers et une documentation complète sont maintenus

## 3. Données traitées par CarbonOS

### 3.1 Catégories de données personnelles

CarbonOS traite les catégories de données personnelles suivantes :

#### 3.1.1 Données d'identification

- Nom et prénom
- Adresse email professionnelle
- Fonction/poste
- Numéro de téléphone professionnel (optionnel)

#### 3.1.2 Données de connexion

- Identifiants de connexion
- Adresse IP
- Données de journalisation
- Informations sur l'appareil et le navigateur

#### 3.1.3 Données professionnelles

- Informations sur l'entreprise
- Département/service
- Rôle dans le processus de gestion carbone

#### 3.1.4 Données d'utilisation

- Préférences utilisateur
- Historique des actions
- Paramètres personnalisés

### 3.2 Données sensibles

CarbonOS ne collecte ni ne traite aucune donnée sensible au sens de l'article 9 du RGPD (origine raciale ou ethnique, opinions politiques, convictions religieuses, données génétiques, etc.).

### 3.3 Données relatives aux émissions carbone

Les données relatives aux émissions carbone (consommation d'énergie, déplacements, etc.) ne sont généralement pas considérées comme des données personnelles lorsqu'elles sont agrégées au niveau de l'entreprise. Toutefois, certaines données peuvent être indirectement liées à des personnes identifiables (ex: déplacements professionnels individuels). Dans ce cas, elles sont traitées avec les mêmes garanties que les autres données personnelles.

## 4. Base légale des traitements

Chaque traitement de données effectué par CarbonOS repose sur une base légale conforme à l'article 6 du RGPD :

### 4.1 Exécution du contrat (Art. 6.1.b)

La base légale principale pour le traitement des données est l'exécution du contrat entre votre entreprise et CarbonOS. Ce traitement est nécessaire pour :

- Fournir les services de la plateforme
- Gérer les comptes utilisateurs
- Calculer l'empreinte carbone
- Générer les rapports réglementaires

### 4.2 Obligation légale (Art. 6.1.c)

Certains traitements sont nécessaires au respect d'obligations légales, notamment :

- Conservation des données de facturation
- Réponse aux demandes des autorités compétentes
- Conformité aux réglementations environnementales

### 4.3 Intérêt légitime (Art. 6.1.f)

D'autres traitements sont basés sur l'intérêt légitime de CarbonOS ou de votre entreprise, comme :

- Amélioration des services
- Sécurité de la plateforme
- Prévention de la fraude
- Benchmarking anonymisé

### 4.4 Consentement (Art. 6.1.a)

Le consentement est utilisé comme base légale pour :

- L'envoi de communications marketing (newsletter, webinaires)
- L'utilisation de cookies non essentiels
- La collecte de données facultatives

Le consentement est recueilli de manière explicite, par une action positive claire, et peut être retiré à tout moment.

## 5. Droits des personnes concernées

CarbonOS facilite l'exercice des droits des personnes concernées conformément aux articles 15 à 22 du RGPD :

### 5.1 Droit d'accès (Art. 15)

Les utilisateurs peuvent accéder à l'ensemble des données personnelles les concernant via :

- La section "Mon profil" de l'application
- La fonctionnalité "Exporter mes données" dans les paramètres de confidentialité
- Une demande formelle via le formulaire de contact DPO

### 5.2 Droit de rectification (Art. 16)

Les utilisateurs peuvent corriger leurs données inexactes via :

- La section "Mon profil" de l'application
- Une demande formelle via le formulaire de contact DPO

### 5.3 Droit à l'effacement (Art. 17)

Les utilisateurs peuvent demander la suppression de leurs données via :

- La fonctionnalité "Supprimer mon compte" dans les paramètres
- Une demande formelle via le formulaire de contact DPO

*Note : Certaines données peuvent être conservées pour respecter des obligations légales ou pour l'exercice de droits en justice.*

### 5.4 Droit à la limitation du traitement (Art. 18)

Les utilisateurs peuvent demander la limitation du traitement de leurs données via :

- Les paramètres de confidentialité de l'application
- Une demande formelle via le formulaire de contact DPO

### 5.5 Droit à la portabilité (Art. 20)

Les utilisateurs peuvent exporter leurs données dans un format structuré via :

- La fonctionnalité "Exporter mes données" (formats JSON ou CSV)
- Une demande formelle via le formulaire de contact DPO

### 5.6 Droit d'opposition (Art. 21)

Les utilisateurs peuvent s'opposer au traitement de leurs données basé sur l'intérêt légitime via :

- Les paramètres de confidentialité de l'application
- Une demande formelle via le formulaire de contact DPO

### 5.7 Procédure de traitement des demandes

Toutes les demandes d'exercice des droits sont traitées selon la procédure suivante :

1. Réception de la demande
2. Vérification de l'identité du demandeur
3. Traitement de la demande dans un délai d'un mois (prolongeable de deux mois en cas de demande complexe)
4. Réponse au demandeur
5. Journalisation de la demande et de son traitement

## 6. Mesures techniques et organisationnelles

CarbonOS a mis en place des mesures techniques et organisationnelles appropriées pour garantir la sécurité des données :

### 6.1 Sécurité des données

#### 6.1.1 Chiffrement

- Chiffrement des données en transit (HTTPS, TLS 1.3)
- Chiffrement des données au repos (AES-256)
- Hachage des mots de passe (bcrypt avec facteur de coût élevé)

#### 6.1.2 Contrôle d'accès

- Authentification forte (mot de passe complexe, option 2FA)
- Gestion des droits basée sur les rôles (RBAC)
- Principe du moindre privilège
- Révocation automatique des accès

#### 6.1.3 Protection de l'infrastructure

- Hébergement sécurisé en France/UE
- Pare-feu et détection d'intrusion
- Mises à jour de sécurité régulières
- Tests de pénétration biannuels

### 6.2 Mesures organisationnelles

#### 6.2.1 Formation et sensibilisation

- Formation RGPD obligatoire pour tous les employés
- Sensibilisation régulière aux bonnes pratiques
- Procédures documentées

#### 6.2.2 Gestion des accès

- Procédure d'attribution et de révocation des droits
- Revue périodique des accès
- Journalisation des accès aux données sensibles

#### 6.2.3 Sous-traitance

- Sélection rigoureuse des sous-traitants
- Clauses contractuelles conformes à l'article 28 du RGPD
- Audit régulier des sous-traitants

### 6.3 Mesures spécifiques pour les données sensibles

Bien que CarbonOS ne traite pas de données sensibles au sens de l'article 9 du RGPD, des mesures spécifiques sont appliquées pour les données considérées comme confidentielles :

- Chiffrement renforcé
- Accès restreint et journalisé
- Anonymisation lorsque possible

## 7. Registre des activités de traitement

Conformément à l'article 30 du RGPD, CarbonOS maintient un registre des activités de traitement. Ce registre est accessible aux clients via le module DPO de l'application.

### 7.1 Activités de traitement principales

#### 7.1.1 Gestion des comptes utilisateurs

- **Finalité** : Permettre l'accès et l'utilisation de la plateforme
- **Catégories de données** : Données d'identification, données de connexion
- **Base légale** : Exécution du contrat
- **Durée de conservation** : Durée du contrat + 1 an
- **Destinataires** : Personnel autorisé de CarbonOS
- **Mesures de sécurité** : Authentification, chiffrement, contrôle d'accès

#### 7.1.2 Calcul de l'empreinte carbone

- **Finalité** : Mesurer et suivre les émissions de gaz à effet de serre
- **Catégories de données** : Données d'activité, données financières
- **Base légale** : Exécution du contrat
- **Durée de conservation** : 5 ans (obligation légale)
- **Destinataires** : Personnel autorisé de l'entreprise cliente
- **Mesures de sécurité** : Chiffrement, contrôle d'accès, journalisation

#### 7.1.3 Génération de rapports réglementaires

- **Finalité** : Produire des rapports conformes aux exigences légales
- **Catégories de données** : Données d'émissions, données d'entreprise
- **Base légale** : Obligation légale, exécution du contrat
- **Durée de conservation** : 5 ans (obligation légale)
- **Destinataires** : Personnel autorisé, autorités réglementaires
- **Mesures de sécurité** : Chiffrement, contrôle d'accès, journalisation

#### 7.1.4 Benchmarking sectoriel

- **Finalité** : Comparer les performances avec d'autres entreprises du secteur
- **Catégories de données** : Données d'émissions anonymisées
- **Base légale** : Intérêt légitime
- **Durée de conservation** : 3 ans
- **Destinataires** : Personnel autorisé (données agrégées uniquement)
- **Mesures de sécurité** : Anonymisation, agrégation, contrôle d'accès

## 8. Analyse d'impact relative à la protection des données (PIA)

Conformément à l'article 35 du RGPD, CarbonOS a réalisé une analyse d'impact relative à la protection des données (PIA) pour les traitements susceptibles d'engendrer un risque élevé pour les droits et libertés des personnes.

### 8.1 Méthodologie

La PIA a été réalisée selon la méthodologie de la CNIL, en suivant ces étapes :

1. Description du contexte et des traitements
2. Analyse de la nécessité et de la proportionnalité
3. Identification et évaluation des risques
4. Identification des mesures pour traiter les risques

### 8.2 Principaux risques identifiés

#### 8.2.1 Accès non autorisé aux données

- **Description** : Accès illégitime aux données d'émissions ou aux informations personnelles
- **Impact potentiel** : Divulgation d'informations confidentielles, atteinte à la réputation
- **Probabilité** : Faible
- **Gravité** : Moyenne
- **Mesures d'atténuation** : Authentification forte, chiffrement, contrôle d'accès, journalisation

#### 8.2.2 Perte d'intégrité des données

- **Description** : Modification non autorisée des données d'émissions
- **Impact potentiel** : Rapports erronés, non-conformité réglementaire
- **Probabilité** : Très faible
- **Gravité** : Élevée
- **Mesures d'atténuation** : Validation à deux niveaux, journalisation des modifications, audit trail

#### 8.2.3 Indisponibilité des données

- **Description** : Impossibilité d'accéder aux données d'émissions
- **Impact potentiel** : Retard dans les rapports réglementaires
- **Probabilité** : Très faible
- **Gravité** : Moyenne
- **Mesures d'atténuation** : Sauvegardes régulières, infrastructure redondante, plan de continuité

### 8.3 Conclusion de la PIA

L'analyse d'impact montre que les risques pour les droits et libertés des personnes concernées sont correctement maîtrisés grâce aux mesures techniques et organisationnelles mises en place. Le traitement peut être mis en œuvre en l'état.

## 9. Procédure en cas de violation de données

Conformément aux articles 33 et 34 du RGPD, CarbonOS a mis en place une procédure de gestion des violations de données personnelles.

### 9.1 Détection et signalement interne

1. Détection d'une violation potentielle
2. Signalement immédiat au DPO et à l'équipe de sécurité
3. Ouverture d'un incident de sécurité
4. Documentation initiale de l'incident

### 9.2 Qualification et évaluation

1. Confirmation de la violation
2. Détermination de la nature et de l'étendue de la violation
3. Évaluation des risques pour les personnes concernées
4. Documentation détaillée

### 9.3 Notification à l'autorité de contrôle

En cas de risque pour les droits et libertés des personnes :

1. Notification à la CNIL dans les 72 heures
2. Contenu de la notification :
   - Nature de la violation
   - Catégories et nombre approximatif de personnes concernées
   - Catégories et nombre approximatif de données concernées
   - Conséquences probables
   - Mesures prises ou envisagées
   - Coordonnées du DPO

### 9.4 Communication aux personnes concernées

En cas de risque élevé pour les droits et libertés des personnes :

1. Communication claire aux personnes concernées
2. Contenu de la communication :
   - Nature de la violation
   - Conséquences probables
   - Mesures prises ou envisagées
   - Recommandations pour se protéger
   - Coordonnées du DPO

### 9.5 Actions correctives

1. Mise en œuvre des mesures d'urgence pour limiter l'impact
2. Correction des vulnérabilités
3. Renforcement des mesures de sécurité
4. Suivi et évaluation des actions

### 9.6 Retour d'expérience

1. Analyse des causes profondes
2. Mise à jour des procédures si nécessaire
3. Formation complémentaire si nécessaire
4. Documentation complète de l'incident et des actions

## 10. Transferts de données hors UE

### 10.1 Politique de transfert

CarbonOS privilégie l'hébergement et le traitement des données au sein de l'Union Européenne. Par défaut, aucun transfert de données hors UE n'est effectué.

### 10.2 Garanties en cas de transfert

Dans les rares cas où un transfert hors UE serait nécessaire (par exemple, pour certains services de support technique), CarbonOS s'assure que des garanties appropriées sont mises en place :

- Décision d'adéquation de la Commission européenne
- Clauses contractuelles types (CCT)
- Règles d'entreprise contraignantes (BCR)
- Consentement explicite des personnes concernées

### 10.3 Sous-traitants et transferts

La liste des sous-traitants susceptibles de traiter des données, y compris ceux situés hors UE, est disponible dans le module DPO de l'application. Cette liste précise :

- L'identité et les coordonnées du sous-traitant
- Les services fournis
- La localisation des traitements
- Les garanties mises en place pour les transferts

### 10.4 Transparence

Les personnes concernées sont informées de tout transfert de données hors UE via la politique de confidentialité. Cette information précise :

- Les pays destinataires
- L'existence ou l'absence d'une décision d'adéquation
- Les garanties appropriées mises en place
- Les moyens d'obtenir une copie des garanties

---

Cette documentation RGPD est régulièrement mise à jour pour refléter les évolutions réglementaires et les améliorations apportées à la plateforme CarbonOS. Pour toute question relative à la protection des données, veuillez contacter notre DPO à l'adresse dpo@carbonos.fr.

**Version : 1.0**  
**Date de dernière mise à jour : 23 mars 2025**
