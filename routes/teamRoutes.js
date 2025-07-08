const express = require('express');
const {
  createTeam,
  getAllTeams,
  getTeamById,
  getTeamByTeamId,
  getTeamsBySportId,
  checkJerseyNumber
} = require('../controllers/teamController');

const router = express.Router();

router.post('/create', createTeam);
router.get('/', getAllTeams);
router.get('/mongo/:id', getTeamById);
router.get('/id/:teamId', getTeamByTeamId);
router.get('/sport/:sportId', getTeamsBySportId);

router.get('/check-jersey', checkJerseyNumber);

module.exports = router;
