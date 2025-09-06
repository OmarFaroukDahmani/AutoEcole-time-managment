import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Log.css";

export default function Test() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState({
    username: "",
    email: "",
    password: "",
    school_name: "",
    school_address: "",
    government: "",
  });
  const [student, setStudent] = useState({
    username: "",
    email: "",
    password: "",
    teacherId: "",
  });
  const [role, setRole] = useState({ role: "" });

  const handleStudentChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };
  const handleTeacherChange = (e) => {
    setTeacher({ ...teacher, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body =
        role.role === "teacher"
          ? { ...teacher, role: "teacher" }
          : { ...student, role: "student", teacherId: Number(student.teacherId) };

      const response = await fetch("http://localhost:5050/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/login");
      } else {
        setMessage(data.error || data.message || "Something went wrong");
      }
    } catch (error) {
      setMessage("Server error: " + error.message);
    }
  };

  return (
    <div className="signup-container">
      {role.role === "" && (
        <div className="role-selection">
          <button className="role-btn teacher-btn" onClick={() => setRole({ role: "teacher" })}>
            Teacher
          </button>
          <button className="role-btn student-btn" onClick={() => setRole({ role: "student" })}>
            Student
          </button>
        </div>
      )}

      {role.role === "teacher" && (
        <div className="form-wrapper">
          <h1 className="form-title">Teacher Sign Up</h1>
          <form className="form" onSubmit={handleSubmit}>
            <input className="form-input" type="text" name="username" placeholder="Username" onChange={handleTeacherChange} required />
            <input className="form-input" type="email" name="email" placeholder="Email" onChange={handleTeacherChange} required />
            <input className="form-input" type="password" name="password" placeholder="Password" onChange={handleTeacherChange} required />
            <input className="form-input" type="text" name="school_name" placeholder="School Name" onChange={handleTeacherChange} required />
            <input className="form-input" type="text" name="school_address" placeholder="School Address" onChange={handleTeacherChange} required />

            <label htmlFor="government" className="form-label">Government</label>
            <select className="form-select" name="government" value={teacher.government} onChange={(e) => setTeacher({ ...teacher, government: e.target.value })} required>
              <option value="">Select Government</option>
              <option value="Tunis">Tunis</option>
              <option value="Ariana">Ariana</option>
              <option value="Ben Arous">Ben Arous</option>
              <option value="Manouba">Manouba</option>
              <option value="Nabeul">Nabeul</option>
              <option value="Zaghouan">Zaghouan</option>
              <option value="Bizerte">Bizerte</option>
              <option value="Béja">Béja</option>
              <option value="Jendouba">Jendouba</option>
              <option value="Kef">Kef</option>
              <option value="Siliana">Siliana</option>
              <option value="Sousse">Sousse</option>
              <option value="Monastir">Monastir</option>
              <option value="Mahdia">Mahdia</option>
              <option value="Sfax">Sfax</option>
              <option value="Kairouan">Kairouan</option>
              <option value="Kasserine">Kasserine</option>
              <option value="Sidi Bouzid">Sidi Bouzid</option>
              <option value="Gabès">Gabès</option>
              <option value="Medenine">Medenine</option>
              <option value="Tataouine">Tataouine</option>
              <option value="Gafsa">Gafsa</option>
              <option value="Tozeur">Tozeur</option>
              <option value="Kebili">Kebili</option>
            </select>

            <button type="submit" className="submit-btn">Register</button>
          </form>

          <p className="error-message">{message}</p>

          <p className="form-text">
            Already have an account? <span><Link to="/login" className="link">Login</Link></span>
          </p>

          <button className="back-btn" onClick={() => setRole({ role: "" })}>Back</button>
        </div>
      )}

      {role.role === "student" && (
        <div className="form-wrapper">
          <h1 className="form-title">Student Sign Up</h1>
          <form className="form" onSubmit={handleSubmit}>
            <input className="form-input" type="text" name="username" placeholder="Username" value={student.username} onChange={handleStudentChange} required />
            <input className="form-input" type="email" name="email" placeholder="Email" value={student.email} onChange={handleStudentChange} required />
            <input className="form-input" type="password" name="password" placeholder="Password" value={student.password} onChange={handleStudentChange} required />
            <input className="form-input" type="text" name="teacherId" placeholder="Teacher Id" onChange={handleStudentChange} required />
            <button type="submit" className="submit-btn">Register</button>
          </form>

          <p className="error-message">{message}</p>

          <p className="form-text">
            Already have an account? <span><Link to="/login" className="link">Login</Link></span>
          </p>

          <button className="back-btn" onClick={() => setRole({ role: "" })}>Back</button>
        </div>
      )}
    </div>
  );
}
