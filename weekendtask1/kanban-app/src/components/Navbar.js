import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { MoreOutlined, PlusOutlined, DownOutlined } from '@ant-design/icons';
import AddTaskModal from './AddTaskModal';
import './Navbar.css';

export default function Navbar({ onMobileMenuToggle }) {
  const { list, activeBoardId } = useSelector(state => state.boards);
  const activeBoard = list.find(b => b.id === activeBoardId);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // or useState(false)
  return (
    <div className="navbar-container">
      {/* Tapping this entire block toggles the sidebar overlay menu on mobile */}
      <div className="navbar-left" onClick={onMobileMenuToggle}>
        <div className="mobile-logo-bars">
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <h1 className="navbar-title">
          {activeBoard ? activeBoard.name : 'No Active Board'}
          <DownOutlined className="mobile-dropdown-icon" />
        </h1>
      </div>

      <div className="navbar-actions">
        <Button 
          type="primary" 
          shape="round" 
          icon={<PlusOutlined />} 
          className="add-task-btn"
          disabled={!activeBoard || activeBoard.columns?.length === 0}
          onClick={(e) => {
            e.stopPropagation(); // Prevents closing or shifting elements unexpectedly
            setIsAddOpen(true);
          }}
        >
          <span className="btn-text">Add New Task</span>
        </Button>
        <MoreOutlined className="navbar-more-icon" />
      </div>

      {isAddOpen && (
        <AddTaskModal 
          visible={isAddOpen} 
          boardId={activeBoardId} 
          onClose={() => setIsAddOpen(false)} 
          isDarkMode={isDarkMode}
          styles={{

      }}
        />
      )}
    </div>
  );
}