const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: ['M', 'W'],
      required: true
    },
    isTeamPlayer: {
      type: Boolean,
      default: false
    },
    sport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sport',
      required: true
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    jerseyNumber: {
      type: String,
      maxlength: 4
    },
    role: {
      type: String,
      enum: ['player', 'substitute'],
      default: 'player'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Player', playerSchema);
