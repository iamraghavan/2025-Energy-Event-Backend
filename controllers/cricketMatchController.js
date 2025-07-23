exports.updatePlayerScore = async (req, res) => {
  try {
    const {
      matchId,
      playerId,
      team,
      runs,
      wickets,
      ballsFaced,
      oversBowled,
      extraBalls = 0 // default to 0 if not passed
    } = req.body;

    if (!['A', 'B'].includes(team)) {
      return res.status(400).json({ message: 'Team must be A or B' });
    }

    const match = await CricketMatch.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    const playerArray = team === 'A' ? match.playersA : match.playersB;
    const score = playerArray.find(p => p.player.toString() === playerId);
    if (!score) return res.status(404).json({ message: 'Player not found in this match' });

    // 🔍 Capture delta (before update)
    const delta = {
      runs: (runs ?? score.runs) - score.runs,
      wickets: (wickets ?? score.wickets) - score.wickets
    };

    // ✅ Update all fields if present
    if (runs != null) score.runs = runs;
    if (wickets != null) score.wickets = wickets;
    if (ballsFaced != null) score.ballsFaced = ballsFaced;
    if (oversBowled != null) score.oversBowled = oversBowled;
    score.extraBalls = extraBalls;

    // 📊 Derived stats
    const strikeRate = (score.ballsFaced > 0)
      ? ((score.runs / score.ballsFaced) * 100).toFixed(2)
      : '0.00';

    const economyRate = (score.oversBowled > 0)
      ? (score.runs / score.oversBowled).toFixed(2)
      : '0.00';

    // 🧮 Team totals (legal balls only)
    const totalRuns = playerArray.reduce((sum, p) => sum + (p.runs || 0), 0);
    const totalWickets = playerArray.reduce((sum, p) => sum + (p.wickets || 0), 0);
    const ballsUsed = playerArray.reduce((sum, p) => sum + (p.ballsFaced || 0), 0);
    const extraBallsUsed = playerArray.reduce((sum, p) => sum + (p.extraBalls || 0), 0);

    const totalBalls = match.overs * 6;
    const ballsLeft = totalBalls - ballsUsed;

    await match.save();

    // 📡 Emit socket update
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
        teamStats: {
          totalRuns,
          totalWickets,
          ballsUsed,
          extraBallsUsed,
          ballsLeft
        },
        delta
      }
    });

  } catch (err) {
    console.error('[updatePlayerScore]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getCricketMatchDetails = async (req, res) => {
  try {
    const match = await CricketMatch.findById(req.params.matchId)
      .populate('winningTeam', 'teamId name')
      .populate('playersA.player', 'name jerseyNumber role')
      .populate('playersB.player', 'name jerseyNumber role');

    if (!match) return res.status(404).json({ message: 'Match not found' });

    const teamDocs = await Team.find({
      _id: { $in: [match.teamA, match.teamB] }
    }).select('teamId name gender sport school');

    const computeStats = (players) => {
      const totalRuns = players.reduce((sum, p) => sum + (p.runs || 0), 0);
      const totalWickets = players.reduce((sum, p) => sum + (p.wickets || 0), 0);
      const balls = players.reduce((sum, p) => sum + (p.ballsFaced || 0), 0);
      const extras = players.reduce((sum, p) => sum + (p.extraBalls || 0), 0);
      const oversUsed = (balls / 6).toFixed(1);
      return { totalRuns, totalWickets, oversUsed, extras };
    };

    const teamsData = [];

    for (const teamDoc of teamDocs) {
      const isTeamA = teamDoc._id.equals(match.teamA);
      const players = isTeamA ? match.playersA : match.playersB;
      const stats = computeStats(players);

      teamsData.push({
        team: teamDoc,
        stats,
        players
      });
    }

    res.json({
      success: true,
      match: {
        _id: match._id,
        overs: match.overs,
        isComplete: match.isComplete,
        winningTeam: match.winningTeam || null,
        teams: teamsData
      }
    });

  } catch (err) {
    console.error('[getCricketMatchDetails]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};