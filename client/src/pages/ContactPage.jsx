import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { contactApi } from '../services/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('⚠️ Please fill in all fields!');
      return;
    }

    setLoading(true);
    try {
      await contactApi.submit(formData);
      setSuccessMsg('✅ Message sent successfully! Thank you for contacting ACE Meklit.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
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
            Get in Touch
          </span>
          <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0 1rem' }}>
            CONTACT ACE MEKLIT
          </h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: '#cbd5e1', fontSize: '1.05rem' }}>
            Have questions about our faith apparel, church music, or custom bulk orders? Send us a direct message.
          </p>
        </div>
      </section>

      <div className="container section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Contact Details & Ministry Information */}
          <div
            style={{
              background: '#ffffff',
              padding: '2.5rem',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
            }}
          >
            <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '1rem' }}>
              Church Ministry Inquiries
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              We are dedicated to serving our community and glorifying God. Feel free to contact our administrative team regarding merchandise, gospel distribution, or church support.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#eff6ff', color: '#1e3a8a', padding: '0.75rem', borderRadius: '10px' }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.2rem' }}>Headquarters</h4>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                    Apostolic Church of Ethiopia, Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#fef3c7', color: '#d97706', padding: '0.75rem', borderRadius: '10px' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.2rem' }}>Email Us</h4>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                    support@acemeklit.org / petrossisay1646@gmail.com
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#ecfdf5', color: '#10b981', padding: '0.75rem', borderRadius: '10px' }}>
                  <Phone size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.2rem' }}>Ministry Call Center</h4>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                    +251 91 100 0000 / +251 11 000 0000
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '1.25rem',
                background: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: '#1e3a8a' }}>
                Official Social Media
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                You can also connect with us on Telegram (@Apostolic_Songs), YouTube, TikTok, and Facebook.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div
            style={{
              background: '#ffffff',
              padding: '2.5rem',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
            }}
          >
            <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '1.5rem' }}>
              Send a Message
            </h2>

            {successMsg && (
              <div className="alert alert-success">
                <CheckCircle2 size={18} />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="alert alert-danger">
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} id="contactForm">
              <div className="form-group">
                <label className="form-label" htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Petros Sisay"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. petros@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Write your inquiry or comment here..."
                ></textarea>
              </div>

              <button
                type="submit"
                id="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
              >
                <Send size={18} />
                <span>{loading ? 'Submitting...' : 'Submit Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
