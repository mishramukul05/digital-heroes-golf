const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true, min: 1, max: 45 }, // Stableford format 
  date: { type: Date, required: true, default: Date.now } // [cite: 46]
});

module.exports = mongoose.model('Score', ScoreSchema);