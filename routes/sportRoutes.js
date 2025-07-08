const express = require('express');
const {
  getAllSports,
  getSportById,
  getSportBySportId
} = require('../controllers/sportController');

const router = express.Router();

// Get all sports
router.get('/', getAllSports);

// Get sport by Mongo _id
router.get('/mongo/:id', getSportById);

// Get sport by custom sportId
router.get('/id/:sportId', getSportBySportId);

module.exports = router;
