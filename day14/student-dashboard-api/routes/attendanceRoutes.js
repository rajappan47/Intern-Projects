const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/', attendanceController.createLog);
router.get('/', attendanceController.getAllLogs);

module.exports = router;