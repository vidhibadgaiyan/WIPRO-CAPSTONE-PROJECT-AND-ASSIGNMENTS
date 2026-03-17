// src/pages/Login.jsx
import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
 
function Login() {
  const navigate = useNavigate();
 
  const [form, setForm] = useState({ email: "", password: "", role: "USER" });
  const [error, setError] = useState("");
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form);
      if (form.role === "OWNER") {
        navigate("/admin/menu");
      } else {
        navigate("/menu");
      }
    } catch (err) {
      setError("Login failed. Check your credentials.");
    }
  };
 
  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <div className="card p-4 shadow">
        <h3 className="mb-3 text-center">Login</h3>
 
        {error && <div className="alert alert-danger">{error}</div>}
 
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <select className="form-select" name="role" onChange={handleChange}>
              <option value="USER">User</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>
          <button className="btn btn-danger w-100" type="submit">Login</button>
        </form>
 
        <p className="text-center mt-3">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
 
export default Login;