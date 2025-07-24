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
  addHighlight,

  updateBallScore 
} = require('../controllers/cricketMatchController');

router.post('/', createCricketMatch);
router.get('/', getAllCricketMatches);
router.get('/:matchId', getCricketMatchById);
router.patch('/:matchId', updateCricketMatch);
router.delete('/:matchId', deleteCricketMatch);

router.patch('/score', updatePlayerScore);
router.get('/details/:matchId', getCricketMatchDetails);
router.post('/:matchId/highlight', addHighlight);

router.post('/:matchId/ball', updateBallScore);

module.exports = router;
