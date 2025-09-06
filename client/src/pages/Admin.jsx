import { useState, useEffect } from "react";
import "../styles/Admin.css";
import { useNavigate , Link } from "react-router-dom";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")); 
  const navigate = useNavigate();

  useEffect(() => {
    const GetUsers = async () => {
      try {
        if (!user || !user.id) return;

        const response = await fetch(`http://localhost:5050/users/${user.id}`, {
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

  const Logout = ()=>{
    localStorage.clear(); 
    navigate("/"); 
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title">Students List</h1>
        <button onClick={Logout} className="logout-btn">Log out</button>
      </header>

      <main className="admin-main">
        <table className="students-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th colSpan={2}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-users">No students found</td>
              </tr>
            ) : (
              users.map((u) => (
                <>
                <tr key={u.email}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.phone_number || "No phone number"}</td>
                  <td>
                    <Link to="/add-lesson">
                      <button className="table-btn add-btn">Add</button>
                    </Link>
                  </td>
                  <td>
                    <Link to="/delete">
                      <button className="table-btn delete-btn">Delete</button>
                    </Link>
                  </td>
                </tr>
                </>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}
