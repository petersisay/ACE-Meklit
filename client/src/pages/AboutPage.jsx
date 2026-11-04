import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';

const AboutPage = () => {
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
          <p style={{ maxWidth: '650px', margin: '0 auto', color: '#cbd5e1', fontSize: '1.05rem' }}>
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

        {/* CTA banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
            color: '#ffffff',
            padding: '3rem 2rem',
            borderRadius: '16px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
            Have a Question or Custom Church Order?
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 1.75rem', color: '#cbd5e1' }}>
            We'd love to hear from you. Reach out to our ministry team for inquiries, bulk orders, choir uniforms, or spiritual support.
          </p>
          <Link to="/contact" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            <span>Contact Us Today</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
