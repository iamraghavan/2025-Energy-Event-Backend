const KabaddiMatch = require('../models/KabaddiMatch');
const KabaddiMatchPoint = require('../models/KabaddiMatchPoint');
const KabaddiPlayerStats = require('../models/KabaddiPlayerStats');
const Sport = require('../models/Sport');
const Team = require('../models/Team');
const Player = require('../models/Player');

//  Create new Kabaddi match
exports.createKabaddiMatch = async (req, res) => {
  try {
    const { sportId, teamAId, teamBId, court, referee, startTime } = req.body;

    const sport = await Sport.findOne({ sportId });
    if (!sport) return res.status(404).json({ message: 'Sport not found' });

    const teamA = await Team.findOne({ teamId: teamAId });
    if (!teamA) return res.status(404).json({ message: 'Team A not found' });

    const teamB = await Team.findOne({ teamId: teamBId });
    if (!teamB) return res.status(404).json({ message: 'Team B not found' });

    const match = await KabaddiMatch.create({
      sport: sport._id,
      teamA: teamA._id,
      teamB: teamB._id,
      court,
      referee,
      status: 'Scheduled',
      startTime
    });

    res.status(201).json({ success: true, data: match });
  } catch (err) {
    console.error('[createKabaddiMatch]', err);
    res.status(500).json({ message: err.message });
  }
};

//  Get all Kabaddi matches
exports.getAllKabaddiMatches = async (req, res) => {
  try {
    const matches = await KabaddiMatch.find()
      .populate('sport')
      .populate('teamA')
      .populate('teamB');

    res.json({ success: true, count: matches.length, data: matches });
  } catch (err) {
    console.error('[getAllKabaddiMatches]', err);
    res.status(500).json({ message: err.message });
  }
};

//  Get single Kabaddi match
exports.getKabaddiMatch = async (req, res) => {
  try {
    const matchId = req.params.id;

    const match = await KabaddiMatch.findById(matchId)
      .populate('sport')
      .populate('teamA')
      .populate('teamB');

    if (!match) return res.status(404).json({ message: 'Match not found' });

    res.json({ success: true, data: match });
  } catch (err) {
    console.error('[getKabaddiMatch]', err);
    res.status(500).json({ message: err.message });
  }
};

//  Update Kabaddi match
exports.updateKabaddiMatch = async (req, res) => {
  try {
    const matchId = req.params.id;

    const match = await KabaddiMatch.findByIdAndUpdate(matchId, req.body, {
      new: true,
      runValidators: true
    });

    if (!match) return res.status(404).json({ message: 'Match not found' });

    res.json({ success: true, data: match });
  } catch (err) {
    console.error('[updateKabaddiMatch]', err);
    res.status(500).json({ message: err.message });
  }
};

//  Delete Kabaddi match
exports.deleteKabaddiMatch = async (req, res) => {
  try {
    const matchId = req.params.id;

    const match = await KabaddiMatch.findByIdAndDelete(matchId);

    if (!match) return res.status(404).json({ message: 'Match not found' });

    res.json({ success: true, message: 'Match deleted' });
  } catch (err) {
    console.error('[deleteKabaddiMatch]', err);
    res.status(500).json({ message: err.message });
  }
};

//  Add point to Kabaddi match
exports.addKabaddiPoint = async (req, res) => {
  try {
    const { matchId, teamId, playerId, action, points } = req.body;

    const match = await KabaddiMatch.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    const team = await Team.findOne({ teamId });
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ message: 'Player not found' });

    await KabaddiMatchPoint.create({
      match: match._id,
      team: team._id,
      player: player._id,
      action,
      points
    });

    // Update match score
    if (match.teamA.equals(team._id)) {
      match.score.teamA += points;
    } else if (match.teamB.equals(team._id)) {
      match.score.teamB += points;
    }
    await match.save();

    // Update player stats
    let stats = await KabaddiPlayerStats.findOne({ match: match._id, player: player._id });
    if (!stats) {
      stats = await KabaddiPlayerStats.create({
        match: match._id,
        player: player._id
      });
    }

    if (action === 'Raid') stats.totalRaids += 1;
    if (action === 'Tackle') stats.totalTackles += 1;
    stats.totalPoints += points;
    await stats.save();

    // Emit update
    if (req.io) {
      req.io.to(matchId).emit('kabaddiScoreUpdated', { match });
    }

    res.json({ success: true, data: match });
  } catch (err) {
    console.error('[addKabaddiPoint]', err);
    res.status(500).json({ message: err.message });
  }
};

//  Get all points for a match

