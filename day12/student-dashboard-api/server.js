

const express = require('express');
const cors = require('cors');

// Import controllers
const studentController = require('./controllers/studentController');

const app = express();

// Use PORT from environment variable if available, otherwise default to 5000
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

/* ==================== ROUTES ==================== */

// GET all students
app.get('/api/students', studentController.getAllStudents);

// POST a new student
app.post('/api/students', studentController.createStudent);

// PUT toggle status
app.put('/api/students/:id/toggle', studentController.toggleStudentStatus);

// DELETE a student
app.delete('/api/students/:id', studentController.deleteStudent);

// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` Backend API running on port ${PORT}`);
  console.log(` Clean MVC/Controller architecture initialized!   `);
  console.log(`===================================================`);
});