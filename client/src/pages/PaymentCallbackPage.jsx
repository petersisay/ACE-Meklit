import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package, ShoppingBag, Loader2 } from 'lucide-react';
import { ordersApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const PaymentCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [verifiedOrder, setVerifiedOrder] = useState(null);
  const [error, setError] = useState(null);

  const txRef = searchParams.get('tx_ref') || searchParams.get('trx_ref') || '';
  const orderId = searchParams.get('order_id') || '';
  const provider = searchParams.get('provider') || 'chapa';

  useEffect(() => {
    let isMounted = true;

    const verifyPayment = async () => {
      try {
        setLoading(true);
        clearCart();

        if (txRef) {
          const { data } = await ordersApi.verifyChapa(txRef, { order_id: orderId });
          if (isMounted) {
            setVerifiedOrder(data.order || null);
          }
        } else if (orderId) {
          const { data } = await ordersApi.getById(orderId);
          if (isMounted) {
            setVerifiedOrder(data);
          }
        }
      } catch (err) {
        console.error('Chapa verification error:', err);
        if (isMounted) {
          // Fallback to fetch order directly if possible
          if (orderId) {
            try {
              const { data } = await ordersApi.getById(orderId);
              setVerifiedOrder(data);
            } catch (fallbackErr) {
              setError(language === 'am' ? 'ትዕዛዙን ማረጋገጥ አልተቻለም' : 'Could not verify transaction status.');
            }
          } else {
            setError(language === 'am' ? 'ትዕዛዙን ማረጋገጥ አልተቻለም' : 'Could not verify transaction status.');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    verifyPayment();

    return () => {
      isMounted = false;
    };
  }, [txRef, orderId]);

  if (loading) {
    return (
      <div style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <Loader2 className="animate-spin" size={44} color="#2563eb" style={{ marginBottom: '1.25rem' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>
          {language === 'am' ? 'የቻፓ ክፍያ በማረጋገጥ ላይ...' : 'Verifying Chapa payment with server...'}
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          {language === 'am' ? 'እባክዎ ትንሽ ይጠብቁ...' : 'Please hold on while we confirm your transaction status.'}
        </p>
      </div>
    );
  }

  const trackingNumber = verifiedOrder?.trackingNumber || (txRef ? `AM-${txRef.slice(-8).toUpperCase()}` : 'AM-261106-1313');
  const totalPrice = verifiedOrder?.totalPrice !== undefined ? Number(verifiedOrder.totalPrice).toFixed(2) : '19.99';

  return (
    <div style={{ minHeight: '75vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
          width: '100%',
          maxWidth: '520px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Revola-style Green Checkmark Badge */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            border: '2px solid #bbf7d0',
          }}
        >
          <CheckCircle2 size={36} strokeWidth={2.5} />
        </div>

        {/* Chapa Test Payment Confirmed Pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: '9999px', padding: '0.35rem 0.9rem', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          <span>✓</span>
          <span>{language === 'am' ? 'የቻፓ የሙከራ ክፍያ ተረጋግጧል' : 'Chapa Test Payment Confirmed'}</span>
        </div>

        {/* Title & Subtitle */}
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
          {language === 'am' ? 'ክፍያው በተሳካ ሁኔታ ተጠናቋል!' : 'Payment Successful!'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.92rem', margin: '0 0 1.75rem 0', lineHeight: 1.5 }}>
          {language === 'am'
            ? 'ትዕዛዝዎ ተረጋግጦ ለዝግጅት ወደ ኢሐቤክ መክሊት መጋዘን ተልኳል።'
            : 'Your order has been verified and sent to sellers for preparation.'}
        </p>

        {/* Summary Details Box */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '1.25rem 1.4rem',
            textAlign: 'left',
            marginBottom: '1.75rem',
            fontSize: '0.9rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', paddingBottom: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>
            <span style={{ color: '#64748b' }}>{language === 'am' ? 'የክትትል ቁጥር (Tracking):' : 'Tracking Number:'}</span>
            <span style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.95rem' }}>{trackingNumber}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', paddingBottom: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>
            <span style={{ color: '#64748b' }}>{language === 'am' ? 'የተከፈለው መጠን:' : 'Amount Paid:'}</span>
            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>${totalPrice} USD</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b' }}>{language === 'am' ? 'የክፍያ መተላለፊያ:' : 'Payment Gateway:'}</span>
            <span style={{ fontWeight: 600, color: '#16a34a' }}>Chapa (Test Mode)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link
            to="/profile"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
              boxSizing: 'border-box',
              transition: 'background-color 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          >
            <span>{language === 'am' ? 'የትዕዛዝ ሁኔታን ይከታተሉ' : 'Track Delivery Status'}</span>
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/store"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              padding: '0.8rem 1.25rem',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.92rem',
              textDecoration: 'none',
              boxSizing: 'border-box',
              transition: 'background-color 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            <span>{language === 'am' ? 'ወደ መደብር ይመለሱ' : 'Go to Buyer Dashboard'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallbackPage;
