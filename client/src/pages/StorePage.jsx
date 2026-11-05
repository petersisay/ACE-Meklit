import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsApi } from '../services/api';

const categories = [
  'All',
  'ACE Logo Products',
  'Bible Verse Products',
  'Holy Bible Covers and Books',
];

const StorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
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
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
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

  // Group products by category for sectional display when viewing All without active search
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
            Faith-Based Apparel & Merchandise
          </span>
          <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0 1rem' }}>ACE MEKLIT STORE</h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: '#cbd5e1', fontSize: '1.05rem', fontWeight: 500 }}>
            Scripture Thread • Living Word Apparel • Covenant Cotton • Verity Wear • Biblical Books ...
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
                placeholder="Search products by title, keyword, or scripture..."
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
                {cat}
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
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No products found</h3>
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
              Reset Filters
            </button>
          </div>
        ) : selectedCategory === 'All' && !searchKeyword ? (
          /* Exact 3-section categorization from store.html */
          <div>
            {aceLogoItems.length > 0 && (
              <div style={{ marginBottom: '3.5rem' }}>
                <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.75rem' }}>
                  <h2 style={{ fontSize: '1.5rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ⇒ ACE Logo Products
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
                    ⇒ Bible Verse Products
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
                    ⇒ Holy Bible Covers and Books
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
                Showing <strong>{products.length}</strong> items in <em>{selectedCategory}</em>
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
