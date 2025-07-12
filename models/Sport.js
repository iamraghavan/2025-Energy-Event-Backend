const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema(
  {
    sportId: {
      type: String,
      required: true,
      unique: true,
      length: 5
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['team', 'individual'],
      required: true
    },
    genderCategory: {
      type: String,
      enum: ['M', 'W', 'M/W'],
      required: true
    },
    details: {
      type: String,
      trim: true
    },
    athleticsEvents: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sport', sportSchema);
