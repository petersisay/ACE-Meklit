require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const MediaContent = require('./models/MediaContent');
const ContactMessage = require('./models/ContactMessage');
const Order = require('./models/Order');

const users = [
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
];

const products = [
  // ACE Logo Products (from store.html)
  {
    name: 'Hoddie',
    description: 'ACE Logo official heavyweight hoodie. Scripture Thread, Covenant Cotton, Verity Wear.',
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

  // Bible Verse Products (from store.html)
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

  // Holy Bible Covers and Books (from store.html)
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
];

const mediaItems = [
  // Full Album Musics (from index.html)
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

  // Best Preachings (from index.html)
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
];

const contactMessages = [
  {
    name: 'Yonas Haile',
    email: 'yonas@example.com',
    message: 'Grace and peace to you in Jesus name! Inquiring about purchasing ACE Meklit apparel for our church youth choir.',
    status: 'unread',
  },
];

const importData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing old records...');
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await MediaContent.deleteMany();
    await ContactMessage.deleteMany();

    console.log('[Seeder] Inserting users...');
    const createdUsers = [];
    for (const u of users) {
      const created = await User.create(u);
      createdUsers.push(created);
    }
    const adminUser = createdUsers[0]._id;
    const regularUser = createdUsers[1]._id;

    console.log('[Seeder] Inserting all original products...');
    const createdProducts = await Product.insertMany(products);

    console.log('[Seeder] Inserting all original gospel media...');
    await MediaContent.insertMany(mediaItems);

    console.log('[Seeder] Inserting contact messages...');
    await ContactMessage.insertMany(contactMessages);

    console.log('[Seeder] Inserting sample purchase order...');
    await Order.create({
      user: regularUser,
      orderItems: [
        {
          name: createdProducts[0].name,
          qty: 1,
          image: createdProducts[0].image,
          price: createdProducts[0].price,
          product: createdProducts[0]._id,
        },
        {
          name: createdProducts[6].name,
          qty: 1,
          image: createdProducts[6].image,
          price: createdProducts[6].price,
          product: createdProducts[6]._id,
        },
      ],
      shippingAddress: {
        fullName: 'Bereket Tesfaye',
        address: 'Bole Medhanealem Road',
        city: 'Addis Ababa',
        postalCode: '1000',
        country: 'Ethiopia',
        phone: '+251922000000',
      },
      paymentMethod: 'Telebirr',
      itemsPrice: 39.98,
      shippingPrice: 0.0,
      taxPrice: 0.0,
      totalPrice: 39.98,
      isPaid: true,
      paidAt: Date.now(),
      isDelivered: false,
      status: 'Processing',
    });

    console.log('✅ [Seeder] All original materials imported successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seeder] Error with data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await MediaContent.deleteMany();
    await ContactMessage.deleteMany();

    console.log('🗑️ [Seeder] Data destroyed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seeder] Error with data destruction: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
