const express = require('express');
const {
  createSuperAdmin,
  createLevel2Admin,
  createScorekeeper,
  login
} = require('../controllers/authController');

const apiKeyAuth = require('../middleware/apiKeyAuth'); // reuse your apiKeyAuth

const router = express.Router();

// Public: login
router.post('/login', login);

// Public: create SuperAdmin (one-time)
router.post('/superadmin', createSuperAdmin);

// Requires API key: Level2Admin and Scorekeeper creation
router.post('/lv2admin', apiKeyAuth, createLevel2Admin);
router.post('/scorekeeper', apiKeyAuth, createScorekeeper);

module.exports = router;
