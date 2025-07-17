"use client"

import { useState, useRef } from "react"
import EditTaskModal from "./EditTaskModal"
import "./TaskCard.css"

const PRIORITY_COLORS = {
  low: "#28a745",
  medium: "#ffc107",
  high: "#dc3545",
}

const TaskCard = ({ task, onDragStart, onDelete, onSmartAssign, currentUser, token, onEditConflict, isEditing, onEditOpen, onEditClose }) => {
  const [isHovered, setIsHovered] = useState(false)
  const lastUpdatedAt = useRef(task.updatedAt)

  const handleDragStart = (e) => {
    onDragStart(e, task)
  }

  const handleEditClick = () => {
    lastUpdatedAt.current = task.updatedAt 
    if (onEditOpen) onEditOpen()
  }

  const getPriorityColor = (priority) => {
    return PRIORITY_COLORS[priority] || "#6c757d"
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <>
      <div
        className="task-card"
        draggable
        onDragStart={handleDragStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="task-header">
          <h4 className="task-title">{task.title}</h4>
          <div
            className="priority-indicator"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
            title={`Priority: ${task.priority}`}
          >
            {task.priority.charAt(0).toUpperCase()}
          </div>
        </div>

        {task.description && <p className="task-description">{task.description}</p>}

        <div className="task-meta">
          <div className="assigned-user">
            <span className="user-avatar">{task.assignedTo?.username?.charAt(0).toUpperCase() || "?"}</span>
            <span className="user-name">{task.assignedTo?.username || "Unassigned"}</span>
          </div>

          {task.createdAt && <div className="task-date">{formatDate(task.createdAt)}</div>}
        </div>

        {/* Hover Actions */}
        {isHovered && (
          <div className="task-actions">
            <button className="action-btn edit-btn" onClick={handleEditClick} title="Edit Task">
              ✏️
            </button>
            <button className="action-btn smart-assign-btn" onClick={() => onSmartAssign(task._id)} title="Smart Assign">
              🎯
            </button>
            <button className="action-btn delete-btn" onClick={() => onDelete(task._id)} title="Delete Task">
              🗑️
            </button>
          </div>
        )}
      </div>
      {/* EditTaskModal removed from here. Now rendered at BoardPage.js top level. */}
    </>
  )
}

export default TaskCard
