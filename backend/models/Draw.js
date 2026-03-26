const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const drawSchema = new Schema({
  month: { type: String, required: true }, // e.g., "YYYY-MM"
  winningNumbers: { type: [Number], required: true }, // Array of 5 numbers
  prizePoolTotal: { type: Number, required: true },
  basePrizePool: { type: Number, default: 0 },
  rolloverAmount: { type: Number, default: 0 },
  jackpotClaimed: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['simulation', 'published'],
    default: 'simulation',
  },
  winners: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    matchTier: { type: Number, enum: [3, 4, 5], required: true },
    prizeAmount: { type: Number, required: true },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'paid'],
      default: 'pending',
    },
    proofImage: { type: String }, // To store the Base64 image string
  }],
}, {
  timestamps: true,
});

const Draw = mongoose.model('Draw', drawSchema);

module.exports = Draw;