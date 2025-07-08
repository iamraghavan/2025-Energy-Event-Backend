const User = require('../models/User');

const apiKeyAuth = async (req, res, next) => {
  const clientKey = req.headers['x-api-key'];

  if (!clientKey) {
    return res.status(401).json({ message: 'API key missing' });
  }

  // Look up user with matching API key
  const user = await User.findOne({ apiKey: clientKey, role: 'superadmin' });

  if (!user) {
    return res.status(403).json({ message: 'Invalid API key' });
  }

  req.superAdmin = user; // Optional: attach to request for logging
  next();
};

module.exports = apiKeyAuth;
