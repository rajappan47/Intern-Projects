import React from 'react';
import './TaskCard.css';

export default function TaskCard({ task, onClick }) {
  const completedSubtasks = task.subtasks?.filter(s => s.isCompleted).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div className="task-card" onClick={onClick}>
      <h3>{task.title}</h3>
      <p>{completedSubtasks} of {totalSubtasks} subtasks</p>
    </div>
  );
}