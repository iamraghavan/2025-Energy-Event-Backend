const mongoose = require('mongoose');

// Highlight (Ball-by-ball)
const highlightSchema = new mongoose.Schema({
  over: { type: Number, required: true },
  ball: { type: Number, required: true },
  batsman: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  bowler: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  run: { type: Number, default: 0 },
  isFour: { type: Boolean, default: false },
  isSix: { type: Boolean, default: false },
  isWicket: { type: Boolean, default: false },
  wicketType: { type: String, enum: ['bowled', 'caught', 'runout', 'lbw', 'hitwicket', 'stumped', 'retired'], default: null },
  fielder: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null },
  shotDirection: { type: String, enum: ['leg side', 'off side', 'cover', 'mid-wicket', 'square leg', 'third man', 'straight', 'point', 'long on', 'long off'], default: null },
  extraType: { type: String, enum: ['no ball', 'wide', 'bye', 'leg bye'], default: null },
  commentary: { type: String }
}, { _id: false, timestamps: true });

// Player stats
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
  fixtureName: { type: String, default: '' },
  overs: { type: Number, enum: [2, 6, 8, 10], required: true },
  status: { type: String, enum: ['scheduled', 'live', 'completed'], default: 'scheduled' },
  isComplete: { type: Boolean, default: false },

  teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  playersA: [playerScoreSchema],
  playersB: [playerScoreSchema],

  // Toss
  tossWinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  tossDecision: { type: String, enum: ['bat', 'bowl'], default: null },

  // Innings
  firstInningsTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  secondInningsTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  firstInningsRuns: { type: Number, default: 0 },
  secondInningsRuns: { type: Number, default: 0 },
  target: { type: Number, default: 0 },

  // Result
  winningTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },

  // Ball-by-ball
  highlights: [highlightSchema]
}, { timestamps: true });

module.exports = mongoose.model('CricketMatch', cricketMatchSchema);
