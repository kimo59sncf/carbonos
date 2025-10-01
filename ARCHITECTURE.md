# Architecture CarbonOS - Version Corrigée

## Vue d'ensemble

CarbonOS est une plateforme de gestion des émissions carbone construite avec une architecture **Next.js unifiée** qui intègre le frontend et le backend API.

## Architecture choisie : Next.js Full-Stack

### ✅ **Décision architecturale**
- **Frontend + API Backend** : Next.js 14+ avec App Router
- **Base de données** : SQLite avec Drizzle ORM
- **Serveur API externe** : Express.js (optionnel, pour fonctionnalités avancées)
- **Port principal** : 3000 (Next.js)

### 🏗️ **Structure du projet**

```
CarbonOS/
├── src/                          # Application Next.js principale
│   ├── app/                      # App Router Next.js
│   │   ├── api/                  # API Routes Next.js
│   │   │   ├── auth/             # Authentification
│   │   │   ├── dashboard/        # Données dashboard
│   │   │   └── ...
│   │   ├── dashboard/            # Page dashboard (fonctionnelle)
│   │   ├── auth/                 # Page d'authentification
│   │   └── page.tsx              # Page d'accueil
│   ├── components/               # Composants React
│   │   ├── ui/                   # Composants de base (Radix UI)
│   │   ├── sections/             # Sections de page
│   │   └── dashboard/            # Composants dashboard
│   ├── hooks/                    # Hooks personnalisés
│   ├── lib/                      # Utilitaires
│   └── providers/                # Context providers
├── server/                       # Serveur Express.js (optionnel)
│   ├── db.ts                     # Configuration base de données
│   ├── storage.ts                # Couche d'accès aux données
│   ├── routes.ts                 # Routes API Express.js
│   └── auth.ts                   # Authentification Passport.js
├── client/                       # Ancienne structure (dépréciée)
└── shared/                       # Schémas partagés
```

## 🔧 **Configuration technique**

### **Frontend (Next.js)**
- **Framework** : Next.js 14+ avec App Router
- **Language** : TypeScript strict mode
- **UI Library** : Radix UI + Tailwind CSS 4.0
- **État** : React Query v5
- **Animations** : Framer Motion
- **Formulaires** : React Hook Form + Zod

### **Backend API**
- **API Routes** : Next.js API Routes (port 3000)
- **Base de données** : SQLite avec Drizzle ORM
- **Authentification** : NextAuth.js (prévu)
- **Serveur externe** : Express.js (port 5000) pour fonctionnalités avancées

### **Base de données**
- **Moteur** : SQLite (développement) / PostgreSQL (production)
- **ORM** : Drizzle ORM
- **Migrations** : Drizzle Kit
- **Schéma** : Partagé entre frontend et backend

## 🚀 **Démarrage de l'application**

### **Mode développement**
```bash
# Démarrer l'application principale
npm run dev  # http://localhost:3000

# Démarrer le serveur API externe (optionnel)
# Le serveur Express.js peut être démarré séparément si needed
```

### **Variables d'environnement**
```env
# Configuration de base
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Base de données
DATABASE_URL=./sqlite.db

# Authentification (à configurer)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## 📡 **Intégration API**

### **Hiérarchie des APIs**
1. **Next.js API Routes** (priorité haute) - `/api/*`
2. **Serveur Express.js** (fallback) - `http://localhost:5000/api/*`

### **Exemple d'intégration**
```typescript
// Dans les composants React
const fetchDashboardData = async () => {
  try {
    // Essaie d'abord l'API Next.js
    const response = await fetch('/api/dashboard');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('API Next.js non disponible');
  }

  // Fallback vers le serveur Express.js
  const fallbackResponse = await fetch('http://localhost:5000/api/dashboard-direct');
  return await fallbackResponse.json();
};
```

## 🔐 **Authentification**

### **Système d'authentification**
- **Frontend** : Hook `useAuth()` personnalisé
- **Backend** : API Routes Next.js avec sessions
- **Base de données** : Table `users` avec mots de passe hashés

### **Comptes de test**
- **Demo** : `demo@carbonos.com` / `demo123`
- **Admin** : Comptes créés via l'interface d'administration

## 📊 **Fonctionnalités implémentées**

### **Dashboard fonctionnel**
- ✅ Affichage des émissions Scope 1, 2, 3
- ✅ Graphiques et visualisations
- ✅ Échéances réglementaires (BEGES, CSRD)
- ✅ Benchmarks sectoriels
- ✅ Actions rapides

### **Gestion des données**
- ✅ CRUD entreprises
- ✅ Gestion des émissions
- ✅ Rapports de conformité
- ✅ Exports de données

### **Conformité**
- ✅ RGPD : Bandeau de consentement, gestion des données
- ✅ CSRD : Rapports de durabilité
- ✅ BEGES : Bilan d'émissions GES

## 🔄 **Workflow de développement**

### **Pour les développeurs**
1. **Démarrer l'application** : `npm run dev`
2. **Accéder au dashboard** : `http://localhost:3000/dashboard`
3. **API disponibles** : `http://localhost:3000/api/*`
4. **Backend externe** : `http://localhost:5000/api/*` (si démarré)

### **Pour ajouter de nouvelles fonctionnalités**
1. **Frontend** : Créer composants dans `src/components/`
2. **API** : Ajouter routes dans `src/app/api/`
3. **Base de données** : Modifier schéma dans `shared/schema.ts`
4. **Backend externe** : Ajouter routes dans `server/routes.ts`

## 🚨 **Points d'attention**

### **Architecture hybride**
- Le serveur Express.js (port 5000) reste disponible pour les fonctionnalités avancées
- Les API Next.js (port 3000) sont prioritaires
- Fallback automatique en cas d'indisponibilité

### **Sécurité**
- ✅ Headers de sécurité configurés
- ✅ Authentification sécurisée
- ✅ Validation des données avec Zod
- ✅ RGPD compliant

## 📈 **Évolution future**

### **Améliorations prévues**
1. **Base de données** : Migration PostgreSQL
2. **Authentification** : NextAuth.js complet
3. **Real-time** : WebSockets pour données temps réel
4. **API externe** : Intégration ADEME, météo, etc.

### **Déploiement**
- **Plateforme** : Vercel/Netlify recommandé
- **Base de données** : PostgreSQL géré
- **Variables d'environnement** : Configurer en production

---

## ✅ **Résumé des corrections apportées**

1. **✅ Dashboard fonctionnel** : Remplacé le code fictif par une vraie implémentation
2. **✅ API intégrée** : Connexion automatique au backend avec fallback
3. **✅ Architecture unifiée** : Next.js comme point d'entrée unique
4. **✅ Composants cohérents** : Utilisation des vrais composants UI
5. **✅ Tests validés** : API et intégration fonctionnelles

**CarbonOS est maintenant une plateforme cohérente et fonctionnelle ! 🎉**