import { useState, useEffect } from "react";
import "../styles/Admin.css";
import { useNavigate, Link } from "react-router-dom";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`https://autotime-api-48989bed2553.herokuapp.com/stats/${user.userId}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    if (user && user.userId) {
      fetchStats();
    }
  }, [user]);

  useEffect(() => {
    const GetUsers = async () => {
      try {
        if (!user || !user.userId) return;

        const response = await fetch(`https://autotime-api-48989bed2553.herokuapp.com/users/${user.userId}`, {
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

  const handleDelete = async (studentId) => {
    try {
      const response = await fetch(`https://autotime-api-48989bed2553.herokuapp.com/delete/${studentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter((u) => u.student_id !== studentId));
      console.log(`Student with ID ${studentId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete student. Please try again.");
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
            <li><b>Username:</b> <span className="profile-name">{user.username}</span></li>
            <li><b>Email:</b> {user.email}</li>
            <li><b>Phone:</b> {user.phone_number || "Not provided"}</li>
          </ul>
        ) : <p className="loading-text">Loading profile...</p>}
        <button className="edit-profile-btn">Edit Profile</button>
      </section>

      <main className="admin-main">
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

        <section className="drivers-section">
          <div className="drivers-header">
            <h1 className="section-title">Your Drivers</h1>
            <Link to={"/admin/add_driver"}>
              <button className="table-btn add-btn"> Add Driver</button>
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
                      <Link>
                        <button className="table-btn edit-btn">Edit</button>
                      </Link>
                    </td>
                    <td>
                      <button className="table-btn delete-btn">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

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
