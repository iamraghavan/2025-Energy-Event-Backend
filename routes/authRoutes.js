const express = require('express');
const {
  createSuperAdmin,
  createLevel2Admin,
  createScorekeeper,
  login,
  getAllUsers,
} = require('../controllers/authController');

const apiKeyAuth = require('../middleware/apiKeyAuth');

const router = express.Router();



// Public routes
router.post('/login', login);
router.post('/superadmin', apiKeyAuth, createSuperAdmin);
router.get('/users', apiKeyAuth, getAllUsers);
// Protected routes (must send valid SuperAdmin or Level2Admin API key)
router.post('/lv2admin', apiKeyAuth, createLevel2Admin);
router.post('/scorekeeper', apiKeyAuth, createScorekeeper);

module.exports = router;
