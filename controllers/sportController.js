const Sport = require('../models/Sport');

// ✅ Get all sports (group by gender)
exports.getAllSports = async (req, res) => {
  try {
    const sports = await Sport.find();

    const men = sports.filter(s => s.genderCategory.includes('M'));
    const women = sports.filter(s => s.genderCategory.includes('W'));

    res.status(200).json({
      success: true,
      menSports: men,
      womenSports: women
    });
  } catch (err) {
    console.error('[getAllSports]', err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get sport by Mongo _id
exports.getSportById = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);
    if (!sport) {
      return res.status(404).json({ message: 'Sport not found' });
    }
    res.status(200).json({ success: true, data: sport });
  } catch (err) {
    console.error('[getSportById]', err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get sport by custom sportId
exports.getSportBySportId = async (req, res) => {
  try {
    const sport = await Sport.findOne({ sportId: req.params.sportId });
    if (!sport) {
      return res.status(404).json({ message: 'Sport not found' });
    }
    res.status(200).json({ success: true, data: sport });
  } catch (err) {
    console.error('[getSportBySportId]', err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update sport details
exports.updateSportDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Sport.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'Sport not found' });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('[updateSportDetails]', err);
    res.status(500).json({ message: err.message });
  }
};
