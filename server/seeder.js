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
  // ACE Logo Products
  {
    name: 'ACE Official Hoodie',
    description: 'Premium heavyweight cotton hoodie featuring the official Apostolic Church of Ethiopia insignia. Perfect for warmth and everyday Christian witness.',
    category: 'ACE Logo Products',
    price: 19.99,
    image: '/Images/hoddie.png',
    countInStock: 25,
    isFeatured: true,
    scriptureReference: 'Deuteronomy 6:4',
  },
  {
    name: 'ACE Faith Cap',
    description: 'Structured adjustable embroidered cap displaying the ACE monogram. Breathable, durable, and stylish for all seasons.',
    category: 'ACE Logo Products',
    price: 1.99,
    image: '/Images/hat.png',
    countInStock: 50,
    isFeatured: true,
    scriptureReference: 'Ephesians 6:17',
  },
  {
    name: 'ACE Winter Jacket',
    description: 'Weather-resistant windbreaker jacket tailored for comfort and durability with subtle ACE embroidered branding.',
    category: 'ACE Logo Products',
    price: 29.99,
    image: '/Images/jacket.png',
    countInStock: 15,
    isFeatured: true,
    scriptureReference: 'Psalm 91:4',
  },
  {
    name: 'ACE Ceramic Tea Mug',
    description: '11oz high-quality ceramic mug with high-gloss finish and inspiring ACE emblem for morning devotionals and tea.',
    category: 'ACE Logo Products',
    price: 0.99,
    image: '/Images/mug.png',
    countInStock: 60,
    isFeatured: false,
    scriptureReference: 'Proverbs 3:5-6',
  },
  {
    name: 'ACE Graphic T-Shirt',
    description: '100% ring-spun soft cotton t-shirt with signature ACE typography and modern retail fit.',
    category: 'ACE Logo Products',
    price: 12.99,
    image: '/Images/shirt.png',
    countInStock: 30,
    isFeatured: true,
    scriptureReference: '1 Corinthians 13:13',
  },
  {
    name: 'ACE Classic Everyday Shirt',
    description: 'Lightweight, pre-shrunk cotton tee with classic crew neck and understated ACE Meklit faith accent.',
    category: 'ACE Logo Products',
    price: 2.99,
    image: '/Images/t-shirt.png',
    countInStock: 40,
    isFeatured: false,
    scriptureReference: 'Colossians 3:12',
  },

  // Bible Verse Products
  {
    name: 'Bible Verse Hoodie (Acts 2:38)',
    description: 'Living Word apparel boldly displaying Acts 2:38 apostolic repentance and baptism scripture typography on pure covenant cotton.',
    category: 'Bible Verse Products',
    price: 19.99,
    image: '/Images/peter_hoddie.png',
    countInStock: 20,
    isFeatured: true,
    scriptureReference: 'Acts 2:38',
  },
  {
    name: 'Bible Verse Coffee Cup',
    description: 'Inspirational morning coffee cup printed with Isaiah 40:31 promise: Those who hope in the Lord will renew their strength.',
    category: 'Bible Verse Products',
    price: 6.99,
    image: '/Images/coffee_cup.png',
    countInStock: 35,
    isFeatured: true,
    scriptureReference: 'Isaiah 40:31',
  },
  {
    name: 'Bible Verse Canvas Tote Bag',
    description: 'Heavy-duty eco-friendly canvas tote bag with scripture imprint, great for carrying Bibles, hymn books, and study materials.',
    category: 'Bible Verse Products',
    price: 1.99,
    image: '/Images/bag.png',
    countInStock: 45,
    isFeatured: false,
    scriptureReference: 'Joshua 1:9',
  },

  // Holy Bible Covers and Books
  {
    name: 'Handcrafted Holy Bible Leather Cover',
    description: 'Protective embossed Bible case with zip closure, bookmark ribbon, and pen holder to preserve your sacred scriptures.',
    category: 'Holy Bible Covers and Books',
    price: 9.99,
    image: '/Images/Bible cover.jpg',
    countInStock: 25,
    isFeatured: true,
    scriptureReference: 'Hebrews 4:12',
  },
  {
    name: 'ቃሉ ይናገር (Kalu Ynager) Biblical Book',
    description: 'Sound apostolic doctrine teachings and spiritual insights from Bishop Teklemariam Gezahagne on Biblical holiness and truth.',
    category: 'Holy Bible Covers and Books',
    price: 4.99,
    image: '/Images/kalu ynager.jpg',
    countInStock: 50,
    isFeatured: true,
    scriptureReference: '2 Timothy 3:16',
  },
];

const mediaItems = [
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
];

const contactMessages = [
  {
    name: 'Yonas Haile',
    email: 'yonas@example.com',
    message: 'Grace and peace to you in Jesus name! I would like to inquire about ordering ACE Meklit apparel in bulk for our youth choir.',
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

    console.log('[Seeder] Inserting products...');
    const sampleProducts = products.map((product) => ({
      ...product,
    }));
    const createdProducts = await Product.insertMany(sampleProducts);

    console.log('[Seeder] Inserting media content...');
    await MediaContent.insertMany(mediaItems);

    console.log('[Seeder] Inserting contact messages...');
    await ContactMessage.insertMany(contactMessages);

    console.log('[Seeder] Inserting sample order...');
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

    console.log('✅ [Seeder] Data imported successfully!');
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
