const mongoose = require('mongoose');

const kabaddiMatchPointSchema = new mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'KabaddiMatch', required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  action: { type: String, enum: ['Raid', 'Raid-and-Bonus', 'Tackle', 'Bonus', 'Foul', 'All Out'], required: true },
  points: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KabaddiMatchPoint', kabaddiMatchPointSchema);
