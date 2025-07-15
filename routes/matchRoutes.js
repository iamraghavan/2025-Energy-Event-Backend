const express = require('express');
const router = express.Router();
const {
  createMatch,
  getAllMatches,
  getMatchById,
  replaceMatch,
  updateMatch,
  deleteMatch,
} = require('../controllers/matchController');


// CRUD
router.get('/', getAllMatches);
router.post('/', createMatch);
router.get('/:id', getMatchById);
router.put('/:id', replaceMatch);   // Full replace
router.patch('/:id', updateMatch);  // Partial update
router.delete('/:id', deleteMatch);


module.exports = router;
