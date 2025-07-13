const express = require('express');
const {
  createSchool,
  getAllSchools,
  getSchoolById,
  getSchoolBySchoolId
} = require('../controllers/schoolController');

const router = express.Router();

router.post('/create', createSchool);
router.get('/', getAllSchools);
router.get('/mongo/:id', getSchoolById);
router.get('/id/:schoolId', getSchoolBySchoolId);

module.exports = router;
