import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/Nav/nav-bar.jsx";
import Home from "./Pages/Home.jsx";
import Focus from "./Pages/Focus.jsx";
import Tasks from "./Pages/Tasks.jsx";
import Calendar from "./Pages/Calendar.jsx";

function App() {
  return (
    <>
      <NavBar />
      <div class="container">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/TODO" element={<Home />} />
            <Route path="/Late" element={<Home />} />
            <Route path="/Done" element={<Home />} />
            <Route path="/Focus" element={<Focus />} />
            <Route path="/Tasks" element={<Tasks />} />
            <Route path="/Calendar" element={<Calendar />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
