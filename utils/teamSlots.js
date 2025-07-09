// utils/teamSlots.js
const Player = require('../models/Player');
const Sport = require('../models/Sport');
const Team = require('../models/Team');

// Define your team player limits for each sport
const TEAM_SPORT_LIMITS = {
  Kabaddi: { player: 7, substitute: 5 },
  Volleyball: { player: 6, substitute: 6 },
  Basketball: { player: 5, substitute: 7 },
  Cricket: { player: 11, substitute: 4 },
  Football: { player: 11, substitute: 5 }
};

exports.checkTeamSlots = async (sportId, teamId, role) => {
 
  const sport = await Sport.findOne({ sportId });
  if (!sport) throw new Error('Sport not found');

  const team = await Team.findOne({ teamId });
  if (!team) throw new Error('Team not found');

  const limits = TEAM_SPORT_LIMITS[sport.name];
  if (!limits) throw new Error(`Limits not defined for ${sport.name}`);

  const currentCount = await Player.countDocuments({
    team: team._id,
    role: role
  });

  const limit = limits[role];
  const available = currentCount < limit;

  return { available, currentCount, limit, sportName: sport.name };
};
