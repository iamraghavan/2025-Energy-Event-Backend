const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  sport: { type: String, required: true },

  teamA: { type: String, required: true }, // your custom teamId
  teamB: { type: String, required: true },

  pointsA: { type: Number, default: 0 },
  pointsB: { type: Number, default: 0 },

  scheduledAt: { type: Date, required: true },

  venue: { type: String, required: true },
  courtNumber: { type: String, required: true },
  refereeName: { type: String, required: true },

  status: { type: String, enum: ['scheduled', 'live', 'completed'], default: 'scheduled' },

  isComplete: { type: Boolean, default: false },

  result: { type: String },         // e.g., "TeamA Wins"
  winnerTeam: { type: String },     // store winning teamId if team match
  winnerPlayer: { type: String },   // optional: for individual sports

  scorekeeperId: { type: String, required: true }, // store who created/managed it

  remarks: { type: String },        // optional notes
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
