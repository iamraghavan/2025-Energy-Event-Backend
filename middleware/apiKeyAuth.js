const User = require('../models/User');

module.exports = async function apiKeyAuth(req, res, next) {
  try {
    const clientKey = req.headers['x-api-key'];

    if (!clientKey) {
      return res.status(401).json({ message: 'API key missing' });
    }

    const user = await User.findOne({
      apiKey: clientKey,
      role: { $in: ['superadmin', 'lv2admin'] }
    });

    if (!user) {
      return res.status(403).json({ message: 'Invalid API key' });
    }

    req.admin = user; // For optional logging or audit
    next();
  } catch (err) {
    console.error('[apiKeyAuth]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
