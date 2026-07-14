import React, { useState, useEffect } from 'react';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import AttendanceSummary from './components/AttendanceSummary';

// The URL where your separate Express backend project is running
const API_URL = 'http://localhost:5000/api/students';

function App() {
  const [students, setStudents] = useState([]);

  // Fetch the student list automatically when the dashboard loads
  useEffect(() => {
    fetchStudents();
  }, []);

  // GET: Read data from the backend
  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // POST: Add a new student to db.json
  const addStudent = async (newStudent) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      if (response.ok) {
        fetchStudents(); // Refresh our UI with updated data from backend
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  // DELETE: Remove a student from db.json
  const deleteStudent = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchStudents(); // Refresh UI
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  // PUT: Toggle student status in db.json
  const toggleStatus = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/toggle`, {
        method: 'PUT',
      });
      if (response.ok) {
        fetchStudents(); // Refresh UI
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Student Management Dashboard</h1>
      
      {/* These child components remain structurally unchanged! */}
      <AttendanceSummary students={students} />
      <StudentForm onAddStudent={addStudent} />
      <StudentList 
        students={students} 
        onDelete={deleteStudent} 
        onToggleStatus={toggleStatus} 
      />
    </div>
  );
}

export default App;