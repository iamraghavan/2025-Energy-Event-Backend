const User = require('../models/User');

//   Create SuperAdmin (public - only once)
exports.createSuperAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const user = await User.create({ username, password, role: 'superadmin' });

    res.status(201).json({
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
    res.status(500).json({ message: 'Internal server error' });
  }
};

//   Create Level 2 Admin (requires valid API key)
exports.createLevel2Admin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const user = await User.create({ username, password, role: 'lv2admin' });

    res.status(201).json({
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
    res.status(500).json({ message: 'Internal server error' });
  }
};

//   Create Scorekeeper (requires valid API key)
exports.createScorekeeper = async (req, res) => {
  try {
    const { username, password } = req.body;

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const user = await User.create({ username, password, role: 'scorekeeper' });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        role: user.role
        // Note: No API key for scorekeeper
      }
    });
  } catch (err) {
    console.error('[createScorekeeper]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//   Login for all roles
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({
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
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};

    const users = await User.find(query).select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    console.error('[getAllUsers]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};