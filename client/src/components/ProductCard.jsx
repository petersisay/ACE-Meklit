import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { language, t } = useLanguage();

  return (
    <div className="product-card">
      <div className="product-image-container">
        {product.isFeatured && (
          <span className="product-badge">{language === 'am' ? 'ተመራጭ' : 'Featured'}</span>
        )}
        <Link to={`/product/${product._id}`} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={
              product.image &&
              (product.image.startsWith('http') ||
                product.image.startsWith('data:') ||
                product.image.startsWith('/'))
                ? product.image
                : `/${product.image || 'Images/ace logo.jpg'}`
            }
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.src = '/Images/ace logo.jpg';
            }}
          />
        </Link>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>

        {product.scriptureReference && (
          <p className="product-scripture">✝ {product.scriptureReference}</p>
        )}

        <div className="product-footer">
          <span className="product-price">${Number(product.price).toFixed(2)}</span>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <Link
              to={`/product/${product._id}`}
              className="btn btn-sm btn-outline-primary"
              title={language === 'am' ? 'ዝርዝር ይመልከቱ' : 'View Product Details'}
              style={{ padding: '0.45rem 0.65rem' }}
            >
              <Eye size={16} />
            </Link>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => addToCart(product, 1)}
              title={t('store_add_cart')}
            >
              <ShoppingBag size={16} />
              <span>{language === 'am' ? 'ጨምር' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
