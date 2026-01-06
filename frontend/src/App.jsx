import React, { useState } from "react";
import { useTasks } from "./hooks/useTasks";
import { api } from "./services/api";

function App() {
  const { tasks } = useTasks();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const updateTask = (id, updates) => {
    api.patch(`/tasks/${id}`, updates);
  };
  const toggleComplete = (task) => {
    const next = task.status === "completed" ? "pending" : "completed";
    updateTask(task.id, { status: next });
  };

  const createTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    api.post("/tasks", { title: newTaskTitle, description: newTaskDescription });
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  const deleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
        api.delete(`/tasks/${id}`);
    }
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = () => {
    if (editTitle.trim()) {
        updateTask(editingId, { title: editTitle });
        setEditingId(null);
        setEditTitle("");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  return (
    <div className="app">
      <div className="header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/vite.svg" alt="App Logo" className="logo" />
          <div className="title">Task Manager</div>
        </div>
      </div>

      <form onSubmit={createTask} className="task-form">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task"
          className="input"
        />
        <input
          type="text"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          placeholder="Description (optional)"
          className="input"
        />
        <button type="submit" className="btn btn-primary">Add Task</button>
      </form>

      <div className="filters">
        <button
          onClick={() => setFilter("all")}
          className={`tab ${filter === "all" ? "active" : ""}`}
        >
          🗂️ View All
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`tab ${filter === "pending" ? "active" : ""}`}
        >
          ⏳ Pending
        </button>
        <button
          onClick={() => setFilter("in-progress")}
          className={`tab ${filter === "in-progress" ? "active" : ""}`}
        >
          🚧 In-Progress
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`tab ${filter === "completed" ? "active" : ""}`}
        >
          ✅ Completed
        </button>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 && <p className="subtitle">No tasks found.</p>}
        {filteredTasks.map(task => (
          <div key={task.id} className="task-card">
            {editingId === task.id ? (
              <div className="task-top" style={{ gap: 10 }}>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input"
                />
                <button onClick={saveEdit} className="btn btn-success">Save</button>
                <button onClick={cancelEdit} className="btn btn-danger">Cancel</button>
              </div>
            ) : (
              <div className="task-top">
                <div className="task-left">
                  <button
                    className={`tick ${task.status === "completed" ? "tick-checked" : ""}`}
                    onClick={() => toggleComplete(task)}
                    aria-label="Toggle complete"
                  />
                  <div
                    className="task-title"
                    style={{
                      textDecoration: task.status === "completed" ? "line-through" : "none",
                      color: task.status === "completed" ? "#a1a1aa" : "#fff"
                    }}
                  >
                    {task.title}
                  </div>
                  {task.description && (
                    <div className="subtitle" style={{ marginTop: 6 }}>{task.description}</div>
                  )}
                  <div style={{ marginTop: 6 }}>
                    <span className={`badge ${
                      task.status === "completed" ? "badge-completed" :
                      task.status === "in-progress" ? "badge-inprogress" : "badge-pending"
                    }`}>
                      {task.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="task-actions">
                  <button onClick={() => startEditing(task)} className="btn btn-ghost">Edit</button>
                  <select
                    className="select"
                    value={task.status}
                    onChange={(e) => updateTask(task.id, { status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button onClick={() => deleteTask(task.id)} className="icon-btn" aria-label="Delete">
                    <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M9 3h6a1 1 0 0 1 1 1v2h4a1 1 0 1 1 0 2h-1v12a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8H4a1 1 0 1 1 0-2h4V4a1 1 0 0 1 1-1Zm1 3h4V5h-4v1ZM8 8v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8H8Z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            )}
            <div className="task-meta">
              <div>
                Created: {task.created_at ? new Date(task.created_at).toLocaleString() : "-"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
