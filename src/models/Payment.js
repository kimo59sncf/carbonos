const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'EUR'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'transfer'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    type: Object,
    default: {}
  },
  date: {
    type: Date,
    default: Date.now
  },
  transactionId: {
    type: String
  },
  invoiceNumber: {
    type: String
  },
  invoiceUrl: {
    type: String
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);
