"use client"

import { useState, useEffect, useCallback } from "react"
import TaskCard from "./TaskCard"
import ActivityLogPanel from "./ActivityLogPanel"
import ConflictModal from "./ConflictModal"
import CreateTaskModal from "./CreateTaskModal"
import MergeTaskModal from "./MergeTaskModal"
import { connectSocket, disconnectSocket } from "../utils/socket"
import "./BoardPage.css"

const COLUMNS = {
  "Todo": "Todo",
  "In Progress": "In Progress",
  "Done": "Done",
}

const BoardPage = ({ user, token, onLogout }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [draggedTask, setDraggedTask] = useState(null)
  const [showActivityLog, setShowActivityLog] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [conflictData, setConflictData] = useState(null)
  const [error, setError] = useState("")
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [mergeData, setMergeData] = useState(null)

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/tasks/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      } else {
        setError("Failed to fetch tasks")
      }
      
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }, [token])

  // WebSocket event handlers
  const handleTaskCreated = useCallback((task) => {
    setTasks((prev) => [...prev, task])
  }, [])

  const handleTaskUpdated = useCallback((updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (editingTaskId === updatedTask._id) {
          // Return a shallow clone to break reference with parent state
          return { ...task }
        }
        return task._id === updatedTask._id ? { ...updatedTask } : { ...task }
      })
    )
  }, [])

  const handleTaskDeleted = useCallback((task_id) => {
    setTasks((prev) => prev.filter((task) => task._id !== task_id))
  }, [])

  useEffect(() => {
    fetchTasks()

    // Connect to WebSocket
    const socket = connectSocket(token)

    socket.on("task:created", handleTaskCreated)
    socket.on("task:updated", handleTaskUpdated)
    socket.on("task:deleted", handleTaskDeleted)

    return () => {
      disconnectSocket()
    }
  }, [fetchTasks, handleTaskCreated, handleTaskUpdated, handleTaskDeleted, token])

  // Drag and drop handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e, newStatus) => {
    e.preventDefault()

    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null)
      return
    }

    const updatedTask = {
      ...draggedTask,
      status: newStatus,
      clientUpdatedAt: draggedTask.updatedAt,
    }

    // Optimistically update UI
    setTasks((prev) => prev.map((task) => (task._id === draggedTask._id ? updatedTask : task)))

    try {
      const response = await fetch(`http://localhost:5000/tasks/update-task/${draggedTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      })

      if (response.status === 409) {
        // Handle conflict
        const conflictInfo = await response.json()
        setConflictData({
          task_id: draggedTask._id,
          yourVersion: updatedTask,
          latestVersion: conflictInfo.latestVersion,
          type: "status_update",
        })
      } else if (!response.ok) {
        // Revert optimistic update
        setTasks((prev) => prev.map((task) => (task._id === draggedTask._id ? draggedTask : task)))
        setError("Failed to update task")
      }
    } catch (err) {
      // Revert optimistic update
      setTasks((prev) => prev.map((task) => (task._id === draggedTask._id ? draggedTask : task)))
      setError("Network error")
    }

    setDraggedTask(null)
  }

  // Task operations
  const handleDeleteTask = async (task_id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/tasks/delete-task/${task_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        setError("Failed to delete task")
      }
    } catch (err) {
      setError("Network error")
    }
  }

  const handleSmartAssign = async (task_id) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/smart-assign/${task_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        setError("Failed to smart assign task")
      }
    } catch (err) {
      setError("Network error")
    }
  }

  const handleConflictResolve = async (resolution) => {
    if (resolution.action === "overwrite") {
      try {
        const response = await fetch(`http://localhost:5000/tasks/update-task/${conflictData.task_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...conflictData.yourVersion,
            force: true,
          }),
        })

        if (!response.ok) {
          setError("Failed to resolve conflict")
        }
      } catch (err) {
        setError("Network error")
      }
    }

    setConflictData(null)
    setEditingTaskId(null) // Close the edit modal after force overwrite
  }

  const handleMergeOpen = (yourVersion, latestVersion) => {
    setMergeData({ yourVersion, latestVersion })
    setConflictData(null)
  }

  const handleMergeSubmit = async (mergedFields) => {
    if (!mergeData) return
    try {
      const response = await fetch(`http://localhost:5000/tasks/update-task/${conflictData?.task_id || mergeData.latestVersion._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...mergedFields,
          clientUpdatedAt: mergeData.latestVersion.updatedAt,
          force: true,
        }),
      })
      if (!response.ok) {
        setError("Failed to save merged task")
      } else {
        fetchTasks()
      }
    } catch (err) {
      setError("Network error")
    }
    setMergeData(null)
    setEditingTaskId(null)
  }

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your workspace...</p>
      </div>
    )
  }

  return (
    <div className="board-container">
      {/* Header */}
      <header className="board-header">
        <div className="header-left">
          <h1>Collaborative Board</h1>
          <span className="user-info">Welcome, {user.username}</span>
        </div>
        <div className="header-right">
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            + New Task
          </button>
          <button className="btn btn-secondary" onClick={() => setShowActivityLog(!showActivityLog)}>
            Activity Log
          </button>
          <button className="btn btn-outline" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      <div className="board-content">
        {/* Kanban Board */}
        <div className={`kanban-board ${showActivityLog ? "with-s_idebar" : ""}`}>
          {Object.entries(COLUMNS).map(([status, title]) => (
            <div
              key={status}
              className="kanban-column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div className="column-header">
                <h3>{title}</h3>
                <span className="task-count">{getTasksByStatus(status).length}</span>
              </div>

              <div className="column-content">
                {getTasksByStatus(status).map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDragStart={handleDragStart}
                    onDelete={handleDeleteTask}
                    onSmartAssign={handleSmartAssign}
                    currentUser={user}
                    token={token}
                    onEditConflict={setConflictData}
                    isEditing={editingTaskId === task._id}
                    onEditOpen={() => setEditingTaskId(task._id)}
                    onEditClose={() => setEditingTaskId(null)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Activity Log Panel */}
        {showActivityLog && <ActivityLogPanel token={token} onClose={() => setShowActivityLog(false)} />}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateTaskModal token={token} onClose={() => setShowCreateModal(false)} existingTasks={tasks} />
      )}

      {conflictData && <ConflictModal conflictData={conflictData} onResolve={handleConflictResolve} onMerge={handleMergeOpen} />}
      {mergeData && (
        <MergeTaskModal
          yourVersion={mergeData.yourVersion}
          latestVersion={mergeData.latestVersion}
          onClose={() => setMergeData(null)}
          onMergeSubmit={handleMergeSubmit}
        />
      )}
    </div>
  )
}

export default BoardPage
