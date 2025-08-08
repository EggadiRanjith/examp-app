import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          ExamApp
        </Link>
        <div className="navbar-nav">
          {user ? (
            <>
              <span className="nav-link">Welcome, {user.name}</span>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <button 
                onClick={handleLogout} 
                className="nav-link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
