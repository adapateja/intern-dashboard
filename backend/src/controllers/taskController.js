// Task controller
import { Task } from "../models/Task.js";

// GET /api/tasks?search=&status=
export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { search, status } = req.query;

    const query = { user: userId };
    if (status && ["pending", "in-progress", "completed"].includes(status)) {
      query.status = status;
    }
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      user: userId,
      title,
      description: description || "",
      status: status || "pending",
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { title, description, status } = req.body;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (
      status !== undefined &&
      ["pending", "in-progress", "completed"].includes(status)
    ) {
      task.status = status;
    }

    const updated = await task.save();
    res.json(updated);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid task id" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();
    res.json({ message: "Task removed" });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid task id" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

