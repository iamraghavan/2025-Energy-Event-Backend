const express = require('express');
const router = express.Router();
const {
  addPlayer,
  getPlayersByTeam,
  updatePlayer,
  deletePlayer,
  bulkUploadPlayers
} = require('../controllers/playerController');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/bulk-upload/:teamId', upload.single('file'), bulkUploadPlayers);

router.post('/', addPlayer);
router.get('/team/:teamId', getPlayersByTeam);
router.patch('/:id', updatePlayer);
router.delete('/:id', deletePlayer);

module.exports = router;
