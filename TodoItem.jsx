import { useState } from "react";
import { MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { FiClock } from "react-icons/fi";

const TodoItem = ({
  todo,
  index,
  editingTodo,
  editedText,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onToggleTodo,
  onDeleteTodo,
  onEditedTextChange
}) => {
  const [editDescription, setEditDescription] = useState(todo.description || "");
  const [editPriority, setEditPriority] = useState(todo.priority || "Medium");
  const [editDueAt, setEditDueAt] = useState(todo.dueAt ? todo.dueAt.slice(0, 16) : "");
  const [showDetails, setShowDetails] = useState(false);

  const dueLabel = todo?.dueAt ? new Date(todo.dueAt).toLocaleString() : null;
  const isOverdue = todo?.dueAt ? new Date(todo.dueAt).getTime() < Date.now() && !todo.completed : false;

  const handleSave = () => {
    onSaveEdit(todo._id, {
      text: editedText,
      description: editDescription,
      priority: editPriority,
      dueAt: editDueAt ? new Date(editDueAt).toISOString() : null
    });
  };

  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {editingTodo === todo._id ? (
        <div className="flex flex-col gap-2 bg-slate-700 p-4 rounded-xl border border-slate-600 transition-all duration-200 hover:shadow-purple-500/20">
          <input
            type="text"
            value={editedText}
            onChange={(e) => onEditedTextChange(e.target.value)}
            className="flex-1 p-2 border rounded-lg border-slate-500 outline-none focus:ring-2 focus:ring-purple-500 text-white bg-slate-600 placeholder-slate-400 transition-all duration-200"
            placeholder="Task Title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="flex-1 p-2 border rounded-lg border-slate-500 outline-none focus:ring-2 focus:ring-purple-500 text-white bg-slate-600 placeholder-slate-400 transition-all duration-200 resize-none"
            placeholder="Description"
          />
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value)}
            className="flex-1 p-2 border rounded-lg border-slate-500 outline-none focus:ring-2 focus:ring-purple-500 text-white bg-slate-600 transition-all duration-200"
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
          <input
            type="datetime-local"
            value={editDueAt}
            onChange={(e) => setEditDueAt(e.target.value)}
            className="flex-1 p-2 border rounded-lg border-slate-500 outline-none focus:ring-2 focus:ring-purple-500 text-white bg-slate-600 transition-all duration-200"
          />
          <div className="flex gap-x-2 mt-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer transition-all duration-200 hover:scale-110"
            >
              <MdOutlineDone />
            </button>
            <button
              onClick={onCancelEdit}
              className="px-4 py-2 bg-slate-500 text-slate-300 rounded-lg hover:bg-slate-400 cursor-pointer transition-all duration-200 hover:scale-110"
            >
              <IoClose />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-700 p-4 rounded-xl border border-slate-600 transition-all duration-200 hover:bg-slate-600 hover:shadow-purple-500/30 hover:scale-102">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-4 overflow-hidden">
              <button
                onClick={() => onToggleTodo(todo._id)}
                className={`flex-shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                  todo.completed ? "bg-green-600 border-green-600 text-white" : "border-slate-500 hover:border-purple-400"
                }`}
              >
                {todo.completed && <MdOutlineDone className="text-xs" />}
              </button>
              <span className={`truncate font-medium transition-all duration-200 ${todo.completed ? "text-slate-400 line-through" : "text-white"}`}>
                {todo.text}
              </span>
            </div>
            <div className="flex gap-x-2">
              <button
                className="p-2 text-purple-400 hover:text-purple-300 rounded-lg hover:bg-purple-900/50 duration-200 transition-all hover:scale-110"
                onClick={() => onStartEditing(todo)}
              >
                <MdModeEditOutline />
              </button>
              <button
                onClick={() => onDeleteTodo(todo._id)}
                className="p-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-900/50 duration-200 transition-all hover:scale-110"
              >
                <FaTrash />
              </button>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-900/50 duration-200 transition-all hover:scale-110 text-sm"
              >
                {showDetails ? "Hide Details" : "View Details"}
              </button>
            </div>
          </div>

          {showDetails && (
            <div className="mt-3 flex flex-col gap-1 text-slate-200 text-sm">
              {todo.description && <div><strong>Description:</strong> {todo.description}</div>}
              {todo.priority && <div><strong>Priority:</strong> {todo.priority}</div>}
              {todo.dueAt && <div><strong>Due:</strong> {new Date(todo.dueAt).toLocaleString()}</div>}
            </div>
          )}

          {dueLabel && (
            <div className="mt-3">
              <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  isOverdue ? "bg-red-500/10 text-red-300 border-red-500/40" : "bg-slate-600/40 text-slate-200 border-slate-500/50"
                }`} title={isOverdue ? "This task is pending" : "Task due date"}>
                <FiClock className="text-sm" />
                <span className="max-w-full break-words">{dueLabel}</span>
                {isOverdue && <span className="ml-1">• Pending</span>}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoItem;
