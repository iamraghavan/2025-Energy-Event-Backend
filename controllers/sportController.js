// controllers/sportController.js
const Sport = require('../models/Sport');


exports.createSport = async (req, res) => {
  try {
    const { sportId, name, type, genderCategory, details, athleticsEvents } = req.body;

    // Basic validations
    if (!sportId || !name || !type || !genderCategory) {
      return res.status(400).json({
        message: 'sportId, name, type, and genderCategory are required'
      });
    }

    const exists = await Sport.findOne({ sportId });
    if (exists) {
      return res.status(409).json({
        message: 'Sport with this sportId already exists'
      });
    }

    const newSport = await Sport.create({
      sportId,
      name,
      type,
      genderCategory,
      details: details || '',
      athleticsEvents: athleticsEvents || []
    });

    res.status(201).json({
      success: true,
      data: newSport
    });
  } catch (err) {
    console.error('[createSport]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getAllSports = async (req, res) => {
  try {
    const sports = await Sport.find();

    const menSports = sports.filter(s => s.genderCategory.includes('M'));
    const womenSports = sports.filter(s => s.genderCategory.includes('W'));

    res.status(200).json({
      success: true,
      data: {
        menSports,
        womenSports
      }
    });
  } catch (err) {
    console.error('[getAllSports]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getSportById = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);
    if (!sport) {
      return res.status(404).json({ message: 'Sport not found' });
    }
    res.status(200).json({ success: true, data: sport });
  } catch (err) {
    console.error('[getSportById]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getSportBySportId = async (req, res) => {
  try {
    const sport = await Sport.findOne({ sportId: req.params.sportId });
    if (!sport) {
      return res.status(404).json({ message: 'Sport not found' });
    }
    res.status(200).json({ success: true, data: sport });
  } catch (err) {
    console.error('[getSportBySportId]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateSportDetails = async (req, res) => {
  try {
    const sport = await Sport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!sport) {
      return res.status(404).json({ message: 'Sport not found' });
    }

    res.status(200).json({ success: true, data: sport });
  } catch (err) {
    console.error('[updateSportDetails]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
