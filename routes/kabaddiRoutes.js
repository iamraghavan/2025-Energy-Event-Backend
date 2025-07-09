const express = require('express');
const {
  createKabaddiMatch,
  getKabaddiMatch,
  getAllKabaddiMatches,
  updateKabaddiMatch,
  deleteKabaddiMatch,

  addKabaddiPoint,
  getKabaddiPointsByMatch,
  updateKabaddiPoint,
  deleteKabaddiPoint,

  removeLastKabaddiPoint,
  
  getPlayerStatsByMatchAndPlayer
} = require('../controllers/kabaddiController');

const router = express.Router();

//  Kabaddi Matches
router.post('/matches', createKabaddiMatch);
router.get('/matches', getAllKabaddiMatches);
router.get('/matches/:id', getKabaddiMatch);
router.patch('/matches/:id', updateKabaddiMatch);
router.delete('/matches/:id', deleteKabaddiMatch);

//  Kabaddi Points
router.post('/points', addKabaddiPoint);
router.get('/points/match/:matchId', getKabaddiPointsByMatch);
router.patch('/points/:id', updateKabaddiPoint);
router.delete('/points/:id', deleteKabaddiPoint);

router.delete('/remove-last-point', removeLastKabaddiPoint);

//  Player Stats (read only, calculated)
router.get('/stats/:matchId/player/:playerId', getPlayerStatsByMatchAndPlayer);

module.exports = router;
