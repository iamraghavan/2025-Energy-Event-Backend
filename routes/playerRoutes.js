const express = require('express');
const router = express.Router();
const {
  addPlayer,
  getPlayersByTeam,
  updatePlayer,
  deletePlayer
} = require('../controllers/playerController');

router.post('/', addPlayer);
router.get('/team/:teamId', getPlayersByTeam);
router.patch('/:id', updatePlayer);
router.delete('/:id', deletePlayer);

module.exports = router;
