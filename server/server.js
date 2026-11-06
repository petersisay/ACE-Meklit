const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'ACE Meklit API is running smoothly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/contact', contactRoutes);

// Serve Frontend client build in production
const clientDistPath = path.join(__dirname, '../client/dist');
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

// Bootstrap essential data independently
const ensureDatabaseBootstrap = async () => {
  try {
    const User = require('./models/User');
    const Product = require('./models/Product');
    const MediaContent = require('./models/MediaContent');
    const Order = require('./models/Order');

    // 0. Drop legacy unique indexes on Order collection if present
    try {
      await Order.collection.dropIndex('trackingNumber_1');
      console.log('[Server] Successfully dropped legacy unique index trackingNumber_1');
    } catch (idxErr) {
      // Index does not exist or already dropped - safe to ignore
    }

    // 1. Ensure Default Admin User exists and has valid credentials
    const adminEmail = 'admin@acemeklit.org';
    const adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      console.log('[Server] Creating default Admin user (admin@acemeklit.org)...');
      await User.create({
        name: 'Admin Petros Sisay',
        email: adminEmail,
        password: 'password123',
        role: 'admin',
        phone: '+251911000000',
      });
    } else {
      adminUser.role = 'admin';
      const isMatch = await adminUser.matchPassword('password123');
      if (!isMatch) {
        console.log('[Server] Synchronizing Admin password to password123...');
        adminUser.password = 'password123';
        await adminUser.save();
      }
    }

    // 2. Ensure Default Demo Customer exists and has valid credentials
    const demoEmail = 'bereket@example.com';
    const demoUser = await User.findOne({ email: demoEmail });
    if (!demoUser) {
      console.log('[Server] Creating default Demo user (bereket@example.com)...');
      await User.create({
        name: 'Bereket Tesfaye',
        email: demoEmail,
        password: 'password123',
        role: 'user',
        phone: '+251922000000',
      });
    } else {
      const isMatch = await demoUser.matchPassword('password123');
      if (!isMatch) {
        console.log('[Server] Synchronizing Demo user password to password123...');
        demoUser.password = 'password123';
        await demoUser.save();
      }
    }

    // 3. Purge foreign demo/junk products & Ensure Product Catalog exists
    const validCategories = [
      'ACE Logo Products',
      'Bible Verse Products',
      'Holy Bible Covers and Books',
    ];
    await Product.deleteMany({
      $or: [
        { category: { $nin: validCategories } },
        { name: { $in: ['PC', 'pc', 'Sample Product'] } },
        { name: { $regex: /^Used /i } },
      ],
    });

    const productCount = await Product.countDocuments({ category: { $in: validCategories } });
    if (productCount === 0) {
      console.log('[Server] No valid products found. Seeding initial Meklit catalog...');
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
    }

    // 4. Ensure Media Content exists
    const mediaCount = await MediaContent.countDocuments();
    if (mediaCount === 0) {
      console.log('[Server] No media found. Seeding initial gospel albums & preachings...');
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
    }
  } catch (seedErr) {
    console.warn('[Server] Database bootstrap check warning:', seedErr.message);
  }
};

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();
    await ensureDatabaseBootstrap();

    app.listen(PORT, () => {
      console.log(`[Server] ACE Meklit API listening on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    });
  } catch (error) {
    console.error(`[Server] Failed to start server: ${error.message}`);
  }
};

startServer();

module.exports = app;
