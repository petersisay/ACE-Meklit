import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../services/api';

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user ? user.name : '',
    phone: user ? user.phone : '',
    address: '',
    city: 'Addis Ababa',
    postalCode: '1000',
    country: 'Ethiopia',
    paymentMethod: 'Telebirr',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="section container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>Your cart is currently empty</h2>
        <p style={{ color: '#64748b', margin: '1rem 0 2rem' }}>
          Please add items to your cart before proceeding to checkout.
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

      // Simulate payment execution
      await ordersApi.pay(data._id, {
        id: `TXN-ACE-${Date.now()}`,
        status: 'PAID',
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
            Order Placed Successfully!
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
            <p><strong>Payment Method:</strong> {formData.paymentMethod} (Simulated Payment Confirmed)</p>
            <p><strong>Total Paid:</strong> ${Number(orderSuccess.totalPrice).toFixed(2)}</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/profile" className="btn btn-navy">
              View My Order in Dashboard
            </Link>
            <Link to="/store" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page section container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#0f172a', marginBottom: '0.5rem' }}>
          Secure Checkout
        </h1>
        <p style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Lock size={16} color="#10b981" /> 256-bit encrypted ministry order checkout
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Shipping and Payment Form */}
          <div
            style={{
              background: '#ffffff',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              1. Delivery Information
            </h3>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="form-input"
                placeholder="Petros Sisay"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="+251 91 100 0000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Street Address / Landmark *</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="form-input"
                placeholder="Bole, Sub-city, Near Apostolic Church"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Country *</label>
                <input
                  type="text"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', margin: '2rem 0 1.25rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              2. Payment Method
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  border: formData.paymentMethod === 'Telebirr' ? '2px solid #1e3a8a' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: formData.paymentMethod === 'Telebirr' ? '#f0f9ff' : '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Telebirr"
                  checked={formData.paymentMethod === 'Telebirr'}
                  onChange={handleChange}
                />
                <div>
                  <strong>Telebirr</strong>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>Instant electronic mobile payment</p>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  border: formData.paymentMethod === 'CBE Birr' ? '2px solid #1e3a8a' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: formData.paymentMethod === 'CBE Birr' ? '#f0f9ff' : '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CBE Birr"
                  checked={formData.paymentMethod === 'CBE Birr'}
                  onChange={handleChange}
                />
                <div>
                  <strong>CBE Birr / Mobile Banking</strong>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>Direct Commercial Bank of Ethiopia transfer</p>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  border: formData.paymentMethod === 'Credit/Debit Card' ? '2px solid #1e3a8a' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: formData.paymentMethod === 'Credit/Debit Card' ? '#f0f9ff' : '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Credit/Debit Card"
                  checked={formData.paymentMethod === 'Credit/Debit Card'}
                  onChange={handleChange}
                />
                <div>
                  <strong>Credit / Debit Card</strong>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>Visa, MasterCard, or Diaspora international card</p>
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary sidebar */}
          <div
            style={{
              background: '#ffffff',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#0f172a' }}>
              Order Review
            </h3>

            <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '1.25rem' }}>
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.85rem',
                    paddingBottom: '0.85rem',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#f8fafc', borderRadius: '6px' }}
                    onError={(e) => {
                      e.target.src = '/Images/ace logo.jpg';
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>{item.name}</p>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Qty: {item.qty} × ${item.price}</p>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#64748b' }}>
              <span>Items Total</span>
              <span>${totalPrice}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#64748b' }}>
              <span>Shipping & Handling</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>Free</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '1rem',
                marginTop: '1rem',
                borderTop: '2px solid #e2e8f0',
                fontWeight: 800,
                fontSize: '1.4rem',
                color: '#1e3a8a',
                marginBottom: '1.5rem',
              }}
            >
              <span>Total to Pay</span>
              <span>${totalPrice}</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.95rem', fontSize: '1.05rem', marginBottom: '1rem' }}
            >
              {submitting ? 'Processing Payment...' : `Complete Purchase ($${totalPrice})`}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="#10b981" />
              <span>Safe & verified church ministry checkout</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
