import React, { useState, useEffect } from 'react';
import { Layout, Menu, message } from 'antd';
import { UserOutlined, BookOutlined, ReadOutlined } from '@ant-design/icons';

// STUDENT COMPONENTS (Kept separate!)
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import AttendanceSummary from './components/AttendanceSummary';

// LIBRARY COMPONENTS (Kept separate!)
import BookCatalog from './components/BookCatalog';
import BookingHistory from './components/BookingHistory';
import BookingForm from './components/BookingForm';

const { Header, Content, Footer } = Layout;

const STUDENT_API_URL = 'http://localhost:5000/api/students';
const LIBRARY_API_URL = 'http://localhost:5001/api';

function App() {
  const [currentTab, setCurrentTab] = useState('students');
  
  // States
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchLibraryData();
  }, []);

  // ==================== FETCH API CALLS ====================
  const fetchStudents = async () => {
    try {
      const response = await fetch(STUDENT_API_URL);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchLibraryData = async () => {
    try {
      const [booksRes, bookingsRes] = await Promise.all([
        fetch(`${LIBRARY_API_URL}/books`),
        fetch(`${LIBRARY_API_URL}/bookings`)
      ]);
      if (booksRes.ok && bookingsRes.ok) {
        setBooks(await booksRes.json());
        setBookings(await bookingsRes.json());
      }
    } catch (error) {
      console.error('Error fetching library data:', error);
    }
  };

  // ==================== ACTIONS ====================
  const handleBorrowBook = async (studentName) => {
    try {
      const response = await fetch(`${LIBRARY_API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: selectedBook.id, studentName })
      });
      const data = await response.json();

      if (!response.ok) {
        message.error(data.error || 'Failed to borrow book');
        return;
      }

      message.success(`Successfully checked out: "${selectedBook.title}"`);
      setIsBorrowModalOpen(false);
      fetchLibraryData(); // Refresh Library data dynamically!
    } catch (error) {
      message.error('Failed to communicate with Library Server');
    }
  };

  // Student action hooks
  const addStudent = async (newStudent) => {
    try {
      const response = await fetch(STUDENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      if (response.ok) fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      const response = await fetch(`${STUDENT_API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(`${STUDENT_API_URL}/${id}/toggle`, { method: 'PUT' });
      if (response.ok) fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      
      {/* Top Main Navigation Bar */}
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#001529', padding: '0 24px' }}>
        <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ReadOutlined style={{ fontSize: '22px' }} /> Administration Dashboard
        </div>
        
        <Menu 
          theme="dark" 
          mode="horizontal" 
          selectedKeys={[currentTab]} 
          onClick={(e) => setCurrentTab(e.key)}
          style={{ minWidth: '300px', justifyContent: 'end' }}
          items={[
            { key: 'students', icon: <UserOutlined />, label: 'Students' },
            { key: 'library', icon: <BookOutlined />, label: 'Library' }
          ]}
        />
      </Header>

      {/* Main Workspace Body */}
      <Content style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* ==================== 1. STUDENT VIEW ==================== */}
        {currentTab === 'students' && (
          <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h1 style={{ textAlign: 'center', color: '#1890ff', margin: '0 0 20px 0' }}>Student Management Dashboard</h1>
            
            <AttendanceSummary students={students} />
            <div style={{ margin: '30px 0' }}>
              <StudentForm onAddStudent={addStudent} />
            </div>
            <StudentList 
              students={students} 
              onDelete={deleteStudent} 
              onToggleStatus={toggleStatus} 
            />
          </div>
        )}

        {/* ==================== 2. LIBRARY VIEW ==================== */}
        {currentTab === 'library' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
            
            {/* Modular Catalog */}
            <BookCatalog 
              books={books} 
              onOpenBorrowModal={(book) => {
                setSelectedBook(book);
                setIsBorrowModalOpen(true);
              }} 
            />

            {/* Modular Ledger/History */}
            <BookingHistory bookings={bookings} />
          </div>
        )}

      </Content>

      <Footer style={{ textAlign: 'center', color: '#a0aec0' }}>
        School Portal ©2026 Powered by Independent Backend Microservices
      </Footer>

      {/* Modular Pop-up Form */}
      <BookingForm 
        isOpen={isBorrowModalOpen}
        selectedBook={selectedBook}
        onClose={() => setIsBorrowModalOpen(false)}
        onConfirm={handleBorrowBook}
      />

    </Layout>
  );
}

export default App;