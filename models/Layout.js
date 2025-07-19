const mongoose = require('mongoose');

const layoutSchema = new mongoose.Schema({
  quadrant1: { type: String, default: null }, // sportId or name
  quadrant2: { type: String, default: null },
  quadrant3: { type: String, default: null },
  quadrant4: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Layout', layoutSchema);
