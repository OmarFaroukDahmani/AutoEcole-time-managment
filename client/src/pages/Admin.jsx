import { useState, useEffect } from "react";
import "../styles/Admin.css";
import { useNavigate, Link } from "react-router-dom";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const GetUsers = async () => {
      try {
        if (!user || !user.userId) return;

        const response = await fetch(`http://localhost:5050/users/${user.userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    GetUsers();
  }, [user]);

  const Logout = () => {
    localStorage.clear();
    navigate("/");
  };
  
  // New function to handle student deletion
  const handleDelete = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:5050/delete/${studentId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
  
      // Update state to remove the deleted user
      setUsers(users.filter(u => u.student_id !== studentId));
      console.log(`Student with ID ${studentId} deleted successfully.`);
  
    } catch (error) {
      console.error("Error deleting user:", error);
      alert('Failed to delete student. Please try again.');
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title">Students List</h1>
        <button onClick={Logout} className="logout-btn">Log out</button>
      </header>
      <section className="admin-profile section">
        <h2 className="section-title">Your Profile</h2>
        {user ? (
          <ul className="profile-list">
            <li><b>Username:</b> <span className="name">{user.username}</span></li>
            <li><b>Email:</b> {user.email}</li>
            <li><b>Phone:</b> {user.phone_number || "Not provided"}</li>
          </ul>
        ) : <p className="loading-text">Loading profile...</p>}
      </section>

      <main className="admin-main">
        <table className="students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th style={{ textAlign: "center" }} colSpan={2}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-users">No students found</td>
              </tr>
            ) : (
              users.map((u) => (
               <tr key={u.student_id}>
                <td>{u.student_id}</td>
                <td      onClick={() => navigate(`/student_info/${u.student_id}`)} className="clickable-row">{u.username}</td>
                <td>{u.email}</td>
                <td>{u.phone_number || "No phone number"}</td>
                <td>
                  <Link to={`/add-lesson/${u.student_id}`}>
                    <button className="table-btn add-btn">Add</button>
                  </Link>
                </td>
                <td>
                  <button
                    className="table-btn delete-btn"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleDelete(u.student_id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}