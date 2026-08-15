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
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">My Tasks</h2>
          <button
            onClick={logout}
            className="text-sm text-slate-500 hover:text-red-500 font-medium transition"
          >
            Logout
          </button>
        </div>

        <form onSubmit={addTask} className="flex gap-2 mb-6">
          <input
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-5 py-2.5 text-sm transition"
          >
            Add
          </button>
        </form>

        <div className="bg-white rounded-2xl shadow-lg divide-y divide-slate-100">
          {tasks.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-8">
              No tasks yet — add one above.
            </p>
          )}
          {tasks.map((task) => (
            <div key={task._id} className="flex items-center justify-between px-5 py-4">
              <span
                onClick={() => toggleComplete(task)}
                className={`cursor-pointer text-sm ${
                  task.completed ? 'line-through text-slate-400' : 'text-slate-700'
                }`}
              >
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task._id)}
                className="text-xs text-red-500 hover:text-red-700 font-medium transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}