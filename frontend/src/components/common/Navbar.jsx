import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user ? `${user.first_name?.[0]}${user.last_name?.[0]}`.toUpperCase() : '?';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <img src="/logo.png" alt="Traveloop" height="40" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
          <span className="navbar-logo-fallback">Traveloop</span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <NavLink to="/dashboard" className={({isActive}) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
          <NavLink to="/trips" className={({isActive}) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>My Trips</NavLink>
          <NavLink to="/explore" className={({isActive}) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>Explore</NavLink>
          <NavLink to="/community" className={({isActive}) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>Community</NavLink>
        </div>

        <div className="navbar-right">
          <div className="navbar-avatar-wrap" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="navbar-avatar">{initials}</div>
            {dropdownOpen && (
              <div className="navbar-dropdown">
                <div className="navbar-dropdown-user">
                  <div className="navbar-avatar sm">{initials}</div>
                  <div>
                    <div className="nav-name">{user?.first_name} {user?.last_name}</div>
                    <div className="nav-email">{user?.email}</div>
                  </div>
                </div>
                <div className="navbar-dropdown-divider" />
                <Link to="/profile" className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>Profile</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>Admin Panel</Link>
                )}
                <button className="navbar-dropdown-item danger" onClick={logout}>Logout</button>
              </div>
            )}
          </div>
          <button className="navbar-hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
