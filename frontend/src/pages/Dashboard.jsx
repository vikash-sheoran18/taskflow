import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const { token, logout } = useAuth();

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const res = await api.get('/tasks', authHeader);
    setTasks(res.data);
  }

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await api.post('/tasks', { title }, authHeader);
    setTitle('');
    loadTasks();
  }

  async function toggleComplete(task) {
    await api.put(`/tasks/${task._id}`, { completed: !task.completed }, authHeader);
    loadTasks();
  }

  async function deleteTask(id) {
    await api.delete(`/tasks/${id}`, authHeader);
    loadTasks();
  }

  return (
    <div>
      <button onClick={logout}>Logout</button>
      <h2>My Tasks</h2>
      <form onSubmit={addTask}>
        <input placeholder="New task..." value={title}
          onChange={(e) => setTitle(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              onClick={() => toggleComplete(task)}>
              {task.title}
            </span>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}