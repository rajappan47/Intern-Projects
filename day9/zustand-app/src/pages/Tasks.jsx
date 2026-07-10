import { useEffect, useState } from "react";

import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Input,
  Select,
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import TaskForm from "../components/TaskForm";

import useTaskStore from "../store/taskStore";

const Tasks = () => {
  const {
    tasks,
    loading,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
  } = useTaskStore();

  const [editingTask, setEditingTask] =
    useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Priority",
      dataIndex: "priority",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() =>
              setEditingTask(record)
            }
          />

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() =>
              deleteTask(record.id)
            }
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title="Add Task"
        style={{
          marginBottom: 20,
        }}
      >
        <TaskForm
          onSubmit={addTask}
        />
      </Card>

<Card title="Task List">
  <Table
    rowKey="id"
    columns={columns}
    dataSource={tasks}
    loading={loading}
    scroll={{ x: 600 }}
    pagination={{
      pageSize: 5,
      showSizeChanger: false,
    }}
  />
</Card>

      <Modal
        title="Edit Task"
        open={!!editingTask}
        onCancel={() =>
          setEditingTask(null)
        }
        onOk={() => {
          updateTask(editingTask);
          setEditingTask(null);
        }}
      >
        <Input
          style={{
            marginBottom: 15,
          }}
          value={
            editingTask?.title
          }
          onChange={(e) =>
            setEditingTask({
              ...editingTask,
              title: e.target.value,
            })
          }
        />

        <Select
          style={{
            width: "100%",
          }}
          value={
            editingTask?.priority
          }
          onChange={(value) =>
            setEditingTask({
              ...editingTask,
              priority: value,
            })
          }
          options={[
            {
              label: "Low",
              value: "Low",
            },
            {
              label: "Medium",
              value: "Medium",
            },
            {
              label: "High",
              value: "High",
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default Tasks;