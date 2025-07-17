"use client"
import "./ConflictModal.css"

const ConflictModal = ({ conflictData, onResolve, onMerge }) => {
  const { yourVersion, latestVersion } = conflictData

  const handleOverwrite = () => {
    onResolve({ action: "overwrite" })
  }

  const handleMerge = () => {
    onResolve({ action: "merge" })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="modal-overlay">
      <div className="conflict-modal">
        <div className="modal-header">
          <h2>⚔️ Conflict Detected</h2>
          <p>This task was modified by another user while you were editing it.</p>
        </div>

        <div className="conflict-comparison">
          <div className="version-panel your-version">
            <h3>✅ Your Version</h3>
            <div className="version-details">
              <div className="field">
                <label>Title:</label>
                <span>{yourVersion.title}</span>
              </div>
              <div className="field">
                <label>Description:</label>
                <span>{yourVersion.description || "No description"}</span>
              </div>
              <div className="field">
                <label>Status:</label>
                <span className={`status-badge ${yourVersion.status}`}>{yourVersion.status}</span>
              </div>
              <div className="field">
                <label>Priority:</label>
                <span className={`priority-badge ${yourVersion.priority}`}>{yourVersion.priority}</span>
              </div>
              <div className="field">
                <label>Assigned to:</label>
                <span>{yourVersion.assignedTo?.username || "Unassigned"}</span>
              </div>
              <div className="field">
                <label>Your changes:</label>
                <span>{formatDate(yourVersion.clientUpdatedAt)}</span>
              </div>
            </div>
          </div>

          <div className="version-panel latest-version">
            <h3>🗂️ Latest Version</h3>
            <div className="version-details">
              <div className="field">
                <label>Title:</label>
                <span>{latestVersion.title}</span>
              </div>
              <div className="field">
                <label>Description:</label>
                <span>{latestVersion.description || "No description"}</span>
              </div>
              <div className="field">
                <label>Status:</label>
                <span className={`status-badge ${latestVersion.status}`}>{latestVersion.status}</span>
              </div>
              <div className="field">
                <label>Priority:</label>
                <span className={`priority-badge ${latestVersion.priority}`}>{latestVersion.priority}</span>
              </div>
              <div className="field">
                <label>Assigned to:</label>
                <span>{latestVersion.assignedTo?.username || "Unassigned"}</span>
              </div>
              <div className="field">
                <label>Last updated:</label>
                <span>{formatDate(latestVersion.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="conflict-actions">
          <button className="btn btn-secondary" onClick={onMerge ? () => onMerge(yourVersion, latestVersion) : undefined}>
            Merge Manually
          </button>
          <button className="btn btn-danger" onClick={handleOverwrite}>
            Force Overwrite
          </button>
        </div>

        <div className="conflict-warning">
          <p>
            <strong>Warning:</strong> Force overwrite will replace the latest version with your changes. This action
            cannot be undone.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ConflictModal
