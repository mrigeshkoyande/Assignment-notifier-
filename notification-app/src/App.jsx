import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import SubjectPage from "./pages/SubjectPage";
import About from "./pages/About";
import NewAssignment from "./pages/NewAssignment";
import "./App.css";

function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="main-area">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subject/:code" element={<SubjectPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/new" element={<NewAssignment />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
