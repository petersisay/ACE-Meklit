import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Award, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { contactApi } from '../services/api';

const AboutPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.error || status.success) {
      setStatus({ loading: false, success: false, error: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ loading: false, success: false, error: '⚠️ Please fill in all fields!' });
      return;
    }

    setStatus({ loading: true, success: false, error: null });
    try {
      await contactApi.sendMessage({
        name: formData.name,
        email: formData.email,
        subject: 'General Inquiry via About Page',
        message: formData.message,
      });
      setStatus({ loading: false, success: true, error: null });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Failed to send message. Please try again.',
      });
    }
  };

  return (
    <div className="about-page">
      {/* Header Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          color: '#ffffff',
          padding: '4rem 0 3rem',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <span style={{ color: '#d97706', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Our Calling & Heritage
          </span>
          <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0 1rem' }}>
            ABOUT ACE MEKLIT
          </h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: '#cbd5e1', fontSize: '1.05rem', fontWeight: 500 }}>
            Apostolic Church of Ethiopia — Integrating timeless biblical values with contemporary fashion, gospel music, and spiritual growth.
          </p>
        </div>
      </section>

      <div className="container section">
        {/* Main Brand Overview */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
            marginBottom: '4.5rem',
          }}
        >
          <div>
            <span style={{ color: '#d97706', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Our Story
            </span>
            <h2 style={{ fontSize: '2.1rem', color: '#0f172a', margin: '0.5rem 0 1.25rem' }}>
              Dedicated to Purposeful Style
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
              ACE Meklit is a premier apparel brand dedicated to integrating timeless biblical values with contemporary fashion. Our mission is to provide believers with a sophisticated means of expressing their faith through high-quality, thoughtfully designed clothing and accessories.
            </p>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.75rem' }}>
              We believe that scripture is a living word, and by weaving these sacred truths into the fabric of daily life, we aim to inspire, encourage, and strengthen our community across Ethiopia and worldwide.
            </p>

            <div
              style={{
                padding: '1.25rem',
                background: '#fffbeb',
                borderLeft: '4px solid #d97706',
                borderRadius: '8px',
              }}
            >
              <p className="scripture-quote" style={{ fontSize: '1.05rem', margin: '0 0 0.3rem', color: '#92400e' }}>
                "Hear, O Israel: The LORD our GOD, The LORD is one."
              </p>
              <strong style={{ color: '#b45309', fontSize: '0.85rem' }}>Deuteronomy 6:4</strong>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                background: '#ffffff',
                padding: '2rem',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.06)',
                display: 'inline-block',
                maxWidth: '420px',
              }}
            >
              <img
                src="/Images/ace logo.jpg"
                alt="ACE Logo"
                style={{
                  width: '240px',
                  height: '240px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  margin: '0 auto 1.5rem',
                  border: '4px solid #d97706',
                }}
              />
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.35rem' }}>
                Apostolic Church of Ethiopia
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Faith • Holiness • Gospel Excellence
              </p>
            </div>
          </div>
        </div>

        {/* Quality and Integrity */}
        <div
          style={{
            background: '#ffffff',
            padding: '3rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
            marginBottom: '4.5rem',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span style={{ color: '#1e3a8a', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Our Commitment
            </span>
            <h2 style={{ fontSize: '2.1rem', color: '#0f172a', margin: '0.5rem 0 1rem' }}>
              Quality and Integrity
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8 }}>
              Every garment in our collection is curated with an unwavering commitment to excellence. From the selection of premium materials to the precision of our designs, we prioritize integrity in every step of our process.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem',
            }}
          >
            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#d97706', marginBottom: '0.75rem' }}>
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#0f172a' }}>
                Premium Craftsmanship
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Carefully chosen heavyweight cotton and durable fabrics that withstand daily wear while keeping comfort at the forefront.
              </p>
            </div>

            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#1e3a8a', marginBottom: '0.75rem' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#0f172a' }}>
                Authentic Biblical Messages
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Scriptures and church emblems are verified according to true apostolic sound doctrine, creating conversation starters that testify to Christ.
              </p>
            </div>

            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#10b981', marginBottom: '0.75rem' }}>
                <Heart size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#0f172a' }}>
                Ministry Support
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Our apparel and media platforms empower church initiatives, gospel music publishing, and church youth empowerment.
              </p>
            </div>
          </div>
        </div>

        {/* Original Contact Section from about.html */}
        <div
          style={{
            background: '#ffffff',
            padding: '3rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
            maxWidth: '700px',
            margin: '0 auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ color: '#d97706', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Get In Touch
            </span>
            <h2 style={{ fontSize: '1.9rem', color: '#0f172a', margin: '0.4rem 0 0.6rem' }}>
              Contact ACE Meklit
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Leave us a message, prayer request, or order inquiry below.
            </p>
          </div>

          {status.success && (
            <div
              style={{
                padding: '1rem',
                borderRadius: '8px',
                background: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={20} color="#10b981" />
              <span>✅ Message sent successfully!</span>
            </div>
          )}

          {status.error && (
            <div
              style={{
                padding: '1rem',
                borderRadius: '8px',
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                fontWeight: 600,
              }}
            >
              <AlertCircle size={20} color="#ef4444" />
              <span>{status.error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: '#334155' }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Your Name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: '#334155' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter Your Email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: '#334155' }}>
                Message
              </label>
              <textarea
                name="message"
                id="message"
                rows="4"
                placeholder="Type Here ..."
                value={formData.message}
                onChange={handleChange}
                className="form-input"
                style={{ resize: 'vertical' }}
              />
            </div>

            <button
              id="btn"
              type="submit"
              disabled={status.loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', justifyContent: 'center' }}
            >
              <Send size={18} />
              <span>{status.loading ? 'Sending...' : 'Submit'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
