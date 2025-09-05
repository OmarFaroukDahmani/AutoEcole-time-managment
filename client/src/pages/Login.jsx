import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/Signup.css"

export default function Login() {
  const [values, setValues] = useState({
    userid: "",
    password: "",
  })
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:5050/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data))
        navigate("/")
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
          placeholder="Email/Username"
          onChange={(e) => setValues({ ...values, userid: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setValues({ ...values, password: e.target.value })}
        />
        <p>{message}</p>
        <button type="submit">Login</button>
        <p>
          You don't have an account?{" "}
          <span>
            <Link to="/signup">Sign Up</Link>
          </span>
        </p>
      </form>
    </div>
  )
}
