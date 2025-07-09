const mongoose = require('mongoose');

const kabaddiMatchSchema = new mongoose.Schema({
  sport: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true }, // Kabaddi sportId
  teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  court: { type: String, required: true },
  referee: { type: String },
  status: { type: String, enum: ['Scheduled', 'Live', 'Completed'], default: 'Scheduled' },
  score: {
    teamA: { type: Number, default: 0 },
    teamB: { type: Number, default: 0 }
  },
  startTime: Date,
  endTime: Date
}, { timestamps: true });

module.exports = mongoose.model('KabaddiMatch', kabaddiMatchSchema);
