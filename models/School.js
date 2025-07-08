const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    schoolId: {
      type: String,
      required: true,
      unique: true,
      length: 5
    },
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('School', schoolSchema);
