import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Tasks from "../pages/Tasks";
import Profile from "../pages/Profile";

import DashboardLayout from "../layouts/DashboardLayout";

import useAuthStore from "../store/authStore";

const AppRoutes = () => {
  const user = useAuthStore(
    (state) => state.user
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate
              to="/dashboard/tasks"
              replace
            />
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      />

      <Route
        path="/login"
        element={
          user ? (
            <Navigate
              to="/dashboard/tasks"
              replace
            />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          user ? (
            <DashboardLayout />
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      >
        <Route
          index
          element={
            <Navigate
              to="tasks"
              replace
            />
          }
        />

        <Route
          path="tasks"
          element={<Tasks />}
        />

        <Route
          path="profile"
          element={<Profile />}
        />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;