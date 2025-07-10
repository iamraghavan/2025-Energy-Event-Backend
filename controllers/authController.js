const User = require('../models/User');

// ✅ Create Super Admin (one-time)
exports.createSuperAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const user = await User.create({
      username,
      password,
      role: 'superadmin'
    });

    return res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        role: user.role,
        apiKey: user.apiKey
      }
    });
  } catch (err) {
    console.error('[createSuperAdmin]', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Create Level 2 Admin (requires SuperAdmin API key)
exports.createLevel2Admin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check unique
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const user = await User.create({
      username,
      password,
      role: 'lv2admin'
    });

    return res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        role: user.role,
        apiKey: user.apiKey
      }
    });
  } catch (err) {
    console.error('[createLevel2Admin]', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Create Scorekeeper (requires admin, but no API key)
exports.createScorekeeper = async (req, res) => {
  try {
    const { username, password } = req.body;

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const user = await User.create({
      username,
      password,
      role: 'scorekeeper'
    });

    return res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error('[createScorekeeper]', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Login for all
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        role: user.role,
        apiKey: user.apiKey || null
      }
    });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
