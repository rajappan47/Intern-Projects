import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Tag, Popconfirm, Space } from 'antd';
import { useSelector } from 'react-redux';
import API from '../api';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null); // Track book being edited
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  // Members and Admins can Edit/Delete/Create
  const canEdit = user?.role === 'Member' || user?.role === 'Admin';

  const fetchBooks = async () => {
    try {
      const res = await API.get('/books');
      setBooks(res.data);
    } catch (err) {
      message.error('Failed to load books');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Open modal for CREATING a new book
  const handleOpenCreateModal = () => {
    setEditingBook(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Open modal for EDITING an existing book
  const handleOpenEditModal = (record) => {
    setEditingBook(record);
    form.setFieldsValue({
      title: record.title,
      author: record.author,
    });
    setIsModalOpen(true);
  };

  // Handle Form Submission (Handles both Create and Update)
  const handleSubmit = async (values) => {
    try {
      if (editingBook) {
        // UPDATE existing book (PUT)
        await API.put(`/books/${editingBook._id}`, values);
        message.success('Book updated successfully');
      } else {
        // CREATE new book (POST)
        await API.post('/books', values);
        message.success('Book created successfully');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      message.error(editingBook ? 'Failed to update book' : 'Failed to create book');
    }
  };

  // Delete Book
  const handleDeleteBook = async (id) => {
    try {
      await API.delete(`/books/${id}`);
      message.success('Book deleted');
      fetchBooks();
    } catch (err) {
      message.error('Failed to delete book');
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Author', dataIndex: 'author', key: 'author' },
    ...(canEdit
      ? [
          {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
              <Space size="middle">
                <Button 
                  type="default" 
                  size="small" 
                  onClick={() => handleOpenEditModal(record)}
                >
                  Edit
                </Button>
                <Popconfirm 
                  title="Delete this book?" 
                  onConfirm={() => handleDeleteBook(record._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger size="small">
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]
      : []),
  ];

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Book Catalog <Tag color="blue">Role: {user?.role}</Tag></h2>
        {canEdit && (
          <Button type="primary" onClick={handleOpenCreateModal}>
            Add Book
          </Button>
        )}
      </div>

      <Table dataSource={books} columns={columns} rowKey="_id" />

      {/* Modal for both Create and Edit operations */}
      <Modal 
        title={editingBook ? 'Edit Book' : 'Add Book'} 
        open={isModalOpen} 
        onCancel={() => {
          setIsModalOpen(false);
          setEditingBook(null);
        }} 
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="author" label="Author" rules={[{ required: true, message: 'Please enter an author' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}