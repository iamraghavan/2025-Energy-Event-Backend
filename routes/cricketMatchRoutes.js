const express = require('express');
const router = express.Router();
const {
  createCricketMatch,
  getAllCricketMatches,
  getCricketMatchById,
  updateCricketMatch,
  deleteCricketMatch,
  updatePlayerScore,
  getCricketMatchDetails,
  addHighlight
} = require('../controllers/cricketMatchController');

router.post('/:matchId/highlight', addHighlight);
router.post('/', createCricketMatch);
router.get('/', getAllCricketMatches);
router.get('/:matchId', getCricketMatchById);
router.patch('/:matchId', updateCricketMatch);
router.delete('/:matchId', deleteCricketMatch);

router.patch('/score', updatePlayerScore);
router.get('/details/:matchId', getCricketMatchDetails);

module.exports = router;