exports.getKabaddiPointsByMatch = async (req, res) => {
  try {
    const matchId = req.params.matchId;

    // Find all points for this match
    const points = await KabaddiMatchPoint.find({ match: matchId })
      .populate({
        path: 'player',
        select: 'name jerseyNumber gender'
      })
      .populate({
        path: 'team',
        select: 'name teamId'
      })
      .sort({ timestamp: 1 }); // optional: chronological order

    // Transform result for clear output
    const formattedPoints = points.map(point => ({
      playerName: point.player?.name || 'N/A',
      playerId: point.player?._id || null,
      jerseyNumber: point.player?.jerseyNumber || null,
      teamName: point.team?.name || 'N/A',
      teamId: point.team?.teamId || null,
      action: point.action,
      points: point.points,
      timestamp: point.timestamp,
      formattedTime: new Date(point.timestamp).toLocaleTimeString()
    }));

    res.json({
      success: true,
      count: formattedPoints.length,
      data: formattedPoints
    });

  } catch (err) {
    console.error('[getKabaddiPointsByMatch]', err);
    res.status(500).json({ message: err.message });
  }
};


//  Update point
exports.updateKabaddiPoint = async (req, res) => {
  try {
    const point = await KabaddiMatchPoint.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('team').populate('player');

    if (!point) return res.status(404).json({ message: 'Point not found' });

    res.json({ success: true, data: point });
  } catch (err) {
    console.error('[updateKabaddiPoint]', err);
    res.status(500).json({ message: err.message });
  }
};

//  Delete point
exports.deleteKabaddiPoint = async (req, res) => {
  try {
    const point = await KabaddiMatchPoint.findByIdAndDelete(req.params.id);
    if (!point) return res.status(404).json({ message: 'Point not found' });

    res.json({ success: true, message: 'Point deleted' });
  } catch (err) {
    console.error('[deleteKabaddiPoint]', err);
    res.status(500).json({ message: err.message });
  }
};

exports.removeLastKabaddiPoint = async (req, res) => {
  try {
    const { matchId } = req.query;

    if (!matchId) {
      return res.status(400).json({ message: 'matchId is required' });
    }

    // 1️⃣ Find the latest point for this match
    const lastPoint = await KabaddiMatchPoint.findOne({ match: matchId }).sort({ timestamp: -1 });

    if (!lastPoint) {
      return res.status(404).json({ message: 'No points to remove' });
    }

    // 2️⃣ Find the match
    const match = await KabaddiMatch.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // 3️⃣ Deduct the points from the correct team
    if (match.teamA.equals(lastPoint.team)) {
      match.score.teamA -= lastPoint.points;
      if (match.score.teamA < 0) match.score.teamA = 0;
    } else if (match.teamB.equals(lastPoint.team)) {
      match.score.teamB -= lastPoint.points;
      if (match.score.teamB < 0) match.score.teamB = 0;
    }

    await match.save();

    // 4️⃣ Deduct from player stats too
    const stats = await KabaddiPlayerStats.findOne({
      match: matchId,
      player: lastPoint.player
    });

    if (stats) {
      if (lastPoint.action === 'Raid') stats.totalRaids -= 1;
      if (lastPoint.action === 'Tackle') stats.totalTackles -= 1;
      stats.totalPoints -= lastPoint.points;

      if (stats.totalRaids < 0) stats.totalRaids = 0;
      if (stats.totalTackles < 0) stats.totalTackles = 0;
      if (stats.totalPoints < 0) stats.totalPoints = 0;

      await stats.save();
    }

    // 5️⃣ Remove the point record
    await KabaddiMatchPoint.findByIdAndDelete(lastPoint._id);

    // 6️⃣ Emit update via socket
    if (req.io) {
      req.io.to(matchId).emit('kabaddiScoreUpdated', { match });
    }

    res.json({
      success: true,
      message: 'Last point removed successfully',
      data: match
    });

  } catch (err) {
    console.error('[removeLastKabaddiPoint]', err);
    res.status(500).json({ message: err.message });
  }
};




//  Get player stats for a match
exports.getPlayerStatsByMatchAndPlayer = async (req, res) => {
  try {
    const stats = await KabaddiPlayerStats.findOne({
      match: req.params.matchId,
      player: req.params.playerId
    }).populate('player').populate('match');

    if (!stats) return res.status(404).json({ message: 'Stats not found' });

    res.json({ success: true, data: stats });
  } catch (err) {
    console.error('[getPlayerStatsByMatchAndPlayer]', err);
    res.status(500).json({ message: err.message });
  }
};
