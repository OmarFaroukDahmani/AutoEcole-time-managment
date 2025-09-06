import React, { useState } from "react";
import {useNavigate} from 'react-router-dom'
import "../styles/AddLesson.css";

export default function AddLesson() {
  const [lesson, setLesson] = useState({
    student_id: "",
    date: "",
    time: "",
    status: "",
  });

  const navigate = useNavigate(); 

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setLesson({ ...lesson, [e.target.name]: e.target.value });
  };
  const handleClick = ()=>{
    navigate('/admin')
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5050/add_lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lesson),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Lesson added successfully!");
        setLesson({ student_id: "", date: "", time: "", status: "" }); 
      } else {
        setMessage(data.error || "Failed to add lesson");
      }
    } catch (error) {
      setMessage("Server error: " + error.message);
    }
  };

  return (
    <div className="add-lesson-container">
      <h2>Add New Lesson</h2>
      <form onSubmit={handleSubmit} className="add-lesson-form">
        <label htmlFor="student_id">Student ID</label>
        <input
          type="number"
          name="student_id"
          value={lesson.student_id}
          onChange={handleChange}
          placeholder="Enter student ID"
          required
          className="input-field"
        />

        <label htmlFor="date">Date</label>
        <input
          type="date"
          name="date"
          value={lesson.date}
          onChange={handleChange}
          required
          className="input-field"
        />

        <label htmlFor="time">Time</label>
        <input
          type="time"
          name="time"
          value={lesson.time}
          onChange={handleChange}
          required
          className="input-field"
        />

        <label htmlFor="status">Description</label>
        <input
          type="text"
          name="status"
          value={lesson.status}
          onChange={handleChange}
          placeholder="Optional"
          className="input-field"
        />

        <button type="submit" className="submit-btn" onClick={handleClick}>
          Add Lesson
        </button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
}
