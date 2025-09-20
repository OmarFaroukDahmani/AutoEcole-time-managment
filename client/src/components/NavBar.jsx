import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "../styles/navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          AutoTime.tn
        </Link>

        {/* Burger Icon */}
        <div className="nav-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Nav Links */}
        <ul className={`nav-links ${isOpen ? "active" : ""}`}>
          <li>
            <a href="#about" onClick={closeMenu}>About</a>
          </li>
          <li>
            <a href="#features" onClick={closeMenu}>Features</a>
          </li>
          <li>
            <a href="#partners" onClick={closeMenu}>Partners</a>
          </li>
          <li>
            <Link to="/sign-up" onClick={closeMenu}>Sign Up</Link>
          </li>
          <li>
            <Link to="/login" onClick={closeMenu}>Log In</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
