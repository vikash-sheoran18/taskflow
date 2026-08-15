const express = require('express');
const Task = require('../models/Task');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// CREATE a task
router.post('/', protect, async (req, res) => {
  const task = await Task.create({ title: req.body.title, user: req.userId });
  res.status(201).json(task);
});

// READ all tasks belonging to the logged-in user
router.get('/', protect, async (req, res) => {
  const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(tasks);
});

// UPDATE a task (e.g. mark complete, edit title)
router.put('/:id', protect, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.userId }, // only update if it belongs to this user
    req.body,
    { new: true }
  );
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

// DELETE a task
router.delete('/:id', protect, async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted' });
});

module.exports = router;