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
    if (!user || !user.id) return;

    // Fetch student profile
    fetch(`http://localhost:5050/student/${user.id}`)
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Error fetching profile:", err));

    // Fetch student lessons
    fetch(`http://localhost:5050/student/${user.id}/lessons`)
      .then((res) => res.json())
      .then((data) => setLessons(data))
      .catch((err) => console.error("Error fetching lessons:", err));
  }, [user]);

  return (
    <div className="student-page">
      <header className="student-header">
        <h1>Welcome, {profile?.username || "Student"} 👋</h1>
        <button onClick={Logout} className="logout-btn">Log out</button>
      </header>

      {/* Profile Section */}
      <section className="student-profile section">
        <h2 className="section-title">Your Profile</h2>
        {profile ? (
          <ul className="profile-list">
            <li><b>Username:</b> {profile.username}</li>
            <li><b>Email:</b> {profile.email}</li>
            <li><b>Phone:</b> {profile.phone_number || "Not provided"}</li>
            <li><b>Teacher:</b> {profile.teacher_name || "N/A"}</li>
            <li><b>School:</b> {profile.school_name || "N/A"}</li>
          </ul>
        ) : (
          <p className="loading-text">Loading profile...</p>
        )}
      </section>

      {/* Lessons Section */}
      <section className="student-lessons section">
        <h2 className="section-title">Your Lessons</h2>
        {lessons.length > 0 ? (
          <table className="lessons-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td>{lesson.date}</td>
                  <td>{lesson.time}</td>
                  <td className={`status ${lesson.status?.toLowerCase() || ""}`}>
                    {lesson.status || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="loading-text">No lessons scheduled yet.</p>
        )}
      </section>
    </div>
  );
}
