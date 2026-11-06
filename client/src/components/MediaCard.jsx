import React from 'react';
import { ExternalLink } from 'lucide-react';

export const extractYouTubeId = (input) => {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/
  );
  if (match && match[1]) return match[1];
  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const v = url.searchParams.get('v');
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
  } catch (e) {
    // ignore
  }
  return trimmed;
};

const MediaCard = ({ media }) => {
  const videoId = extractYouTubeId(media.youtubeId || media.youtubeUrl);
  const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : 'https://www.youtube.com';
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : '';

  return (
    <div className="media-card">
      <div className="media-video-container">
        {videoId ? (
          <iframe
            src={embedUrl}
            title={media.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#0f172a', color: '#ffffff' }}>
            <span>Video not available</span>
          </div>
        )}
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
            href={watchUrl}
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
