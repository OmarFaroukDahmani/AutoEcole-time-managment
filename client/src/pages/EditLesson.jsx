import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/AddLesson.css"; // you can reuse the same CSS

export default function EditLesson() {
  const [lesson, setLesson] = useState({ date: "", time: "", status: "" });
  const [message, setMessage] = useState("");

  const { id } = useParams(); // lesson_id

  const navigate = useNavigate();

  // Fetch existing lesson details to prefill form
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`http://localhost:5050/lesson/${id}`);
        const data = await res.json();
        if (res.ok) {
          setLesson({
            date: data.date?.split("T")[0] || "", // format yyyy-mm-dd
            time: data.time || "",
            status: data.status || "",
          });
        } else {
          setMessage(data.error || "Could not load lesson");
        }
      } catch (error) {
        setMessage("Server error: " + error.message);
      }
    };
    fetchLesson();
  }, [id]);

  const handleChange = (e) => {
    setLesson({ ...lesson, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5050/edit_lesson/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lesson),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Lesson updated successfully!");
        navigate("/admin"); // redirect back to admin
      } else {
        setMessage(data.error || "Failed to update lesson");
      }
    } catch (error) {
      setMessage("Server error: " + error.message);
    }
  };

  return (
    <div className="add-lesson-container">
      <h2>Edit Lesson</h2>
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

        <button type="submit" className="submit-btn">
          Save Changes
        </button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
}
