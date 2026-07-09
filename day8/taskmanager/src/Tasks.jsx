import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, List, Tag, Typography, Divider, Alert, message, Card, Space } from 'antd';
import { PlusOutlined, ClockCircleOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { useAuth } from './AuthContext'; // Import useAuth hook
import { mockAddTaskApi, fetchTasksApi, updateTaskStatusApi } from './mockApi';

const { Title } = Typography;

export const Tasks = () => {
  const { user } = useAuth(); // Destructuring active user parameters
  const [form] = Form.useForm();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const loadInitialTasks = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        // Passing user.id to only load current user's items
        const data = await fetchTasksApi(user.id);
        setTasks(data);
      } catch (err) {
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadInitialTasks();
  }, [user?.id]);

  const onAddTask = async (values) => {
    if (!user?.id) return;
    setSubmitting(true);
    setApiError(null);
    try {
      const cleanTitle = values.title.trim();
      // Passing user.id to map the task record creation block to this account
      const response = await mockAddTaskApi(cleanTitle, values.priority, user.id);
      
      setTasks(prev => [...prev, response.data]);
      form.resetFields();
      message.success(response.message);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, currentItem, newStatus) => {
    try {
      const updatedItem = await updateTaskStatusApi(id, currentItem, newStatus);
      setTasks(prev => prev.map(task => task.id === id ? updatedItem : task));
      message.success(`Task shifted to ${newStatus}`);
    } catch (err) {
      message.error(err.message);
    }
  };

  const getPriorityTagColor = (priority) => {
    switch(priority) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      case 'Low': return 'blue';
      default: return 'default';
    }
  };

  const getStatusTagElement = (status) => {
    switch(status) {
      case 'In Progress':
        return <Tag icon={<SyncOutlined spin />} color="processing">In Progress</Tag>;
      case 'Completed':
        return <Tag icon={<CheckCircleOutlined />} color="success">Completed</Tag>;
      default:
        return <Tag icon={<ClockCircleOutlined />} color="default">Pending</Tag>;
    }
  };

  return (
    <div>
      <Title level={3}>Manage Your System Tasks</Title>
      <Divider />

      {apiError && (
        <Alert message={apiError} type="error" showIcon style={{ marginBottom: 20 }} closable onClose={() => setApiError(null)} />
      )}

      <Card title="Add New Task" size="small" style={{ marginBottom: 24, background: '#fafafa' }}>
        <Form form={form} layout="inline" onFinish={onAddTask} style={{ gap: '12px' }}>
          <Form.Item
            name="title"
            rules={[
              { required: true, message: 'Task title is required!' },
              { min: 3, message: 'Minimum 3 characters required!' },
              { pattern: /^\S/, message: 'Task title cannot start with a blank space!' },
              { pattern: /^[a-zA-Z ]+$/, message: 'Numbers and special characters are not allowed!' }
            ]}
            style={{ flex: 2, minWidth: '200px', margin: 0 }}
          >
            <Input placeholder="What needs to be done?" allowClear />
          </Form.Item>

          <Form.Item
            name="priority"
            initialValue="Medium"
            style={{ flex: 1, minWidth: '120px', margin: 0 }}
          >
            <Select>
              <Select.Option value="Low">Low Priority</Select.Option>
              <Select.Option value="Medium">Medium Priority</Select.Option>
              <Select.Option value="High">High Priority</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ margin: 0 }}>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={submitting} disabled={submitting}>
              Add Task
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <List
        loading={loading}
        bordered
        dataSource={tasks}
        renderItem={(item) => (
          <List.Item 
            key={item.id}
            actions={[
              <Select
                size="small"
                value={item.status || 'Pending'}
                style={{ width: 130 }}
                onChange={(value) => handleStatusChange(item.id, item, value)}
              >
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="In Progress">In Progress</Select.Option>
                <Select.Option value="Completed">Completed</Select.Option>
              </Select>
            ]}
          >
            <List.Item.Meta
              title={
                <Space size="middle">
                  <span style={{ textDecoration: item.status === 'Completed' ? 'line-through' : 'none', color: item.status === 'Completed' ? '#aaa' : 'inherit' }}>
                    {item.title}
                  </span>
                  <Tag color={getPriorityTagColor(item.priority)}>{item.priority}</Tag>
                  {getStatusTagElement(item.status || 'Pending')}
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};