import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Spin, Alert, notification } from "antd";
import api from "./api";

function UserList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [form] = Form.useForm();

  // ==========================================
  // 1. REACT QUERY: QUERY (Fetch/Caching)
  // ==========================================
  const { data: comments, isLoading, isError, error } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      const response =  api.get("/comment");

      //await () => {'http://localhost:5000/comments'}
      return response.data;
    },
  });

  // ==========================================
  // 2. REACT QUERY: MUTATIONS (Create, Update, Delete)
  // ==========================================
  
  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (newComment) => {
      return (await api.post("/comments", newComment)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]); // Refetches fresh data & updates cache
      notification.success({ message: "Comment created successfully!" });
      closeModal();
    },
    onError: () => notification.error({ message: "Failed to create comment" }),
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      return (await api.put(`/comments/${updatedData.id}`, updatedData)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]); 
      notification.success({ message: "Comment updated successfully!" });
      closeModal();
    },
    onError: () => notification.error({ message: "Failed to update comment" }),
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/comments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
      notification.success({ message: "Comment deleted successfully!" });
    },
    onError: () => notification.error({ message: "Failed to delete comment" }),
  });

  // ==========================================
  // HANDLERS
  // ==========================================
  const openModal = (record = null) => {
    setEditingComment(record);
    if (record) {
      form.setFieldsValue(record); // Pre-fill form for editing
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingComment(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    if (editingComment) {
      updateMutation.mutate({ ...editingComment, ...values });
    } else {
      createMutation.mutate({ postId: 1, ...values }); // Default mock post ID
    }
  };

  // ==========================================
  // ANTD TABLE COLUMNS DEFINITION
  // ==========================================
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 70 },
    { title: "Post ID", dataIndex: "postId", key: "postId", width: 90 },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Body", dataIndex: "body", key: "body", ellipsis: true },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => openModal(record)}>Edit</Button>
          <Popconfirm
            title="Delete the comment"
            description="Are you sure to delete this comment?"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ==========================================
  // 3. LOADING AND ERROR STATES UI
  // ==========================================
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" tip="Loading comments..." />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Error"
        description={error.message || "Something went wrong while fetching data."}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <h2>Comments Management (CRUD)</h2>
        <Button type="primary" onClick={() => openModal()}>
          Add New Comment
        </Button>
      </div>

      {/* Antd Table handles array mapping and styling out-of-the-box */}
      <Table 
        dataSource={comments} 
        columns={columns} 
        rowKey="id" 
        pagination={{ 
    pageSize: 5, 
    showSizeChanger: false // This hides the record count selector dropdown
  }}
      />

      {/* Create / Edit Modal Form */}
      <Modal
        title={editingComment ? "Edit Comment" : "Add Comment"}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
                { required: true, message: "Please input the name!" },
                 { pattern: /^\S/, message: 'Task title cannot start with a blank space!' },
          { pattern: /^[a-zA-Z ]+$/, message: 'Numbers and special characters are not allowed!' }
            
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the email!" },
              { type: "email", message: "Please enter a valid email!" }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="body"
            label="Comment Body"
            rules={[{ required: true, message: "Please input the comment body!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserList;