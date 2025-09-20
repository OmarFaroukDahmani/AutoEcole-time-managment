import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/student.css";

export default function Student() {
  const [profile, setProfile] = useState(null);
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const Logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    if (!user || !user.userId) {
      navigate("/");
      return;
    }
    // Fetch profile
    fetch(`http://localhost:5050/student/${user.userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) console.error("Error:", data.message);
        else setProfile(data);
      })
      .catch((err) => console.error("Error fetching profile:", err));

    // Fetch lessons
    fetch(`http://localhost:5050/lessons/${user.userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) console.error("Error:", data.message);
        else setLessons(data);
      })
      .catch((err) => console.error("Error fetching lessons:", err));
  }, [user, navigate]);

  return (
    <div className="student-page">
      <header className="student-header">
        <h1>Welcome, <span className="name">{profile?.username || "Student"}</span> 👋</h1>
        <button onClick={Logout} className="logout-btn">Log out</button>
      </header>

      <section className="student-profile section">
        <h2 className="section-title">Your Profile</h2>
        {profile ? (
          <ul className="profile-list">
            <li><b>Username:</b> <span className="name">{profile.username}</span></li>
            <li><b>Email:</b> {profile.email}</li>
            <li><b>Phone:</b> {profile.phone_number || "Not provided"}</li>
            <li><b>Teacher Name:</b> <span className="name">{profile.teacher_name}</span></li>
            <li><b>School Name:</b><span className="name"> {profile.school_name}</span></li>
          </ul>
        ) : <p className="loading-text">Loading profile...</p>}
      </section>

      <section className="student-lessons section">
        <h2 className="section-title">Your Lessons</h2>
        {lessons.length > 0 ? (
          <table className="lessons-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson, index) => (
                <tr key={lesson.id || index}>
                  <td>{new Date(lesson.date).toISOString().split("T")[0]}</td>
                  <td>{lesson.time}</td>
                  <td>{lesson.status || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="loading-text">No lessons scheduled yet.</p>}
      </section>
    </div>
  );
}
