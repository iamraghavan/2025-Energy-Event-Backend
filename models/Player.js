const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  jerseyNumber: { type: Number, required: true },
  role: {
    type: String,
    required: true,
    enum: [
      // Batsmen
      'Right-hand Batsman',
      'Left-hand Batsman',
      // Wicket-keepers
      'Wicket-keeper',
      // Bowlers
      'Right-arm Fast Bowler',
      'Right-arm Medium-fast Bowler',
      'Right-arm Fast-medium Bowler',
      'Left-arm Fast Bowler',
      'Left-arm Medium-fast Bowler',
      'Left-arm Fast-medium Bowler',
      'Right-arm Off-spin Bowler (Off-break)',
      'Right-arm Leg-spin Bowler (Leg-break/Googly)',
      'Left-arm Orthodox Spinner',
      'Left-arm Chinaman Spinner (Left-arm unorthodox spin)',
      // All-rounders
      'Batting All-rounder (Right-hand bat)',
      'Batting All-rounder (Left-hand bat)',
      'Bowling All-rounder (Fast/Medium)',
      'Bowling All-rounder (Spin)'
    ]
  },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
