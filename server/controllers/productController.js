const Product = require('../models/Product');

const OFFICIAL_CATEGORIES = [
  'ACE Logo Products',
  'Bible Verse Products',
  'Holy Bible Covers and Books',
  'Apparel',
  'Accessories',
];

const defaultProducts = [
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
];

// @desc    Fetch all products with optional search and category filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    // Only purge legacy foreign junk items without touching newly created products
    await Product.deleteMany({
      $or: [
        { name: { $in: ['PC', 'pc', 'Sample Product'] } },
        { name: { $regex: /^Used /i } },
      ],
    });

    const totalCount = await Product.countDocuments();
    if (totalCount === 0) {
      console.log('[ProductController] Populating authentic Meklit catalog...');
      await Product.insertMany(defaultProducts);
    }

    const { category, keyword, sort } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (keyword) {
      filter.$and = [
        {
          $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
            { scriptureReference: { $regex: keyword, $options: 'i' } },
          ],
        },
      ];
    }

    let query = Product.find(filter);

    if (sort === 'price-low') {
      query = query.sort({ price: 1 });
    } else if (sort === 'price-high') {
      query = query.sort({ price: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const products = await query.exec();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique categories
// @route   GET /api/products/categories/list
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const distinctCategories = await Product.distinct('category');
    const merged = Array.from(new Set([...OFFICIAL_CATEGORIES, ...distinctCategories])).filter(Boolean);
    res.json(merged);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      description,
      image,
      category,
      countInStock,
      isFeatured,
      scriptureReference,
    } = req.body;

    const product = new Product({
      name: name || 'Sample Product',
      price: price !== undefined ? price : 9.99,
      description: description || 'Sample Description',
      image: image || '/Images/ace logo.jpg',
      category: category || 'ACE Logo Products',
      countInStock: countInStock !== undefined ? countInStock : 10,
      isFeatured: Boolean(isFeatured),
      scriptureReference: scriptureReference || '',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      description,
      image,
      category,
      countInStock,
      isFeatured,
      scriptureReference,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name !== undefined ? name : product.name;
      product.price = price !== undefined ? price : product.price;
      product.description = description !== undefined ? description : product.description;
      product.image = image !== undefined ? image : product.image;
      product.category = category !== undefined ? category : product.category;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.scriptureReference = scriptureReference !== undefined ? scriptureReference : product.scriptureReference;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};
