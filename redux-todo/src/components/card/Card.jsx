import "./card.css";

export default function Card({type, data, users, onEdit, onStatus, onDelete, showStatusDropdown, setShowStatusDropdown, onStatusChange}) {

  const statusClass = type === 'task' ? `status-${(data?.status || '').toLowerCase().replace(/\s+/g, '')}` : '';
  
  return (
    <div className={`app-card ${type === "task" ? "todo-card" : ""} ${statusClass}`}>
      {type === "user" && (
        <>
          <span><strong>Name:</strong> {data.firstName} {data.lastName}</span><br/>
          <span><strong>Email:</strong> {data.email}</span><br/>
          <span><strong>Phone:</strong> {data.phoneNumber}</span><br/>
          <span><strong>DOB:</strong> {data.dob}</span><br/>
          <span><strong>Gender:</strong> {data.gender}</span>
        </>
      )}
      {type === "task" && (
        <>
          <div className="todo-item-main">
            <h4 style={{textDecoration: data.status.toLowerCase() === 'completed' ? 'line-through' : 'none'}}>{data.title}</h4>
            {data.description && (
              <p className="task-desc">Description: {data.description}</p>
            )}
            <small>Status: {data.status}</small><br />
            <small>Assigned By: {users?.find(u => u.id == data.assignedBy)?.email || "Unknown"}</small>
          </div>

          <div className="todo-actions">
            <button className="todo-action-btn" onClick={() => onEdit(data)}>Edit</button>
            <div className="status-btn-wrapper">
              <button className="todo-action-btn" onClick={() => onStatus(data.id)}>Status</button>
              {showStatusDropdown === data.id && (
                <div className="status-dropdown" onMouseLeave={() => setShowStatusDropdown(null)}>
                  {["Todo", "In progress", "Completed"].map(status => (
                    <div
                      key={status}
                      className={`status-option ${data.status === status ? "selected" : ""}`}
                      onClick={() => onStatusChange(data.id, status)}
                    >
                      {status}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="todo-action-btn delete-btn" onClick={() => onDelete(data)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}
