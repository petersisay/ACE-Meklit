import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page section container">
        <div
          style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          <div style={{ color: '#94a3b8', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <ShoppingBag size={56} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: '#0f172a' }}>
            {t('cart_empty_title')}
          </h2>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>
            {t('cart_empty_desc')}
          </p>
          <Link to="/store" className="btn btn-primary">
            <span>{t('cart_explore_store')}</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page section container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#0f172a', marginBottom: '0.5rem' }}>
          Shopping Cart
        </h1>
        <p style={{ color: '#64748b' }}>
          You have <strong>{totalItems}</strong> item{totalItems > 1 ? 's' : ''} in your cart.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Cart Items Table */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div
            style={{
              padding: '1rem 1.5rem',
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569' }}>PRODUCT DETAILS</span>
            <button
              type="button"
              onClick={clearCart}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Clear Cart
            </button>
          </div>

          <div style={{ divideY: '1px solid #e2e8f0' }}>
            {cartItems.map((item) => (
              <div
                key={item._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid #f1f5f9',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '72px',
                    height: '72px',
                    objectFit: 'contain',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '0.4rem',
                    border: '1px solid #e2e8f0',
                  }}
                  onError={(e) => {
                    e.target.src = '/Images/ace logo.jpg';
                  }}
                />

                <div style={{ flex: '1 1 200px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 600 }}>
                    {item.category}
                  </span>
                  <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.2rem' }}>
                    Unit Price: ${Number(item.price).toFixed(2)}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item._id, item.qty - 1)}
                    style={{ padding: '0.4rem 0.75rem', background: '#f8fafc', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0.4rem 0.8rem', minWidth: '32px', textAlign: 'center', fontWeight: 600, fontSize: '0.95rem' }}>
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item._id, item.qty + 1)}
                    style={{ padding: '0.4rem 0.75rem', background: '#f8fafc', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>

                {/* Item Total */}
                <div style={{ minWidth: '80px', textAlign: 'right', fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>
                  ${(item.price * item.qty).toFixed(2)}
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item._id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '0.4rem',
                    transition: 'color 0.2s',
                  }}
                  title="Remove Item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.75rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#0f172a' }}>
            {t('cart_order_summary')}
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#64748b' }}>
            <span>{t('cart_subtotal')} ({totalItems})</span>
            <span>${totalPrice}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#64748b' }}>
            <span>{t('cart_shipping')}</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>{t('cart_free')}</span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              marginTop: '1rem',
              borderTop: '2px solid #e2e8f0',
              fontWeight: 800,
              fontSize: '1.35rem',
              color: '#0f172a',
              marginBottom: '1.5rem',
            }}
          >
            <span>{t('cart_total')}</span>
            <span style={{ color: '#1e3a8a' }}>${totalPrice}</span>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/checkout')}
            style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem', marginBottom: '1rem' }}
          >
            <span>{t('cart_checkout')}</span>
            <ArrowRight size={18} />
          </button>

          <Link
            to="/store"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              color: '#64748b',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={16} />
            <span>{t('cart_continue_shopping')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
