/**
 * ACE Meklit - Comprehensive Security & Business Feature Verification Test Suite
 * Validates:
 * 1. Health check with database connectivity and uptime
 * 2. Public API catalog & search filtering
 * 3. Authentication & JWT security
 * 4. Admin role-based access control (RBAC) & route guards
 * 5. Server-side order price tampering prevention
 * 6. Order object ownership authorization (IDOR protection)
 */

const http = require('http');
const path = require('path');
const mongoose = require('mongoose');

// Configure test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '5002';
process.env.JWT_SECRET = 'test_jwt_secret_ace_meklit_2026';

const serverDir = path.resolve(__dirname, '..');
const { connectDB, disconnectDB } = require(path.join(serverDir, 'config', 'db'));
const app = require(path.join(serverDir, 'server'));

const User = require(path.join(serverDir, 'models', 'User'));
const Product = require(path.join(serverDir, 'models', 'Product'));
const Order = require(path.join(serverDir, 'models', 'Order'));

// HTTP helper
const request = (options, postData) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed = data;
        try {
          parsed = JSON.parse(data);
        } catch (e) {}
        resolve({ statusCode: res.statusCode, headers: res.headers, body: parsed });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
};

async function runAuditTests() {
  console.log('================================================================');
  console.log('✝️  ACE MEKLIT — SECURITY AUDIT & BUSINESS VERIFICATION SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, name, details = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${name} ${details}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name} ${details}`);
      failed++;
    }
  }

  let server = null;

  try {
    // 1. Connect database
    console.log('[Phase 1] Starting In-Memory Test Database...');
    await connectDB();

    // Start HTTP server on test port 5002
    server = app.listen(5002);
    console.log('[Phase 1] Test HTTP Server running on http://localhost:5002\n');

    // Clean & Seed fresh test records
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    const adminUser = await User.create({
      name: 'Admin Petros Sisay',
      email: 'admin@acemeklit.org',
      password: 'password123',
      role: 'admin',
      phone: '+251911000000',
    });

    const customerUser = await User.create({
      name: 'Bereket Customer',
      email: 'bereket@example.com',
      password: 'password123',
      role: 'user',
      phone: '+251922000000',
    });

    const otherUser = await User.create({
      name: 'Other Customer',
      email: 'other@example.com',
      password: 'password123',
      role: 'user',
      phone: '+251933000000',
    });

    const testProduct = await Product.create({
      name: 'ACE Official Hoodie',
      description: 'Living Word & ACE Logo official heavyweight hoodie.',
      category: 'ACE Logo Products',
      price: 50.00, // True price is $50.00
      image: '/Images/hoddie.png',
      countInStock: 25,
      isFeatured: true,
      scriptureReference: 'Deuteronomy 6:4',
    });

    // --- TEST 1: Healthcheck with DB status ---
    console.log('[Phase 2] Verifying Healthcheck & Startup Resilience...');
    const healthRes = await request({
      hostname: 'localhost',
      port: 5002,
      path: '/api/health',
      method: 'GET',
    });
    assert(healthRes.statusCode === 200, 'Healthcheck returns 200 OK');
    assert(healthRes.body.status === 'online', 'Healthcheck status is online');
    assert(healthRes.body.database === 'connected', 'Healthcheck verifies database is connected');
    assert(typeof healthRes.body.uptime === 'number', 'Healthcheck reports system uptime');

    // --- TEST 2: Product Catalog & Search ---
    console.log('\n[Phase 3] Verifying Product Catalog & Search Filters...');
    const prodRes = await request({
      hostname: 'localhost',
      port: 5002,
      path: '/api/products',
      method: 'GET',
    });
    assert(prodRes.statusCode === 200 && Array.isArray(prodRes.body), 'GET /api/products returns product array');

    const searchRes = await request({
      hostname: 'localhost',
      port: 5002,
      path: '/api/products?keyword=Hoodie',
      method: 'GET',
    });
    assert(searchRes.body.length > 0 && searchRes.body[0].name.includes('Hoodie'), 'Search filter finds products by keyword');

    // --- TEST 3: Authentication & Token Issuance ---
    console.log('\n[Phase 4] Verifying Authentication & Role-Based Access Control...');
    const loginCustomer = await request(
      {
        hostname: 'localhost',
        port: 5002,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'bereket@example.com', password: 'password123' }
    );
    assert(loginCustomer.statusCode === 200 && loginCustomer.body.token, 'Customer login succeeds and returns JWT token');
    const customerToken = loginCustomer.body.token;

    const loginAdmin = await request(
      {
        hostname: 'localhost',
        port: 5002,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'admin@acemeklit.org', password: 'password123' }
    );
    assert(loginAdmin.statusCode === 200 && loginAdmin.body.role === 'admin', 'Admin login succeeds and identifies admin role');
    const adminToken = loginAdmin.body.token;

    const loginOther = await request(
      {
        hostname: 'localhost',
        port: 5002,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'other@example.com', password: 'password123' }
    );
    const otherToken = loginOther.body.token;

    // RBAC: Customer should be blocked from admin endpoints
    const forbiddenRes = await request({
      hostname: 'localhost',
      port: 5002,
      path: '/api/auth/users',
      method: 'GET',
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(forbiddenRes.statusCode === 403, 'RBAC: Standard user is denied (403) from accessing admin routes');

    const adminAllowedRes = await request({
      hostname: 'localhost',
      port: 5002,
      path: '/api/auth/users',
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminAllowedRes.statusCode === 200, 'RBAC: Admin user is permitted (200) on admin routes');

    // --- TEST 4: Price Tampering Prevention ---
    console.log('\n[Phase 5] Verifying Server-Side Order Price Tampering Prevention...');
    // Attacker submits an order for 2 Hoodies ($50 each = $100 total) but claims price is $0.01 and total is $0.02
    const tamperedOrderRes = await request(
      {
        hostname: 'localhost',
        port: 5002,
        path: '/api/orders',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
        },
      },
      {
        orderItems: [
          {
            product: testProduct._id.toString(),
            name: testProduct.name,
            qty: 2,
            price: 0.01, // Spoofed malicious price
          },
        ],
        shippingAddress: {
          fullName: 'Bereket Customer',
          address: 'Bole Medhanialem',
          city: 'Addis Ababa',
          country: 'Ethiopia',
          phone: '0911000000',
        },
        paymentMethod: 'Chapa (Telebirr, CBE Birr, Cards)',
        itemsPrice: 0.02, // Spoofed items price
        totalPrice: 0.02, // Spoofed total price
      }
    );

    assert(tamperedOrderRes.statusCode === 201, 'Order creation succeeds');
    const createdOrder = tamperedOrderRes.body;
    assert(
      createdOrder.totalPrice === 100.00,
      'Security: Server ignored spoofed $0.02 and enforced verified database price ($100.00)',
      `Actual: $${createdOrder.totalPrice}`
    );
    assert(
      createdOrder.orderItems[0].price === 50.00,
      'Security: Order item unit price matches real product price ($50.00)',
      `Actual: $${createdOrder.orderItems[0].price}`
    );

    // --- TEST 5: Order Object Ownership (IDOR Prevention) ---
    console.log('\n[Phase 6] Verifying Order Object Ownership Authorization (IDOR)...');
    // 'otherUser' tries to mark Bereket's order as paid
    const unauthorizedPayRes = await request(
      {
        hostname: 'localhost',
        port: 5002,
        path: `/api/orders/${createdOrder._id}/pay`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${otherToken}`,
        },
      },
      { id: 'MALICIOUS-TXN', status: 'COMPLETED' }
    );
    assert(unauthorizedPayRes.statusCode === 403, 'Security: Other user cannot pay for or alter someone else\'s order (403 Forbidden)');

    // Bereket (owner) marks own order as paid
    const ownerPayRes = await request(
      {
        hostname: 'localhost',
        port: 5002,
        path: `/api/orders/${createdOrder._id}/pay`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
        },
      },
      { id: 'CHAPA-LEGIT-123', status: 'COMPLETED' }
    );
    assert(ownerPayRes.statusCode === 200 && ownerPayRes.body.isPaid === true, 'Owner can successfully mark own order as paid (200 OK)');

    // Other user tries to view Bereket's order
    const unauthorizedViewRes = await request({
      hostname: 'localhost',
      port: 5002,
      path: `/api/orders/${createdOrder._id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${otherToken}` },
    });
    assert(unauthorizedViewRes.statusCode === 403, 'Security: Other user is blocked (403) from viewing private order details');

    // Admin can view any order
    const adminViewRes = await request({
      hostname: 'localhost',
      port: 5002,
      path: `/api/orders/${createdOrder._id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminViewRes.statusCode === 200, 'Admin can view any customer order (200 OK)');

    console.log('\n================================================================');
    console.log(`AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================\n');

    if (failed > 0) {
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('Test Suite encountered fatal error:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
    await disconnectDB();
  }
}

runAuditTests();
