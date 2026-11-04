const mongoose = require('mongoose');

const mediaContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide content title'],
      trim: true,
    },
    artistOrSpeaker: {
      type: String,
      required: [true, 'Please provide artist or speaker name'],
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['music', 'preaching'],
    },
    releaseType: {
      type: String,
      default: 'Full Album',
    },
    youtubeId: {
      type: String,
      required: [true, 'Please provide YouTube video ID'],
      trim: true,
    },
    youtubeUrl: {
      type: String,
      required: [true, 'Please provide YouTube URL'],
    },
    description: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MediaContent', mediaContentSchema);
