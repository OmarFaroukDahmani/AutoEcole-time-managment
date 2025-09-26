import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/student.css";

export default function Student_info() {
  const [profile, setProfile] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [money, setMoney] = useState({ total_price: "", paid_amount: "" });
  const [paymentMessage, setPaymentMessage] = useState("");
  const [lessonMessage, setLessonMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setMoney({ ...money, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentMessage(""); 

    if (Number(money.paid_amount) > Number(money.total_price)) {
      setPaymentMessage("Error: Paid amount cannot be more than the total price.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/set_money/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(money),
      });

      const data = await response.json();

      if (response.ok) {
        setPaymentMessage(data.message);
        // Refresh the profile data after a successful money update
        fetchProfileAndLessons();
      } else {
        setPaymentMessage(data.error || "Failed to update money information.");
      }
    } catch (error) {
      setPaymentMessage("Server error: " + error.message);
    }
  };

  const fetchProfileAndLessons = async () => {
    if (!id) return;
    try {
      // Fetch profile
      const profileResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/student/${id}`);
      const profileData = await profileResponse.json();
      if (profileResponse.ok) {
        setProfile(profileData);
        setMoney({
          total_price: profileData.total_price || "",
          paid_amount: profileData.paid_amount || "",
        });
      } else {
        console.error("Error fetching profile:", profileData.message);
      }

      // Fetch lessons
      const lessonsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/lessons/${id}`);
      const lessonsData = await lessonsResponse.json();
      if (lessonsResponse.ok) {
        setLessons(lessonsData);
      } else {
        console.error("Error fetching lessons:", lessonsData.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setPaymentMessage("Failed to load student data. Please check the server connection.");
    }
  };

  useEffect(() => {
    fetchProfileAndLessons();
  }, [id]);

  useEffect(() => {
    if (paymentMessage) {
      const timer = setTimeout(() => {
        setPaymentMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [paymentMessage]);

  useEffect(() => {
    if (lessonMessage) {
      const timer = setTimeout(() => {
        setLessonMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lessonMessage]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDelete = async (lessonId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/delete_lesson/${lessonId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete lesson');
      }

      setLessons((prev) => prev.filter((l) => l.lesson_id !== lessonId));
      setLessonMessage("Lesson deleted successfully!");
    } catch (error) {
      console.error("Error deleting lesson:", error);
      setLessonMessage("Failed to delete lesson. Please try again.");
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
            <li><b>Total Cost:</b> {profile.total_price} DT</li>
            <li><b>Paid Amount:</b> {profile.paid_amount} DT</li>
            <li>
              <Link to={`/admin/add-lesson/${id}`}>
                <button className="table-btn add-btn">Add Lesson</button>
              </Link>
            </li>
          </ul>
        ) : (
          <p className="loading-text">Loading profile...</p>
        )}
      </section >

      <section className="section">
        <div className="set-money-container">
          <h2>Update Payment Information</h2>
          <form onSubmit={handleSubmit} className="set-money-form">
            <label htmlFor="total_price">Total Price (TND)</label>
            <input
              type="number"
              name="total_price"
              value={money.total_price}
              onChange={handleChange}
              required
              className="input-field"
            />
            <label htmlFor="paid_amount">Paid Amount (TND)</label>
            <input
              type="number"
              name="paid_amount"
              value={money.paid_amount}
              onChange={handleChange}
              required
              className="input-field"
            />
            <button type="submit" className="submit-btn">
              Update Payment
            </button>
            {paymentMessage && <p className="form-message">{paymentMessage}</p>}
          </form>
        </div>
      </section>

      <section className="student-lessons section">
        <h2 className="section-title"> Lessons</h2>
        {lessonMessage && <p className="form-message">{lessonMessage}</p>}
        {lessons.length > 0 ? (
          <table className="lessons-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Note</th>
                <th>Driver</th>
                <th style={{ textAlign: "center" }} colSpan={2}>Action</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.lesson_id}>
                  <td>{formatDate(lesson.date)}</td>
                  <td>{lesson.time}</td>
                  <td>{lesson.status || "N/A"}</td>
                  <td> {`${lesson.driver_name || 'N/A'}(${lesson.vehicle_assigned || 'N/A'})`} </td>
                  <td style={{ textAlign: "center" }}>
                    <Link to={`/admin/edit_lesson/${lesson.lesson_id}`}>
                      <button className="table-btn add-btn">Edit</button>
                    </Link>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="table-btn delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(lesson.lesson_id);
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
        <button className="return-btn primary-btn">Return Back</button>
      </Link>
    </div>
  );
}