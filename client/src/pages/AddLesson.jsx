import { useState, useEffect } from "react";
import {Link, useParams, useNavigate } from "react-router-dom";
import "../styles/AddLesson.css";

export default function AddLesson() {
  const [lesson, setLesson] = useState({ date: "", time: "", status: "", driverId: "" });
  const [message, setMessage] = useState("");
  const [drivers, setDrivers] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const { id } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLesson({ ...lesson, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const getDrivers = async () => {
      try {
        if (!user || !user.userId) return;

        const response = await fetch(`https://autotime-api-48989bed2553.herokuapp.com/drivers/${user.userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch drivers");
        }

        const data = await response.json();
        setDrivers(data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    getDrivers();
  }, [user]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://autotime-api-48989bed2553.herokuapp.com/add_lesson/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lesson),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Lesson added successfully!");
        navigate("/admin");
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

        <label htmlFor="status">Note</label>
        <input
          type="text"
          name="status"
          value={lesson.status}
          onChange={handleChange}
          placeholder="Optional"
          className="input-field"
        />

        <label htmlFor="driverId">Assign Driver</label>
        <select
          className="form-select"
          name="driverId"
          value={lesson.driverId}
          onChange={handleChange}
          required
        >
          <option value="">Select Driver</option>
          {drivers.map((u) => (
            <option key={u.driver_id} value={u.driver_id}>
              {u.name} ({u.vehicle_assigned})
            </option>
          ))}
        </select>

        <button type="submit" className="submit-btn">
          Add Lesson
        </button>
        {message && <p className="form-message">{message}</p>}
      </form>

      <Link to='/admin'>
        <button className="return-btn primary-btn">Return Back</button>
      </Link>
    </div>
  );
}