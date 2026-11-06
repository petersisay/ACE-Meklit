import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import ProductDetailPage from './pages/ProductDetailPage';
import MediaPage from './pages/MediaPage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentCallbackPage from './pages/PaymentCallbackPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { PrivateRoute, AdminRoute } from './components/ProtectedRoute';
import { useCart } from './context/CartContext';
import { CheckCircle2, Info } from 'lucide-react';

const ToastNotification = () => {
  const { notification } = useCart();
  if (!notification) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        background: '#0f172a',
        color: '#ffffff',
        padding: '0.85rem 1.25rem',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontSize: '0.9rem',
        fontWeight: 500,
        border: '1px solid #334155',
        animation: 'slideUp 0.3s ease',
      }}
    >
      {notification.type === 'info' ? (
        <Info size={18} color="#38bdf8" />
      ) : (
        <CheckCircle2 size={18} color="#10b981" />
      )}
      <span>{notification.message}</span>
    </div>
  );
};

const NotFoundPage = () => (
  <div className="section container" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
    <h1 style={{ fontSize: '3rem', color: '#1e3a8a', marginBottom: '1rem' }}>404</h1>
    <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#0f172a' }}>Page Not Found</h2>
    <p style={{ color: '#64748b', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
      The page you are looking for doesn't exist or has been relocated.
    </p>
    <Link to="/" className="btn btn-primary">
      Return to Home
    </Link>
  </div>
);

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <CheckoutPage />
              </PrivateRoute>
            }
          />
          <Route path="/payment/callback" element={<PaymentCallbackPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <ToastNotification />
    </>
  );
}

export default App;
