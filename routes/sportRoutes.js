const express = require('express');
const {
  getAllSports,
  getSportById,
  getSportBySportId,
  updateSportDetails
} = require('../controllers/sportController');

const router = express.Router();

router.get('/', getAllSports);
router.get('/mongo/:id', getSportById);
router.get('/id/:sportId', getSportBySportId);
router.patch('/mongo/:id', updateSportDetails); // For updating details

module.exports = router;
