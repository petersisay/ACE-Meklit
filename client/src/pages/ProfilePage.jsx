import React, { useState, useEffect } from 'react';
import { User, Package, Clock, CheckCircle, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ordersApi, authApi } from '../services/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updateMsg, setUpdateMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await ordersApi.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdateMsg(null);
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const updateData = { name, phone };
      if (password.trim()) {
        updateData.password = password;
      }
      const { data } = await authApi.updateProfile(updateData);
      updateUser(data);
      setUpdateMsg('Profile updated successfully!');
      setPassword('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="profile-page section container">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#0f172a', marginBottom: '0.5rem' }}>
          My Account & Orders
        </h1>
        <p style={{ color: '#64748b' }}>
          Manage your personal details and track your ACE Meklit purchases.
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
        {/* Profile Card */}
        <div
          style={{
            background: '#ffffff',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#1e3a8a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.25rem',
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0 }}>{user?.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                {user?.role === 'admin' ? '⭐ Administrator' : 'Beloved Member'}
              </p>
            </div>
          </div>

          {updateMsg && (
            <div className="alert alert-success" style={{ fontSize: '0.9rem' }}>
              <CheckCircle size={18} />
              <span>{updateMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="alert alert-danger" style={{ fontSize: '0.9rem' }}>
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                value={email}
                disabled
                className="form-input"
                style={{ background: '#f8fafc', color: '#64748b' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
                placeholder="+251..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password (leave blank to keep current)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-navy"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <Save size={18} />
              <span>{submitting ? 'Saving Changes...' : 'Update Profile'}</span>
            </button>
          </form>
        </div>

        {/* Order History */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Package size={22} color="#1e3a8a" />
            <h2 style={{ fontSize: '1.35rem', color: '#0f172a', margin: 0 }}>
              Order History ({orders.length})
            </h2>
          </div>

          {loadingOrders ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
              <Package size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.4rem' }}>No orders yet</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Your completed purchases and trackings will show up here.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Order ID</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Date</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Items</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Total</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Payment</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', fontWeight: 600, color: '#1e3a8a' }}>
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td style={{ padding: '1rem 1rem', color: '#64748b' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem 1rem' }}>
                        {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                      </td>
                      <td style={{ padding: '1rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                        ${Number(order.totalPrice).toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem 1rem' }}>
                        {order.isPaid ? (
                          <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>
                            ✓ Paid
                          </span>
                        ) : (
                          <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.85rem' }}>
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            background:
                              order.status === 'Delivered'
                                ? '#ecfdf5'
                                : order.status === 'Processing'
                                ? '#eff6ff'
                                : '#fef3c7',
                            color:
                              order.status === 'Delivered'
                                ? '#059669'
                                : order.status === 'Processing'
                                ? '#1d4ed8'
                                : '#b45309',
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
