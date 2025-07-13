const School = require('../models/School');
const generateID = require('../utils/generateID');

// Create new school
exports.createSchool = async (req, res) => {
  try {
    const { name, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: 'Name and address are required' });
    }

    let schoolId;
    let exists = true;

    // Ensure unique 5-digit ID
    while (exists) {
      schoolId = generateID();
      const check = await School.findOne({ schoolId });
      if (!check) exists = false;
    }

    const newSchool = await School.create({
      schoolId,
      name: name.trim(),
      address: address.trim()
    });

    res.status(201).json({
      success: true,
      data: newSchool
    });
  } catch (err) {
    console.error('[createSchool]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get ALL schools
exports.getAllSchools = async (req, res) => {
  try {
    const schools = await School.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: schools.length, data: schools });
  } catch (err) {
    console.error('[getAllSchools]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get one school by Mongo _id
exports.getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.status(200).json({ success: true, data: school });
  } catch (err) {
    console.error('[getSchoolById]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get one school by custom schoolId
exports.getSchoolBySchoolId = async (req, res) => {
  try {
    const school = await School.findOne({ schoolId: req.params.schoolId });
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.status(200).json({ success: true, data: school });
  } catch (err) {
    console.error('[getSchoolBySchoolId]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
