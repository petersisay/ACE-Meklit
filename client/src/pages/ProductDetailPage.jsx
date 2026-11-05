import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Check, Shield, Truck, RotateCcw } from 'lucide-react';
import { productsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, language } = useLanguage();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await productsApi.getById(id);
        setProduct(data);

        // Fetch related products
        const relatedRes = await productsApi.getAll({ category: data.category });
        setRelated(relatedRes.data.filter((p) => p._id !== data._id).slice(0, 3));
      } catch (err) {
        setError('Product not found or unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <p>{language === 'am' ? 'የምርት መረጃ በመጫን ላይ...' : 'Loading product details...'}</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>{language === 'am' ? 'ምርቱ አልተገኘም' : 'Product Not Found'}</h2>
        <p style={{ color: '#64748b', margin: '1rem 0 2rem' }}>
          {language === 'am' ? 'የተጠየቀው ምርት አልተገኘም ወይም አልቋል።' : 'The requested product could not be located.'}
        </p>
        <Link to="/store" className="btn btn-primary">
          {language === 'am' ? 'ወደ መክሊት መደብር ተመለስ' : 'Return to Meklit Store'}
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="product-detail-page section">
      <div className="container">
        {/* Breadcrumb / Back button */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '0.95rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={18} />
            <span>{t('product_back')}</span>
          </button>
        </div>

        {/* Product Detail Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            background: '#ffffff',
            padding: '2.5rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            marginBottom: '4rem',
          }}
        >
          {/* Product Image */}
          <div
            style={{
              background: '#f8fafc',
              borderRadius: '12px',
              padding: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e2e8f0',
              maxHeight: '480px',
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              onError={(e) => {
                e.target.src = '/Images/ace logo.jpg';
              }}
            />
          </div>

          {/* Product Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span className="product-category" style={{ fontSize: '0.85rem' }}>
                {product.category}
              </span>
              {product.countInStock > 0 ? (
                <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Check size={14} /> {t('product_in_stock')} ({product.countInStock} {language === 'am' ? 'አለ' : 'available'})
                </span>
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>
                  {t('product_out_of_stock')}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '2.1rem', color: '#0f172a', marginBottom: '1rem', lineHeight: 1.25 }}>
              {product.name}
            </h1>

            {product.scriptureReference && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: '#fffbeb',
                  borderLeft: '4px solid #d97706',
                  borderRadius: '4px',
                  marginBottom: '1.5rem',
                }}
              >
                <p className="scripture-quote" style={{ fontSize: '0.95rem', margin: 0, color: '#92400e' }}>
                  ✝ {language === 'am' ? 'የመጽሐፍ ቅዱስ ጥቅስ' : 'Biblical Inspiration'}: {product.scriptureReference}
                </p>
              </div>
            )}

            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '1.5rem' }}>
              ${Number(product.price).toFixed(2)}
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.6rem', color: '#0f172a' }}>
                {language === 'am' ? 'ስለ እቃው ማብራሪያ' : 'About this item'}
              </h3>
              <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '1rem' }}>
                {product.description}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ padding: '0.65rem 1rem', background: '#f8fafc', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600 }}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.countInStock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ width: '50px', textAlign: 'center', border: 'none', fontSize: '1rem', fontWeight: 600 }}
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.countInStock, q + 1))}
                  style={{ padding: '0.65rem 1rem', background: '#f8fafc', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600 }}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={product.countInStock <= 0}
                style={{ flex: '1 1 200px', padding: '0.85rem 1.75rem' }}
              >
                <ShoppingBag size={20} />
                <span>{t('store_add_cart')}</span>
              </button>
            </div>

            {/* Feature guarantees */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                borderTop: '1px solid #e2e8f0',
                paddingTop: '1.5rem',
                fontSize: '0.85rem',
                color: '#64748b',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={18} color="#1e3a8a" />
                <span>{language === 'am' ? 'በመላው ኢትዮጵያ አስተማማኝ አቅርቦት' : 'Reliable Delivery in Ethiopia'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={18} color="#1e3a8a" />
                <span>{language === 'am' ? '100% ትክክለኛ የኤሲኢ ምርቶች' : '100% Authentic ACE Merchandise'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.75rem', color: '#0f172a' }}>
              {language === 'am' ? `ተጨማሪ ከ ${product.category}` : `More from ${product.category}`}
            </h2>
            <div className="products-grid">
              {related.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
