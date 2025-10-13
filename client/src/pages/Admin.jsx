import { useState, useEffect } from "react";
import "../styles/Admin.css";
import { useNavigate, Link } from "react-router-dom";

export default function Admin() {
  const [user] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.userId) return;

    const fetchAllData = async () => {
      try {
        const [driversRes, statsRes, usersRes] = await Promise.all([
          fetch(`https://autotime-api-48989bed2553.herokuapp.com/drivers/${user.userId}`),
          fetch(`https://autotime-api-48989bed2553.herokuapp.com/stats/${user.userId}`),
          fetch(`https://autotime-api-48989bed2553.herokuapp.com/users/${user.userId}`),
        ]);

        if (!driversRes.ok || !statsRes.ok || !usersRes.ok) {
          throw new Error("One or more API requests failed.");
        }

        const [driversData, statsData, usersData] = await Promise.all([
          driversRes.json(),
          statsRes.json(),
          usersRes.json(),
        ]);

        setDrivers(driversData);
        setStats(statsData);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAllData();
  }, [user?.userId]);

  const Logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleStudentDelete = async (studentId) => {
    try {
      const response = await fetch(`https://autotime-api-48989bed2553.herokuapp.com/delete/${studentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      setUsers((prev) => prev.filter((u) => u.student_id !== studentId));
      console.log(`Student with ID ${studentId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student. Please try again.");
    }
  };

  const handleDriverDelete = async (driver_id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;

    try {
      const response = await fetch(
        `https://autotime-api-48989bed2553.herokuapp.com/delete-driver/${driver_id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete driver");
      }

      alert("Driver deleted successfully!");
      setDrivers((prev) => prev.filter((driver) => driver.driver_id !== driver_id));
    } catch (error) {
      console.error("Error deleting driver:", error);
      alert("Failed to delete driver. Please try again.");
    }
  };

  return (
    <div className="admin-container">
      {/* ===== Header ===== */}
      <header className="admin-header">
        <h1 className="admin-title">Students List</h1>
        <button onClick={Logout} className="logout-btn">Log out</button>
      </header>

      {/* ===== Profile + Stats ===== */}
      <section className="profile-stats-container">
        <section className="admin-profile section">
          <h2 className="section-title">Your Profile</h2>
          {user ? (
            <ul className="profile-list">
              <li><b>Username:</b> <span className="profile-name">{user.username}</span></li>
              <li><b>Email:</b> {user.email}</li>
              <li><b>Phone:</b> {user.phone_number || "Not provided"}</li>
            </ul>
          ) : (
            <p className="loading-text">Loading profile...</p>
          )}
          <Link to={`/admin/edit-profile/${user.userId}`}>
            <button className="edit-profile-btn">Edit Profile</button>
          </Link>
        </section>

        {stats && (
          <div className="stats-card">
            <h2 className="stats-title">📊 School Statistics</h2>
            <ul className="stats-list">
              <li><b>Drivers:</b> {stats.drivers_count}</li>
              <li><b>Students:</b> {stats.students_count}</li>
              <li><b>Total Paid:</b> {stats.total_paid} TND</li>
              <li><b>Remaining:</b> {stats.total_remaining} TND</li>
            </ul>
          </div>
        )}
      </section>

      {/* ===== Main Content ===== */}
      <main className="admin-main">
        {/* ===== Drivers ===== */}
        <section className="drivers-section">
          <div className="drivers-header">
            <h1 className="section-title">Your Drivers</h1>
            <Link to="/admin/add_driver">
              <button className="table-btn add-btn">Add Driver</button>
            </Link>
          </div>

          {drivers.length === 0 ? (
            <p className="loading-text">No Drivers found</p>
          ) : (
            <table className="drivers-table">
              <thead>
                <tr>
                  <th>Driver name</th>
                  <th>Phone Number</th>
                  <th>Vehicle Assigned</th>
                  <th style={{ textAlign: "center" }} colSpan={2}>Action</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver.driver_id}>
                    <td>{driver.name}</td>
                    <td>{driver.phone_number || "No phone number"}</td>
                    <td>{driver.vehicle_assigned}</td>
                    <td>
                      <Link to={'/admin/edit-driver'}>
                        <button className="table-btn edit-btn">Edit</button>
                      </Link>
                    </td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDriverDelete(driver.driver_id);
                        }}
                        className="table-btn delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* ===== Students ===== */}
        <h1 className="section-title">Your Students</h1>
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
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.phone_number || "No phone number"}</td>
                  <td>
                    <Link to={`/admin/student_info/${u.student_id}`}>
                      <button className="table-btn details-btn">Details</button>
                    </Link>
                  </td>
                  <td>
                    <button
                      className="table-btn delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStudentDelete(u.student_id);
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
