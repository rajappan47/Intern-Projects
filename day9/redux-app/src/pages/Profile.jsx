import {
  Card,
  Avatar,
  Typography,
  Descriptions,
} from "antd";

import { UserOutlined } from "@ant-design/icons";

import { useSelector } from "react-redux";

const { Title } = Typography;

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return null;
  }

  return (
    <Card>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 25,
        }}
      >
        <Avatar
          size={70}
          icon={<UserOutlined />}
        />

        <div
          style={{
            marginLeft: 20,
          }}
        >
          <Title level={3}>
            {user.name}
          </Title>

          <p>{user.designation}</p>
        </div>
      </div>

      <Descriptions
        bordered
        column={1}
      >
        <Descriptions.Item label="Employee ID">
          {user.employeeId}
        </Descriptions.Item>

        <Descriptions.Item label="Department">
          {user.department}
        </Descriptions.Item>

        <Descriptions.Item label="Designation">
          {user.designation}
        </Descriptions.Item>

        <Descriptions.Item label="Experience">
          {user.experience}
        </Descriptions.Item>

        <Descriptions.Item label="Email">
          {user.email}
        </Descriptions.Item>

        <Descriptions.Item label="Phone">
          {user.phone}
        </Descriptions.Item>

        <Descriptions.Item label="Location">
          {user.location}
        </Descriptions.Item>

        <Descriptions.Item label="Joining Date">
          {user.joiningDate}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default Profile;