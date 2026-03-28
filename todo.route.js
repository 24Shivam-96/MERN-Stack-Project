import express from "express";
import Todo from "../models/todo.model.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all todos for the logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new todo
router.post("/", protect, async (req, res) => {
  const { text, description, dueAt, priority } = req.body;
  try {
    const newTodo = await Todo.create({
      text,
      description,
      dueAt,
      priority: priority || "Medium",
      user: req.user._id,
    });
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Update task (text, status, priority, due date, or description)
router.patch("/:id", protect, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    const fields = ["text", "description", "completed", "priority", "dueAt"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) todo[field] = req.body[field];
    });

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ New: Filter by status/priority
router.get("/filter", protect, async (req, res) => {
  try {
    const { status, priority } = req.query;
    const query = { user: req.user._id };

    if (status === "completed") query.completed = true;
    else if (status === "pending") query.completed = false;

    if (priority) query.priority = priority;

    const todos = await Todo.find(query).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete
router.delete("/:id", protect, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
