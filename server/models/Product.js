const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
      enum: [
        'ACE Logo Products',
        'Bible Verse Products',
        'Holy Bible Covers and Books',
        'Apparel',
        'Accessories',
      ],
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      default: 0.0,
      min: [0, 'Price must be positive'],
    },
    image: {
      type: String,
      required: [true, 'Please provide product image path'],
    },
    countInStock: {
      type: Number,
      required: true,
      default: 20,
      min: [0, 'Stock cannot be negative'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    scriptureReference: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Performance compound indexes for lightning-fast catalog filtering and search
productSchema.index({ category: 1, isFeatured: -1, createdAt: -1 });
productSchema.index({ name: 'text', description: 'text', scriptureReference: 'text' });

module.exports = mongoose.model('Product', productSchema);
