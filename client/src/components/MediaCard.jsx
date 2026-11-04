import React from 'react';
import { ExternalLink, Play } from 'lucide-react';

const MediaCard = ({ media }) => {
  return (
    <div className="media-card">
      <div className="media-video-container">
        <iframe
          src={`https://www.youtube.com/embed/${media.youtubeId}?rel=0`}
          title={media.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      <div className="media-info">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span className="media-type-badge">
            {media.type === 'music' ? '🎵 Gospel Music' : '📖 Apostolic Preaching'}
          </span>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
            {media.releaseType}
          </span>
        </div>

        <h3 className="media-title">{media.title}</h3>
        <p className="media-speaker">{media.artistOrSpeaker}</p>

        {media.description && (
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.5 }}>
            {media.description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
          <a
            href={media.youtubeUrl || `https://www.youtube.com/watch?v=${media.youtubeId}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-outline-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span>Watch on YouTube</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
