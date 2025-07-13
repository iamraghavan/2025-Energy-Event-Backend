const express = require('express');
const {
  createSchool,
  getAllSchools,
  getSchoolById,
  getSchoolBySchoolId,
  patchSchool,
  putSchool,
  deleteSchool
} = require('../controllers/schoolController');

const router = express.Router();

// CRUD Endpoints
router.post('/', createSchool);             
router.get('/', getAllSchools);             
router.get('/mongo/:id', getSchoolById);   
router.get('/id/:schoolId', getSchoolBySchoolId); 
router.patch('/mongo/:id', patchSchool);   
router.put('/mongo/:id', putSchool);        
router.delete('/mongo/:id', deleteSchool);  

module.exports = router;
