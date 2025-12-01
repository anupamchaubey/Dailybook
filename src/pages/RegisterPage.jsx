import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../api";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      setLoading(true);
      const msg = await registerApi(form);
      setInfo(msg || "Registered successfully. You can login now.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (e1) {
      setError(e1.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h1>Register</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {info && <p style={{ color: "green" }}>{info}</p>}

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label>Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
          />
        </div>
        <div className="form-group">
          <label>Password (min 6 chars)</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}

export default RegisterPage;
