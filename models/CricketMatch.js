const mongoose = require('mongoose');

const playerScoreSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  ballsFaced: { type: Number, default: 0 }, // For batsman
  oversBowled: { type: Number, default: 0 }, // For bowler
  extraBalls: { type: Number, default: 0 }   // No ball, wide, etc.
}, { _id: false });


const cricketMatchSchema = new mongoose.Schema({
  teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  playersA: [playerScoreSchema], // player + stats
  playersB: [playerScoreSchema],
  overs: { type: Number, enum: [6, 8, 10], required: true },
  winningTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  isComplete: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('CricketMatch', cricketMatchSchema);
