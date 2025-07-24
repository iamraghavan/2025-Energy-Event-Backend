const mongoose = require('mongoose');

const playerScoreSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  isCaptain: { type: Boolean, default: false },
  isWicketKeeper: { type: Boolean, default: false },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  ballsFaced: { type: Number, default: 0 },
  oversBowled: { type: Number, default: 0 },
  extraBalls: { type: Number, default: 0 }
}, { _id: false });

const cricketMatchSchema = new mongoose.Schema({
  teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  playersA: [playerScoreSchema],
  playersB: [playerScoreSchema],
  overs: { type: Number, enum: [6, 8, 10], required: true },
  winningTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  isComplete: { type: Boolean, default: false },
  fixtureName: { type: String, default: '' },
  status: { type: String, enum: ['scheduled', 'live', 'completed'], default: 'scheduled' }
}, { timestamps: true });

module.exports = mongoose.model('CricketMatch', cricketMatchSchema);
