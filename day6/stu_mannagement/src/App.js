import React, { useState } from 'react';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import AttendanceSummary from './components/AttendanceSummary';

function App() {
  const [students, setStudents] = useState([
    { id: 1, name: 'Alex Mercer', rollNum: 'CS101', dept: 'Computer Science', status: 'Present' },
    { id: 2, name: 'Jane Doe', rollNum: 'EC102', dept: 'Electronics', status: 'Absent' }
  ]);

  
  const addStudent = (newStudent) => {
    setStudents([...students, { ...newStudent, id: Date.now(), status: 'Present' }]);
  };

  
  const deleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  
  const toggleStatus = (id) => {
    setStudents(students.map(student => 
      student.id === id 
        ? { ...student, status: student.status === 'Present' ? 'Absent' : 'Present' } 
        : student
    ));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Student Management Dashboard</h1>
      
      {/* Attendance Summary Component */}
      <AttendanceSummary students={students} />
      
      {/* Student Form Component */}
      <StudentForm onAddStudent={addStudent} />
      
      {/* Student List Component */}
      <StudentList 
        students={students} 
        onDelete={deleteStudent} 
        onToggleStatus={toggleStatus} 
      />
    </div>
  );
}

export default App;