import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { accountRegex } from "../utils/validators.js";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ accountNumber: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    // 🔹 Frontend validation
    if (!accountRegex.test(form.accountNumber)) {
      setMsg("❌ Account number must contain 6–20 digits.");
      setLoading(false);
      return;
    }

    if (!form.password) {
      setMsg("❌ Password is required.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/api/auth/login", form);

      setMsg("✅ Login successful! Redirecting...");
      setTimeout(() => navigate("/payment"), 1200);
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.message || "Invalid credentials."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Welcome Back</h1>
        <p className="subtitle">Please log in to continue</p>

        <input
          name="accountNumber"
          placeholder="Account Number"
          value={form.accountNumber}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {msg && <p className="message">{msg}</p>}

        <p className="link-text">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </form>
    </div>
  );
}
