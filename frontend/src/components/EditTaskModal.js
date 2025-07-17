"use client"

import { useState, useRef } from "react"
import "./Modal.css"

const EditTaskModal = ({ task, token, onClose, onConflict, lastUpdatedAt }) => {
  // Only initialize formData once, when modal opens
  const initialFormData = useRef({
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    status: task.status,
    assignedTo: task.assignedTo || "",
  })
  const [formData, setFormData] = useState(initialFormData.current)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Fetch the latest task from the backend
      const latestRes = await fetch(`https://kanban-board-fc6s.onrender.com/tasks/${task._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!latestRes.ok) {
        setError("Failed to fetch latest task data.")
        setLoading(false)
        return
      }
      const latestTask = await latestRes.json()
      // Compare updatedAt
      if (lastUpdatedAt && latestTask.updatedAt !== lastUpdatedAt) {
        if (onConflict) {
          onConflict({
            task_id: task._id,
            yourVersion: { ...formData, clientUpdatedAt: lastUpdatedAt, assignedTo: task.assignedTo },
            latestVersion: latestTask,
            type: "edit-local"
          })
          setLoading(false)
          return
        } else {
          setError("Task was modified by another user. Please refresh and try again.")
          setLoading(false)
          return
        }
      }

      // Proceed with update if no conflict
      const response = await fetch(`https://kanban-board-fc6s.onrender.com/tasks/update-task/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          clientUpdatedAt: latestTask.updatedAt,
        }),
      })

      if (response.ok) {
        onClose()
      } else if (response.status === 409) {
        // Handle conflict - trigger parent modal if provided
        const conflictInfo = await response.json()
        if (onConflict) {
          onConflict({
            task_id: task._id,
            yourVersion: { ...formData, clientUpdatedAt: latestTask.updatedAt, assignedTo: task.assignedTo },
            latestVersion: conflictInfo.latestVersion,
            type: "edit"
          })
        } else {
          setError("Task was modified by another user. Please refresh and try again.")
        }
      } else {
        const data = await response.json()
        setError(data.message || "Failed to update task")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Edit Task</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange} className="form-select">
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="assignedTo">Assigned To</label>
            <input
              type="text"
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter username"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Updating..." : "Update Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTaskModal
