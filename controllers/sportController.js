const Sport = require('../models/Sport');

// Get all sports
exports.getAllSports = async (req, res) => {
  try {
    const sports = await Sport.find();
    res.status(200).json({ success: true, data: sports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sport by Mongo _id
exports.getSportById = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);
    if (!sport) {
      return res.status(404).json({ message: 'Sport not found' });
    }
    res.status(200).json({ success: true, data: sport });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sport by custom sportId
exports.getSportBySportId = async (req, res) => {
  try {
    const sport = await Sport.findOne({ sportId: req.params.sportId });
    if (!sport) {
      return res.status(404).json({ message: 'Sport not found' });
    }
    res.status(200).json({ success: true, data: sport });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
