const MediaContent = require('../models/MediaContent');

// Bulletproof YouTube ID extractor from any link, embed, or raw ID
const extractYouTubeId = (input) => {
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

// @desc    Get all media items (music and preachings)
// @route   GET /api/media
// @access  Public
const getAllMedia = async (req, res, next) => {
  try {
    const { type, featured } = req.query;
    const filter = {};

    if (type && ['music', 'preaching'].includes(type)) {
      filter.type = type;
    }

    if (featured !== undefined) {
      filter.isFeatured = featured === 'true';
    }

    const items = await MediaContent.find(filter).sort({ createdAt: -1 });

    // Clean all items and auto-heal existing records with raw URLs
    const sanitized = items.map((item) => {
      const cleanId = extractYouTubeId(item.youtubeId || item.youtubeUrl);
      const cleanWatchUrl = cleanId ? `https://www.youtube.com/watch?v=${cleanId}` : item.youtubeUrl;

      if (cleanId && (item.youtubeId !== cleanId || item.youtubeUrl !== cleanWatchUrl)) {
        MediaContent.updateOne(
          { _id: item._id },
          { $set: { youtubeId: cleanId, youtubeUrl: cleanWatchUrl } }
        ).catch(() => {});
      }

      return {
        ...item.toObject(),
        youtubeId: cleanId,
        youtubeUrl: cleanWatchUrl,
      };
    });

    res.json(sanitized);
  } catch (error) {
    next(error);
  }
};

// @desc    Get media item by ID
// @route   GET /api/media/:id
// @access  Public
const getMediaById = async (req, res, next) => {
  try {
    const item = await MediaContent.findById(req.params.id);
    if (item) {
      const cleanId = extractYouTubeId(item.youtubeId || item.youtubeUrl);
      res.json({
        ...item.toObject(),
        youtubeId: cleanId,
        youtubeUrl: cleanId ? `https://www.youtube.com/watch?v=${cleanId}` : item.youtubeUrl,
      });
    } else {
      res.status(404).json({ message: 'Media content not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new media content
// @route   POST /api/media
// @access  Private/Admin
const createMedia = async (req, res, next) => {
  try {
    const {
      title,
      artistOrSpeaker,
      type,
      releaseType,
      youtubeId,
      youtubeUrl,
      description,
      isFeatured,
    } = req.body;

    const cleanId = extractYouTubeId(youtubeId || youtubeUrl);

    if (!title || !artistOrSpeaker || !type || !cleanId) {
      return res.status(400).json({
        message: 'Please provide title, artist/speaker, type, and a valid YouTube link or video ID',
      });
    }

    const cleanWatchUrl = `https://www.youtube.com/watch?v=${cleanId}`;

    const media = new MediaContent({
      title: title.trim(),
      artistOrSpeaker: artistOrSpeaker.trim(),
      type,
      releaseType: releaseType || (type === 'music' ? 'Full Album' : 'Preaching'),
      youtubeId: cleanId,
      youtubeUrl: cleanWatchUrl,
      description: description ? description.trim() : '',
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
    });

    const createdMedia = await media.save();
    res.status(201).json(createdMedia);
  } catch (error) {
    next(error);
  }
};

// @desc    Update media content
// @route   PUT /api/media/:id
// @access  Private/Admin
const updateMedia = async (req, res, next) => {
  try {
    const media = await MediaContent.findById(req.params.id);

    if (media) {
      media.title = req.body.title || media.title;
      media.artistOrSpeaker = req.body.artistOrSpeaker || media.artistOrSpeaker;
      media.type = req.body.type || media.type;
      media.releaseType = req.body.releaseType || media.releaseType;

      if (req.body.youtubeId || req.body.youtubeUrl) {
        const cleanId = extractYouTubeId(req.body.youtubeId || req.body.youtubeUrl);
        if (cleanId) {
          media.youtubeId = cleanId;
          media.youtubeUrl = `https://www.youtube.com/watch?v=${cleanId}`;
        }
      }

      media.description = req.body.description !== undefined ? req.body.description : media.description;
      media.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : media.isFeatured;

      const updated = await media.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Media content not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete media content
// @route   DELETE /api/media/:id
// @access  Private/Admin
const deleteMedia = async (req, res, next) => {
  try {
    const media = await MediaContent.findById(req.params.id);

    if (media) {
      await MediaContent.deleteOne({ _id: media._id });
      res.json({ message: 'Media content removed' });
    } else {
      res.status(404).json({ message: 'Media content not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMedia,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
};
