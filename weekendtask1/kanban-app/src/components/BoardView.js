import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TaskCard from './TaskCard';
import TaskDetailsModal from './TaskDetailsModal';
import './BoardView.css';

export default function BoardView() {
  const { list, activeBoardId } = useSelector(state => state.boards);
  const activeBoard = list.find(b => b.id === activeBoardId);
  const [selectedTask, setSelectedTask] = useState(null);

  if (!activeBoard) return <div className="empty-board">Select a board to display tasks</div>;

  return (
    <div className="board-view">
      {activeBoard.columns.map(col => (
        <div key={col.id} className="board-column">
          <div className="column-header">
            <span className="column-dot" style={{ backgroundColor: col.color }}></span>
            {col.name} ({col.tasks?.length || 0})
          </div>
          <div className="column-cards">
            {col.tasks?.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onClick={() => setSelectedTask({ task, columnId: col.id })} 
              />
            ))}
          </div>
        </div>
      ))}
      <div className="board-column new-column">
        <span>+ New Column</span>
      </div>

      {selectedTask && (
        <TaskDetailsModal 
          visible={!!selectedTask}
          task={selectedTask.task}
          columnId={selectedTask.columnId}
          boardId={activeBoardId}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}