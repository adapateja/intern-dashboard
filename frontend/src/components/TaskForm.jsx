import { useEffect, useState } from "react";

const initialState = {
  title: "",
  description: "",
  status: "pending",
};

function TaskForm({ onSubmit, loading, editableTask }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editableTask) {
      setForm({
        title: editableTask.title || "",
        description: editableTask.description || "",
        status: editableTask.status || "pending",
      });
      setErrors({});
    } else {
      setForm(initialState);
      setErrors({});
    }
  }, [editableTask]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) {
      errs.title = "Title is required";
    } else if (form.title.trim().length < 3) {
      errs.title = "Title must be at least 3 characters";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form, () => setForm(initialState));
  };

  return (
    <form onSubmit={handleSubmit} className="card card-body mb-4 shadow-sm">
      <h5 className="mb-3">
        {editableTask ? "Edit Task" : "Create New Task"}
      </h5>
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          name="title"
          className={`form-control ${errors.title ? "is-invalid" : ""}`}
          value={form.title}
          onChange={handleChange}
          placeholder="Task title"
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          value={form.description}
          onChange={handleChange}
          placeholder="Optional description"
          rows={3}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Status</label>
        <select
          name="status"
          className="form-select"
          value={form.status}
          onChange={handleChange}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Saving..." : editableTask ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
}

export default TaskForm;
