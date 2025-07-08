const express = require('express');
const { createSuperAdmin } = require('../controllers/authController');

const router = express.Router();

router.post('/superadmin', createSuperAdmin);

module.exports = router;
