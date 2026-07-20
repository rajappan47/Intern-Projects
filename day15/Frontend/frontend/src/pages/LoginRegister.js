import React, { useState } from 'react';
import { Card, Form, Input, Button, Tabs, message } from 'antd';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function LoginRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const res = await API.post('/auth/login', values);
      dispatch(loginSuccess(res.data));
      message.success('Logged in successfully!');
      navigate('/books');
    } catch (err) {
      message.error(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async (values) => {
    try {
      await API.post('/auth/register', values);
      message.success('Registration successful! You have been assigned the Reader role by default.');
    } catch (err) {
      message.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <Card>
        <Tabs defaultActiveKey="1" items={[
          {
            key: '1',
            label: 'Login',
            children: (
              <Form layout="vertical" onFinish={handleLogin}>
                <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                  <Input.Password />
                </Form.Item>
                <Button type="primary" htmlType="submit" block>Login</Button>
              </Form>
            )
          },
          {
            key: '2',
            label: 'Register',
            children: (
              <Form layout="vertical" onFinish={handleRegister}>
                <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                  <Input.Password />
                </Form.Item>
                <Form.Item name="confirmpassword" label="confirmpassword" rules={[{ required: true }]}>
                  <Input.Password />
                </Form.Item>

                <Button type="primary" htmlType="submit" block>Register</Button>
              </Form>
            )
          }
        ]} />
      </Card>
    </div>
  );
}