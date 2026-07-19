const AttendanceLog = require('../models/AttendanceLog');
const Student = require('../models/Student');

// 1. POST: Create an Attendance Log for a Student
exports.createLog = async (req, res) => {
  try {
    const { studentId, status, remarks } = req.body;

    // Check if student exists
    const studentExists = await Student.findById(studentId);
    if (!studentExists) {
      return res.status(404).json({ message: 'Student not found to assign attendance to.' });
    }

    const log = new AttendanceLog({
      student: studentId,
      status,
      remarks
    });

    await log.save();
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: 'Error saving log', error: error.message });
  }
};

// 2. GET: Retrieve all logs and POPULATE the linked Student details
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await AttendanceLog.find()
      // "populate" automatically swaps the Student ID with the actual Student Name and Roll Number!
      .populate('student', 'name rollNum dept') 
      .sort({ date: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving logs', error: error.message });
  }
};