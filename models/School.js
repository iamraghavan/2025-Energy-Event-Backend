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
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('School', schoolSchema);
