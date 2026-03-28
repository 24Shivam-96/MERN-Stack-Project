import { useState } from "react";
import axios from "axios";

const Auth = ({ onLogin, onSignup }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [authForm, setAuthForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [authError, setAuthError] = useState("");

  const handleAuthFormChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const response = await axios.post(endpoint, authForm);
      const { token: newToken, ...userData } = response.data;

      if (isSignup) {
        // Stay on Auth page and switch to login view
        setIsSignup(false);
        onSignup(); // show alert in App.jsx
      } else {
        // Login case
        onLogin(newToken, userData);
      }

      setAuthForm({ username: "", email: "", password: "" });
    } catch (error) {
      setAuthError(error.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-8 text-center animate-pulse">
        {isSignup ? "Sign Up" : "Login"}
      </h1>
      <form onSubmit={handleAuthSubmit} className="space-y-4">
        {isSignup && (
          <input
            className="w-full p-3 border rounded-lg border-slate-500 outline-none focus:ring-2 focus:ring-purple-500 text-white bg-slate-700 placeholder-slate-400 transition-all duration-200"
            type="text"
            name="username"
            value={authForm.username}
            onChange={handleAuthFormChange}
            placeholder="Username"
            required
          />
        )}
        <input
          className="w-full p-3 border rounded-lg border-slate-500 outline-none focus:ring-2 focus:ring-purple-500 text-white bg-slate-700 placeholder-slate-400 transition-all duration-200"
          type="email"
          name="email"
          value={authForm.email}
          onChange={handleAuthFormChange}
          placeholder="Email"
          required
        />
        <input
          className="w-full p-3 border rounded-lg border-slate-500 outline-none focus:ring-2 focus:ring-purple-500 text-white bg-slate-700 placeholder-slate-400 transition-all duration-200"
          type="password"
          name="password"
          value={authForm.password}
          onChange={handleAuthFormChange}
          placeholder="Password"
          required
        />
        {authError && <p className="text-red-400 text-center">{authError}</p>}
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>
      </form>
      <p className="text-center text-slate-400 mt-4">
        {isSignup ? "Already have an account?" : "Don't have an account?"}
        <button
          onClick={() => setIsSignup(!isSignup)}
          className="text-purple-400 hover:text-purple-300 ml-2"
        >
          {isSignup ? "Login" : "Sign Up"}
        </button>
      </p>
    </>
  );
};

export default Auth;
