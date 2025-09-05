import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/Signup.css"


export default function Signup() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

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
        setMessage(data.error || "Something went wrong")
      }
    } catch (error) {
      setMessage("Server error: " + error.message)
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setValues({ ...values, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setValues({ ...values, password: e.target.value })}
        />
        <p>{message}</p>
        <button type="submit">Register</button>
        <p>
          You have an account?{" "}
          <span>
            <Link to="/login">Login</Link>
          </span>
        </p>
      </form>
    </div>
  )
}
