import { useEffect, useState } from "react";
import axios from "axios";
import Auth from "./components/Auth.jsx";
import TodoList from "./components/TodoList.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await axios.get("/api/auth/verify");

        if (res.data.valid) {
          setUser(res.data.user);
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Token verification failed:", err);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();

    // Request notification permission
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  const notify = (title, body) => {
    try {
      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification(title, { body });
      } else {
        alert(`${title}\n${body}`);
      }
    } catch {
      alert(`${title}\n${body}`);
    }
  };

  const handleLogin = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    setUser(userData);
    setIsLoggedIn(true);

    // Show banner after login
    setBanner(
      `Welcome back${userData?.username ? ", " + userData.username : ""}!`
    );
    setTimeout(() => setBanner(""), 3000);
  };

  const handleSignup = () => {
    alert("Signup successful! Please login to continue.");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setIsLoggedIn(false);
    notify("Logout", "You have been logged out successfully.");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Banner */}
      {!!banner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg border border-emerald-400">
          <div className="font-semibold">{banner}</div>
          <div className="text-xs opacity-95 mt-1">
            Manage your tasks easily — add title, description, priority & due
            date.
          </div>
        </div>
      )}

      {/* Background gradients */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />

      {/* Top-right title */}
      <div className="absolute top-4 right-4 text-white text-2xl font-extrabold italic font-serif text-right drop-shadow-lg">
        MERN Todo List Project
        <br />
        <span className="text-sm font-normal italic">
          Guided by — Lalit Patil Sir
        </span>
      </div>

      {/* Right tips panel */}
      <aside className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-80 bg-slate-800/60 rounded-2xl border border-slate-700 p-5 backdrop-blur shadow-xl">
        <h2 className="text-white font-semibold text-lg mb-3">
          Make the most of your Todo
        </h2>
        <ul className="space-y-2 text-slate-300 text-sm list-disc pl-5">
          <li>Add tasks with title, description & priority</li>
          <li>Set a due date for reminders</li>
          <li>Search your tasks anytime</li>
          <li>Mark as done, edit, or delete easily</li>
        </ul>
        <div className="mt-4 text-xs text-slate-400">
          Tip: Enable browser notifications for alerts when tasks are due.
        </div>
      </aside>

      {/* Left motivational panel */}
      <aside className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 w-80 bg-slate-800/60 rounded-2xl border border-slate-700 p-5 backdrop-blur shadow-xl">
        <h2 className="text-white font-semibold text-lg mb-3">
          Stay motivated
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          "Small progress every day adds up to big results." Keep adding tasks
          and completing them.
        </p>
        <div className="mt-4 text-xs text-slate-400">
          Pro tip: Use priorities to organize your day better.
        </div>
      </aside>

      {/* Main content card */}
      <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-lg p-8 transition-all duration-300 hover:shadow-purple-500/20">
        {!isLoggedIn ? (
          <Auth onLogin={handleLogin} onSignup={handleSignup} />
        ) : (
          <TodoList user={user} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}

export default App;
