const Team = require('../models/Team');
const Sport = require('../models/Sport');
const School = require('../models/School');
const generateID = require('../utils/generateID');

// Create new team
exports.createTeam = async (req, res) => {
  try {
    const { name, gender, sportId, schoolId } = req.body;

    if (!name || !gender || !sportId || !schoolId) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const sport = await Sport.findOne({ sportId });
    if (!sport) return res.status(404).json({ message: 'Sport not found' });

    const school = await School.findOne({ schoolId });
    if (!school) return res.status(404).json({ message: 'School not found' });

    let teamId;
    let exists = true;
    while (exists) {
      teamId = generateID();
      const check = await Team.findOne({ teamId });
      if (!check) exists = false;
    }

    const team = await Team.create({
      teamId,
      name,
      gender,
      sport: sport._id,
      school: school._id
    });

    res.status(201).json({ success: true, data: team });
  } catch (err) {
    console.error('[createTeam]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all teams
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate('sport').populate('school').sort({ createdAt: -1 });
    res.json({ success: true, count: teams.length, data: teams });
  } catch (err) {
    console.error('[getAllTeams]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get team by Mongo ID
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('sport').populate('school');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json({ success: true, data: team });
  } catch (err) {
    console.error('[getTeamById]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update team by ID (PUT or PATCH)
exports.updateTeam = async (req, res) => {
  try {
    const updated = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    }).populate('sport').populate('school');
    if (!updated) return res.status(404).json({ message: 'Team not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('[updateTeam]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete team by ID
exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json({ success: true, message: 'Team deleted' });
  } catch (err) {
    console.error('[deleteTeam]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// HEAD: Check team exists by ID
exports.headTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.sendStatus(404);
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
};

