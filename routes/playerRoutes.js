const express = require('express');
const {
  registerPlayer,
  getAllPlayers,
  checkTeamEligibility,
  getPlayersBySport,
  getPlayersBySportAndTeam,
  getPlayerBySportAndTeam
} = require('../controllers/playerController');

const { checkJerseyNumber } = require('../controllers/teamController');

const router = express.Router();

router.post('/register', registerPlayer);
router.get('/', getAllPlayers);

router.get('/check-jersey', checkJerseyNumber);
router.get('/check-eligibility', checkTeamEligibility);

router.get('/sport/:sportId', getPlayersBySport);
router.get('/sport/:sportId/team/:teamId', getPlayersBySportAndTeam);
router.get('/sport/:sportId/team/:teamId/player/:playerId', getPlayerBySportAndTeam);

module.exports = router;
