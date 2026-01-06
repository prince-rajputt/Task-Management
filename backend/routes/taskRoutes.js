const express = require("express");
const router = express.Router();
const { pool, useMemory } = require("../db");

const memoryTasks = [];
let nextId = 1;

// CREATE TASK
router.post("/", async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: "Title required" });

  try {
    if (useMemory) {
      const task = {
        id: nextId++,
        title,
        description: description || "",
        status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
      };
      memoryTasks.push(task);
      req.app.get("io").emit("taskCreated", task);
      console.log("Emitted taskCreated (Memory):", task);
      return res.status(201).json(task);
    } else {
      const result = await pool.query(
        "INSERT INTO tasks(title, description) VALUES($1,$2) RETURNING *",
        [title, description]
      );

      req.app.get("io").emit("taskCreated", result.rows[0]);
      console.log("Emitted taskCreated:", result.rows[0]);
      return res.status(201).json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET ALL TASKS
router.get("/", async (req, res) => {
  const { status } = req.query;
  try {
    if (useMemory) {
      const tasks = status
        ? memoryTasks.filter(t => t.status === status)
        : memoryTasks.slice();
      tasks.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      return res.status(200).json(tasks);
    } else {
      const query = status
        ? pool.query("SELECT * FROM tasks WHERE status=$1 ORDER BY created_at ASC", [status])
        : pool.query("SELECT * FROM tasks ORDER BY created_at ASC");

      const tasks = await query;
      return res.status(200).json(tasks.rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE TASK (Status, Title, Description)
router.patch("/:id", async (req, res) => {
  const { status, title, description } = req.body;
  const { id } = req.params;

  try {
    if (useMemory) {
      const taskId = Number(id);
      const idx = memoryTasks.findIndex(t => t.id === taskId);
      if (idx === -1) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      const updatedTask = {
        ...memoryTasks[idx],
        updated_at: new Date(),
      };

      if (status !== undefined) updatedTask.status = status;
      if (title !== undefined) updatedTask.title = title;
      if (description !== undefined) updatedTask.description = description;

      memoryTasks[idx] = updatedTask;
      req.app.get("io").emit("taskUpdated", memoryTasks[idx]);
      return res.status(200).json(memoryTasks[idx]);
    } else {
      // Build dynamic query
      const fields = [];
      const values = [];
      let paramIndex = 1;

      if (status !== undefined) {
        fields.push(`status=$${paramIndex++}`);
        values.push(status);
      }
      if (title !== undefined) {
        fields.push(`title=$${paramIndex++}`);
        values.push(title);
      }
      if (description !== undefined) {
        fields.push(`description=$${paramIndex++}`);
        values.push(description);
      }

      if (fields.length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      fields.push(`updated_at=NOW()`);
      values.push(id);
      
      const query = `UPDATE tasks SET ${fields.join(", ")} WHERE id=$${paramIndex} RETURNING *`;
      
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
          return res.status(404).json({ error: "Task not found" });
      }

      req.app.get("io").emit("taskUpdated", result.rows[0]);
      return res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE TASK
router.delete("/:id", async (req, res) => {
  try {
    if (useMemory) {
      const taskId = Number(req.params.id);
      const before = memoryTasks.length;
      const afterList = memoryTasks.filter(t => t.id !== taskId);
      if (afterList.length === before) {
        return res.status(404).json({ error: "Task not found" });
      }
      memoryTasks.length = 0;
      memoryTasks.push(...afterList);
      req.app.get("io").emit("taskDeleted", req.params.id);
      return res.status(204).send();
    } else {
      const result = await pool.query("DELETE FROM tasks WHERE id=$1 RETURNING id", [req.params.id]);
      
      if (result.rowCount === 0) {
          return res.status(404).json({ error: "Task not found" });
      }
      
      req.app.get("io").emit("taskDeleted", req.params.id);
      return res.status(204).send();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
