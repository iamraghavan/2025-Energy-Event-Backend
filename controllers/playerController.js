const Player = require('../models/Player');
const Sport = require('../models/Sport');
const Team = require('../models/Team');

// Register a player
exports.registerPlayer = async (req, res) => {
  try {
    const { name, phone, gender, isTeamPlayer, sportId, teamId, jerseyNumber } = req.body;

    // Validate sport exists by sportId
    const sport = await Sport.findOne({ sportId });
    if (!sport) {
      return res.status(400).json({ message: 'Sport not found' });
    }

    let team = null;

    if (isTeamPlayer) {
      if (!teamId) {
        return res.status(400).json({ message: 'Team ID is required for team players' });
      }
      // Validate team exists by teamId
      team = await Team.findOne({ teamId });
      if (!team) {
        return res.status(400).json({ message: 'Team not found' });
      }
    }

    if (jerseyNumber && jerseyNumber.length > 4) {
      return res.status(400).json({ message: 'Jersey number must be max 4 digits' });
    }

    const player = await Player.create({
      name,
      phone,
      gender,
      isTeamPlayer,
      sport: sport._id,
      team: team ? team._id : null,
      jerseyNumber: isTeamPlayer ? jerseyNumber : null
    });

    res.status(201).json({
      success: true,
      data: player
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all players
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find()
      .populate('sport')
      .populate('team');
    res.json({ success: true, data: players });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
