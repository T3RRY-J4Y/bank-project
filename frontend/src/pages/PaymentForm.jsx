import { useState, useEffect } from "react";
import api from "../services/api";
import { accountRegex, currencyRegex, swiftRegex } from "../utils/validators.js";
import "./PaymentForm.css";

export default function PaymentForm() {
  const [form, setForm] = useState({
    amount: "",
    currency: "ZAR",
    payeeAccount: "",
    swiftCode: "",
  });
  const [msg, setMsg] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const fetchPayments = async () => {
    try {
      const res = await api.get("/api/payments");
      setPayments(res.data);
    } catch {
      setMsg("❌ Failed to load payments.");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    // 🔹 Frontend validation
    if (!form.amount || Number(form.amount) <= 0) {
      setMsg("❌ Amount must be a positive number.");
      setLoading(false);
      return;
    }

    if (!currencyRegex.test(form.currency)) {
      setMsg("❌ Currency must be 3 uppercase letters (e.g., ZAR).");
      setLoading(false);
      return;
    }

    if (!accountRegex.test(form.payeeAccount)) {
      setMsg("❌ Payee account must be 6–20 digits.");
      setLoading(false);
      return;
    }

    if (!swiftRegex.test(form.swiftCode)) {
      setMsg("❌ SWIFT code must be 8–11 uppercase letters/numbers.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/api/payments", form);
      setMsg("✅ Payment created successfully!");
      setForm({ amount: "", currency: "ZAR", payeeAccount: "", swiftCode: "" });
      fetchPayments(); // refresh list
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.message || "Payment failed."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <form className="payment-form" onSubmit={handleSubmit}>
        <h1>Make a Payment</h1>
        <p className="subtitle">Complete the details below to send a payment</p>

        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <input
          name="currency"
          placeholder="Currency"
          value={form.currency}
          onChange={handleChange}
          required
        />

        <input
          name="payeeAccount"
          placeholder="Payee Account"
          value={form.payeeAccount}
          onChange={handleChange}
          required
        />

        <input
          name="swiftCode"
          placeholder="SWIFT Code"
          value={form.swiftCode}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>

        {msg && <p className="message">{msg}</p>}
      </form>

      <div className="payment-list">
        <h2>Your Payments</h2>
        {payments.length === 0 ? (
          <p className="no-payments">No payments yet.</p>
        ) : (
          <ul>
            {payments.map((p) => (
              <li key={p._id} className={`payment-item ${p.status}`}>
                <span>💸 {p.amount} {p.currency}</span>
                <span>→ {p.payeeAccount}</span>
                <span className="status">[{p.status}]</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
