import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Play, ArrowRight, Sparkles, BookOpen, Music, ShieldCheck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import MediaCard from '../components/MediaCard';
import { productsApi, mediaApi } from '../services/api';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, mediaRes] = await Promise.all([
          productsApi.getAll({ limit: 6 }),
          mediaApi.getAll(),
        ]);
        setFeaturedProducts(prodRes.data.slice(0, 6));
        setMediaList(mediaRes.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const musics = mediaList.filter((m) => m.type === 'music');
  const preachings = mediaList.filter((m) => m.type === 'preaching');

  const scrollToPreachings = (e) => {
    e.preventDefault();
    const elem = document.getElementById('sbiket');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="homepage">
      {/* Hero Header with Original Deuteronomy 6:4 Scripture */}
      <section className="hero">
        <div className="container hero-content">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <img
              src="/Images/ace logo.jpg"
              alt="Apostolic Church of Ethiopia"
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                border: '3px solid #d97706',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                objectFit: 'cover',
              }}
            />
          </div>
          <span className="hero-tag">Apostolic Church of Ethiopia</span>
          <h1 className="hero-title">ACE MEKLIT & CONTENTS</h1>
          <div className="hero-scripture">
            <p className="scripture-quote">
              " Hear, O Israel: The LORD our GOD, The LORD is one. "
            </p>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.08em', color: '#fbbf24' }}>
              ( Deuteronomy 6:4 )
            </span>
          </div>
          <p style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '2rem', maxWidth: '720px', margin: '0 auto 2rem', fontWeight: 500 }}>
            Scripture Thread • Living Word Apparel • Covenant Cotton • Verity Wear • Biblical Books & Apostolic Hymns
          </p>
          <div className="hero-buttons">
            <Link to="/store" className="btn btn-primary">
              <ShoppingBag size={18} />
              <span>Explore Store</span>
            </Link>
            <a href="#sbiket" onClick={scrollToPreachings} className="btn btn-outline-white">
              <Play size={18} />
              <span>Full AlbumMusics & Sermons</span>
            </a>
          </div>
        </div>
      </section>

      {/* Apostolic Songs Banner Image Showcase */}
      <section style={{ background: '#0b1329', padding: '1.5rem 0', borderBottom: '1px solid #1e293b' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div
            style={{
              overflow: 'hidden',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
              maxHeight: '260px',
            }}
          >
            <img
              src="/Images/AS-banner.jpg"
              alt="Apostolic Songs Banner"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* Brand Value Pillars */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '2.5rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem',
              textAlign: 'center',
            }}
          >
            <div style={{ padding: '1rem' }}>
              <div style={{ color: '#d97706', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                <Sparkles size={32} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Purposeful Faith Style</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
                Weaving scripture and biblical identity into comfortable, high-quality contemporary apparel.
              </p>
            </div>

            <div style={{ padding: '1rem' }}>
              <div style={{ color: '#1e3a8a', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                <Music size={32} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Anointed Gospel Songs</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
                Full gospel albums and Apostolic choir worship melodies that exalt Jesus Christ.
              </p>
            </div>

            <div style={{ padding: '1rem' }}>
              <div style={{ color: '#d97706', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                <BookOpen size={32} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Biblical Sound Doctrine</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
                Sermons from Apostolic bishops and doctrinal books upholding holiness and the Word of God.
              </p>
            </div>

            <div style={{ padding: '1rem' }}>
              <div style={{ color: '#10b981', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Integrity & Ministry</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
                Every purchase supports ministry outreach, church publishing, and Christian community support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section container">
        <div className="section-header">
          <span className="section-subtitle">Faith-Based Apparel & Essentials</span>
          <h2 className="section-title">ACE Meklit Highlights</h2>
          <p className="section-desc">
            Explore apparel, custom mugs, and Bible covers created to reflect living biblical truths.
          </p>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Loading products...</p>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/store" className="btn btn-navy">
            <span>View All Store Products</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Original Full AlbumMusics Section with id="sbiket" */}
      <section id="sbiket" className="section" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Apostolic Choir & Worship</span>
            <h2 className="section-title" style={{ color: '#1e3a8a' }}>⇒ Full AlbumMusics</h2>
            <p className="section-desc">
              Complete gospel music albums by anointed Ethiopian Apostolic singers and choirs.
            </p>
          </div>

          <div className="media-grid" style={{ marginBottom: '4rem' }}>
            {musics.map((item) => (
              <MediaCard key={item._id || item.youtubeId} media={item} />
            ))}
          </div>

          {/* Original Best Preachings Section */}
          <div className="section-header">
            <span className="section-subtitle">Sound Apostolic Doctrine</span>
            <h2 className="section-title" style={{ color: '#1e3a8a' }}>⇒ Best Preachings</h2>
            <p className="section-desc">
              Inspiring messages by Bishop Elias Asha and Bishop Degu Kebede on faith and perseverance.
            </p>
          </div>

          <div className="media-grid">
            {preachings.map((item) => (
              <MediaCard key={item._id || item.youtubeId} media={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
