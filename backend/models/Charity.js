const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const charitySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  totalRaised: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

const Charity = mongoose.model('Charity', charitySchema);

module.exports = Charity;