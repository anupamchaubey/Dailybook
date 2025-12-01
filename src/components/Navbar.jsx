import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand">
          DailyBook
        </Link>
      </div>
      <nav className="navbar-right">
        <NavLink to="/">Explore</NavLink>

        {isAuthenticated && (
          <>
            <NavLink to="/me/entries">My Entries</NavLink>
            <NavLink to="/me/entries/new">New Entry</NavLink>
            <NavLink to="/me/profile">
              {user?.username ? `@${user.username}` : "Profile"}
            </NavLink>
            <button onClick={handleLogout} className="link-button">
              Logout
            </button>
          </>
        )}

        {!isAuthenticated && (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
