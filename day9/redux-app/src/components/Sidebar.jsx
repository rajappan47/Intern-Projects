import { Menu } from "antd";

import {
  CheckSquareOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { logout } from "../features/auth/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const sidebarCollapsed = useSelector(
  (state) => state.ui.sidebarCollapsed
);

  const handleLogout = () => {
    dispatch(logout());

    navigate("/login");
  };

  return (
    <>
<div
  style={{
    color: "#fff",
    fontSize: sidebarCollapsed ? 20 : 22,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
    whiteSpace: "nowrap",
    overflow: "hidden",
  }}
>
  {sidebarCollapsed ? "TM" : "Task Manager"}
</div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={[
          {
            key: "/dashboard/tasks",
            icon: <CheckSquareOutlined />,
            label: (
              <Link to="/dashboard/tasks">
                Tasks
              </Link>
            ),
          },

          {
            key: "/dashboard/profile",
            icon: <UserOutlined />,
            label: (
              <Link to="/dashboard/profile">
                Profile
              </Link>
            ),
          },

          {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: handleLogout,
          },
        ]}
      />
    </>
  );
};

export default Sidebar;