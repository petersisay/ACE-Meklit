require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve static images from root Images directory
const rootImagesDir = path.join(__dirname, '..', 'Images');
app.use('/Images', express.static(rootImagesDir));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'ACE Meklit - Apostolic Church of Ethiopia',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/contact', contactRoutes);

// In production, serve React frontend static build
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  const indexHtml = path.join(clientDistPath, 'index.html');
  res.sendFile(indexHtml, (err) => {
    if (err) {
      next();
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is brand new
    try {
      const Product = require('./models/Product');
      const count = await Product.countDocuments();
      if (count === 0) {
        console.log('[Server] No products found. Seeding initial catalog & media...');
        const User = require('./models/User');
        const MediaContent = require('./models/MediaContent');

        // Initial admin & user
        await User.create([
          {
            name: 'Admin Petros Sisay',
            email: 'admin@acemeklit.org',
            password: 'password123',
            role: 'admin',
            phone: '+251911000000',
          },
          {
            name: 'Bereket Tesfaye',
            email: 'bereket@example.com',
            password: 'password123',
            role: 'user',
            phone: '+251922000000',
          },
        ]);

        await Product.insertMany([
          {
            name: 'Hoddie',
            description: 'Living Word Apparel & ACE Logo official heavyweight hoodie. Scripture Thread, Covenant Cotton, Verity Wear.',
            category: 'ACE Logo Products',
            price: 19.99,
            image: '/Images/hoddie.png',
            countInStock: 30,
            isFeatured: true,
            scriptureReference: 'Deuteronomy 6:4',
          },
          {
            name: 'Cap',
            description: 'ACE faith cap displaying the Apostolic Church of Ethiopia monogram.',
            category: 'ACE Logo Products',
            price: 1.99,
            image: '/Images/hat.png',
            countInStock: 50,
            isFeatured: true,
            scriptureReference: 'Ephesians 6:17',
          },
          {
            name: 'Jacket',
            description: 'Weather-resistant ACE branded winter jacket designed for purposeful style.',
            category: 'ACE Logo Products',
            price: 29.99,
            image: '/Images/jacket.png',
            countInStock: 20,
            isFeatured: true,
            scriptureReference: 'Psalm 91:4',
          },
          {
            name: 'Tea Mug',
            description: 'High-gloss ceramic tea mug with ACE emblem for your daily devotional.',
            category: 'ACE Logo Products',
            price: 0.99,
            image: '/Images/mug.png',
            countInStock: 60,
            isFeatured: false,
            scriptureReference: 'Proverbs 3:5-6',
          },
          {
            name: 'T-Shirt',
            description: '100% premium cotton graphic shirt featuring Apostolic Church of Ethiopia faith typography.',
            category: 'ACE Logo Products',
            price: 12.99,
            image: '/Images/shirt.png',
            countInStock: 35,
            isFeatured: true,
            scriptureReference: '1 Corinthians 13:13',
          },
          {
            name: 'Shirt',
            description: 'Everyday comfortable pre-shrunk cotton tee with subtle ACE faith design.',
            category: 'ACE Logo Products',
            price: 2.99,
            image: '/Images/t-shirt.png',
            countInStock: 45,
            isFeatured: false,
            scriptureReference: 'Colossians 3:12',
          },
          {
            name: 'Bible Verse Hoddie',
            description: 'Scripture Thread hoodie with inspiring biblical verses woven into Covenant Cotton.',
            category: 'Bible Verse Products',
            price: 19.99,
            image: '/Images/peter_hoddie.png',
            countInStock: 25,
            isFeatured: true,
            scriptureReference: 'Acts 2:38',
          },
          {
            name: 'Bible Verse Coffee Cup',
            description: 'Ceramic coffee cup featuring biblical scriptures to inspire your mornings.',
            category: 'Bible Verse Products',
            price: 6.99,
            image: '/Images/coffee_cup.png',
            countInStock: 40,
            isFeatured: true,
            scriptureReference: 'Isaiah 40:31',
          },
          {
            name: 'Bible Verse Tote Bag',
            description: 'Durable eco-friendly canvas tote bag with scripture imprint, perfect for Holy Bibles and books.',
            category: 'Bible Verse Products',
            price: 1.99,
            image: '/Images/bag.png',
            countInStock: 50,
            isFeatured: false,
            scriptureReference: 'Joshua 1:9',
          },
          {
            name: 'Bible Cover',
            description: 'Protective handcrafted Holy Bible cover case with zip closure to safeguard scripture.',
            category: 'Holy Bible Covers and Books',
            price: 9.99,
            image: '/Images/Bible cover.jpg',
            countInStock: 30,
            isFeatured: true,
            scriptureReference: 'Hebrews 4:12',
          },
          {
            name: 'Biblical Books',
            description: 'ቃሉ ይናገር (Kalu Ynager) — Sound biblical teachings and doctrine from Bishop Teklemariam Gezahagne.',
            category: 'Holy Bible Covers and Books',
            price: 4.99,
            image: '/Images/kalu ynager.jpg',
            countInStock: 55,
            isFeatured: true,
            scriptureReference: '2 Timothy 3:16',
          },
        ]);

        await MediaContent.insertMany([
          {
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
            title: 'Alafrim',
            artistOrSpeaker: 'Meseret Kejela Volume #1',
            type: 'music',
            releaseType: 'Full Album',
            youtubeId: '0kdVLZWfWlQ',
            youtubeUrl: 'https://www.youtube.com/embed/0kdVLZWfWlQ?si=VHKT8vtUPRMRbIQH',
            description: 'Full gospel album music by Meseret Kejela Volume #1.',
            isFeatured: true,
          },
          {
            title: 'Yeamlko Mezmur',
            artistOrSpeaker: 'Apostolic Songs',
            type: 'music',
            releaseType: 'Collection of Apostolic Songs',
            youtubeId: 'uAGCujczi0g',
            youtubeUrl: 'https://www.youtube.com/embed/uAGCujczi0g?si=KtekcA2GXNXf6YDG',
            description: 'Collection of Apostolic Songs — Anointed gospel praise and worship.',
            isFeatured: true,
          },
          {
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
            title: 'Jmareyachinin Anirsa',
            artistOrSpeaker: 'Bishop Degu Kebede',
            type: 'preaching',
            releaseType: 'Preaching',
            youtubeId: 'xUCGEPX1Rmk',
            youtubeUrl: 'https://www.youtube.com/embed/xUCGEPX1Rmk?si=J1MumHvxVROqVaHE',
            description: 'Best Preaching: Bishop Degu Kebede — Jmareyachinin Anirsa.',
            isFeatured: true,
          },
        ]);
        console.log('[Server] Auto-seed complete!');
      }
    } catch (seedErr) {
      console.warn('[Server] Auto-seeding skipped:', seedErr.message);
    }

    app.listen(PORT, () => {
      console.log(`[Server] ACE Meklit API listening on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    });
  } catch (error) {
    console.error(`[Server] Failed to start server: ${error.message}`);
  }
};

startServer();

module.exports = app;
