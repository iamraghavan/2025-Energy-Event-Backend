const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  jerseyNumber: { type: Number, required: true },
  role: { type: String, enum: ['batsman', 'bowler', 'allrounder', 'wicketkeeper'], required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
