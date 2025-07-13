const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    teamId: { type: String, required: true, unique: true },  // Custom 5-digit
    name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['M', 'W'], required: true },

    sport: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
