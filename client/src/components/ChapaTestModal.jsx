import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, CreditCard, ShieldCheck, Lock, ChevronRight, X, Loader2 } from 'lucide-react';
import { ordersApi } from '../services/api';

const ChapaTestModal = ({ isOpen, onClose, order, txRef, onPaymentSuccess }) => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [phoneNumber, setPhoneNumber] = useState(
    order?.shippingAddress?.phone || '0911223344'
  );
  const [processing, setProcessing] = useState(false);

  if (!isOpen || !order) return null;

  const trackingNumber =
    order.trackingNumber ||
    (txRef ? `AM-${txRef.slice(-8).toUpperCase()}` : `AM-${Date.now().toString().slice(-8)}`);

  const handlePayTestMode = async () => {
    setProcessing(true);

    try {
      if (txRef) {
        await ordersApi.verifyChapa(txRef, { order_id: order._id });
      }

      setTimeout(() => {
        setProcessing(false);
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
        navigate(`/payment/callback?tx_ref=${txRef}&order_id=${order._id}&provider=chapa`);
      }, 1200);
    } catch (err) {
      console.error('Test mode payment error:', err);
      setTimeout(() => {
        setProcessing(false);
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
        navigate(`/payment/callback?tx_ref=${txRef}&order_id=${order._id}&provider=chapa`);
      }, 1000);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 11, 20, 0.85)',
        backdropFilter: 'blur(5px)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      {/* Outer Container matching Chapa Test Mode Screenshot */}
      <div
        style={{
          width: '100%',
          maxWidth: '740px',
          backgroundColor: '#0c192c',
          borderRadius: '16px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px #1e293b',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'minmax(260px, 310px) 1fr',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '4px',
            zIndex: 10,
          }}
          title="Close modal"
        >
          <X size={20} />
        </button>

        {/* LEFT COLUMN: Payment Methods */}
        <div
          style={{
            backgroundColor: '#081424',
            padding: '2rem 1.4rem',
            borderRight: '1px solid #1e293b',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Chapa Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#22c55e',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1rem',
                letterSpacing: '-0.02em',
              }}
            >
              CH
            </div>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#22c55e', letterSpacing: '-0.03em' }}>
              Chapa
            </span>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 1.75rem 0' }}>
            Select your payment method here
          </p>

          {/* Test Bank Payment Option */}
          <div
            onClick={() => setSelectedMethod('bank')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.9rem 1rem',
              backgroundColor: selectedMethod === 'bank' ? '#112920' : '#0c192c',
              border: selectedMethod === 'bank' ? '1.5px solid #22c55e' : '1px solid #1e293b',
              borderRadius: '10px',
              marginBottom: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: selectedMethod === 'bank' ? '#173f2c' : '#1e293b',
                  color: selectedMethod === 'bank' ? '#22c55e' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Landmark size={18} />
              </div>
              <span
                style={{
                  fontSize: '0.92rem',
                  fontWeight: selectedMethod === 'bank' ? 700 : 500,
                  color: selectedMethod === 'bank' ? '#ffffff' : '#cbd5e1',
                }}
              >
                Test Bank Payment
              </span>
            </div>
            <ChevronRight size={18} color={selectedMethod === 'bank' ? '#22c55e' : '#64748b'} />
          </div>

          {/* Test Card Payment Option */}
          <div
            onClick={() => setSelectedMethod('card')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.9rem 1rem',
              backgroundColor: selectedMethod === 'card' ? '#112920' : '#0c192c',
              border: selectedMethod === 'card' ? '1.5px solid #22c55e' : '1px solid #1e293b',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: selectedMethod === 'card' ? '#173f2c' : '#1e293b',
                  color: selectedMethod === 'card' ? '#22c55e' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CreditCard size={18} />
              </div>
              <span
                style={{
                  fontSize: '0.92rem',
                  fontWeight: selectedMethod === 'card' ? 700 : 500,
                  color: selectedMethod === 'card' ? '#ffffff' : '#cbd5e1',
                }}
              >
                Test Card Payment
              </span>
            </div>
            <ChevronRight size={18} color={selectedMethod === 'card' ? '#22c55e' : '#64748b'} />
          </div>
        </div>

        {/* RIGHT COLUMN: Merchant Brand & Payment Form */}
        <div style={{ padding: '2rem 1.85rem', display: 'flex', flexDirection: 'column' }}>
          {/* Header row: Brand & Language */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                }}
              >
                ✓
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                ACE Meklit
              </span>
            </div>

            <div style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600, paddingRight: '1.5rem' }}>
              EN ▾
            </div>
          </div>

          {/* Order reference */}
          <div style={{ color: '#94a3b8', fontSize: '0.88rem', fontWeight: 500, marginBottom: '1.25rem' }}>
            Order {trackingNumber}
          </div>

          {/* Test mode disclaimer */}
          <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.5, margin: '0 0 0.5rem 0' }}>
            No actual money is used in the test mode. Only our test cards and bank accounts can be used.
          </p>

          <a
            href="#testing-phone"
            onClick={(e) => {
              e.preventDefault();
              setPhoneNumber('0911000000');
            }}
            style={{
              color: '#22c55e',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              marginBottom: '1.5rem',
              display: 'inline-block',
            }}
          >
            Testing phone number
          </a>

          {/* Phone Number Input */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.45rem' }}>
              Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="09********"
                style={{
                  width: '100%',
                  padding: '0.8rem 2.5rem 0.8rem 1rem',
                  backgroundColor: '#08121e',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#22c55e',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ShieldCheck size={20} />
              </div>
            </div>
          </div>

          {/* Pay using Test Mode Button */}
          <button
            type="button"
            onClick={handlePayTestMode}
            disabled={processing}
            style={{
              width: '100%',
              padding: '0.85rem',
              backgroundColor: '#65a30d',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: processing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(101, 163, 13, 0.4)',
              transition: 'background-color 0.15s ease',
            }}
            onMouseOver={(e) => {
              if (!processing) e.currentTarget.style.backgroundColor = '#4d7c0f';
            }}
            onMouseOut={(e) => {
              if (!processing) e.currentTarget.style.backgroundColor = '#65a30d';
            }}
          >
            {processing ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Processing Test Payment...</span>
              </>
            ) : (
              <span>Pay using Test Mode</span>
            )}
          </button>
        </div>
      </div>

      {/* Secured By Chapa Footer */}
      <div
        style={{
          marginTop: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          color: '#cbd5e1',
          fontSize: '0.88rem',
          fontWeight: 600,
        }}
      >
        <Lock size={15} color="#22c55e" />
        <span>Secured By Chapa</span>
      </div>
    </div>
  );
};

export default ChapaTestModal;
