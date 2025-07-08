const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    rollNumber: { type: String, required: true, unique: true },
    department: { type: String },
    year: { type: Number },
    phone: { type: String }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Student', studentSchema);
