const Player = require('../models/Player');
const Sport = require('../models/Sport');
const Team = require('../models/Team');
const { checkTeamSlots } = require('../utils/teamSlots');

//  Register player
exports.registerPlayer = async (req, res) => {
  try {
    const { name, phone, gender, isTeamPlayer, sportId, teamId, jerseyNumber, role } = req.body;

    // Validate sport
    const sport = await Sport.findOne({ sportId });
    if (!sport) {
      return res.status(400).json({ message: 'Sport not found' });
    }

    let team = null;

    if (isTeamPlayer) {
      if (!teamId) {
        return res.status(400).json({ message: 'Team ID is required for team players' });
      }

      team = await Team.findOne({ teamId });
      if (!team) {
        return res.status(400).json({ message: 'Team not found' });
      }

      if (jerseyNumber && jerseyNumber.length > 4) {
        return res.status(400).json({ message: 'Jersey number must be max 4 digits' });
      }

      if (!role || !['player', 'substitute'].includes(role)) {
        return res.status(400).json({ message: 'Role must be "player" or "substitute" for team players' });
      }

    } else {
      if (role) {
        return res.status(400).json({ message: 'Individual players should not have a role' });
      }
    }

    const player = await Player.create({
      name,
      phone,
      gender,
      isTeamPlayer,
      sport: sport._id,
      team: team ? team._id : null,
      jerseyNumber: isTeamPlayer ? jerseyNumber : null,
      role: isTeamPlayer ? role : undefined
    });

    res.status(201).json({ success: true, data: player });

  } catch (error) {
    console.error('[registerPlayer]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//  Get all players
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find()
      .populate('sport')
      .populate('team');
    res.json({ success: true, data: players });
  } catch (error) {
    console.error('[getAllPlayers]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//  Check team eligibility
exports.checkTeamEligibility = async (req, res) => {
  try {
    const { sportId, teamId, role } = req.query;

    if (!sportId || !teamId || !role) {
      return res.status(400).json({ message: 'sportId, teamId and role are required' });
    }

    if (!['player', 'substitute'].includes(role)) {
      return res.status(400).json({ message: 'Role must be "player" or "substitute"' });
    }

    const result = await checkTeamSlots(sportId, teamId, role);

    if (result.available) {
      res.json({
        available: true,
        message: `Slot available for ${role}. Current: ${result.currentCount}/${result.limit} for ${result.sportName}`
      });
    } else {
      res.json({
        available: false,
        message: `No slots available for ${role}. Current: ${result.currentCount}/${result.limit} for ${result.sportName}`
      });
    }
  } catch (err) {
    console.error('[checkTeamEligibility]', err);
    res.status(500).json({ message: err.message });
  }
};

//  Get all players by sport
exports.getPlayersBySport = async (req, res) => {
  try {
    const sport = await Sport.findOne({ sportId: req.params.sportId });
    if (!sport) {
      return res.status(404).json({ message: 'Sport not found' });
    }

    const players = await Player.find({ sport: sport._id })
      .populate('sport')
      .populate('team');

    res.json({ success: true, count: players.length, data: players });
  } catch (err) {
    console.error('[getPlayersBySport]', err);
    res.status(500).json({ message: err.message });
  }
};

//  Get all players by sport and team
exports.getPlayersBySportAndTeam = async (req, res) => {
  try {
    const { sportId, teamId } = req.params;

    const sport = await Sport.findOne({ sportId });
    if (!sport) return res.status(404).json({ message: 'Sport not found' });

    const team = await Team.findOne({ teamId });
    if (!team) return res.status(404).json({ message: 'Team not found' });

    // Try matching ObjectId
    let players = await Player.find({
      sport: sport._id,
      team: team._id
    }).populate('sport').populate('team');

    // If no matches, fallback to legacy `teamId` string field if exists
    if (players.length === 0) {
      players = await Player.find({
        sport: sport._id,
        $or: [
          { team: team._id },
          { teamId: teamId } // fallback if legacy
        ]
      }).populate('sport').populate('team');
    }

    res.json({ success: true, count: players.length, data: players });
  } catch (err) {
    console.error('[getPlayersBySportAndTeam]', err);
    res.status(500).json({ message: err.message });
  }
};

//  Get one player by sport and team
exports.getPlayerBySportAndTeam = async (req, res) => {
  try {
    const { sportId, teamId, playerId } = req.params;

    const sport = await Sport.findOne({ sportId });
    if (!sport) return res.status(404).json({ message: 'Sport not found' });

    const team = await Team.findOne({ teamId });
    if (!team) return res.status(404).json({ message: 'Team not found' });

    // Try matching ObjectId
    let player = await Player.findOne({
      _id: playerId,
      sport: sport._id,
      team: team._id
    }).populate('sport').populate('team');

    // If not found, fallback
    if (!player) {
      player = await Player.findOne({
        _id: playerId,
        sport: sport._id,
        $or: [
          { team: team._id },
          { teamId: teamId } // fallback legacy
        ]
      }).populate('sport').populate('team');
    }

    if (!player) return res.status(404).json({ message: 'Player not found' });

    res.json({ success: true, data: player });
  } catch (err) {
    console.error('[getPlayerBySportAndTeam]', err);
    res.status(500).json({ message: err.message });
  }
};

