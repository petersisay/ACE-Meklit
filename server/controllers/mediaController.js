const MediaContent = require('../models/MediaContent');

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
    res.json(items);
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
      res.json(item);
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

    if (!title || !artistOrSpeaker || !type || !youtubeId) {
      return res.status(400).json({
        message: 'Please provide title, artist/speaker, type, and YouTube ID',
      });
    }

    const media = new MediaContent({
      title,
      artistOrSpeaker,
      type,
      releaseType: releaseType || (type === 'music' ? 'Full Album' : 'Preaching'),
      youtubeId,
      youtubeUrl: youtubeUrl || `https://www.youtube.com/watch?v=${youtubeId}`,
      description: description || '',
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
      media.youtubeId = req.body.youtubeId || media.youtubeId;
      media.youtubeUrl = req.body.youtubeUrl || media.youtubeUrl;
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
      res.json({ message: 'Media item removed successfully' });
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
