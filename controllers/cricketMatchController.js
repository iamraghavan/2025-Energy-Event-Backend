    const CricketMatch = require('../models/CricketMatch');
    const Player = require('../models/Player');
    const Team = require('../models/Team');

    // CREATE match + emit
    exports.createCricketMatch = async (req, res) => {
      try {
        const { teamAId, teamBId, overs, fixtureName, captains, wicketKeepers, tossWinner, tossDecision } = req.body;

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
          fixtureName,
          tossWinner,
          tossDecision,
          firstInningsTeam: tossDecision === 'bat' ? tossWinner : (tossWinner.toString() === teamA._id.toString() ? teamB._id : teamA._id),
          secondInningsTeam: tossDecision === 'bat' ? (tossWinner.toString() === teamA._id.toString() ? teamB._id : teamA._id) : tossWinner
        });

        req.app.get('io').emit('matchCreated', match);
        res.status(201).json({ success: true, data: match });
      } catch (err) {
        console.error('[createCricketMatch]', err);
        res.status(500).json({ message: 'Internal server error' });
      }
    };

    // GET ALL MATCHES
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

    // GET ONE MATCH
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

    // UPDATE MATCH
    exports.updateCricketMatch = async (req, res) => {
      try {
        const updated = await CricketMatch.findByIdAndUpdate(req.params.matchId, req.body, { new: true, runValidators: true });
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

    // ADD HIGHLIGHT
    exports.addHighlight = async (req, res) => {
      try {
        const { matchId } = req.params;
        const highlight = req.body;
        const match = await CricketMatch.findById(matchId);
        if (!match) return res.status(404).json({ message: 'Match not found' });

        match.highlights.push(highlight);
        await match.save();

        req.app.get('io').emit('highlightAdded', { matchId, highlight });
        res.status(201).json({ success: true, data: highlight });
      } catch (err) {
        console.error('[addHighlight]', err);
        res.status(500).json({ message: 'Internal server error' });
      }
    };

    // UPDATE PLAYER SCORE
    exports.updatePlayerScore = async (req, res) => {
      try {
        const { matchId, playerId, team, runs, wickets, ballsFaced, oversBowled, extraBalls = 0 } = req.body;
        if (!['A', 'B'].includes(team)) return res.status(400).json({ message: 'Invalid team indicator' });

        const match = await CricketMatch.findById(matchId);
        if (!match) return res.status(404).json({ message: 'Match not found' });

        const playerArray = team === 'A' ? match.playersA : match.playersB;
        const score = playerArray.find(p => p.player.toString() === playerId);
        if (!score) return res.status(404).json({ message: 'Player not found' });

        const delta = {
          runs: (runs ?? score.runs) - score.runs,
          wickets: (wickets ?? score.wickets) - score.wickets
        };

        if (runs != null) score.runs = runs;
        if (wickets != null) score.wickets = wickets;
        if (ballsFaced != null) score.ballsFaced = ballsFaced;
        if (oversBowled != null) score.oversBowled = oversBowled;
        score.extraBalls = extraBalls;

        const strikeRate = (score.ballsFaced > 0) ? ((score.runs / score.ballsFaced) * 100).toFixed(2) : '0.00';
        const economyRate = (score.oversBowled > 0) ? (score.runs / score.oversBowled).toFixed(2) : '0.00';

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
          updatedScore: { ...score.toObject(), strikeRate, economyRate },
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

    // GET FULL DETAILS
    exports.getCricketMatchDetails = async (req, res) => {
      try {
        const match = await CricketMatch.findById(req.params.matchId)
          .populate('teamA teamB winningTeam tossWinner firstInningsTeam secondInningsTeam', 'teamId name')
          .populate('playersA.player playersB.player', 'name jerseyNumber role');

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
            ...match.toObject(),
            stats: {
              teamA: statsA,
              teamB: statsB,
              currentRunRate: (statsA.totalRuns / (statsA.oversUsed || 1)).toFixed(2),
              requiredRunRate: match.target ? ((match.target - statsB.totalRuns) / (match.overs - statsB.oversUsed)).toFixed(2) : null
            }
          }
        });
      } catch (err) {
        console.error('[getCricketMatchDetails]', err);
        res.status(500).json({ message: 'Internal server error' });
      }
    };


exports.updateBallScore = async (req, res) => {
  try {
    const { matchId } = req.params;
    const {
      over,
      ball,
      batsman,
      bowler,
      run = 0,
      isFour = false,
      isSix = false,
      isWicket = false,
      wicketType = null,
      fielder = null,
      shotDirection = null,
      extraType = null,
      commentary = ''
    } = req.body;

    const match = await CricketMatch.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    // Create new highlight
    const highlight = {
      over,
      ball,
      batsman,
      bowler,
      run,
      isFour,
      isSix,
      isWicket,
      wicketType,
      fielder,
      shotDirection,
      extraType,
      commentary
    };

    match.highlights.push(highlight);

    // Find player records
    const batsmanScore = [...match.playersA, ...match.playersB].find(p => p.player.toString() === batsman);
    const bowlerScore = [...match.playersA, ...match.playersB].find(p => p.player.toString() === bowler);
    if (!batsmanScore || !bowlerScore) return res.status(404).json({ message: 'Player stats not found' });

    // Update batter stats
    const isLegal = !['wide', 'no ball'].includes(extraType);
    const isExtra = extraType !== null;

    if (!isExtra || extraType === 'no ball') {
      batsmanScore.runs += run;
      batsmanScore.ballsFaced += isLegal ? 1 : 0;
      if (isFour) batsmanScore.fours += 1;
      if (isSix) batsmanScore.sixes += 1;
    }

    batsmanScore.strikeRate = batsmanScore.ballsFaced
      ? ((batsmanScore.runs / batsmanScore.ballsFaced) * 100).toFixed(2)
      : 0;

    // Update bowler stats
    if (!['wide', 'no ball'].includes(extraType)) {
      bowlerScore.oversBowled += 1 / 6;
    } else {
      bowlerScore.extraBalls += 1;
    }

    if (isWicket) bowlerScore.wickets += 1;

    if (!['bye', 'leg bye'].includes(extraType)) {
      bowlerScore.runsConceded += run;
    }

    const ballsBowled = Math.floor(bowlerScore.oversBowled * 6);
    bowlerScore.economyRate = ballsBowled
      ? (bowlerScore.runsConceded / (ballsBowled / 6)).toFixed(2)
      : '0.00';

    // Update per-over summary
    let overSummary = match.oversSummary.find(o => o.over === over && o.bowler.toString() === bowler);
    if (!overSummary) {
      overSummary = {
        over,
        bowler,
        balls: [],
        runsInOver: 0,
        wicketsInOver: 0,
        isMaiden: false
      };
      match.oversSummary.push(overSummary);
    }

    overSummary.balls.push(highlight);
    overSummary.runsInOver += run;
    if (isWicket) overSummary.wicketsInOver += 1;

    if (overSummary.balls.length === 6 && overSummary.runsInOver === 0) {
      overSummary.isMaiden = true;
      bowlerScore.maidens += 1;
    }

    // Update current game state
    match.striker = batsman;
    match.currentBowler = bowler;

    await match.save();

    // Emit to frontend
    req.app.get('io').emit('ballScored', {
      matchId,
      highlight,
      striker: match.striker,
      nonStriker: match.nonStriker,
      currentBowler: match.currentBowler,
      batterStats: batsmanScore,
      bowlerStats: bowlerScore,
      overSummary
    });

    res.status(200).json({
      success: true,
      message: 'Ball recorded and score updated',
      data: {
        highlight,
        striker: match.striker,
        bowlerStats: bowlerScore,
        batterStats: batsmanScore
      }
    });
  } catch (err) {
    console.error('[updateBallScore]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
