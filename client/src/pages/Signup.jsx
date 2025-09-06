import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import "../styles/Signup.css"

export default function Signup() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const initialRole = params.get("role") || "student" // detect from URL

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    role: initialRole,
    school_name: "",
    school_address: "",
  })

  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:5050/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (response.ok) {
        navigate("/login")
      } else {
        setMessage(data.error || data.message || "Something went wrong")
      }
    } catch (error) {
      setMessage("Server error: " + error.message)
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up as {values.role}</h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={values.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={values.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={values.password}
          onChange={handleChange}
          required
        />

        {/* Show extra fields only if teacher */}
        {values.role === "teacher" && (
          <>
            <input
              type="text"
              name="school_name"
              placeholder="School Name"
              value={values.school_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="school_address"
              placeholder="School Address"
              value={values.school_address}
              onChange={handleChange}
              required
            />
          </>
        )}

        <p className="error-message">{message}</p>

        <button type="submit">Register</button>

        <p>
          Already have an account?{" "}
          <span>
            <Link to="/login">Login</Link>
          </span>
        </p>
      </form>
    </div>
  )
}
