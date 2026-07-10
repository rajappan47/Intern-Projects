import { Layout, Button, Typography } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

import { Outlet } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { toggleSidebar } from "../features/ui/uiSlice";

import Sidebar from "../components/Sidebar";

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const dispatch = useDispatch();

  const { sidebarCollapsed } = useSelector(
    (state) => state.ui
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
      >
        <Sidebar />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={
              sidebarCollapsed ? (
                <MenuUnfoldOutlined />
              ) : (
                <MenuFoldOutlined />
              )
            }
            onClick={() =>
              dispatch(toggleSidebar())
            }
          />
        <Typography.Title
            level={4}
            style={{
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Redux Task Manager
          </Typography.Title>
        </Header>

        <Content
          style={{
            margin: "20px",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;