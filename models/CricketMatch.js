const mongoose = require('mongoose');

// Schema for a single ball highlight
const highlightSchema = new mongoose.Schema({
  over: { type: Number, required: true },         // Over number (e.g. 5)
  ball: { type: Number, required: true },         // Ball in the over (1 to 6)
  batsman: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  bowler: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  run: { type: Number, default: 0 },
  isFour: { type: Boolean, default: false },
  isSix: { type: Boolean, default: false },
  isWicket: { type: Boolean, default: false },
  wicketType: { type: String, enum: ['bowled', 'caught', 'runout', 'lbw', 'hitwicket', 'stumped', 'retired'], default: null },
  fielder: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null }, // Who caught/runout
  shotDirection: { type: String, enum: ['leg side', 'off side', 'cover', 'mid-wicket', 'square leg', 'third man', 'straight', 'point', 'long on', 'long off'], default: null },
  extraType: { type: String, enum: ['no ball', 'wide', 'bye', 'leg bye'], default: null },
  commentary: { type: String }
}, { timestamps: true, _id: false });

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
  status: { type: String, enum: ['scheduled', 'live', 'completed'], default: 'scheduled' },

  // 🏏 Highlights: array of all balls played
  highlights: [highlightSchema]
}, { timestamps: true });

module.exports = mongoose.model('CricketMatch', cricketMatchSchema);
