import React from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';

function BookingForm({ isOpen, selectedBook, onClose, onConfirm }) {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    onConfirm(values.studentName);
    form.resetFields();
  };

  return (
    <Modal
      title={`Borrow: "${selectedBook?.title}"`}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="studentName"
          label="Borrowing Student Name"
          rules={[{ required: true, message: 'Please input the student name!' }]}
        >
          <Input placeholder="Enter student's full name" />
        </Form.Item>
        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit">Confirm Checkout</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default BookingForm;