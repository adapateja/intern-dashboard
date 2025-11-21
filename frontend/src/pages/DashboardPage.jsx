import { useEffect, useState } from "react";
import api from "../api/axiosInstance.js";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";
import useAuth from "../hooks/useAuth.js";

function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [savingTask, setSavingTask] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editableTask, setEditableTask] = useState(null);
  const [error, setError] = useState("");

  const fetchTasks = async (params = {}) => {
    try {
      setLoadingTasks(true);
      setError("");
      const { data } = await api.get("/tasks", { params });
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSearchFilter = (e) => {
    e.preventDefault();
    fetchTasks({
      search: search || undefined,
      status: statusFilter || undefined,
    });
  };

  const handleCreateOrUpdate = async (form, resetForm) => {
    try {
      setSavingTask(true);
      setError("");
      if (editableTask) {
        const { data } = await api.put(`/tasks/${editableTask._id}`, form);
        setTasks((prev) =>
          prev.map((t) => (t._id === editableTask._id ? data : t))
        );
        setEditableTask(null);
      } else {
        const { data } = await api.post("/tasks", form);
        setTasks((prev) => [data, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save task");
    } finally {
      setSavingTask(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      if (editableTask && editableTask._id === id) {
        setEditableTask(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <h2 className="mb-2">Dashboard</h2>
        <p className="mb-2 text-muted">
          Logged in as <strong>{user?.email}</strong>
        </p>
      </div>

      <TaskForm
        onSubmit={handleCreateOrUpdate}
        loading={savingTask}
        editableTask={editableTask}
      />

      <div className="card card-body mb-3 shadow-sm">
        <form
          className="row gy-2 gx-2 align-items-end"
          onSubmit={handleSearchFilter}
        >
          <div className="col-md-6">
            <label className="form-label">Search</label>
            <input
              className="form-control"
              placeholder="Search tasks by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="col-md-3 d-grid">
            <button type="submit" className="btn btn-outline-primary">
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loadingTasks ? (
        <div className="text-center py-4">
          <div className="spinner-border" role="status" />
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          onEdit={(task) => setEditableTask(task)}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}

export default DashboardPage;
