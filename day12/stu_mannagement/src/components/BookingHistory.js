import React from 'react';
import { Card, Space } from 'antd';

function BookingHistory({ bookings }) {
  return (
    <Card title="📋 Active Bookings Log" style={{ maxHeight: '550px', overflowY: 'auto' }}>
      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#bfbfbf', padding: '20px 0' }}>
          No active bookings.
        </div>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          {bookings.map(log => (
            <Card size="small" key={log.id} style={{ borderLeft: '4px solid #1890ff', background: '#fafafa' }}>
              <div style={{ fontWeight: 'bold' }}>{log.bookTitle}</div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                Borrowed by: <strong>{log.studentName}</strong>
              </div>
              <div style={{ fontSize: '10px', color: '#bfbfbf' }}>
                {new Date(log.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </Card>
          ))}
        </Space>
      )}
    </Card>
  );
}

export default BookingHistory;