// src/pages/Login.jsx
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", { email, password });
      
      localStorage.setItem("token", res.data.token);
      setToken(res?.data?.token);
      toast.success("Login successful");
      setTimeout(() => navigate("/search"), 500);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Invalid credentials");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-light vh-100">
      <div className="card shadow p-4" style={{ width: "350px" }}>
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <p className="text-center mt-3">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            style={{
              color: "blue",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Create one here
          </span>
        </p>
      </div>
    </div>
  );
}
