import React, { useState } from "react"
import "./ConflictModal.css"

const MergeTaskModal = ({ yourVersion, latestVersion, onClose, onMergeSubmit }) => {
  const [formData, setFormData] = useState({
    title: latestVersion.title,
    description: latestVersion.description,
    status: latestVersion.status,
    priority: latestVersion.priority,
    assignedTo: latestVersion.assignedTo,
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCopy = (field, from) => {
    setFormData({
      ...formData,
      [field]: from[field],
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onMergeSubmit(formData)
  }

  return (
    <div className="modal-overlay">
      <div className="conflict-modal">
        <div className="modal-header">
          <h2>🛠️ Manual Merge</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="merge-comparison-row">
            {/* Your Version */}
            <div className="merge-panel">
              <h3 style={{ color: '#28a745', marginBottom: 12 }}>Your Version</h3>
              <div>
                <div className="merge-field-label">Title</div>
                <div className="merge-field-value">{yourVersion.title}</div>
                <button type="button" className="merge-copy-btn" onClick={() => handleCopy("title", yourVersion)}>Copy</button>
                <div className="merge-field-label">Description</div>
                <div className="merge-field-value">{yourVersion.description}</div>
                <button type="button" className="merge-copy-btn" onClick={() => handleCopy("description", yourVersion)}>Copy</button>
                <div className="merge-field-label">Status</div>
                <div className="merge-field-value">{yourVersion.status}</div>
                <button type="button" className="merge-copy-btn" onClick={() => handleCopy("status", yourVersion)}>Copy</button>
                <div className="merge-field-label">Priority</div>
                <div className="merge-field-value">{yourVersion.priority}</div>
                <button type="button" className="merge-copy-btn" onClick={() => handleCopy("priority", yourVersion)}>Copy</button>
                <div className="merge-field-label">Assigned To</div>
                <div className="merge-field-value">{yourVersion.assignedTo?.username || yourVersion.assignedTo || "Unassigned"}</div>
                <button type="button" className="merge-copy-btn" onClick={() => handleCopy("assignedTo", yourVersion)}>Copy</button>
              </div>
            </div>
            {/* Merged Version */}
            <div className="merge-panel merged">
              <h3 style={{ color: '#fd7e14', marginBottom: 12 }}>Merged</h3>
              <div>
                <div className="merge-field-label">Title</div>
                <input
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  className="merge-input"
                />
                <div className="merge-field-label">Description</div>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="merge-textarea"
                  rows={2}
                />
                <div className="merge-field-label">Status</div>
                <input
                  name="status"
                  value={formData.status || ""}
                  onChange={handleChange}
                  className="merge-input"
                />
                <div className="merge-field-label">Priority</div>
                <input
                  name="priority"
                  value={formData.priority || ""}
                  onChange={handleChange}
                  className="merge-input"
                />
                <div className="merge-field-label">Assigned To</div>
                <input
                  name="assignedTo"
                  value={formData.assignedTo?.username || formData.assignedTo || ""}
                  onChange={handleChange}
                  className="merge-input"
                  placeholder="User ID"
                />
              </div>
            </div>
            {/* Latest Version */}
            <div className="merge-panel">
              <h3 style={{ color: '#17a2b8', marginBottom: 12 }}>Latest Version</h3>
              <div>
                <div className="merge-field-label">Title</div>
                <div className="merge-field-value">{latestVersion.title}</div>
                <button type="button" className="merge-copy-btn" onClick={() => handleCopy("title", latestVersion)}>Copy</button>
                <div className="merge-field-label">Description</div>
                <div className="merge-field-value">{latestVersion.description}</div>
                <button type="button" className="merge-copy-btn" onClick={() => handleCopy("description", latestVersion)}>Copy</button>
                <div className="merge-field-label">Status</div>
                <div className="merge-field-value">{latestVersion.status}</div>
                <button type="button" className="merge-copy-btn" onClick={() => handleCopy("status", latestVersion)}>Copy</button>
                <div className="merge-field-label">Priority</div>
                <div className="merge-field-value">{latestVersion.priority}</div>
                <button type="button" className="merge-copy-btn" onClick={() => handleCopy("priority", latestVersion)}>Copy</button>
                <div className="merge-field-label">Assigned To</div>
                <div className="merge-field-value">{latestVersion.assignedTo?.username || latestVersion.assignedTo || "Unassigned"}</div>
                <button type="button" className="merge-copy-btn" onClick={() => handleCopy("assignedTo", latestVersion)}>Copy</button>
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Merged Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MergeTaskModal 