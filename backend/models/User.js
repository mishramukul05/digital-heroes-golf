const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  subscriptionStatus: { type: String, enum: ['active', 'inactive', 'lapsed'], default: 'inactive' }, // [cite: 41, 89]
  selectedCharityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity' }, // [cite: 31, 76]
  charityPercentage: { type: Number, default: 10, min: 10 }, // [cite: 77, 78]
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  subscriptionPlan: { type: String, enum: ['monthly', 'yearly', 'none'], default: 'none' },
  subscriptionStartDate: { type: Date },
  subscriptionRenewalDate: { type: Date },
  totalWinnings: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);