import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand info */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img
                src="/Images/ace songs.png"
                alt="Apostolic Songs"
                style={{ height: '42px', width: 'auto' }}
              />
              <h3 style={{ margin: 0, color: '#ffffff' }}>APOSTOLIC SONGS & MEKLIT</h3>
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#94a3b8' }}>
              {t('church_name')} — Proclaiming the living gospel of our Lord Jesus Christ through spirit-filled worship, sound doctrine, and faith-based apparel.
            </p>
            <div
              style={{
                padding: '0.85rem',
                background: 'rgba(217, 119, 6, 0.1)',
                borderLeft: '3px solid #d97706',
                borderRadius: '4px',
              }}
            >
              <p className="scripture-quote" style={{ fontSize: '0.88rem', margin: 0 }}>
                {t('hero_quote')}
              </p>
              <small style={{ color: '#d97706', fontWeight: 600 }}>{t('hero_verse')}</small>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="footer-title">{t('footer_quick_links')}</h4>
            <ul className="footer-links">
              <li><Link to="/">{t('nav_home')}</Link></li>
              <li><Link to="/store">{t('nav_store')}</Link></li>
              <li><Link to="/media">{t('nav_media')}</Link></li>
              <li><Link to="/about">{t('nav_about')}</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="footer-title">{t('footer_categories')}</h4>
            <ul className="footer-links">
              <li><Link to="/store?category=ACE%20Logo%20Products">{t('store_cat_logo')}</Link></li>
              <li><Link to="/store?category=Bible%20Verse%20Products">{t('store_cat_verse')}</Link></li>
              <li><Link to="/store?category=Holy%20Bible%20Covers%20and%20Books">{t('store_cat_books')}</Link></li>
              <li><Link to="/media?type=music">{t('media_sec_music')}</Link></li>
              <li><Link to="/media?type=preaching">{t('media_sec_preaching')}</Link></li>
            </ul>
          </div>

          {/* Connect & Social */}
          <div>
            <h4 className="footer-title">{t('footer_connect')}</h4>
            <p style={{ fontSize: '0.88rem', marginBottom: '1rem' }}>
              Follow our official ministry channels on social media for sermons, live fellowship, and new apparel drops.
            </p>
            <div className="footer-socials">
              <a
                href="https://youtu.be/OmA9U3AgUss"
                target="_blank"
                rel="noreferrer"
                className="social-icon-link"
                title="Watch on YouTube"
              >
                <img src="/Images/youtube logo.png" alt="YouTube" />
              </a>
              <a
                href="https://www.tiktok.com/@apostolic.song?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noreferrer"
                className="social-icon-link"
                title="Follow on TikTok"
              >
                <img src="/Images/tiktok logo.png" alt="TikTok" />
              </a>
              <a
                href="https://web.facebook.com/share/g/1BM88kKVzb/"
                target="_blank"
                rel="noreferrer"
                className="social-icon-link"
                title="Join on Facebook"
              >
                <img src="/Images/Facebook Logo.png" alt="Facebook" />
              </a>
              <a
                href="https://t.me/Apostolic_Songs"
                target="_blank"
                rel="noreferrer"
                className="social-icon-link"
                title="Join on Telegram"
              >
                <img src="/Images/telegram logo.png" alt="Telegram" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {t('church_name')}. {t('footer_rights')}</p>
          <p>
            Upgraded & Maintained by <strong style={{ color: '#ffffff' }}>Petros Sisay</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
