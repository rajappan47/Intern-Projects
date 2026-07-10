import { Layout, Button, Typography } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import useUIStore from "../store/uiStore";

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);

  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={sidebarCollapsed}>
        <Sidebar />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Button
            type="text"
            icon={
              sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
            }
            onClick={toggleSidebar}
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
            Zustand Task Manager
          </Typography.Title>
        </Header>

        <Content
          style={{
            margin: 20,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
