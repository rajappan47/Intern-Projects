import React, { useState, useEffect } from 'react';
import { Layout, Input, Pagination, message } from 'antd';
import { ReadOutlined } from '@ant-design/icons';

import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import AttendanceSummary from './components/AttendanceSummary';

const { Header, Content, Footer } = Layout;
const { Search } = Input;

const STUDENT_API_URL = 'http://localhost:5000/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, presentCount: 0, absentCount: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // State to hold the student details being edited
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, [currentPage, searchTerm]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${STUDENT_API_URL}?search=${searchTerm}&page=${currentPage}&limit=5`);
      const data = await response.json();
      
      console.log("Frontend received data:", data); // Check your browser console (F12) to see this!

      if (data && Array.isArray(data.students)) {
        setStudents(data.students);
        setTotalRecords(data.pagination?.totalRecords || data.students.length);
      } else if (Array.isArray(data)) {
        setStudents(data);
        setTotalRecords(data.length);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      setStudents([]);
    }
  }; 

  const fetchStats = async () => {
    try {
      const response = await fetch(`${STUDENT_API_URL}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error computing aggregation metrics:', error);
    }
  };

  const addStudent = async (newStudent) => {
    try {
      const response = await fetch(STUDENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      if (response.ok) {
        message.success('Student registered successfully!');
        fetchStudents();
        fetchStats();
      } else {
        const errorData = await response.json();
        message.error(errorData.error || 'Validation failed on save.');
      }
    } catch (error) {
      message.error('Communication error with server.');
    }
  };

  // New Save Handler targeting PUT request logic
  const saveEditedStudent = async (id, updatedFields) => {
    try {
      const response = await fetch(`${STUDENT_API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      if (response.ok) {
        message.success('Student record updated successfully!');
        setEditingStudent(null); // Clear active edit workspace state
        fetchStudents();
        fetchStats();
      } else {
        const errorData = await response.json();
        message.error(errorData.error || 'Update failed validation rules.');
      }
    } catch (error) {
      message.error('Communication error updating student.');
    }
  };

  const deleteStudent = async (id) => {
    try {
      const response = await fetch(`${STUDENT_API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        message.success('Record soft deleted.');
        fetchStudents();
        fetchStats();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(`${STUDENT_API_URL}/${id}/toggle`, { method: 'PUT' });
      if (response.ok) {
        fetchStudents();
        fetchStats();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Header style={{ display: 'flex', alignItems: 'center', background: '#001529', padding: '0 24px' }}>
        <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ReadOutlined style={{ fontSize: '22px' }} /> Student Administration Portal
        </div>
      </Header>

      <Content style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h1 style={{ textAlign: 'center', color: '#1890ff', marginBottom: '25px' }}>Student Management Workspace</h1>
          
          <AttendanceSummary stats={stats} />
          
          <div style={{ marginBottom: '20px', maxWidth: '450px' }}>
            <Search 
              placeholder="Search by name, roll number, or department..." 
              allowClear
              enterButton
              onSearch={(value) => { setSearchTerm(value); setCurrentPage(1); }} 
            />
          </div>

          {/* Form component acts contextually depending on edit state configuration */}
          <StudentForm 
            onAddStudent={addStudent} 
            editingStudent={editingStudent}
            onSaveEdit={saveEditedStudent}
            onCancelEdit={() => setEditingStudent(null)}
          />
          
          <StudentList 
            students={students} 
            onDelete={deleteStudent} 
            onToggleStatus={toggleStatus} 
            onEditStudent={(student) => setEditingStudent(student)} // Connects row data selection to hook
          />

          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <Pagination 
              current={currentPage} 
              pageSize={5} 
              total={totalRecords} 
              onChange={(page) => setCurrentPage(page)} 
              showSizeChanger={false}
            />
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', color: '#a0aec0' }}>School Portal ©2026 Powered by Independent Backend Microservices</Footer>
    </Layout>
  );
}

export default App;