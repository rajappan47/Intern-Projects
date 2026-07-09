import React from 'react';
import { Typography, Descriptions, Avatar, Card, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from './AuthContext';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: 600 }}>
      <Typography.Title level={3}>User Profile</Typography.Title>
      <Divider />
      
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <Avatar size={64} icon={<UserOutlined />} />
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>System Administrator</Typography.Title>
            <Typography.Text type="secondary">Role: Engineering Lead</Typography.Text>
          </div>
        </div>

        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Email Account">{user?.email}</Descriptions.Item>
          <Descriptions.Item label="Account Status">Active Session</Descriptions.Item>
          <Descriptions.Item label="Storage Token">Mock Local Storage </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};