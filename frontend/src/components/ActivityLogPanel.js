"use client"

import { useState, useEffect } from "react"
import { getSocket } from "../utils/socket"
import "./ActivityLogPanel.css"

const ActivityLogPanel = ({ token, onClose }) => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch recent logs
    const fetchLogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/tasks/logs/recent", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setLogs(data)
          console.log(data)
        }
      } catch (err) {
        console.error("Failed to fetch logs:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()

    // Listen for new logs via WebSocket
    const socket = getSocket()
    if (socket) {
      const handleNewLog = (log) => {
        setLogs((prev) => [log, ...prev.slice(0, 19)]) // Keep only 20 logs
      }

      socket.on("log:new", handleNewLog)

      return () => {
        socket.off("log:new", handleNewLog)
      }
    }
  }, [token])

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const getActionIcon = (action) => {
    switch (action) {
      case "CREATE":
        return "➕"
      case "UPDATE":
        return "✏️"
      case "DELETE":
        return "🗑️"
      case "ASSIGN":
        return "👤"
      case "STATUS_CHANGE":
        return "🔄"
      default:
        return "📝"
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case "CREATE":
        return "#28a745"
      case "UPDATE":
        return "#17a2b8"
      case "DELETE":
        return "#dc3545"
      case "ASSIGN":
        return "#6f42c1"
      case "STATUS_CHANGE":
        return "#fd7e14"
      default:
        return "#6c757d"
    }
  }

  return (
    <div className="activity-log-panel">
      <div className="panel-header">
        <h3>Activity Log</h3>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="panel-content">
        {loading ? (
          <div className="loading-logs">
            <div className="loading-spinner small"></div>
            <p>Loading activity...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="empty-logs">
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="logs-list">
            {logs.map((log, index) => (
              <div key={log._id || index} className="log-item">
                <div className="log-icon" style={{ color: getActionColor(log.action) }}>
                  {getActionIcon(log.action)}
                </div>
                <div className="log-content">
                  <div className="log-message">
                  <strong>{log.user?.username || "Unknown User"}</strong> {(() => {
                    if (log.action === "ASSIGN") {
                      return <>assigned task <em>"{log.task?.title || "Unknown Task"}"</em> to <strong>{log.assignedTo?.username || "Unknown User"}</strong></>;
                    } else if (log.action === "STATUS_CHANGE") {
                      return <>{log.message}</>;
                    } else if(log.action === "CREATE"){  
                      return <>created task <em>"{log.task?.title || "Unknown Task"}"</em>assigned to <strong>{log.assignedTo?.username || "Unknown User"}</strong></>;
                    } else if(log.action === "UPDATE"){
                      return <>updated task <em>"{log.task?.title || "Unknown Task"}"</em></>;
                    } else if(log.action === "DELETE"){
                      return <>deleted <em>"{log.task?.title || "Unknown Task"}"</em></>
                    }
                  })()}
                  </div>
                  <div className="log-timestamp">{formatTimestamp(log.createdAt || log.timestamp)}</div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityLogPanel
