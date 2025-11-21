function TaskList({ tasks, onEdit, onDelete }) {
    if (!tasks.length) {
      return (
        <div className="alert alert-info">
          No tasks found. Create your first task.
        </div>
      );
    }
  
    const statusBadgeClass = (status) => {
      switch (status) {
        case "completed":
          return "bg-success";
        case "in-progress":
          return "bg-warning text-dark";
        default:
          return "bg-secondary";
      }
    };
  
    return (
      <div className="list-group shadow-sm">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="list-group-item d-flex justify-content-between align-items-start"
          >
            <div className="ms-0 me-3 flex-grow-1">
              <div className="d-flex align-items-center mb-1">
                <h6 className="mb-0">{task.title}</h6>
                <span
                  className={`badge ms-2 ${statusBadgeClass(task.status)}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {task.status.replace("-", " ")}
                </span>
              </div>
              {task.description && (
                <p className="mb-1 text-muted small">{task.description}</p>
              )}
              <small className="text-muted">
                Created: {new Date(task.createdAt).toLocaleString()}
              </small>
            </div>
            <div className="btn-group btn-group-sm">
              <button
                className="btn btn-outline-primary"
                onClick={() => onEdit(task)}
              >
                Edit
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={() => onDelete(task._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  export default TaskList;
  