import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/Nav/nav-bar.jsx";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Home from "./pages/Home.jsx";
import Focus from "./pages/Focus.jsx";
import Tasks from "./pages/Tasks.jsx";
import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [showLogin, setShowLogin] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLogin = (userData) => setUser(userData);
  const handleRegister = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleSessionComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!user) {
    return (
      <div className="app">
        <header>
          <h1 className="app-title">FocusFlow</h1>
          <p className="app-tagline">Focus. Flow. Finish.</p>
        </header>
        <main id="main-content" className="container">
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
        </main>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app">
        <NavBar user={user} onLogout={handleLogout} />
        <main id="main-content" className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
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
            <Route path="/tasks" element={<Tasks />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;