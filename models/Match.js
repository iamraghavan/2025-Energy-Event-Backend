const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  sport: { type: String, required: true },
  teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  pointsA: { type: Number, default: 0 },
  pointsB: { type: Number, default: 0 },
  scheduledAt: { type: Date, required: true },
  isComplete: { type: Boolean, default: false },
  result: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
