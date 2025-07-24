const CricketMatch = require('../models/CricketMatch');
const Player = require('../models/Player');
const Team = require('../models/Team');

// CREATE match + emit
exports.createCricketMatch = async (req, res) => {
  try {
    const { teamAId, teamBId, overs, fixtureName, captains, wicketKeepers } = req.body;

    const teamA = await Team.findOne({ teamId: teamAId });
    const teamB = await Team.findOne({ teamId: teamBId });
    if (!teamA || !teamB) return res.status(404).json({ message: 'Invalid team(s)' });

    const playersA = await Player.find({ team: teamA._id });
    const playersB = await Player.find({ team: teamB._id });

    const playersWithMeta = (players, captainId, keeperId) =>
      players.map(p => ({
        player: p._id,
        isCaptain: p._id.toString() === captainId,
        isWicketKeeper: p._id.toString() === keeperId
      }));

    const match = await CricketMatch.create({
      teamA: teamA._id,
      teamB: teamB._id,
      playersA: playersWithMeta(playersA, captains.teamA, wicketKeepers.teamA),
      playersB: playersWithMeta(playersB, captains.teamB, wicketKeepers.teamB),
      overs,
      fixtureName
    });

    req.app.get('io').emit('matchCreated', match);
    res.status(201).json({ success: true, data: match });
  } catch (err) {
    console.error('[createCricketMatch]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// READ ALL
exports.getAllCricketMatches = async (req, res) => {
  try {
    const matches = await CricketMatch.find()
      .populate('teamA', 'teamId name')
      .populate('teamB', 'teamId name')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: matches });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// READ ONE
exports.getCricketMatchById = async (req, res) => {
  try {
    const match = await CricketMatch.findById(req.params.matchId)
      .populate('teamA', 'teamId name')
      .populate('teamB', 'teamId name');

    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.json({ success: true, data: match });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE MATCH (PATCH)
exports.updateCricketMatch = async (req, res) => {
  try {
    const updated = await CricketMatch.findByIdAndUpdate(
      req.params.matchId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Match not found' });

    req.app.get('io').emit('matchUpdated', updated);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE MATCH
exports.deleteCricketMatch = async (req, res) => {
  try {
    const deleted = await CricketMatch.findByIdAndDelete(req.params.matchId);
    if (!deleted) return res.status(404).json({ message: 'Match not found' });

    req.app.get('io').emit('matchDeleted', { matchId: req.params.matchId });
    res.json({ success: true, message: 'Match deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PATCH SCORE
exports.updatePlayerScore = async (req, res) => {
  try {
    const {
      matchId, playerId, team, runs, wickets, ballsFaced, oversBowled, extraBalls = 0
    } = req.body;

    if (!['A', 'B'].includes(team))
      return res.status(400).json({ message: 'Team must be A or B' });

    const match = await CricketMatch.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    const playerArray = team === 'A' ? match.playersA : match.playersB;
    const score = playerArray.find(p => p.player.toString() === playerId);
    if (!score) return res.status(404).json({ message: 'Player not in match' });

    const delta = {
      runs: (runs ?? score.runs) - score.runs,
      wickets: (wickets ?? score.wickets) - score.wickets
    };

    if (runs != null) score.runs = runs;
    if (wickets != null) score.wickets = wickets;
    if (ballsFaced != null) score.ballsFaced = ballsFaced;
    if (oversBowled != null) score.oversBowled = oversBowled;
    score.extraBalls = extraBalls;

    const strikeRate = (score.ballsFaced > 0)
      ? ((score.runs / score.ballsFaced) * 100).toFixed(2)
      : '0.00';

    const economyRate = (score.oversBowled > 0)
      ? (score.runs / score.oversBowled).toFixed(2)
      : '0.00';

    const totalRuns = playerArray.reduce((sum, p) => sum + (p.runs || 0), 0);
    const totalWickets = playerArray.reduce((sum, p) => sum + (p.wickets || 0), 0);
    const ballsUsed = playerArray.reduce((sum, p) => sum + (p.ballsFaced || 0), 0);
    const extraBallsUsed = playerArray.reduce((sum, p) => sum + (p.extraBalls || 0), 0);

    const totalBalls = match.overs * 6;
    const ballsLeft = totalBalls - ballsUsed;

    await match.save();

    req.app.get('io').emit('matchScoreUpdate', {
      matchId,
      playerId,
      team,
      updatedScore: {
        ...score.toObject(),
        strikeRate,
        economyRate
      },
      delta,
      teamStats: {
        totalRuns,
        totalWickets,
        ballsUsed,
        extraBallsUsed,
        ballsLeft,
        oversUsed: (ballsUsed / 6).toFixed(1),
        isInningsComplete: ballsLeft <= 0
      }
    });

    res.json({
      success: true,
      message: 'Player score updated',
      data: {
        updated: score,
        strikeRate,
        economyRate,
        delta
      }
    });
  } catch (err) {
    console.error('[updatePlayerScore]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET FULL MATCH STATS
exports.getCricketMatchDetails = async (req, res) => {
  try {
    const match = await CricketMatch.findById(req.params.matchId)
      .populate('teamA', 'teamId name')
      .populate('teamB', 'teamId name')
      .populate('winningTeam', 'teamId name')
      .populate('playersA.player', 'name jerseyNumber role')
      .populate('playersB.player', 'name jerseyNumber role');

    if (!match) return res.status(404).json({ message: 'Match not found' });

    const computeStats = (players) => {
      const totalRuns = players.reduce((sum, p) => sum + (p.runs || 0), 0);
      const totalWickets = players.reduce((sum, p) => sum + (p.wickets || 0), 0);
      const balls = players.reduce((sum, p) => sum + (p.ballsFaced || 0), 0);
      const extras = players.reduce((sum, p) => sum + (p.extraBalls || 0), 0);
      const oversUsed = (balls / 6).toFixed(1);
      return { totalRuns, totalWickets, oversUsed, extras };
    };

    const statsA = computeStats(match.playersA);
    const statsB = computeStats(match.playersB);

    res.json({
      success: true,
      match: {
        _id: match._id,
        overs: match.overs,
        fixtureName: match.fixtureName,
        isComplete: match.isComplete,
        teamA: match.teamA,
        teamB: match.teamB,
        winningTeam: match.winningTeam || null,
        stats: {
          teamA: statsA,
          teamB: statsB
        },
        playersA: match.playersA,
        playersB: match.playersB
      }
    });
  } catch (err) {
    console.error('[getCricketMatchDetails]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
