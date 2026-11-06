import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  MapPin,
  CreditCard,
  ShoppingBag,
  Loader2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ordersApi } from '../services/api';
import ChapaTestModal from '../components/ChapaTestModal';

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart, addToCart } = useCart();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: user ? user.name : '',
    phone: user ? user.phone : '0911000000',
    address: 'College Road, House 204',
    city: 'Addis Ababa',
    postalCode: '1000',
    country: 'Ethiopia',
    paymentMethod: 'Chapa Payment Gateway',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showChapaModal, setShowChapaModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [activeTxRef, setActiveTxRef] = useState('');

  // If returning with chapa_success, redirect to payment callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const txRef = params.get('tx_ref');
    const orderId = params.get('order_id');
    const chapaSuccess = params.get('chapa_success');

    if (chapaSuccess || txRef) {
      navigate(`/payment/callback?tx_ref=${txRef || ''}&order_id=${orderId || ''}&provider=chapa`, { replace: true });
    }
  }, [location.search, navigate]);

  if (cartItems.length === 0 && !showChapaModal) {
    return (
      <div className="section container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{ color: '#d97706', display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <AlertCircle size={56} />
        </div>
        <h2 style={{ fontSize: '1.8rem', color: '#0f172a' }}>{t('checkout_empty_alert')}</h2>
        <p style={{ color: '#64748b', margin: '1rem 0 2rem' }}>
          {language === 'am'
            ? 'ጋሪዎ በአሁኑ ጊዜ ባዶ ነው። እባክዎ ምርቶችን ከመደብር ይምረጡ ወይም ፈጣን የሙከራ እቃ ጨምረው የቻፓ ክፍያን ይሞክሩ።'
            : 'Your shopping cart is currently empty. Browse our catalog or add a quick test product to try Chapa payment.'}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              addToCart(
                {
                  _id: '672b10000000000000000001',
                  name: 'ACE Meklit T-Shirt',
                  price: 19.99,
                  image: '/Images/peter_tshirt.png',
                },
                1
              );
            }}
            style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
          >
            {language === 'am' ? '+ ፈጣን የሙከራ እቃ ያክሉ ($19.99)' : '+ Add Test Item ($19.99)'}
          </button>
          <Link to="/store" className="btn btn-secondary">
            {language === 'am' ? 'ወደ መደብር ይመለሱ' : 'Browse Store Products'}
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.address.trim() || !formData.phone.trim()) {
      setError(language === 'am' ? 'እባክዎ ሁሉንም አስፈላጊ መረጃዎች ያስገቡ' : 'Please fill in all required shipping fields.');
      return;
    }
    setError(null);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalPayment = async () => {
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
        paymentMethod: 'Chapa (Telebirr, CBE Birr, Cards)',
        itemsPrice: Number(totalPrice),
        shippingPrice: 0.0,
        taxPrice: 0.0,
        totalPrice: Number(totalPrice),
      };

      const { data: createdOrder } = await ordersApi.create(orderData);

      // Initialize Chapa Payment (Live Hosted Checkout or Authentic Chapa Test Mode Modal)
      try {
        const chapaRes = await ordersApi.initializeChapa(createdOrder._id);

        if (chapaRes.data && chapaRes.data.mode === 'live_chapa' && chapaRes.data.checkout_url) {
          clearCart();
          window.location.href = chapaRes.data.checkout_url;
          return;
        }

        // Display the authentic Chapa Test Mode interface directly
        setActiveOrder(chapaRes.data?.order || createdOrder);
        setActiveTxRef(chapaRes.data?.tx_ref || `TX-CHAPA-${Date.now()}-${createdOrder._id}`);
        setShowChapaModal(true);
        setSubmitting(false);
      } catch (chapaErr) {
        console.error('Chapa init error, presenting test modal:', chapaErr);
        const fallbackTxRef = `TX-CHAPA-${Date.now()}-${createdOrder._id}`;
        setActiveOrder(createdOrder);
        setActiveTxRef(fallbackTxRef);
        setShowChapaModal(true);
        setSubmitting(false);
      }
    } catch (err) {
      console.error('Order creation error:', err);
      const isAuthError = err.response && (err.response.status === 401 || err.response.data?.message?.includes('token'));
      if (isAuthError) {
        setError(
          language === 'am'
            ? 'የመግቢያ ክፍለ ጊዜዎ አልቋል (Session Expired)። እባክዎ እንደገና ይግቡ።'
            : 'Your login session has expired. Please log in again to place your order.'
        );
      } else {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : language === 'am'
            ? 'ትዕዛዝ መፍጠር አልተቻለም። እባክዎ እንደገና ይሞክሩ።'
            : 'Failed to process order. Please check your details and try again.'
        );
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="section" style={{ backgroundColor: '#f8fafc', minHeight: '80vh', padding: '2.5rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        
        {/* Revola-style 2-Step Stepper Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '560px',
            margin: '0 auto 2.5rem auto',
            gap: '1rem',
          }}
        >
          {/* Step 1 Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              cursor: step === 2 ? 'pointer' : 'default',
            }}
            onClick={() => step === 2 && setStep(1)}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: step === 1 ? '#2563eb' : '#22c55e',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: 700,
                boxShadow: step === 1 ? '0 0 0 4px rgba(37, 99, 235, 0.15)' : 'none',
              }}
            >
              {step > 1 ? '✓' : '1'}
            </div>
            <span
              style={{
                fontSize: '0.92rem',
                fontWeight: step === 1 ? 700 : 500,
                color: step === 1 ? '#0f172a' : '#475569',
              }}
            >
              {language === 'am' ? '1. የማድረሻ አድራሻ' : '1 Delivery Address & Contact'}
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div
            style={{
              flex: 1,
              height: '2px',
              backgroundColor: step === 2 ? '#2563eb' : '#cbd5e1',
              minWidth: '50px',
              transition: 'background-color 0.3s ease',
            }}
          />

          {/* Step 2 Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: step === 2 ? '#2563eb' : '#e2e8f0',
                color: step === 2 ? '#ffffff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: 700,
                boxShadow: step === 2 ? '0 0 0 4px rgba(37, 99, 235, 0.15)' : 'none',
              }}
            >
              2
            </div>
            <span
              style={{
                fontSize: '0.92rem',
                fontWeight: step === 2 ? 700 : 500,
                color: step === 2 ? '#0f172a' : '#94a3b8',
              }}
            >
              {language === 'am' ? '2. የቻፓ ክፍያ' : '2 Chapa Payment'}
            </span>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              marginBottom: '2rem',
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
            {error.includes('expired') || error.includes('Session') || error.includes('token') || error.includes('ክፍለ ጊዜ') ? (
              <Link
                to="/login?redirect=checkout"
                style={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {language === 'am' ? 'እንደገና ይግቡ' : 'Log In Again'}
              </Link>
            ) : null}
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Step 1 or Step 2 */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            }}
          >
            {step === 1 ? (
              /* STEP 1: DELIVERY ADDRESS & CONTACT */
              <form onSubmit={handleNextStep}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                  <MapPin size={22} color="#2563eb" />
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {language === 'am' ? 'የማድረሻ አድራሻ' : 'Delivery Address & Contact'}
                  </h2>
                </div>

                {/* Revola-style Green Location Status */}
                <div
                  style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem',
                    fontSize: '0.85rem',
                    color: '#15803d',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} color="#16a34a" />
                    <span style={{ fontWeight: 600 }}>
                      {language === 'am'
                        ? 'የማድረሻ ክልል ተረጋግጧል (ኢትዮጵያ - አዲስ አበባ እና ክልሎች)'
                        : 'Delivery Area Confirmed: Ethiopia (Addis Ababa & Regional Hubs)'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                      {language === 'am' ? 'ሙሉ ስም *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Bereket Tesfaye"
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                      {language === 'am' ? 'ስልክ ቁጥር *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="0911000000"
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                      {language === 'am' ? 'የመንገድ / ቤት አድራሻ *' : 'Delivery Address (Street / House) *'}
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Bole Subcity, Woreda 03, House 412"
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ gridTemplateColumns: '1fr 1fr', display: 'grid', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                        {language === 'am' ? 'ከተማ *' : 'City *'}
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="Addis Ababa"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                        {language === 'am' ? 'ሀገር' : 'Country'}
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        disabled
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '0.92rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <button
                    type="submit"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.85rem',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                  >
                    <span>{language === 'am' ? 'ወደ ቻፓ ክፍያ ይቀጥሉ' : 'Continue to Chapa Payment'}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            ) : (
              /* STEP 2: CHAPA PAYMENT GATEWAY (REVOLA STYLE) */
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                  <CreditCard size={22} color="#16a34a" />
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {language === 'am' ? 'የክፍያ መተላለፊያ' : 'Payment Gateway'}
                  </h2>
                </div>

                {/* Revola-style Green Chapa Gateway Card */}
                <div
                  style={{
                    backgroundColor: '#f0fdf4',
                    border: '1.5px solid #86efac',
                    borderRadius: '14px',
                    padding: '1.4rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      {/* Chapa Green Badge */}
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '10px',
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '1.1rem',
                          letterSpacing: '-0.03em',
                          boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        CH
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                          Chapa Payment Gateway
                        </h4>
                        <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.82rem', color: '#475569' }}>
                          Official Ethiopian Gateway (Cards, Telebirr & CBE)
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: '#dcfce7',
                        border: '1px solid #bbf7d0',
                        color: '#15803d',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        letterSpacing: '0.05em',
                      }}
                    >
                      TEST MODE
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', borderTop: '1px solid #bbf7d0', paddingTop: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ShieldCheck size={16} color="#16a34a" />
                      <span>{language === 'am' ? 'በቻፓ በኩል በሰርቨር ደረጃ የተረጋገጠ ባለ 256-ቢት ምስጠራ።' : '256-bit encrypted checkout verified server-side with Chapa.'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} color="#16a34a" />
                      <span>{language === 'am' ? 'ቴሌብር፣ የኢትዮጵያ ንግድ ባንክ (CBE Birr)፣ አዋሽ ባንክ እና ቪዛ/ማስተርካርድን ይደግፋል።' : 'Supports Visa, Mastercard, Telebirr, CBE Birr, and Awash Bank.'}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Coordinates Confirmed Box */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    marginBottom: '1.75rem',
                    fontSize: '0.85rem',
                    color: '#64748b',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem', color: '#0f172a', fontWeight: 600 }}>
                    <MapPin size={16} color="#2563eb" />
                    <span>{language === 'am' ? 'የተረጋገጠ የማድረሻ አድራሻ' : 'Delivery Coordinates Confirmed'}</span>
                  </div>
                  <div>
                    {formData.fullName} • {formData.address}, {formData.city} (Tel: {formData.phone})
                  </div>
                </div>

                {/* Action Navigation Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.75rem 1.25rem',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      color: '#475569',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowLeft size={16} />
                    <span>{language === 'am' ? 'ተመለስ' : 'Back'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalPayment}
                    disabled={submitting}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.8rem 1.6rem',
                      backgroundColor: submitting ? '#6ee7b7' : '#10b981',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.98rem',
                      fontWeight: 700,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      if (!submitting) e.currentTarget.style.backgroundColor = '#059669';
                    }}
                    onMouseOut={(e) => {
                      if (!submitting) e.currentTarget.style.backgroundColor = '#10b981';
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>{language === 'am' ? 'ክፍያ በማስኬድ ላይ...' : 'Connecting to Chapa...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{language === 'am' ? 'በቻፓ ይክፈሉ (Test) →' : 'Pay with Chapa (Test) →'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: "Your Order" Summary Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <ShoppingBag size={20} color="#0f172a" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                {language === 'am' ? 'የትዕዛዝዎ ዝርዝር' : 'Your Order'}
              </h3>
            </div>

            <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '0.25rem' }}>
              {cartItems.map((item) => (
                <div
                  key={item._id || item.product}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        border: '1px solid #e2e8f0',
                      }}
                    />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 600, color: '#0f172a' }}>
                        {item.name}
                      </h4>
                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                        {item.qty} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.92rem' }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>{language === 'am' ? 'የእቃዎች ድምር' : 'Items Subtotal'}</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>${totalPrice}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <div>
                  <div>{language === 'am' ? 'የማድረሻ ክፍያ' : 'Calculated Delivery Fee'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {language === 'am' ? 'መደበኛ ነፃ ማድረሻ (በተካተተ መጠን)' : 'Base Qty Included • Standard Delivery'}
                  </div>
                </div>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>
                  {language === 'am' ? 'ነፃ' : 'Free'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '2px dashed #e2e8f0',
                  paddingTop: '0.9rem',
                  marginTop: '0.4rem',
                }}
              >
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                  {language === 'am' ? 'አጠቃላይ የሚከፈለው' : 'Total Amount Due'}
                </span>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e3a8a' }}>
                  ${totalPrice}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentic Chapa Test Mode Interactive Modal */}
      <ChapaTestModal
        isOpen={showChapaModal}
        onClose={() => setShowChapaModal(false)}
        order={activeOrder}
        txRef={activeTxRef}
        onPaymentSuccess={() => clearCart()}
      />
    </div>
  );
};

export default CheckoutPage;
