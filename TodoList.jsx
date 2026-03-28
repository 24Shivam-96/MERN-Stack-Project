import { useState, useEffect, useRef } from "react";
import axios from "axios";
import TodoItem from "./TodoItem";

const TodoList = ({ user, onLogout }) => {
  const [newTodo, setNewTodo] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDueAt, setNewDueAt] = useState("");
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [toast, setToast] = useState("");
  const reminderTimers = useRef({});

  useEffect(() => {
    fetchTodos();
    return () => {
      Object.values(reminderTimers.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) setFilteredTodos(todos);
    else {
      const q = searchQuery.toLowerCase();
      setFilteredTodos(
        todos.filter(
          (t) =>
            t.text.toLowerCase().includes(q) ||
            (t.description && t.description.toLowerCase().includes(q)) ||
            (t.priority && t.priority.toLowerCase().includes(q))
        )
      );
    }
  }, [searchQuery, todos]);

  const fetchTodos = async () => {
    try {
      const res = await axios.get("/api/todos");
      setTodos(res.data);
      setFilteredTodos(res.data);
      res.data.forEach(scheduleReminder);
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) onLogout();
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const notify = (title, body) => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    } else {
      alert(`${title}\n${body}`);
    }
  };

  const scheduleReminder = (todo) => {
    if (reminderTimers.current[todo._id]) {
      clearTimeout(reminderTimers.current[todo._id]);
      delete reminderTimers.current[todo._id];
    }
    if (!todo?.dueAt || todo.completed) return;
    const delay = new Date(todo.dueAt).getTime() - Date.now();
    if (delay <= 0) return;
    const id = setTimeout(() => {
      notify("Task reminder", `"${todo.text}" is due now.`);
      delete reminderTimers.current[todo._id];
    }, Math.min(delay, 2147483647));
    reminderTimers.current[todo._id] = id;
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const payload = {
        text: newTodo,
        description: newDescription,
        priority: newPriority,
      };
      if (newDueAt) payload.dueAt = new Date(newDueAt).toISOString();

      const res = await axios.post("/api/todos", payload);
      setTodos([...todos, res.data]);
      setFilteredTodos([...todos, res.data]);
      setNewTodo("");
      setNewDescription("");
      setNewPriority("Medium");
      setNewDueAt("");
      showToast("Task added");
      scheduleReminder(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const saveEdit = async (id, updatedFields = null) => {
    try {
      const payload = updatedFields || { text: editedText };
      const res = await axios.patch(`/api/todos/${id}`, payload);
      const updatedTodos = todos.map((t) => (t._id === id ? res.data : t));
      setTodos(updatedTodos);
      setFilteredTodos(updatedTodos);
      scheduleReminder(res.data);
      setEditingTodo(null);
      setEditedText("");
    } catch (err) {
      console.log(err);
    }
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setEditedText("");
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      const updatedTodos = todos.filter((t) => t._id !== id);
      setTodos(updatedTodos);
      setFilteredTodos(updatedTodos);
      if (reminderTimers.current[id]) {
        clearTimeout(reminderTimers.current[id]);
        delete reminderTimers.current[id];
      }
    } catch (err) {
      console.log(err);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const res = await axios.patch(`/api/todos/${id}`, { completed: !todo.completed });
      const updatedTodos = todos.map((t) => (t._id === id ? res.data : t));
      setTodos(updatedTodos);
      setFilteredTodos(updatedTodos);

      if (res.data.completed && reminderTimers.current[id]) {
        clearTimeout(reminderTimers.current[id]);
        delete reminderTimers.current[id];
      } else if (!res.data.completed) scheduleReminder(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {!!toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-slate-700 text-white px-4 py-2 rounded shadow-lg border border-slate-500 z-50">
          {toast}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-white">Task Manager</h1>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>

      <div className="text-white text-center mb-4">Welcome, {user?.username || "User"}!</div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by title, description, or priority..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 mb-4 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500"
      />

      {/* Add Task Form */}
      <form
        onSubmit={addTodo}
        className="flex flex-col gap-3 shadow-lg border border-slate-600 p-4 rounded-xl bg-slate-700 mb-6"
      >
        <input
          type="text"
          placeholder="Task Title"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          required
          className="px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500"
        />
        <textarea
          placeholder="Task Description (optional)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 resize-none"
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
          className="px-4 py-2 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-purple-500"
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>
        <input
          type="datetime-local"
          value={newDueAt}
          onChange={(e) => setNewDueAt(e.target.value)}
          className="px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          Add Task
        </button>
      </form>

      {/* Todo Items */}
      <div className="flex flex-col gap-4">
        {filteredTodos.length === 0 ? (
          <div className="text-slate-400 text-center">No tasks found.</div>
        ) : (
          filteredTodos.map((todo, index) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              index={index}
              editingTodo={editingTodo}
              editedText={editedText}
              onStartEditing={startEditing}
              onSaveEdit={saveEdit}
              onCancelEdit={cancelEdit}
              onToggleTodo={toggleTodo}
              onDeleteTodo={deleteTodo}
              onEditedTextChange={setEditedText}
            />
          ))
        )}
      </div>
    </>
  );
};

export default TodoList;
