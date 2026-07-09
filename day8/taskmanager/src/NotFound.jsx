import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link to="/dashboard/tasks">
            <Button type="primary">Back to Dashboard</Button>
          </Link>
        }
      />
    </div>
  );
};