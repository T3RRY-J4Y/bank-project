import { useState } from "react";
import api from "../services/api";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const [payments, setPayments] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    if (!form.username) {
      setMsg("❌ Username is required.");
      setLoading(false);
      return;
    }
    if (!form.password) {
      setMsg("❌ Password is required.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/api/admin/login", form);
      setLoggedIn(true);
      setMsg(`✅ ${res.data.message || "Admin logged in successfully."}`);
      await fetchPayments();
    } catch (err) {
      setMsg(
        `❌ ${err.response?.data?.message || "Login failed. Check credentials."}`
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    setFetching(true);
    try {
      const res = await api.get("/api/admin/payments");
      setPayments(res.data);
      setMsg("");
    } catch (err) {
      setMsg(
        `❌ ${err.response?.data?.message || "Failed to load payments."}`
      );
    } finally {
      setFetching(false);
    }
  };

  const verifyPayment = async (id) => {
    try {
      // Mark this payment as verifying
      setPayments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, verifying: true } : p))
      );

      const res = await api.post(`/api/admin/payments/${id}/verify`);
      setMsg(`✅ ${res.data.message || "Payment verified successfully."}`);

      // Refresh all payments
      await fetchPayments();
    } catch (err) {
      setMsg(
        `❌ ${err.response?.data?.message || "Could not verify payment."}`
      );
    } finally {
      // Remove verifying flag
      setPayments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, verifying: false } : p))
      );
    }
  };

  if (!loggedIn) {
    return (
      <div className="admin-login-container">
        <form className="admin-login-form" onSubmit={handleLogin}>
          <h1>Admin Login</h1>
          <p className="subtitle">Enter your credentials</p>

          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {msg && <p className="message">{msg}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
        <button
          className="refresh-btn"
          onClick={fetchPayments}
          disabled={fetching}
        >
          {fetching ? "Refreshing..." : "Refresh Payments"}
        </button>
      </header>

      {msg && <p className="message">{msg}</p>}

      <div className="payment-table">
        <h2>All Payments</h2>
        {payments.length === 0 ? (
          <p className="no-data">No payments found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Currency</th>
                <th>User</th>
                <th>Payee</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.amount}</td>
                  <td>{p.currency}</td>
                  <td>{p.userId?.fullName || "Unknown"}</td>
                  <td>{p.payeeAccount}</td>
                  <td className={p.status.toLowerCase()}>{p.status}</td>
                  <td>
                    <button
                      onClick={() => verifyPayment(p._id)}
                      className="verify-btn"
                      disabled={
                        p.status.toLowerCase() === "verified" || p.verifying
                      }
                    >
                      {p.status.toLowerCase() === "verified"
                        ? "Verified"
                        : p.verifying
                        ? "Verifying..."
                        : "Verify"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
