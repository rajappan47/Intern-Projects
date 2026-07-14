const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 5000;
const DB_PATH = path.join(__dirname, 'db.json');

// Middleware
app.use(cors()); // Permits React to call this server cross-origin
app.use(express.json()); // Parses incoming JSON request bodies

// Asynchronous DB Helper: Read
async function getStudents() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist yet, return an empty array
    return [];
  }
}

// Asynchronous DB Helper: Write
async function saveStudents(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

/* ==================== API ENDPOINTS ==================== */

// 1. GET ALL STUDENTS
app.get('/api/students', async (req, res) => {
  try {
    const students = await getStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve students from storage.' });
  }
});

// 2. ADD NEW STUDENT
app.post('/api/students', async (req, res) => {
  try {
    const { name, rollNum, dept } = req.body;
    
    if (!name || !rollNum || !dept) {
      return res.status(400).json({ error: 'All fields (name, rollNum, dept) are required.' });
    }

    const students = await getStudents();
    
    const newStudent = {
      id: Date.now(), // Event loop safe unique identifier
      name,
      rollNum,
      dept,
      status: 'Present' // Default status
    };

    students.push(newStudent);
    await saveStudents(students);
    
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to write new student to storage.' });
  }
});

// 3. TOGGLE ATTENDANCE STATUS (Present <-> Absent)
app.put('/api/students/:id/toggle', async (req, res) => {
  try {
    const targetId = parseInt(req.params.id);
    let students = await getStudents();
    
    let updated = false;
    students = students.map(student => {
      if (student.id === targetId) {
        updated = true;
        return { ...student, status: student.status === 'Present' ? 'Absent' : 'Present' };
      }
      return student;
    });

    if (!updated) {
      return res.status(404).json({ error: 'Student record not found.' });
    }

    await saveStudents(students);
    res.json({ message: 'Attendance status successfully toggled.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update attendance status.' });
  }
});

// 4. DELETE A STUDENT
app.delete('/api/students/:id', async (req, res) => {
  try {
    const targetId = parseInt(req.params.id);
    let students = await getStudents();
    
    const originalLength = students.length;
    students = students.filter(student => student.id !== targetId);

    if (students.length === originalLength) {
      return res.status(404).json({ error: 'Student record not found.' });
    }

    await saveStudents(students);
    res.json({ message: 'Student successfully deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete student record.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` Backend API active at: http://localhost:${PORT}`);
  console.log(` Non-blocking filesystem runs via Node Event Loop. `);
  console.log(`===================================================`);
});