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
            name: 'ACE Official Hoodie',
            description: 'Premium heavyweight cotton hoodie featuring the official Apostolic Church of Ethiopia insignia.',
            category: 'ACE Logo Products',
            price: 19.99,
            image: '/Images/hoddie.png',
            countInStock: 25,
            isFeatured: true,
            scriptureReference: 'Deuteronomy 6:4',
          },
          {
            name: 'ACE Faith Cap',
            description: 'Structured adjustable embroidered cap displaying the ACE monogram.',
            category: 'ACE Logo Products',
            price: 1.99,
            image: '/Images/hat.png',
            countInStock: 50,
            isFeatured: true,
            scriptureReference: 'Ephesians 6:17',
          },
          {
            name: 'ACE Winter Jacket',
            description: 'Weather-resistant jacket with subtle ACE embroidered branding.',
            category: 'ACE Logo Products',
            price: 29.99,
            image: '/Images/jacket.png',
            countInStock: 15,
            isFeatured: true,
            scriptureReference: 'Psalm 91:4',
          },
          {
            name: 'ACE Ceramic Tea Mug',
            description: '11oz high-quality ceramic mug with high-gloss finish and inspiring ACE emblem.',
            category: 'ACE Logo Products',
            price: 0.99,
            image: '/Images/mug.png',
            countInStock: 60,
            isFeatured: false,
            scriptureReference: 'Proverbs 3:5-6',
          },
          {
            name: 'ACE Graphic T-Shirt',
            description: '100% ring-spun soft cotton t-shirt with signature ACE typography.',
            category: 'ACE Logo Products',
            price: 12.99,
            image: '/Images/shirt.png',
            countInStock: 30,
            isFeatured: true,
            scriptureReference: '1 Corinthians 13:13',
          },
          {
            name: 'ACE Classic Everyday Shirt',
            description: 'Lightweight pre-shrunk cotton tee with classic crew neck.',
            category: 'ACE Logo Products',
            price: 2.99,
            image: '/Images/t-shirt.png',
            countInStock: 40,
            isFeatured: false,
            scriptureReference: 'Colossians 3:12',
          },
          {
            name: 'Bible Verse Hoodie (Acts 2:38)',
            description: 'Living Word apparel boldly displaying Acts 2:38 apostolic repentance and baptism scripture.',
            category: 'Bible Verse Products',
            price: 19.99,
            image: '/Images/peter_hoddie.png',
            countInStock: 20,
            isFeatured: true,
            scriptureReference: 'Acts 2:38',
          },
          {
            name: 'Bible Verse Coffee Cup',
            description: 'Inspirational morning coffee cup printed with Isaiah 40:31 promise.',
            category: 'Bible Verse Products',
            price: 6.99,
            image: '/Images/coffee_cup.png',
            countInStock: 35,
            isFeatured: true,
            scriptureReference: 'Isaiah 40:31',
          },
          {
            name: 'Bible Verse Canvas Tote Bag',
            description: 'Heavy-duty eco-friendly canvas tote bag with scripture imprint.',
            category: 'Bible Verse Products',
            price: 1.99,
            image: '/Images/bag.png',
            countInStock: 45,
            isFeatured: false,
            scriptureReference: 'Joshua 1:9',
          },
          {
            name: 'Handcrafted Holy Bible Leather Cover',
            description: 'Protective embossed Bible case with zip closure and bookmark ribbon.',
            category: 'Holy Bible Covers and Books',
            price: 9.99,
            image: '/Images/Bible cover.jpg',
            countInStock: 25,
            isFeatured: true,
            scriptureReference: 'Hebrews 4:12',
          },
          {
            name: 'ቃሉ ይናገር (Kalu Ynager) Biblical Book',
            description: 'Sound apostolic doctrine teachings and spiritual insights on Biblical holiness and truth.',
            category: 'Holy Bible Covers and Books',
            price: 4.99,
            image: '/Images/kalu ynager.jpg',
            countInStock: 50,
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
            youtubeUrl: 'https://www.youtube.com/watch?v=kz9EyrTOIco',
            description: 'Full gospel worship album celebrating the sovereignty and fullness of Jesus Christ.',
            isFeatured: true,
          },
          {
            title: 'Anuregn',
            artistOrSpeaker: 'Hibret Mezmur 17',
            type: 'music',
            releaseType: 'Full Album',
            youtubeId: 'u45Gv3R5fe0',
            youtubeUrl: 'https://www.youtube.com/watch?v=u45Gv3R5fe0',
            description: 'Inspiring Apostolic hymns and worship melodies from Hibret Mezmur Volume 17.',
            isFeatured: true,
          },
          {
            title: 'Alafrim',
            artistOrSpeaker: 'Meseret Kejela Volume #1',
            type: 'music',
            releaseType: 'Full Album',
            youtubeId: '0kdVLZWfWlQ',
            youtubeUrl: 'https://www.youtube.com/watch?v=0kdVLZWfWlQ',
            description: 'Classic spiritual songs by Meseret Kejela filled with anointing and biblical truth.',
            isFeatured: true,
          },
          {
            title: 'Yeamlko Mezmur',
            artistOrSpeaker: 'Apostolic Songs',
            type: 'music',
            releaseType: 'Collection of Apostolic Songs',
            youtubeId: 'uAGCujczi0g',
            youtubeUrl: 'https://www.youtube.com/watch?v=uAGCujczi0g',
            description: 'Uplifting compilation of worship anthems and congregational praise songs.',
            isFeatured: true,
          },
          {
            title: 'Atcheneku',
            artistOrSpeaker: 'Bishop Elias Asha',
            type: 'preaching',
            releaseType: 'Preaching',
            youtubeId: 'm71KeEO2BxM',
            youtubeUrl: 'https://www.youtube.com/watch?v=m71KeEO2BxM',
            description: 'A powerful, faith-building sermon reminding believers not to be anxious but trust God completely.',
            isFeatured: true,
          },
          {
            title: 'Jmareyachinin Anirsa',
            artistOrSpeaker: 'Bishop Degu Kebede',
            type: 'preaching',
            releaseType: 'Preaching',
            youtubeId: 'xUCGEPX1Rmk',
            youtubeUrl: 'https://www.youtube.com/watch?v=xUCGEPX1Rmk',
            description: 'Stirring apostolic preaching urging the church never to forget where God brought us from.',
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
