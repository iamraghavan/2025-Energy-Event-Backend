const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['superadmin', 'lv2admin', 'scorekeeper'],
    default: 'scorekeeper'
  },
  apiKey: { type: String, unique: true, sparse: true } // Only for superadmin/lv2admin
}, { timestamps: true });

// Hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate API key for admin roles
userSchema.pre('save', function (next) {
  if (['superadmin', 'lv2admin'].includes(this.role) && !this.apiKey) {
    this.apiKey = crypto.randomBytes(32).toString('hex');
  }
  next();
});

// Match password helper
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
