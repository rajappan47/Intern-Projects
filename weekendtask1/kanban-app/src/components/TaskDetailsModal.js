import React from 'react';
import { Modal, Checkbox, Select } from 'antd';
import { MoreOutlined, CloseOutlined } from '@ant-design/icons'; // Import the Close icon
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskStatus, toggleSubtask } from '../store/boardSlice';

export default function TaskDetailsModal({ visible, task, columnId, boardId, onClose }) {
  const dispatch = useDispatch();
  const activeBoard = useSelector(state => state.boards.list.find(b => b.id === boardId));

  const handleStatusChange = (newColId) => {
    dispatch(updateTaskStatus({
      boardId,
      sourceColId: columnId,
      destColId: newColId,
      taskId: task.id
    }));
    onClose();
  };

  const handleToggleSubtask = (subtaskTitle) => {
    dispatch(toggleSubtask({
      boardId,
      columnId,
      taskId: task.id,
      subtaskTitle
    }));
  };

  const completedCount = task.subtasks?.filter(s => s.isCompleted).length || 0;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      closable={true} // Changed from false to true
      closeIcon={<CloseOutlined style={{ color: '#828FA3', fontSize: '16px' }} />} // The X Icon added here
      width={480}
      centered
      //styles={{ body: { backgroundColor: '#2B2C37', padding: 32, borderRadius: 8 } }}
    >
      {/* Reduced padding right slightly on title container to leave clean breathing room for the absolute X positioning */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', paddingRight: '24px' }}>
        <h2 style={{ color: '#fff', margin: 0, fontSize: '18px', lineHeight: 1.4 }}>{task.title}</h2>
        <MoreOutlined style={{ color: '#828FA3', fontSize: 24, cursor: 'pointer', marginTop: 4 }} />
      </div>
      
      <p style={{ color: '#828FA3', marginTop: 24, fontSize: 13, lineHeight: 1.6 }}>
        {task.description || "No description provided."}
      </p>
      
      <h4 style={{ color: '#fff', marginTop: 24, fontSize: 12 }}>
        Subtasks ({completedCount} of {task.subtasks?.length || 0})
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
        {task.subtasks?.map((sub, i) => (
          <div key={i} style={{ background: '#20212C', padding: 12, borderRadius: 4, display: 'flex', alignItems: 'center' }}>
            <Checkbox 
              checked={sub.isCompleted}
              onChange={() => handleToggleSubtask(sub.title)}
            >
              <span style={{ 
                color: sub.isCompleted ? '#828FA3' : '#fff', 
                textDecoration: sub.isCompleted ? 'line-through' : 'none',
                marginLeft: 8 
              }}>
                {sub.title}
              </span>
            </Checkbox>
          </div>
        ))}
      </div>

      <h4 style={{ color: '#fff', marginTop: 24, fontSize: 12 }}>Current Status</h4>
      <Select
        value={columnId}
        style={{ width: '100%', marginTop: 8, height: 40 }}
        onChange={handleStatusChange}
        options={activeBoard?.columns.map(c => ({ value: c.id, label: c.name }))}
      />
    </Modal>
  );
}