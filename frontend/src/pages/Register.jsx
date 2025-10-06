import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  accountRegex,
  idNumberRegex,
  passwordRegex,
} from "../utils/validators.js";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    idNumber: "",
    accountNumber: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    // 🔹 Frontend validation using regex
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(form.fullName)) {
      setMsg("❌ Full name can only contain letters and spaces.");
      setLoading(false);
      return;
    }

    if (!idNumberRegex.test(form.idNumber)) {
      setMsg("❌ ID number must be 13 digits.");
      setLoading(false);
      return;
    }

    if (!accountRegex.test(form.accountNumber)) {
      setMsg("❌ Account number must contain 6–20 digits.");
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(form.password)) {
      setMsg(
        "❌ Password must have uppercase, lowercase, number, and special character (min 8 chars)."
      );
      setLoading(false);
      return;
    }

    try {
      await api.post("/api/auth/register", form);

      setMsg("✅ Registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
      setForm({ fullName: "", idNumber: "", accountNumber: "", password: "" });
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.message || "Registration failed."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <p className="subtitle">Join us to get started</p>

        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <input
          name="idNumber"
          placeholder="ID Number"
          value={form.idNumber}
          onChange={handleChange}
          required
        />
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
          {loading ? "Registering..." : "Register"}
        </button>

        {msg && <p className="message">{msg}</p>}

        <p className="link-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
}
