import React from 'react';

function StudentList({ students, onDelete, onToggleStatus, onEditStudent }) {
  if (students.length === 0) {
    return <p style={{ textAlign: 'center', color: '#666' }}>No student records found matching the active workspace views.</p>;
  }

  const thStyle = { padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd' };
  const tdStyle = { padding: '12px', borderBottom: '1px solid #ddd' };

  return (
    <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Roll No.</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Department</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => {
            const studentId = student.id || student._id || index;
            
            return (
              <tr key={studentId}>
                <td style={tdStyle}>{student.rollNum}</td>
                <td style={tdStyle}>{student.name}</td>
                <td style={tdStyle}>{student.dept}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                    backgroundColor: student.status === 'Present' ? '#d4edda' : '#f8d7da',
                    color: student.status === 'Present' ? '#155724' : '#721c24'
                  }}>
                    {student.status || 'Present'}
                  </span>
                </td>
                <td style={tdStyle}>
                  {/* New Edit Row Action Trigger Button */}
                  <button 
                    onClick={() => onEditStudent(student)}
                    style={{ marginRight: '8px', padding: '6px 12px', borderRadius: '4px', border: '1px solid #1890ff', backgroundColor: '#e6f7ff', color: '#1890ff', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onToggleStatus(studentId)}
                    style={{ marginRight: '8px', padding: '6px 12px', borderRadius: '4px', border: '1px solid #6c757d', backgroundColor: '#fff', cursor: 'pointer' }}
                  >
                    Mark {student.status === 'Present' ? 'Absent' : 'Present'}
                  </button>
                  <button 
                    onClick={() => onDelete(studentId)}
                    style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', backgroundColor: '#dc3545', color: '#fff', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;