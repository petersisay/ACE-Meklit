import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, AlertCircle, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const LoginPage = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      if (res.data.role === 'admin' && !location.search) {
        navigate('/admin');
      } else {
        navigate(redirect.startsWith('/') ? redirect : `/${redirect}`);
      }
    } else {
      setErrorMsg(res.error);
    }
  };

  const setDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@acemeklit.org');
      setPassword('password123');
    } else {
      setEmail('bereket@example.com');
      setPassword('password123');
    }
  };

  return (
    <div className="login-page section container">
      <div
        style={{
          maxWidth: '460px',
          margin: '0 auto',
          background: '#ffffff',
          padding: '2.5rem',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/Images/ace logo.jpg"
            alt="ACE Logo"
            style={{ width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 1rem', border: '2px solid #d97706' }}
          />
          <h1 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '0.35rem' }}>
            {t('login_welcome')}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {t('login_subtitle')}
          </p>
        </div>

        {errorMsg && (
          <div className="alert alert-danger" style={{ fontSize: '0.9rem' }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('login_email')}</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('login_password')}</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
          >
            <LogIn size={18} />
            <span>{submitting ? 'Signing in...' : t('login_btn')}</span>
          </button>
        </form>

        {/* Quick Demo Logins Helper */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', marginBottom: '0.75rem', fontWeight: 600 }}>
            <Sparkles size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: '#d97706' }} />
            {t('login_quick_demo')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setDemoCredentials('user')}
              className="btn btn-sm btn-outline-primary"
              style={{ fontSize: '0.78rem' }}
            >
              {t('login_demo_customer')}
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('admin')}
              className="btn btn-sm btn-navy"
              style={{ fontSize: '0.78rem' }}
            >
              {t('login_demo_admin')}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#64748b' }}>
          {t('login_no_account')}{' '}
          <Link to="/register" style={{ color: '#1e3a8a', fontWeight: 600 }}>
            {t('login_create_one')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
