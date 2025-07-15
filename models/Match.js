const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  sport: { type: String, required: true },

  teamA: { type: String, required: true }, // your custom teamId
  teamB: { type: String, required: true },

  pointsA: { type: Number, default: 0 },
  pointsB: { type: Number, default: 0 },

  scheduledAt: { type: Date, required: true },

  venue: { type: String, required: true },     // e.g., "Main Stadium"
  courtNumber: { type: String, required: true }, // e.g., "Court 3"
  refereeName: { type: String, required: true }, // e.g., "Mr. John Doe"
  status:{ type: String, enum: ['scheduled', 'live', 'completed'], default: 'scheduled' },
  isComplete: { type: Boolean, default: false },
  result: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
