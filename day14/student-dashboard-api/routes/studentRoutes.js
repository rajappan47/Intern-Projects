const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.getAllStudents);
router.get('/stats', studentController.getStudentStats);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent); // New Edit Action Routing
router.put('/:id/toggle', studentController.toggleStudentStatus);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;