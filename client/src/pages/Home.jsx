import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/landingPage.css";
import Navbar from "../components/NavBar";

export default function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const GetTeachers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/partners`, {
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

    GetTeachers();
  }, []);


  return (
    <>
      <Navbar/>
      <section className="hero home_section">
        
        <h1>Manage your students with one click!</h1>
        <p>Modern time management for driving schools in Tunisia.</p>
        <div className="auth-buttons">
          <Link to="/sign-up" className="auth-link">
            <button className="auth-btn sign-up-btn">Sign Up</button>
          </Link>
          <Link to="/login" className="auth-link">
            <button className="auth-btn login-btn">Log In</button>
          </Link>
        </div>
        
      </section>
      <main>
        <section id="about" className="home_section">
          <h1>Welcome to AutoTime.tn</h1>
          <p>
            AutoTime.tn is an application designed in collaboration with driving
            schools in Tunisia to simplify their management, organization, and
            access to information anywhere, anytime.
          </p>
          <ul>
            <li>
              <b>Better System:</b> Manage your data accurately and access
              detailed reports.
            </li>
            <li>
              <b>Easier Communication:</b> Provide accounts for teachers and
              students to track schedules and information.
            </li>
            <li>
              <b>Safer Institution:</b> Organize finances, track vehicles, and
              ensure data security.
            </li>
          </ul>
        </section>

        <section id="features" className="home_section">
          <h1>Features</h1>
          <div className="features-grid">
            <div className="feature-card">
              <h3>📅 Scheduling</h3>
              <p>Plan driving lessons and track student progress easily.</p>
            </div>
            <div className="feature-card">
              <h3>📊 Reports</h3>
              <p>View statistics on earnings, student hours, and performance.</p>
            </div>
            <div className="feature-card">
              <h3>🚗 Vehicle Tracking</h3>
              <p>Track vehicle usage, fuel consumption, and maintenance.</p>
            </div>
          </div>
        </section>

        <section id="partners" className="home_section">
          <h1>Our Partners</h1>
          <div className="partners-grid">
            {users.map((e) => (
              <div  className="partner-card" key={e.teacher_id}>
                <ul>
                  <li>{e.username || "NA"}</li>
                  <li>{e.school_name || "NA"}</li>
                  <li>{e.phone_number || "NA"}</li>
                  <li>{e.government || "NA"}</li>
                  <li>{e.price_per_hour || "NA"} DT</li>
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <p>© 2025 AutoTime.tn | Made for driving schools in Tunisia</p>
      </footer>
    </>
  );
}
