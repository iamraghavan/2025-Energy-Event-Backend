const Player = require('../models/Player');
const Team = require('../models/Team');

    const School = require('../models/School');
    const Sport = require('../models/Sport');
    const generateID = require('../utils/generateID');

    // Register a new team
   exports.createTeam = async (req, res) => {
  try {
    const { name, sportId, gender, schoolId } = req.body;

    // Auto-generate a unique 5-digit teamId
    let teamId;
    let exists = true;

    while (exists) {
      teamId = generateID();
      const existing = await Team.findOne({ teamId });
      if (!existing) {
        exists = false;
      }
    }

    // Find by custom schoolId
    const school = await School.findOne({ schoolId });
    if (!school) {
      return res.status(400).json({ message: 'School not found' });
    }

    //  Find by custom sportId
    const sport = await Sport.findOne({ sportId });
    if (!sport) {
      return res.status(400).json({ message: 'Sport not found' });
    }

    const team = await Team.create({
      teamId,
      name,
      sport: sport._id,
      gender,
      school: school._id
    });

    res.status(201).json({
      success: true,
      data: team
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


    // Get all teams
    exports.getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find().populate('sport').populate('school');
        res.json({ success: true, data: teams });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    };


    // Get team by Mongo _id
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('sport').populate('school');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get team by custom teamId
exports.getTeamByTeamId = async (req, res) => {
  try {
    const team = await Team.findOne({ teamId: req.params.teamId }).populate('sport').populate('school');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all teams for a given sportId
exports.getTeamsBySportId = async (req, res) => {
  try {
    // 1️⃣ Find the sport by custom sportId
    const sport = await Sport.findOne({ sportId: req.params.sportId });
    if (!sport) {
      return res.status(404).json({ message: 'Sport not found' });
    }

    // 2️⃣ Find teams where `sport` equals the real ObjectId
    const teams = await Team.find({ sport: sport._id }).populate('sport').populate('school');

    res.status(200).json({ success: true, data: teams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.checkJerseyNumber = async (req, res) => {
  try {
    const { teamId, jerseyNumber } = req.query;

    if (!teamId || !jerseyNumber) {
      return res.status(400).json({ message: 'teamId and jerseyNumber are required' });
    }

    const team = await Team.findOne({ teamId });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const existingPlayer = await Player.findOne({
      team: team._id,
      jerseyNumber: jerseyNumber
    });

    if (existingPlayer) {
      return res.json({ available: false, message: 'Jersey number already taken' });
    }

    res.json({ available: true, message: 'Jersey number is available' });

  } catch (error) {
    console.error('[checkJerseyNumber]', error); // ✅ Always log unexpected errors
    res.status(500).json({ message: error.message });
  }
};