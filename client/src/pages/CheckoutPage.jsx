import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ordersApi } from '../services/api';

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user ? user.name : '',
    phone: user ? user.phone : '',
    address: '',
    city: 'Addis Ababa',
    postalCode: '1000',
    country: 'Ethiopia',
    paymentMethod: 'Chapa (Telebirr, CBE Birr, Cards)',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="section container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{ color: '#d97706', display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <AlertCircle size={56} />
        </div>
        <h2 style={{ fontSize: '1.8rem', color: '#0f172a' }}>{t('checkout_empty_alert')}</h2>
        <p style={{ color: '#64748b', margin: '1rem 0 2rem' }}>
          Your shopping cart is currently empty. Browse our catalog to select your favorite ACE apparel, cups, or books.
        </p>
        <Link to="/store" className="btn btn-primary">
          Browse Store Products
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (!user) {
        navigate('/login?redirect=checkout');
        return;
      }

      const orderData = {
        orderItems: cartItems,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: Number(totalPrice),
        shippingPrice: 0.0,
        taxPrice: 0.0,
        totalPrice: Number(totalPrice),
      };

      const { data } = await ordersApi.create(orderData);

      // Chapa Trial Payment Execution
      const chapaTxRef = `CHAPA-TEST-${Date.now()}`;
      await ordersApi.pay(data._id, {
        id: chapaTxRef,
        status: 'PAID (Chapa Trial)',
        email_address: user.email,
      });

      clearCart();
      setOrderSuccess(data);
    } catch (err) {
      console.error('Order creation failed:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please check all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="section container">
        <div
          style={{
            maxWidth: '650px',
            margin: '0 auto',
            background: '#ffffff',
            padding: '3rem 2rem',
            borderRadius: '16px',
            border: '1px solid #a7f3d0',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.1)',
          }}
        >
          <div style={{ color: '#10b981', display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <CheckCircle2 size={64} />
          </div>
          <h1 style={{ fontSize: '2rem', color: '#065f46', marginBottom: '0.75rem' }}>
            {t('checkout_success_title')}
          </h1>
          <p style={{ color: '#475569', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
            Thank you for supporting ACE Meklit! Your order <strong>#{orderSuccess._id.slice(-8)}</strong> has been registered and confirmed.
          </p>

          <div
            style={{
              background: '#f8fafc',
              padding: '1.25rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              textAlign: 'left',
              marginBottom: '2rem',
              fontSize: '0.9rem',
            }}
          >
            <p><strong>Deliver To:</strong> {formData.fullName} ({formData.phone})</p>
            <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.country}</p>
            <p><strong>Payment Gateway:</strong> Chapa (Telebirr, CBE Birr, Cards) — ✅ Verified (Trial Mode)</p>
            <p><strong>Total Paid:</strong> ${Number(orderSuccess.totalPrice).toFixed(2)}</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/profile" className="btn btn-navy">
              View My Order in Dashboard
            </Link>
            <Link to="/store" className="btn btn-outline-navy">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section container">
      <Link
        to="/cart"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#64748b',
          marginBottom: '1.5rem',
          fontWeight: 500,
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Shopping Cart</span>
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#0f172a', marginBottom: '0.5rem' }}>
          Checkout & Shipping
        </h1>
        <p style={{ color: '#64748b' }}>
          Provide your delivery details to complete your order.
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
        {/* Shipping Form */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: '#0f172a' }}>
            Shipping Address
          </h2>

          {error && (
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: '#334155' }}>
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="form-input"
                placeholder="Full Name"
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: '#334155' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="+251 9..."
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: '#334155' }}>
                Delivery Address *
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="form-input"
                placeholder="Street, Building, or Neighborhood"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: '#334155' }}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem', color: '#334155' }}>
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  readOnly
                  value={formData.country}
                  className="form-input"
                  style={{ background: '#f8fafc' }}
                />
              </div>
            </div>

            {/* Payment Method Selection - Exclusively Chapa */}
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#0f172a' }}>
                  {language === 'am' ? 'የክፍያ ዘዴ' : 'Payment Method'}
                </h3>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: '#ecfdf5',
                    color: '#059669',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    border: '1px solid #a7f3d0',
                  }}
                >
                  {language === 'am' ? '🧪 ቻፓ የሙከራ ክፍያ (Trial)' : '🧪 Chapa Trial Mode'}
                </span>
              </div>

              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '2px solid #059669',
                  background: '#f0fdf4',
                  boxShadow: '0 2px 4px rgba(5, 150, 105, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Chapa"
                    checked={true}
                    readOnly
                    style={{ accentColor: '#059669', width: '18px', height: '18px', marginTop: '3px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <strong style={{ fontSize: '1.05rem', color: '#065f46' }}>
                        Chapa Payment Gateway (ቻፓ)
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
                        {language === 'am' ? 'ይፋዊ የኢትዮጵያ ክፍያ መተላለፊያ' : 'Official Ethiopian Gateway'}
                      </span>
                    </div>
                    <p style={{ margin: '0.35rem 0 0', fontSize: '0.86rem', color: '#047857', lineHeight: 1.5 }}>
                      {language === 'am'
                        ? 'የቴሌብር (Telebirr)፣ የኢትዮጵያ ንግድ ባንክ (CBE Birr)፣ አዋሽ ባንክ እና የቪዛ/ማስተርካርድ ይፋዊ የክፍያ አማራጭ።'
                        : 'Unified payment gateway supporting Telebirr, CBE Birr, Awash Birr, and Bank Debit/Credit Cards.'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid #d1fae5' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, background: '#ffffff', color: '#0f172a', padding: '0.25rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    📱 Telebirr
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, background: '#ffffff', color: '#0f172a', padding: '0.25rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    🏦 CBE Birr
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, background: '#ffffff', color: '#0f172a', padding: '0.25rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    💳 Visa / Mastercard
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, background: '#ffffff', color: '#0f172a', padding: '0.25rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    🏛️ Awash Bank
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem' }}>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem', justifyContent: 'center' }}
              >
                <Lock size={18} />
                <span>
                  {submitting
                    ? (language === 'am' ? 'በቻፓ እየተከፈለ ነው...' : 'Processing Chapa Payment...')
                    : (language === 'am' ? `በቻፓ ይክፈሉ ($${totalPrice})` : `Pay with Chapa ($${totalPrice})`)}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Order Items Preview */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.75rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: '#0f172a' }}>
            Items in Order ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
          </h3>

          <div style={{ maxHeight: '360px', overflowY: 'auto', marginBottom: '1.5rem' }}>
            {cartItems.map((item) => (
              <div
                key={item._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#f8fafc', borderRadius: '6px' }}
                />
                <div style={{ flex: 1 }}>
                  <h5 style={{ fontSize: '0.9rem', margin: 0, fontWeight: 600 }}>{item.name}</h5>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Qty: {item.qty} × ${item.price.toFixed(2)}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  ${(item.price * item.qty).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#64748b' }}>
              <span>Subtotal</span>
              <span>${totalPrice}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#64748b' }}>
              <span>Shipping</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>Free</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#0f172a',
                marginTop: '0.75rem',
              }}
            >
              <span>Total</span>
              <span style={{ color: '#1e3a8a' }}>${totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
