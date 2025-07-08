const School = require('../models/School');
const generateID = require('../utils/generateID');

// Register a new school
exports.createSchool = async (req, res) => {
  try {
    const { name, address } = req.body;

    // Auto-generate a unique 5-digit schoolId
    let schoolId;
    let exists = true;

    while (exists) {
      schoolId = generateID();
      const existing = await School.findOne({ schoolId });
      if (!existing) {
        exists = false;
      }
    }

    const school = await School.create({ schoolId, name, address });

    res.status(201).json({
      success: true,
      data: school
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all schools
exports.getAllSchools = async (req, res) => {
  try {
    const schools = await School.find();
    res.json({ success: true, data: schools });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
