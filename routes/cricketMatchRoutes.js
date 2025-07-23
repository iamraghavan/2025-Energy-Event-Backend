const express = require('express');
const router = express.Router();
const {
  updatePlayerScore,
  getCricketMatchDetails
} = require('../controllers/cricketMatchController');

router.patch('/score', updatePlayerScore);
router.get('/:matchId', getCricketMatchDetails); // GET /api/matches/:matchId

module.exports = router;
