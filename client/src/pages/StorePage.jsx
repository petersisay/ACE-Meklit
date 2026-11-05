import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const categories = [
  'All',
  'ACE Logo Products',
  'Bible Verse Products',
  'Holy Bible Covers and Books',
];

export const DEFAULT_MEKLIT_PRODUCTS = [
  {
    _id: 'default-p1',
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
    _id: 'default-p2',
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
    _id: 'default-p3',
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
    _id: 'default-p4',
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
    _id: 'default-p5',
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
    _id: 'default-p6',
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
    _id: 'default-p7',
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
    _id: 'default-p8',
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
    _id: 'default-p9',
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
    _id: 'default-p10',
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
    _id: 'default-p11',
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

const StorePage = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const categoryLabels = {
    'All': t('store_all'),
    'ACE Logo Products': t('store_cat_logo'),
    'Bible Verse Products': t('store_cat_verse'),
    'Holy Bible Covers and Books': t('store_cat_books'),
  };

  const [products, setProducts] = useState(DEFAULT_MEKLIT_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {};
        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (searchKeyword.trim()) {
          params.keyword = searchKeyword.trim();
        }
        if (sortBy) {
          params.sort = sortBy;
        }

        const { data } = await productsApi.getAll(params);
        // Strictly filter to authentic ACE Meklit products and eliminate any foreign demo items
        const cleanData = (data || []).filter(
          (p) =>
            categories.slice(1).includes(p.category) &&
            !p.name.toLowerCase().startsWith('used ') &&
            p.name.toLowerCase() !== 'pc' &&
            p.image &&
            p.image.startsWith('/Images/')
        );

        if (cleanData.length > 0) {
          setProducts(cleanData);
        } else {
          // Apply local filter to default products if API has no matching clean products
          let filtered = [...DEFAULT_MEKLIT_PRODUCTS];
          if (selectedCategory && selectedCategory !== 'All') {
            filtered = filtered.filter((p) => p.category === selectedCategory);
          }
          if (searchKeyword.trim()) {
            const q = searchKeyword.toLowerCase();
            filtered = filtered.filter(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                (p.scriptureReference && p.scriptureReference.toLowerCase().includes(q))
            );
          }
          if (sortBy === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
          } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
          }
          setProducts(filtered);
        }
      } catch (err) {
        console.error('Failed to load products from API, using default Meklit catalog:', err);
        let filtered = [...DEFAULT_MEKLIT_PRODUCTS];
        if (selectedCategory && selectedCategory !== 'All') {
          filtered = filtered.filter((p) => p.category === selectedCategory);
        }
        if (searchKeyword.trim()) {
          const q = searchKeyword.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              (p.scriptureReference && p.scriptureReference.toLowerCase().includes(q))
          );
        }
        if (sortBy === 'price-low') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
          filtered.sort((a, b) => b.price - a.price);
        }
        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchKeyword, sortBy]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  // Group products strictly by official category
  const aceLogoItems = products.filter((p) => p.category === 'ACE Logo Products');
  const bibleVerseItems = products.filter((p) => p.category === 'Bible Verse Products');
  const bibleCoverItems = products.filter((p) => p.category === 'Holy Bible Covers and Books');

  return (
    <div className="store-page">
      {/* Store Header Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          color: '#ffffff',
          padding: '3.5rem 0 2.5rem',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <span style={{ color: '#d97706', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {t('store_subtitle')}
          </span>
          <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0 1rem' }}>{t('store_title')}</h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: '#cbd5e1', fontSize: '1.05rem', fontWeight: 500 }}>
            {t('store_desc')}
          </p>
        </div>
      </section>

      <div className="container section">
        {/* Filters and Search Bar */}
        <div
          style={{
            background: '#ffffff',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <Search
                size={18}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              />
              <input
                type="text"
                placeholder={t('store_search_placeholder')}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.6rem' }}
              />
            </div>

            {/* Sort Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <SlidersHorizontal size={18} color="#64748b" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{ width: 'auto', minWidth: '180px' }}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="filter-tabs" style={{ marginBottom: 0 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
              >
                {categoryLabels[cat] || cat}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Loading ACE Meklit merchandise...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <ShoppingBag size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{t('store_no_products')}</h3>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              We could not find any products matching your search criteria.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setSelectedCategory('All');
                setSearchKeyword('');
              }}
            >
              {t('store_reset_filters')}
            </button>
          </div>
        ) : selectedCategory === 'All' && !searchKeyword && (aceLogoItems.length > 0 || bibleVerseItems.length > 0 || bibleCoverItems.length > 0) ? (
          /* Exact 3-section categorization from store.html */
          <div>
            {aceLogoItems.length > 0 && (
              <div style={{ marginBottom: '3.5rem' }}>
                <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.75rem' }}>
                  <h2 style={{ fontSize: '1.5rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ⇒ {t('store_cat_logo')}
                  </h2>
                </div>
                <div className="products-grid">
                  {aceLogoItems.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </div>
            )}

            {bibleVerseItems.length > 0 && (
              <div style={{ marginBottom: '3.5rem' }}>
                <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.75rem' }}>
                  <h2 style={{ fontSize: '1.5rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ⇒ {t('store_cat_verse')}
                  </h2>
                </div>
                <div className="products-grid">
                  {bibleVerseItems.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </div>
            )}

            {bibleCoverItems.length > 0 && (
              <div style={{ marginBottom: '3.5rem' }}>
                <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.75rem' }}>
                  <h2 style={{ fontSize: '1.5rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ⇒ {t('store_cat_books')}
                  </h2>
                </div>
                <div className="products-grid">
                  {bibleCoverItems.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                {t('store_showing')} <strong>{products.length}</strong> {t('store_items_in')} <em>{categoryLabels[selectedCategory] || selectedCategory}</em>
              </p>
            </div>
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePage;
