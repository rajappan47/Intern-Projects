import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "../pages/Login";
import Tasks from "../pages/Tasks";
import Profile from "../pages/Profile";

import DashboardLayout from "../layouts/DashboardLayout";

const AppRoutes = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard/tasks" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard/tasks" replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <DashboardLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Navigate to="tasks" replace />} />

        <Route path="tasks" element={<Tasks />} />

        <Route path="profile" element={<Profile />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;