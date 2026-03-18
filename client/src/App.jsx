import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/Nav/nav-bar.jsx";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Home from "./pages/Home";
import Focus from "./pages/Focus";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleSessionComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Not logged in
  if (!user) {
    return (
      <div className="app">
        <h1 className="app-title">FocusFlow</h1>
        {showLogin ? (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setShowLogin(false)}
          />
        ) : (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={() => setShowLogin(true)}
          />
        )}
      </div>
    );
  }

  // Logged in
  return (
    <BrowserRouter>
      <div className="app">
        <NavBar user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route
              path="/home"
              element={<Home refreshTrigger={refreshTrigger} />}
            />
            <Route
              path="/focus"
              element={
                <Focus
                  refreshTrigger={refreshTrigger}
                  onSessionComplete={handleSessionComplete}
                />
              }
            />
            <Route
              path="/tasks"
              element={<div className="placeholder">Tasks - Vee</div>}
            />
            <Route
              path="/calendar"
              element={<div className="placeholder">Calendar - Vee</div>}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
