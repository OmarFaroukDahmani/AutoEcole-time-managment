import '../styles/landingPage.css'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <header className="hero">
        <h1>Manage your students with one click!</h1>
        <p>Modern time management for driving schools in Tunisia.</p>
        <div className="logs">
          <Link to="/test"><button>Sign-Up</button></Link>
        </div>
      </header>

      <main>
        <section id='about'>
          <h1>Welcome to AutoTime.tn</h1>
          <p>
            AutoTime.tn is an application designed in collaboration with driving schools in Tunisia 
            to simplify their management, organization, and access to information anywhere, anytime.
          </p>
          <ul>
            <li><b>Better System:</b> Manage your data accurately and access detailed reports.</li>
            <li><b>Easier Communication:</b> Provide accounts for teachers and students to track schedules and information.</li>
            <li><b>Safer Institution:</b> Organize finances, track vehicles, and ensure data security.</li>
          </ul>
        </section>

        <section id="features">
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

        <section id="partners">
          <h1>Our Partners</h1>
          <div className="partners-grid">
            <div className="partner-card">Partner 1</div>
            <div className="partner-card">Partner 2</div>
            <div className="partner-card">Partner 3</div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2025 AutoTime.tn | Made for driving schools in Tunisia</p>
      </footer>
    </>
  )
}
