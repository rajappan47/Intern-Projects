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

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../features/tasks/taskSlice";

import TaskForm from "../components/TaskForm";

const Tasks = () => {
  const dispatch = useDispatch();

  const { tasks, loading } = useSelector(
    (state) => state.tasks
  );

  const [editingTask, setEditingTask] =
    useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleAdd = (values) => {
    dispatch(addTask(values));
  };

  const handleUpdate = () => {
    dispatch(updateTask(editingTask));

    setEditingTask(null);
  };

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
              dispatch(deleteTask(record.id))
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
          onSubmit={handleAdd}
        />
      </Card>

      <Card title="Task List">
        <Table
          rowKey="id"
          columns={columns}
          loading={loading}
          dataSource={tasks}
        />
      </Card>

      <Modal
        title="Edit Task"
        open={!!editingTask}
        onCancel={() =>
          setEditingTask(null)
        }
        onOk={handleUpdate}
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