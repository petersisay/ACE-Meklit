import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X, Shield, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
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
            <small>{t('church_name')}</small>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
              {t('nav_home')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/store" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {t('nav_store')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/media" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {t('nav_media')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {t('nav_about')}
            </NavLink>
          </li>
        </ul>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="btn btn-sm btn-outline-white"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              padding: '0.35rem 0.65rem',
              borderColor: '#38bdf8',
              color: '#38bdf8',
              borderRadius: '6px',
            }}
            title={language === 'en' ? 'ወደ አማርኛ ቀይር' : 'Switch to English'}
          >
            <Globe size={15} />
            <span>{language === 'en' ? 'አማርኛ' : 'EN'}</span>
          </button>

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
                    {t('nav_profile')}
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
                      {t('nav_admin')}
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
                    {t('nav_logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-sm btn-outline-white">
                {t('nav_login')}
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                {t('nav_join')}
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
                {t('nav_home')}
              </Link>
            </li>
            <li>
              <Link
                to="/store"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 600 }}
              >
                {t('nav_store')}
              </Link>
            </li>
            <li>
              <Link
                to="/media"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 600 }}
              >
                {t('nav_media')}
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 600 }}
              >
                {t('nav_about')}
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ color: '#f59e0b', fontSize: '1.05rem', fontWeight: 700 }}
                >
                  {t('nav_admin')}
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
