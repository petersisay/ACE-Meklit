import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, AlertCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const RegisterPage = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    const res = await register(name, email, password, phone);
    setSubmitting(false);

    if (res.success) {
      navigate('/store');
    } else {
      setErrorMsg(res.error);
    }
  };

  return (
    <div className="register-page section container">
      <div
        style={{
          maxWidth: '480px',
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
            {t('register_title')}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {t('register_subtitle')}
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
            <label className="form-label">{t('register_name')}</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Petros Sisay"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('register_email')}</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="petros@example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('register_phone')}</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="+251 91 100 0000"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('register_password')}</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="At least 6 characters"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('register_confirm_password')}</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Repeat your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.75rem' }}
          >
            <UserPlus size={18} />
            <span>{submitting ? t('register_creating') : t('register_btn')}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#64748b' }}>
          {t('register_has_account')}{' '}
          <Link to="/login" style={{ color: '#1e3a8a', fontWeight: 600 }}>
            {t('register_sign_in')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
