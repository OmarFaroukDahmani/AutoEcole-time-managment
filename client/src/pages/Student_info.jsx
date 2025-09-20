import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; 
import "../styles/student.css";

export default function Student_info() {
  const [profile, setProfile] = useState(null);
  const [lessons, setLessons] = useState([]);
  
  const { id } = useParams();

  useEffect(() => {
    if (!id) return; 

    // Fetch profile
    fetch(`http://localhost:5050/student/${id}`) 
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          console.error("Error fetching profile:", data.message);
        } else {
          setProfile(data);
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));

    // Fetch lessons
    fetch(`http://localhost:5050/lessons/${id}`) 
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          console.error("Error fetching lessons:", data.message);
        } else {
          setLessons(data);
        }
      })
      .catch((err) => console.error("Error fetching lessons:", err));

  }, [id]); 

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

    const handleDelete = async (lessonId) => {
    try {
        const response = await fetch(`http://localhost:5050/delete_lesson/${lessonId}`, {
        method: 'DELETE',
        });

        if (!response.ok) {
        throw new Error('Failed to delete lesson');
        }

        // refresh the lessons list after deletion
        setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    } catch (error) {
        console.error("Error deleting lesson:", error);
        alert('Failed to delete lesson. Please try again.');
    }
    };

  return (
    <div className="student-page">
      <section className="student-profile section">
        <h2 className="section-title">Student Profile</h2>
        {profile ? (
          <ul className="profile-list">
            <li>
              <b>Username:</b> <span className="name">{profile.username}</span>
            </li>
            <li>
              <b>Email:</b> {profile.email}
            </li>
            <li>
              <b>Phone:</b> {profile.phone_number || "Not provided"}
            </li>
            <li>
              <Link to={`/add-lesson/${id}`}>
                <button className="table-btn add-btn">Add Lesson</button>
              </Link>
            </li>
          </ul>
        ) : (
          <p className="loading-text">Loading profile...</p>
        )}
      </section>

      <section className="student-lessons section">
        <h2 className="section-title"> Lessons</h2>
        {lessons.length > 0 ? (
          <table className="lessons-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Note</th>
                <th style={{ textAlign: "center" }} colSpan={2}>Action</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.lesson_id}> 
                  <td>{formatDate(lesson.date)}</td> 
                  <td>{lesson.time}</td>
                  <td>{lesson.status || "N/A"}</td>
                  <td style={{ textAlign: "center" }}>
                    <Link to={`/edit_lesson/${lesson.lesson_id}`}>
                    <button className="table-btn add-btn">Edit</button>
                    </Link>
                  </td>
                    <td style={{ textAlign: "center" }}>
                        <button
                        className="table-btn delete-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(lesson.id);  
                        }}
                        >
                        Delete
                        </button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="loading-text">No lessons scheduled yet.</p>
        )}
      </section>
      
      <Link to='/admin'>
        <button class="return-btn primary-btn">Return Back</button>      
       </Link>
    </div>
  );
}