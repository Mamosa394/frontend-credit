import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add your actual auth state here
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close menu when resizing to desktop view
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    if (windowWidth <= 768) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="home-header">
      <h1 className="company_name">Bokamoso Credit Bureau</h1>
      
      {/* Hamburger Menu Button */}
      <button 
        className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <nav className={`home-nav ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/services" onClick={closeMenu}>Services</Link>
        <Link to="/partners" onClick={closeMenu}>Partners</Link>
        <Link to="/faq" onClick={closeMenu}>FAQ</Link>
        <Link to="/contact" onClick={closeMenu}>Contact</Link>
        
        {isLoggedIn ? (
          <div className="user-profile">
            <div className="user-avatar">JD</div>
            <div className="user-dropdown">
              <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
              <Link to="/settings" onClick={closeMenu}>Settings</Link>
              <Link to="/logout" onClick={closeMenu}>Log Out</Link>
            </div>
          </div>
        ) : (
          <>
            <Link to="/sign-in" onClick={closeMenu}>
              <button className="log-in-btn">Log in</button>
            </Link>
            <Link to="/sign-up" onClick={closeMenu}>
              <button className="sign-up-btn">Sign up</button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;