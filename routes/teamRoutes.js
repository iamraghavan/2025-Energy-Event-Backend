const express = require('express');
const router = express.Router();
const {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  headTeam,
} = require('../controllers/teamController');

router.get('/', getAllTeams);
router.post('/', createTeam);
router.get('/:id', getTeamById);
router.put('/:id', updateTeam);   // Full replace
router.patch('/:id', updateTeam); // Partial update
router.delete('/:id', deleteTeam);
router.head('/:id', headTeam);


module.exports = router;
