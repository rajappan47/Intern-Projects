import React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { store } from './store/store';
import { logout } from './store/authSlice';

import LoginRegister from './pages/LoginRegister';
import BooksPage from './pages/BooksPage';
import UsersPage from './pages/UsersPage';

const { Header, Content } = Layout;

function ProtectedRoute({ children, allowedRoles }) {
  const { user, token } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <div style={{ padding: 40, textAlign: 'center' }}><h2>403 - Forbidden Access</h2></div>;
  }
  return children;
}

function MainApp() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        {token && (
          <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
              <Menu.Item key="1"><Link to="/dashboard">Book List</Link></Menu.Item>
              {user?.role === 'Admin' && (
                <Menu.Item key="2"><Link to="/users">Manage Users</Link></Menu.Item>
              )}
            </Menu>
            <div style={{ color: '#fff' }}>
              <span style={{ marginRight: 16 }}>Logged as: <strong>{user?.username}</strong> ({user?.role})</span>
              <Button type="primary" danger onClick={() => dispatch(logout())}>Logout</Button>
            </div>
          </Header>
        )}
        <Content>
          <Routes>
            <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginRegister />} />
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['Reader', 'Member', 'Admin']}>
                <BooksPage />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <UsersPage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}