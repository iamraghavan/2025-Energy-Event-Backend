const express = require('express');
const router = express.Router();
const { getLayout, updateLayout } = require('../controllers/layoutController');

router.get('/', getLayout);         // GET /api/layout
router.patch('/', updateLayout);    // PATCH /api/layout
router.post('/', updateLayout);     // POST /api/layout

module.exports = router;
