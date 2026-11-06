import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Play, ArrowRight, Sparkles, BookOpen, Music, ShieldCheck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import MediaCard from '../components/MediaCard';
import { productsApi, mediaApi } from '../services/api';
import { DEFAULT_MEKLIT_PRODUCTS } from './StorePage';
import { useLanguage } from '../context/LanguageContext';

const DEFAULT_FEATURED_MEDIA = [
  {
    _id: 'default-m1',
    title: 'Eyesus Mulate',
    artistOrSpeaker: 'Hibret Zmare Senduk',
    type: 'music',
    releaseType: 'Full Album',
    youtubeId: 'kz9EyrTOIco',
    youtubeUrl: 'https://www.youtube.com/embed/kz9EyrTOIco?si=gSx-IJQ8WAZRAoZe',
    description: 'Full gospel album music by Hibret Zmare Senduk exalting Jesus Christ.',
    isFeatured: true,
  },
  {
    _id: 'default-m2',
    title: 'Anuregn',
    artistOrSpeaker: 'Hibret Mezmur 17',
    type: 'music',
    releaseType: 'Full Album',
    youtubeId: 'u45Gv3R5fe0',
    youtubeUrl: 'https://www.youtube.com/embed/u45Gv3R5fe0?si=nY2eU1l6Anc3kGbB',
    description: 'Full gospel album music from Hibret Mezmur Volume 17.',
    isFeatured: true,
  },
  {
    _id: 'default-m3',
    title: 'Atcheneku',
    artistOrSpeaker: 'Bishop Elias Asha',
    type: 'preaching',
    releaseType: 'Preaching',
    youtubeId: 'm71KeEO2BxM',
    youtubeUrl: 'https://www.youtube.com/embed/m71KeEO2BxM?si=x5lFcVqxCvPYxOGF',
    description: 'Best Preaching: Bishop Elias Asha — Atcheneku.',
    isFeatured: true,
  },
  {
    _id: 'default-m4',
    title: 'Jmareyachinin Anirsa',
    artistOrSpeaker: 'Bishop Degu Kebede',
    type: 'preaching',
    releaseType: 'Preaching',
    youtubeId: 'xUCGEPX1Rmk',
    youtubeUrl: 'https://www.youtube.com/embed/xUCGEPX1Rmk?si=J1MumHvxVROqVaHE',
    description: 'Best Preaching: Bishop Degu Kebede — Jmareyachinin Anirsa.',
    isFeatured: true,
  },
];

const HomePage = () => {
  const { t } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState(DEFAULT_MEKLIT_PRODUCTS.slice(0, 4));
  const [featuredMedia, setFeaturedMedia] = useState(DEFAULT_FEATURED_MEDIA);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
                const [prodRes, mediaRes] = await Promise.all([
          productsApi.getAll({ limit: 8 }),
          mediaApi.getAll({ featured: true }),
        ]);
        if (prodRes.data && prodRes.data.length > 0) {
          const cleanProds = prodRes.data.filter(
            (p) =>
              p &&
              p.image &&
              !p.name.toLowerCase().startsWith('used ') &&
              p.name.toLowerCase() !== 'pc' &&
              p.name.toLowerCase() !== 'sample product'
          );
          if (cleanProds.length > 0) {
            const featuredOrNew = cleanProds.filter((p) => p.isFeatured);
            setFeaturedProducts((featuredOrNew.length > 0 ? featuredOrNew : cleanProds).slice(0, 4));
          }
        }
        if (mediaRes.data && mediaRes.data.length > 0) {
          setFeaturedMedia(mediaRes.data);
        }
      } catch (err) {
        console.error('Error fetching home data, using default items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const musics = featuredMedia.filter((m) => m.type === 'music').slice(0, 2);
  const preachings = featuredMedia.filter((m) => m.type === 'preaching').slice(0, 2);

  return (
    <div className="homepage">
      {/* Hero Header */}
      <section className="hero">
        <div className="container hero-content">
          <span className="hero-tag">{t('church_name')}</span>
          <h1 className="hero-title">{t('hero_title')}</h1>
          <div className="hero-scripture">
            <p className="scripture-quote">
              {t('hero_quote')}
            </p>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em' }}>
              {t('hero_verse')}
            </span>
          </div>
          <p style={{ fontSize: '1.1rem', color: '#e2e8f0', marginBottom: '2rem', maxWidth: '680px', margin: '0 auto 2rem' }}>
            {t('hero_sub')}
          </p>
          <div className="hero-buttons">
            <Link to="/store" className="btn btn-primary">
              <ShoppingBag size={18} />
              <span>{t('btn_shop')}</span>
            </Link>
            <Link to="/media" className="btn btn-outline-white">
              <Play size={18} />
              <span>{t('btn_media')}</span>
            </Link>
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
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>{t('pillar_style_title')}</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
                {t('pillar_style_desc')}
              </p>
            </div>

            <div style={{ padding: '1rem' }}>
              <div style={{ color: '#1e3a8a', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                <Music size={32} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>{t('pillar_music_title')}</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
                {t('pillar_music_desc')}
              </p>
            </div>

            <div style={{ padding: '1rem' }}>
              <div style={{ color: '#d97706', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                <BookOpen size={32} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>{t('pillar_doctrine_title')}</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
                {t('pillar_doctrine_desc')}
              </p>
            </div>

            <div style={{ padding: '1rem' }}>
              <div style={{ color: '#10b981', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>{t('pillar_integrity_title')}</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
                {t('pillar_integrity_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section container">
        <div className="section-header">
          <span className="section-subtitle">{t('store_subtitle')}</span>
          <h2 className="section-title">ACE Meklit Highlights</h2>
          <p className="section-desc">
            {t('store_desc')}
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
            <span>{t('store_view_all')}</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Music & Preachings Preview */}
      <section className="section" style={{ background: '#f1f5f9' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">{t('media_subtitle')}</span>
            <h2 className="section-title">{t('media_title')}</h2>
            <p className="section-desc">
              {t('media_desc')}
            </p>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#0f172a' }}>{t('media_music')}</h3>
              <Link to="/media?type=music" style={{ color: '#1e3a8a', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {t('store_view_all')} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="media-grid">
              {musics.map((item) => (
                <MediaCard key={item._id} media={item} />
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#0f172a' }}>{t('media_preaching')}</h3>
              <Link to="/media?type=preaching" style={{ color: '#1e3a8a', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {t('store_view_all')} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="media-grid">
              {preachings.map((item) => (
                <MediaCard key={item._id} media={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
