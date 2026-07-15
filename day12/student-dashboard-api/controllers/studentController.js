

const { getStudents, saveStudents } = require('../utils/dbHandler');

// 1. Fetch all students
const getAllStudents = async (req, res) => {
  try {
    const students = await getStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve students.' });
  }
};

// 2. Add a new student
const createStudent = async (req, res) => {
  try {
    const { name, rollNum, dept } = req.body;
    
    if (!name || !rollNum || !dept) {
      return res.status(400).json({ error: 'All fields (name, rollNum, dept) are required.' });
    }

    const students = await getStudents();
    
    const newStudent = {
      id: Date.now(),
      name,
      rollNum,
      dept,
      status: 'Present'
    };

    students.push(newStudent);
    await saveStudents(students);
    
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to write new student.' });
  }
};

// 3. Toggle attendance status
const toggleStudentStatus = async (req, res) => {
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
      return res.status(404).json({ error: 'Student not found.' });
    }

    await saveStudents(students);
    res.json({ message: 'Attendance status updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update attendance status.' });
  }
};

// 4. Delete a student
const deleteStudent = async (req, res) => {
  try {
    const targetId = parseInt(req.params.id);
    let students = await getStudents();
    
    const originalLength = students.length;
    students = students.filter(student => student.id !== targetId);

    if (students.length === originalLength) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    await saveStudents(students);
    res.json({ message: 'Student deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete student.' });
  }
};

module.exports = {
  getAllStudents,
  createStudent,
  toggleStudentStatus,
  deleteStudent
};