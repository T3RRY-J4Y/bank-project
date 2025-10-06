import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PaymentForm from "./pages/PaymentForm";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css"; 

function App() {
  return (
    <Router>
      <header className="navbar">
        <nav>
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Register
          </NavLink>
          <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Login
          </NavLink>
          <NavLink to="/payment" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Payments
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Admin
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
