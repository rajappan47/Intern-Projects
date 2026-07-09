import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from './DashboardLayout';
import { Login } from './Login';
import { Tasks } from './Tasks';
import { Profile } from './Profile';
import { NotFound } from './NotFound';
import { ErrorBoundary } from './ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard/tasks" replace />} />

            {/* Public Entry Handling */}
            <Route element={<ProtectedRoute redirectIfAuthenticated={true} />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Protected Core App Flow */}
            <Route element={<ProtectedRoute redirectIfAuthenticated={false} />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Navigate to="/dashboard/tasks" replace />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>

            {/* Fallback Wildcard Layout */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;