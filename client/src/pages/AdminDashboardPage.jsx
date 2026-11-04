import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  DollarSign,
  Users,
  Video,
  Mail,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  productsApi,
  ordersApi,
  mediaApi,
  contactApi,
  authApi,
} from '../services/api';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  // Alert feedback
  const [actionMsg, setActionMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // New product form
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'ACE Logo Products',
    price: '',
    description: '',
    image: '/Images/ace logo.jpg',
    countInStock: 25,
    scriptureReference: '',
    isFeatured: true,
  });

  // New media form
  const [showAddMedia, setShowAddMedia] = useState(false);
  const [newMedia, setNewMedia] = useState({
    title: '',
    artistOrSpeaker: '',
    type: 'music',
    releaseType: 'Full Album',
    youtubeId: '',
    description: '',
  });

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes, medRes, msgRes, usrRes] = await Promise.all([
        productsApi.getAll(),
        ordersApi.getAll(),
        mediaApi.getAll(),
        contactApi.getAll(),
        authApi.getUsers(),
      ]);
      setProducts(prodRes.data);
      setOrders(ordRes.data);
      setMediaItems(medRes.data);
      setMessages(msgRes.data);
      setUsers(usrRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setErrorMsg('Failed to fetch administrative data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const triggerFeedback = (msg, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 4000);
    } else {
      setActionMsg(msg);
      setTimeout(() => setActionMsg(null), 4000);
    }
  };

  // Product Actions
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        price: parseFloat(newProduct.price) || 0,
        countInStock: parseInt(newProduct.countInStock) || 0,
      };
      await productsApi.create(payload);
      setShowAddProduct(false);
      setNewProduct({
        name: '',
        category: 'ACE Logo Products',
        price: '',
        description: '',
        image: '/Images/ace logo.jpg',
        countInStock: 25,
        scriptureReference: '',
        isFeatured: true,
      });
      triggerFeedback('Product created successfully!');
      loadAllAdminData();
    } catch (err) {
      triggerFeedback(err.response?.data?.message || 'Error creating product', true);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsApi.delete(id);
        triggerFeedback('Product deleted successfully');
        loadAllAdminData();
      } catch (err) {
        triggerFeedback('Failed to delete product', true);
      }
    }
  };

  // Order Actions
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      triggerFeedback(`Order status updated to "${newStatus}"`);
      loadAllAdminData();
    } catch (err) {
      triggerFeedback('Failed to update order status', true);
    }
  };

  // Media Actions
  const handleCreateMedia = async (e) => {
    e.preventDefault();
    try {
      await mediaApi.create(newMedia);
      setShowAddMedia(false);
      setNewMedia({
        title: '',
        artistOrSpeaker: '',
        type: 'music',
        releaseType: 'Full Album',
        youtubeId: '',
        description: '',
      });
      triggerFeedback('Media item added successfully!');
      loadAllAdminData();
    } catch (err) {
      triggerFeedback(err.response?.data?.message || 'Failed to add media', true);
    }
  };

  const handleDeleteMedia = async (id) => {
    if (window.confirm('Delete this media content?')) {
      try {
        await mediaApi.delete(id);
        triggerFeedback('Media content removed');
        loadAllAdminData();
      } catch (err) {
        triggerFeedback('Failed to delete media', true);
      }
    }
  };

  // Contact Actions
  const handleUpdateMessageStatus = async (id, status) => {
    try {
      await contactApi.updateStatus(id, status);
      triggerFeedback('Inquiry status updated');
      loadAllAdminData();
    } catch (err) {
      triggerFeedback('Failed to update message', true);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        await contactApi.delete(id);
        triggerFeedback('Message deleted');
        loadAllAdminData();
      } catch (err) {
        triggerFeedback('Failed to delete message', true);
      }
    }
  };

  const totalRevenue = orders
    .filter((o) => o.isPaid)
    .reduce((acc, o) => acc + (o.totalPrice || 0), 0)
    .toFixed(2);

  return (
    <div className="admin-page section container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#0f172a', marginBottom: '0.5rem' }}>
          ACE Meklit Administrative Dashboard
        </h1>
        <p style={{ color: '#64748b' }}>
          Comprehensive management portal for orders, store catalog, media content, and inquiries.
        </p>
      </div>

      {actionMsg && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{actionMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Admin Nav Tabs */}
      <div className="filter-tabs" style={{ justifyContent: 'flex-start', marginBottom: '2rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`filter-tab ${activeTab === 'overview' ? 'active' : ''}`}
        >
          Overview & Metrics
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`filter-tab ${activeTab === 'products' ? 'active' : ''}`}
        >
          Products ({products.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`filter-tab ${activeTab === 'orders' ? 'active' : ''}`}
        >
          Orders ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`filter-tab ${activeTab === 'media' ? 'active' : ''}`}
        >
          Media Library ({mediaItems.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`filter-tab ${activeTab === 'messages' ? 'active' : ''}`}
        >
          Contact Messages ({messages.length})
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
          Loading dashboard data...
        </div>
      ) : (
        <div>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '3rem',
                }}
              >
                <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ color: '#10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>TOTAL REVENUE</span>
                    <DollarSign size={24} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>${totalRevenue}</div>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>From paid orders</span>
                </div>

                <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ color: '#1e3a8a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>TOTAL ORDERS</span>
                    <ShoppingBag size={24} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{orders.length}</div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Placed through website</span>
                </div>

                <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ color: '#d97706', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>CATALOG ITEMS</span>
                    <Package size={24} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{products.length}</div>
                  <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 600 }}>In store catalog</span>
                </div>

                <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ color: '#3b82f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>COMMUNITY MEMBERS</span>
                    <Users size={24} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{users.length}</div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Registered accounts</span>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#0f172a' }}>
                  Recent Orders
                </h3>
                {orders.length === 0 ? (
                  <p style={{ color: '#64748b' }}>No orders placed yet.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                          <th style={{ padding: '0.75rem 1rem' }}>Order ID</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Customer</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Items</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Total</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((o) => (
                          <tr key={o._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#1e3a8a' }}>
                              #{o._id.slice(-6).toUpperCase()}
                            </td>
                            <td style={{ padding: '0.75rem 1rem' }}>{o.shippingAddress?.fullName}</td>
                            <td style={{ padding: '0.75rem 1rem' }}>{o.orderItems?.length} items</td>
                            <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>${Number(o.totalPrice).toFixed(2)}</td>
                            <td style={{ padding: '0.75rem 1rem' }}>
                              <span style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, background: '#eff6ff', color: '#1e3a8a' }}>
                                {o.status}
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
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#0f172a' }}>Meklit Store Catalog</h2>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowAddProduct(!showAddProduct)}
                >
                  <Plus size={18} />
                  <span>{showAddProduct ? 'Cancel' : 'Add New Product'}</span>
                </button>
              </div>

              {/* Add Product Form */}
              {showAddProduct && (
                <form
                  onSubmit={handleCreateProduct}
                  style={{
                    background: '#ffffff',
                    padding: '2rem',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    marginBottom: '2rem',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  }}
                >
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#0f172a' }}>
                    New Product Information
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Product Name *</label>
                      <input
                        type="text"
                        required
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="form-input"
                        placeholder="e.g. Living Word Hoodie"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="form-select"
                      >
                        <option value="ACE Logo Products">ACE Logo Products</option>
                        <option value="Bible Verse Products">Bible Verse Products</option>
                        <option value="Holy Bible Covers and Books">Holy Bible Covers and Books</option>
                        <option value="Apparel">Apparel</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="form-input"
                        placeholder="19.99"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Initial Stock *</label>
                      <input
                        type="number"
                        required
                        value={newProduct.countInStock}
                        onChange={(e) => setNewProduct({ ...newProduct, countInStock: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Image Path *</label>
                      <input
                        type="text"
                        required
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        className="form-input"
                        placeholder="/Images/hoddie.png"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Scripture Reference</label>
                      <input
                        type="text"
                        value={newProduct.scriptureReference}
                        onChange={(e) => setNewProduct({ ...newProduct, scriptureReference: e.target.value })}
                        className="form-input"
                        placeholder="e.g. Deuteronomy 6:4"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="form-textarea"
                      placeholder="Detailed item description and fabric details..."
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-navy" style={{ padding: '0.75rem 1.75rem' }}>
                    Save Product
                  </button>
                </form>
              )}

              {/* Products Table */}
              <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '0.85rem 1rem' }}>Image</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Title</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Price</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Stock</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#f8fafc', borderRadius: '6px' }}
                              onError={(e) => {
                                e.target.src = '/Images/ace logo.jpg';
                              }}
                            />
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>{p.name}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{p.category}</td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#1e3a8a' }}>
                            ${Number(p.price).toFixed(2)}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            {p.countInStock > 0 ? (
                              <span style={{ color: '#10b981', fontWeight: 600 }}>{p.countInStock}</span>
                            ) : (
                              <span style={{ color: '#ef4444', fontWeight: 600 }}>0 (Out)</span>
                            )}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p._id)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.4rem' }}
                              title="Delete Product"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1.5rem' }}>
                All Customer Orders
              </h2>

              <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '0.85rem 1rem' }}>Order ID</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Delivery Address</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Total</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Payment</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Update Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#1e3a8a' }}>
                            #{o._id.slice(-6).toUpperCase()}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <strong>{o.shippingAddress?.fullName}</strong>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{o.shippingAddress?.phone}</div>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>
                            {o.shippingAddress?.address}, {o.shippingAddress?.city}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                            ${Number(o.totalPrice).toFixed(2)}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            {o.isPaid ? (
                              <span style={{ color: '#10b981', fontWeight: 600 }}>✓ Paid ({o.paymentMethod})</span>
                            ) : (
                              <span style={{ color: '#ef4444', fontWeight: 600 }}>Unpaid</span>
                            )}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <select
                              value={o.status}
                              onChange={(e) => handleOrderStatusChange(o._id, e.target.value)}
                              className="form-select"
                              style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#0f172a' }}>
                  Gospel Musics & Sermons Library
                </h2>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowAddMedia(!showAddMedia)}
                >
                  <Plus size={18} />
                  <span>{showAddMedia ? 'Cancel' : 'Add Content'}</span>
                </button>
              </div>

              {/* Add Media Form */}
              {showAddMedia && (
                <form
                  onSubmit={handleCreateMedia}
                  style={{
                    background: '#ffffff',
                    padding: '2rem',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    marginBottom: '2rem',
                  }}
                >
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#0f172a' }}>
                    Add Video Embed
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Title *</label>
                      <input
                        type="text"
                        required
                        value={newMedia.title}
                        onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                        className="form-input"
                        placeholder="e.g. Eyesus Mulate"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Artist or Speaker *</label>
                      <input
                        type="text"
                        required
                        value={newMedia.artistOrSpeaker}
                        onChange={(e) => setNewMedia({ ...newMedia, artistOrSpeaker: e.target.value })}
                        className="form-input"
                        placeholder="e.g. Hibret Zmare Senduk / Bishop Elias Asha"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Type *</label>
                      <select
                        value={newMedia.type}
                        onChange={(e) => setNewMedia({ ...newMedia, type: e.target.value })}
                        className="form-select"
                      >
                        <option value="music">Gospel Music</option>
                        <option value="preaching">Apostolic Preaching</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">YouTube Video ID *</label>
                      <input
                        type="text"
                        required
                        value={newMedia.youtubeId}
                        onChange={(e) => setNewMedia({ ...newMedia, youtubeId: e.target.value })}
                        className="form-input"
                        placeholder="e.g. kz9EyrTOIco"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      rows={2}
                      value={newMedia.description}
                      onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
                      className="form-textarea"
                      placeholder="Brief overview of album or sermon..."
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-navy" style={{ padding: '0.75rem 1.75rem' }}>
                    Publish to Media Page
                  </button>
                </form>
              )}

              {/* Media Table */}
              <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '0.85rem 1rem' }}>Title</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Artist / Preacher</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Type</th>
                        <th style={{ padding: '0.85rem 1rem' }}>YouTube ID</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mediaItems.map((m) => (
                        <tr key={m._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>{m.title}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>{m.artistOrSpeaker}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span style={{ padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, background: m.type === 'music' ? '#fef3c7' : '#eff6ff', color: m.type === 'music' ? '#b45309' : '#1e3a8a' }}>
                              {m.type}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace' }}>{m.youtubeId}</td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteMedia(m._id)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.4rem' }}
                              title="Delete Item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MESSAGES */}
          {activeTab === 'messages' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1.5rem' }}>
                Contact Messages & Inquiries
              </h2>

              <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '0.85rem 1rem' }}>Sender</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Email</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Message</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Date</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.map((msg) => (
                        <tr key={msg._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{msg.name}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#1e3a8a' }}>{msg.email}</td>
                          <td style={{ padding: '0.75rem 1rem', maxWidth: '320px', color: '#475569' }}>
                            {msg.message}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <select
                              value={msg.status}
                              onChange={(e) => handleUpdateMessageStatus(msg._id, e.target.value)}
                              className="form-select"
                              style={{ width: 'auto', padding: '0.3rem 0.5rem', fontSize: '0.82rem' }}
                            >
                              <option value="unread">Unread</option>
                              <option value="read">Read</option>
                              <option value="responded">Responded</option>
                            </select>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(msg._id)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.4rem' }}
                              title="Delete Message"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
