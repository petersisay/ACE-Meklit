import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Music, BookOpen, Video } from 'lucide-react';
import MediaCard from '../components/MediaCard';
import { mediaApi } from '../services/api';

const MediaPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'all';

  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedType && selectedType !== 'all') {
          params.type = selectedType;
        }
        const { data } = await mediaApi.getAll(params);
        setMediaList(data);
      } catch (err) {
        console.error('Failed to load media items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [selectedType]);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    if (type === 'all') {
      searchParams.delete('type');
    } else {
      searchParams.set('type', type);
    }
    setSearchParams(searchParams);
  };

  const filteredMedia = mediaList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.artistOrSpeaker.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="media-page">
      {/* Header Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #090d16 0%, #1e3a8a 100%)',
          color: '#ffffff',
          padding: '3.5rem 0 2.5rem',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <span style={{ color: '#d97706', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Apostolic Songs & Teachings
          </span>
          <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0 1rem' }}>
            GOSPEL MUSIC & SERMONS
          </h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: '#cbd5e1', fontSize: '1.05rem' }}>
            Stream full gospel albums and spirit-filled preaching from Apostolic Church of Ethiopia bishops and choirs.
          </p>
        </div>
      </section>

      <div className="container section">
        {/* Controls: search and tabs */}
        <div
          style={{
            background: '#ffffff',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
            marginBottom: '2.5rem',
          }}
        >
          <div style={{ maxWidth: '500px', margin: '0 auto 1.5rem', position: 'relative' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              type="text"
              placeholder="Search by song, album, preacher or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.6rem' }}
            />
          </div>

          <div className="filter-tabs" style={{ marginBottom: 0 }}>
            <button
              type="button"
              onClick={() => handleTypeChange('all')}
              className={`filter-tab ${selectedType === 'all' ? 'active' : ''}`}
            >
              All Content ({filteredMedia.length})
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('music')}
              className={`filter-tab ${selectedType === 'music' ? 'active' : ''}`}
            >
              🎵 Full Album Musics
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('preaching')}
              className={`filter-tab ${selectedType === 'preaching' ? 'active' : ''}`}
            >
              📖 Apostolic Preachings
            </button>
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ color: '#64748b' }}>Loading media content...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <Video size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No media items found</h3>
            <p style={{ color: '#64748b' }}>Try adjusting your search terms or filter selection.</p>
          </div>
        ) : (
          <div className="media-grid">
            {filteredMedia.map((media) => (
              <MediaCard key={media._id} media={media} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPage;
