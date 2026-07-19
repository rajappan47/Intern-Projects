import React from 'react';

function AttendanceSummary({ stats }) {
  const cardStyle = {
    flex: 1,
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
    backgroundColor: '#f4f4f9',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
      <div style={cardStyle}>
        <h3>Total Logged Students</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>{stats.total || 0}</p>
      </div>
      <div style={{ ...cardStyle, borderLeft: '5px solid #28a745' }}>
        <h3 style={{ color: '#28a745' }}>Present</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>{stats.presentCount || 0}</p>
      </div>
      <div style={{ ...cardStyle, borderLeft: '5px solid #dc3545' }}>
        <h3 style={{ color: '#dc3545' }}>Absent</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>{stats.absentCount || 0}</p>
      </div>
    </div>
  );
}

export default AttendanceSummary;