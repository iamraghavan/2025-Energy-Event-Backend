const express = require('express');
const { createSchool, getAllSchools } = require('../controllers/schoolController');
const router = express.Router();

router.post('/create', createSchool);
router.get('/', getAllSchools);

module.exports = router;
