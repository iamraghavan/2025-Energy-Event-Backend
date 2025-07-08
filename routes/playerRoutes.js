const express = require('express');
const { registerPlayer, getAllPlayers } = require('../controllers/playerController');

const { checkJerseyNumber } = require('../controllers/teamController');
const router = express.Router();

router.post('/register', registerPlayer);
router.get('/', getAllPlayers);

router.get('/check-jersey', checkJerseyNumber);

module.exports = router;
