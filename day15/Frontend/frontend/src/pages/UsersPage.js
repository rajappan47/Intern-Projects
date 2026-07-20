import React, { useEffect, useState } from 'react';
import { Table, Select, message, Tag } from 'antd';
import API from '../api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (err) {
      message.error('Failed to load users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/users/${userId}/role`, { role: newRole });
      message.success('User role updated successfully');
      fetchUsers();
    } catch (err) {
      message.error('Failed to update user role');
    }
  };

  const columns = [
    { title: 'Username', dataIndex: 'username', key: 'username' },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'Admin' ? 'red' : role === 'Member' ? 'green' : 'blue'}>
          {role}
        </Tag>
      )
    },
    {
      title: 'Update Role',
      key: 'action',
      render: (_, record) => (
        <Select
          value={record.role}
          style={{ width: 130 }}
          onChange={(newRole) => handleRoleChange(record._id, newRole)}
          options={[
            { value: 'Reader', label: 'Reader' },
            { value: 'Member', label: 'Member' },
            { value: 'Admin', label: 'Admin' }
          ]}
        />
      )
    }
  ];

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h2>User Management (Admin Only)</h2>
      <Table dataSource={users} columns={columns} rowKey="_id" />
    </div>
  );
}