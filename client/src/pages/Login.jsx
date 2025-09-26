import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/SignUp.css";

export default function Login() {
  const [values, setValues] = useState({ userid: "", password: "", role: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        const user = JSON.parse(localStorage.getItem("user"));

        if (user.role === "teacher") navigate("/admin");
        else if (user.role === "student") navigate("/student");
        else setMessage("Invalid role");
      } else {
        setMessage(data.message || data.error || "Something went wrong");
      }
    } catch (error) {
      setMessage("Server error: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Login</h2>
        <input
          type="text"
          className="login-input"
          placeholder="Email/Username"
          onChange={(e) => setValues({ ...values, userid: e.target.value })}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          onChange={(e) => setValues({ ...values, password: e.target.value })}
          required
        />
        <select
          className="login-select"
          name="role"
          onChange={(e) => setValues({ ...values, role: e.target.value })}
          required
        >
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        {message && <p className="error-message">{message}</p>}
        <button type="submit" className="login-btn">Login</button>
        <p className="signup-text">
          You don't have an account?{" "}
          <span><Link to="/sign-up" className="signup-link">Sign Up</Link></span>
        </p>
      </form>
    </div>
  );
}
