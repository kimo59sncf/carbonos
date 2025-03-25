const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schéma pour le statut d'essai
const TrialStatusSchema = new Schema({
  isTrialActive: {
    type: Boolean,
    default: false
  },
  trialStartDate: {
    type: Date
  },
  trialEndDate: {
    type: Date
  },
  remainingReports: {
    type: Number,
    default: 2
  },
  remainingEmissionSources: {
    type: Number,
    default: 5
  }
});

// Schéma pour l'abonnement
const SubscriptionSchema = new Schema({
  plan: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'free'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'cancelled'],
    default: 'inactive'
  },
  paymentMethod: {
    type: String
  },
  paymentId: {
    type: String
  }
});

// Schéma principal de l'entreprise
const CompanySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true
  },
  siren: {
    type: String
  },
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: {
      type: String,
      default: 'France'
    }
  },
  employeeCount: {
    type: Number,
    required: true
  },
  contactEmail: {
    type: String
  },
  contactPhone: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Informations NAF/CNAE pour le benchmarking
  activityCode: {
    type: String
  },
  // Statut d'essai
  trialStatus: {
    type: TrialStatusSchema,
    default: () => ({})
  },
  // Informations d'abonnement
  subscription: {
    type: SubscriptionSchema,
    default: () => ({})
  },
  // Paramètres de confidentialité pour le benchmarking
  privacySettings: {
    allowAnonymousBenchmarking: {
      type: Boolean,
      default: true
    },
    allowSectoralReporting: {
      type: Boolean,
      default: true
    }
  }
});

// Middleware pre-save pour mettre à jour le champ updatedAt
CompanySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Méthode pour vérifier si l'essai est actif
CompanySchema.methods.isTrialActive = function() {
  if (!this.trialStatus.isTrialActive) return false;
  
  const now = new Date();
  const endDate = new Date(this.trialStatus.trialEndDate);
  
  return now <= endDate;
};

// Méthode pour vérifier si l'entreprise peut générer un rapport
CompanySchema.methods.canGenerateReport = function() {
  // Si c'est un abonnement payant, pas de limite
  if (this.subscription.status === 'active') return true;
  
  // Si c'est un essai, vérifier les limites
  if (this.isTrialActive()) {
    return this.trialStatus.remainingReports > 0;
  }
  
  return false;
};

// Méthode pour vérifier si l'entreprise peut ajouter une source d'émission
CompanySchema.methods.canAddEmissionSource = function() {
  // Si c'est un abonnement payant, pas de limite
  if (this.subscription.status === 'active') return true;
  
  // Si c'est un essai, vérifier les limites
  if (this.isTrialActive()) {
    return this.trialStatus.remainingEmissionSources > 0;
  }
  
  return false;
};

// Méthode pour décrémenter le nombre de rapports restants
CompanySchema.methods.decrementRemainingReports = async function() {
  if (this.isTrialActive() && this.trialStatus.remainingReports > 0) {
    this.trialStatus.remainingReports -= 1;
    await this.save();
    return true;
  }
  return false;
};

// Méthode pour décrémenter le nombre de sources d'émission restantes
CompanySchema.methods.decrementRemainingEmissionSources = async function() {
  if (this.isTrialActive() && this.trialStatus.remainingEmissionSources > 0) {
    this.trialStatus.remainingEmissionSources -= 1;
    await this.save();
    return true;
  }
  return false;
};

module.exports = mongoose.model('Company', CompanySchema);
