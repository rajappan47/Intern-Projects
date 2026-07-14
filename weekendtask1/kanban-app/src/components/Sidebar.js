import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveBoard } from '../store/boardSlice';
import { Switch } from 'antd';
import { LayoutFilled, EyeInvisibleOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import './Sidebar.css';

export default function Sidebar({ isDarkMode, setIsDarkMode, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const { list, activeBoardId } = useSelector(state => state.boards);
  const dispatch = useDispatch();

  return (
    <div className={`sidebar ${isMobileMenuOpen ? 'mobile-show' : 'mobile-hide'}`}>
      <div>
        <div className="logo-container">
          <div className="logo-bars">
            <span></span><span></span><span></span>
          </div>
          <h2 className="logo-text">kanban</h2>
        </div>
        
        <p className="boards-count">ALL BOARDS ({list.length})</p>
        <div className="boards-list">
          {list.map(board => (
            <div 
              key={board.id} 
              className={`board-item ${board.id === activeBoardId ? 'active' : ''}`}
              onClick={() => {
                dispatch(setActiveBoard(board.id));
                setIsMobileMenuOpen(false); // Auto-hide menu overlay once selection changes
              }}
            >
              <LayoutFilled className="board-icon" />
              <span className="board-name-text">{board.name}</span>
            </div>
          ))}
          <div className="board-item create-new">+ Create New Board</div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="theme-toggle">
          <SunOutlined style={{ color: '#828FA3', fontSize: '18px' }} />
          <Switch checked={isDarkMode} onChange={(checked) => setIsDarkMode(checked)} />
          <MoonOutlined style={{ color: '#828FA3', fontSize: '18px' }} />
        </div>
        <div className="hide-sidebar">
          <EyeInvisibleOutlined style={{ marginRight: 10 }} /> Hide Sidebar
        </div>
      </div>
    </div>
  );
}