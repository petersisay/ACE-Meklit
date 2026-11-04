import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Brand */}
        <Link to="/" className="nav-brand" onClick={() => setMobileMenuOpen(false)}>
          <img src="/Images/ace logo.jpg" alt="ACE Logo" />
          <div>
            <span>ACE MEKLIT</span>
            <small>Apostolic Church of Ethiopia</small>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/store" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Meklit Store
            </NavLink>
          </li>
          <li>
            <NavLink to="/media" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Music & Sermons
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Contact
            </NavLink>
          </li>
        </ul>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Cart Icon */}
          <Link to="/cart" className="cart-btn" title="View Cart">
            <ShoppingBag size={20} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {/* User Status */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="btn btn-sm btn-outline-white"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <User size={16} />
                <span>{user.name.split(' ')[0]}</span>
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '120%',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                    minWidth: '180px',
                    zIndex: 200,
                    padding: '0.5rem 0',
                  }}
                >
                  <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #334155' }}>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Signed in as</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>{user.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 1rem',
                      color: '#cbd5e1',
                      fontSize: '0.9rem',
                    }}
                  >
                    <User size={16} />
                    My Account & Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1rem',
                        color: '#f59e0b',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                      }}
                    >
                      <Shield size={16} />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.6rem 1rem',
                      color: '#f87171',
                      background: 'transparent',
                      border: 'none',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      borderTop: '1px solid #334155',
                    }}
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-sm btn-outline-white">
                Log In
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Join
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#0f172a',
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid #1e293b',
          }}
        >
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 600 }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/store"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 600 }}
              >
                Meklit Store
              </Link>
            </li>
            <li>
              <Link
                to="/media"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 600 }}
              >
                Music & Sermons
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 600 }}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 600 }}
              >
                Contact
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ color: '#f59e0b', fontSize: '1.05rem', fontWeight: 700 }}
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
