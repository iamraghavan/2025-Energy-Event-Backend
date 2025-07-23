const Player = require('../models/Player');
const Team = require('../models/Team');

// Add player to team
exports.addPlayer = async (req, res) => {
  try {
    const { name, jerseyNumber, role, teamId } = req.body;

    const team = await Team.findOne({ teamId });
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const existingPlayers = await Player.countDocuments({ team: team._id });
    if (existingPlayers >= 11) {
      return res.status(400).json({ message: 'Cannot exceed 11 players in a cricket team' });
    }

    const player = await Player.create({ name, jerseyNumber, role, team: team._id });
    res.status(201).json({ success: true, data: player });
  } catch (err) {
    console.error('[addPlayer]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get players for a team
exports.getPlayersByTeam = async (req, res) => {
  try {
    const team = await Team.findOne({ teamId: req.params.teamId });
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const players = await Player.find({ team: team._id });
    res.json({ success: true, data: players });
  } catch (err) {
    console.error('[getPlayersByTeam]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update player
exports.updatePlayer = async (req, res) => {
  try {
    const updated = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: 'Player not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('[updatePlayer]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete player
exports.deletePlayer = async (req, res) => {
  try {
    const deleted = await Player.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Player not found' });
    res.json({ success: true, message: 'Player deleted' });
  } catch (err) {
    console.error('[deletePlayer]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
