const School = require('../models/School');
const generateID = require('../utils/generateID');

// ✅ Create new School
exports.createSchool = async (req, res) => {
  try {
    const { name, address } = req.body;
    if (!name || !address) {
      return res.status(400).json({ message: 'Name and address are required' });
    }

    let schoolId;
    let exists = true;
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

    res.status(201).json({ success: true, data: newSchool });
  } catch (err) {
    console.error('[createSchool]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Get all Schools
exports.getAllSchools = async (req, res) => {
  try {
    const schools = await School.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: schools.length, data: schools });
  } catch (err) {
    console.error('[getAllSchools]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Get School by Mongo ID
exports.getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ message: 'School not found' });
    res.status(200).json({ success: true, data: school });
  } catch (err) {
    console.error('[getSchoolById]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Get School by SchoolId
exports.getSchoolBySchoolId = async (req, res) => {
  try {
    const school = await School.findOne({ schoolId: req.params.schoolId });
    if (!school) return res.status(404).json({ message: 'School not found' });
    res.status(200).json({ success: true, data: school });
  } catch (err) {
    console.error('[getSchoolBySchoolId]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Update School by Mongo ID (PATCH)
exports.patchSchool = async (req, res) => {
  try {
    const updated = await School.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'School not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('[patchSchool]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Replace School by Mongo ID (PUT)
exports.putSchool = async (req, res) => {
  try {
    const { name, address } = req.body;
    if (!name || !address) {
      return res.status(400).json({ message: 'Name and address are required for PUT' });
    }
    const updated = await School.findOneAndReplace(
      { _id: req.params.id },
      { schoolId: req.body.schoolId, name: name.trim(), address: address.trim() },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'School not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('[putSchool]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Delete School by Mongo ID
exports.deleteSchool = async (req, res) => {
  try {
    const deleted = await School.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'School not found' });
    res.status(200).json({ success: true, message: 'School deleted successfully' });
  } catch (err) {
    console.error('[deleteSchool]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
