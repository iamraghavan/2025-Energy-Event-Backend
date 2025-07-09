const mongoose = require('mongoose');

const kabaddiPlayerStatsSchema = new mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'KabaddiMatch', required: true },
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  totalRaids: { type: Number, default: 0 },
  totalTackles: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 }
});

module.exports = mongoose.model('KabaddiPlayerStats', kabaddiPlayerStatsSchema);
