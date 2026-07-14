import React from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../store/boardSlice';
import { v4 as uuidv4 } from 'uuid';

export default function AddTaskModal({ visible, boardId, onClose }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  
  const activeBoard = useSelector(state => state.boards.list.find(b => b.id === boardId));

  const handleFinish = (values) => {
    const newTask = {
      id: uuidv4(),
      title: values.title,
      description: values.description || "",
      status: values.status,
      subtasks: (values.subtasks || [])
        .filter(st => st && st.trim() !== "")
        .map(title => ({ title, isCompleted: false }))
    };

    dispatch(addTask({ boardId, columnId: values.status, task: newTask }));
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={480}
      centered
      styles={{
        mask: {
        // backgroundColor: 'rgba(0, 0, 0, 0.5)'
       // padding: '10px 10px 101px 101px'

        }
      }}
    >
      {/* Title Text Heading */}
      <h2 style={{ color: 'var(--text-main)', fontSize: '18px', fontWeight: 'bold', margin: '0 0 24px 0' }}>
        Add New Task
      </h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
      >
        {/* Title Input Element */}
        <Form.Item
          label={<span style={{ color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '12px' }}>Title</span>}
          name="title"
          rules={[{ required: true, message: 'Field cannot be empty' }]}
          style={{ marginBottom: '24px' }}
        >
          <Input 
            placeholder="e.g. Take coffee break" 
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              color: 'var(--text-main)', 
              borderColor: 'var(--border-color)', 
              height: '40px',
              borderRadius: '4px'
            }}
          />
        </Form.Item>

        {/* Description TextArea Box */}
        <Form.Item
          label={<span style={{ color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '12px' }}>Description</span>}
          name="description"
          style={{ marginBottom: '24px' }}
        >
          <Input.TextArea 
            rows={4}
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little." 
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              color: 'var(--text-main)', 
              borderColor: 'var(--border-color)', 
              resize: 'none',
              borderRadius: '4px',
              lineHeight: '1.6'
            }}
          />
        </Form.Item>

        {/* Dynamic Subtasks Generator Field */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
            Subtasks
          </label>
          
          <Form.List name="subtasks" initialValue={['', '']}>
            {(fields, { add, remove }) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {fields.map((field, index) => (
                  <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Form.Item
                      {...field}
                      noStyle
                    >
                      <Input 
                        placeholder={index === 0 ? "e.g. Make coffee" : "e.g. Drink coffee & smile"} 
                        style={{ 
                          backgroundColor: 'var(--bg-card)', 
                          color: 'var(--text-main)', 
                          borderColor: 'var(--border-color)', 
                          height: '40px', 
                          flexGrow: 1,
                          borderRadius: '4px'
                        }}
                      />
                    </Form.Item>
                    <CloseOutlined 
                      onClick={() => remove(field.name)} 
                      style={{ color: 'var(--text-muted)', fontSize: '16px', cursor: 'pointer' }} 
                    />
                  </div>
                ))}
                
                <Button 
                  type="default" 
                  onClick={() => add()} 
                  block
                  style={{ 
                    backgroundColor: 'rgba(99, 95, 199, 0.1)', 
                    color: 'var(--purple-primary)', 
                    border: 'none',
                    fontWeight: 'bold',
                    height: '40px',
                    borderRadius: '20px',
                    marginTop: '4px'
                  }}
                >
                  + Add New Subtask
                </Button>
              </div>
            )}
          </Form.List>
        </div>

        {/* Column Flow Selection Menu dropdown */}
        <Form.Item
          label={<span style={{ color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '12px' }}>Status</span>}
          name="status"
          initialValue={activeBoard?.columns[0]?.id}
          style={{ marginBottom: '24px' }}
        >
          <Select
            style={{ height: '40px', borderRadius: '4px' }}
            suffixIcon={<DownOutlined style={{ color: 'var(--purple-primary)' }} />}
            options={activeBoard?.columns.map(col => ({
              value: col.id,
              label: col.name
            }))}
          />
        </Form.Item>

        {/* Submit Execution Action Button */}
        <Form.Item style={{ margin: 0 }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            block
            style={{ 
              backgroundColor: 'var(--purple-primary)', 
              borderColor: 'var(--purple-primary)',
              color: '#FFFFFF',
              fontWeight: 'bold',
              height: '40px',
              borderRadius: '20px'
            }}
          >
            Create Task
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}