const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  plan: {
    type: String,
    enum: ['starter', 'business', 'enterprise'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'cancelled', 'expired'],
    default: 'pending'
  },
  billingInfo: {
    companyName: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    vatNumber: {
      type: String
    },
    contactName: {
      type: String,
      required: true
    },
    contactEmail: {
      type: String,
      required: true
    },
    contactPhone: {
      type: String
    }
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'transfer'],
    required: true
  },
  limits: {
    maxEmissionSources: {
      type: Number,
      default: 20
    },
    maxReports: {
      type: Number,
      default: 5
    },
    hasCollaboration: {
      type: Boolean,
      default: false
    },
    hasCollaborationAdvanced: {
      type: Boolean,
      default: false
    },
    hasAccountingIntegration: {
      type: Boolean,
      default: false
    },
    hasBenchmarking: {
      type: Boolean,
      default: false
    },
    hasBenchmarkingAdvanced: {
      type: Boolean,
      default: false
    },
    hasCustomApi: {
      type: Boolean,
      default: false
    },
    hasDedicatedSupport: {
      type: Boolean,
      default: false
    }
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  renewalDate: {
    type: Date,
    required: true
  },
  cancellationDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre à jour le champ updatedAt avant la sauvegarde
SubscriptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
