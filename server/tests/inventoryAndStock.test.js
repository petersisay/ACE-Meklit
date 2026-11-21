/**
 * ACE Meklit - Real-Time Inventory & Out-of-Stock Protection Test Suite
 * Validates:
 * 1. Out-of-stock rejection (HTTP 400 when countInStock is 0)
 * 2. Insufficient stock rejection (HTTP 400 when requested qty > countInStock)
 * 3. Successful order creation within available inventory
 * 4. Atomic stock decrement upon payment confirmation
 * 5. Idempotent payment processing (duplicate payment does NOT double-deduct stock)
 * 6. Safe inventory restoration when a paid order is cancelled
 * 7. Admin inventory adjustment endpoint (PUT /api/products/:id/stock) with negative stock prevention
 */

const http = require('http');
const path = require('path');
const mongoose = require('mongoose');

process.env.NODE_ENV = 'test';
process.env.PORT = '5003';
process.env.JWT_SECRET = 'test_jwt_secret_ace_inventory_2026';

const serverDir = path.resolve(__dirname, '..');
const { connectDB, disconnectDB } = require(path.join(serverDir, 'config', 'db'));
const app = require(path.join(serverDir, 'server'));

const User = require(path.join(serverDir, 'models', 'User'));
const Product = require(path.join(serverDir, 'models', 'Product'));
const Order = require(path.join(serverDir, 'models', 'Order'));

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

async function runInventoryTests() {
  console.log('================================================================');
  console.log('📦  ACE MEKLIT — REAL-TIME INVENTORY & STOCK PROTECTION SUITE');
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
    console.log('[Phase 1] Starting Test Server and DB...');
    await connectDB();

    server = app.listen(5003);
    await new Promise((r) => setTimeout(r, 500));
    console.log('[Phase 1] Server running on http://localhost:5003\n');

    // Clean test collections
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Setup Test Users
    const customer = await User.create({
      name: 'Bereket Inventory Tester',
      email: 'bereket_inventory@example.com',
      password: 'password123',
      role: 'user',
    });

    const admin = await User.create({
      name: 'Admin Inventory Manager',
      email: 'admin_inventory@example.com',
      password: 'password123',
      role: 'admin',
    });

    // Obtain tokens
    const loginRes = await request(
      {
        hostname: 'localhost',
        port: 5003,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'bereket_inventory@example.com', password: 'password123' }
    );
    const customerToken = loginRes.body.token;

    const adminLoginRes = await request(
      {
        hostname: 'localhost',
        port: 5003,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'admin_inventory@example.com', password: 'password123' }
    );
    const adminToken = adminLoginRes.body.token;

    // Create Test Products
    const inStockProduct = await Product.create({
      name: 'Limited Edition Faith Hoodie',
      description: 'Exclusive covenant cotton hoodie with limited stock',
      category: 'Apparel',
      price: 45.0,
      image: '/Images/shirt.png',
      countInStock: 5,
    });

    const outOfStockProduct = await Product.create({
      name: 'Rare Leather Bible Case',
      description: 'Handcrafted leather case currently sold out',
      category: 'Accessories',
      price: 30.0,
      image: '/Images/Bible cover.jpg',
      countInStock: 0,
    });

    // Phase 2: Out of Stock Rejection
    console.log('[Phase 2] Verifying Out-of-Stock Rejection...');
    const outOfStockOrderRes = await request(
      {
        hostname: 'localhost',
        port: 5003,
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
            product: outOfStockProduct._id.toString(),
            name: outOfStockProduct.name,
            qty: 1,
            price: 30.0,
          },
        ],
        shippingAddress: {
          fullName: 'Bereket Tester',
          address: 'Bole Medhanealem',
          city: 'Addis Ababa',
          phone: '0911223344',
        },
        paymentMethod: 'Chapa (Telebirr)',
      }
    );

    assert(
      outOfStockOrderRes.statusCode === 400,
      'Order with out-of-stock item is rejected with 400 Bad Request'
    );
    assert(
      outOfStockOrderRes.body.message && outOfStockOrderRes.body.message.includes('out of stock'),
      'Error message clearly informs customer product is out of stock'
    );

    // Phase 3: Insufficient Stock Rejection
    console.log('\n[Phase 3] Verifying Insufficient Stock Quantity Rejection...');
    const excessiveQtyOrderRes = await request(
      {
        hostname: 'localhost',
        port: 5003,
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
            product: inStockProduct._id.toString(),
            name: inStockProduct.name,
            qty: 10, // Stock is only 5
            price: 45.0,
          },
        ],
        shippingAddress: {
          fullName: 'Bereket Tester',
          address: 'Bole Medhanealem',
          city: 'Addis Ababa',
          phone: '0911223344',
        },
        paymentMethod: 'Chapa (Telebirr)',
      }
    );

    assert(
      excessiveQtyOrderRes.statusCode === 400,
      'Order exceeding available stock (10 requested vs 5 in stock) is rejected with 400'
    );
    assert(
      excessiveQtyOrderRes.body.message && excessiveQtyOrderRes.body.message.includes('Insufficient stock'),
      'Error message reports insufficient stock quantity'
    );

    // Phase 4: Valid Stock Order Creation
    console.log('\n[Phase 4] Verifying Valid Stock Order Creation...');
    const validOrderRes = await request(
      {
        hostname: 'localhost',
        port: 5003,
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
            product: inStockProduct._id.toString(),
            name: inStockProduct.name,
            qty: 2, // Valid: 2 <= 5
            price: 45.0,
          },
        ],
        shippingAddress: {
          fullName: 'Bereket Tester',
          address: 'Bole Medhanealem',
          city: 'Addis Ababa',
          phone: '0911223344',
        },
        paymentMethod: 'Chapa (Telebirr)',
      }
    );

    assert(validOrderRes.statusCode === 201, 'Valid order is created successfully (201 Created)');
    const createdOrderId = validOrderRes.body._id;

    // Phase 5: Atomic Stock Decrement Upon Payment Confirmation
    console.log('\n[Phase 5] Verifying Atomic Stock Decrement on Payment...');
    const initialProductCheck = await Product.findById(inStockProduct._id);
    assert(initialProductCheck.countInStock === 5, 'Stock remains unchanged prior to confirmed payment');

    const payRes = await request(
      {
        hostname: 'localhost',
        port: 5003,
        path: `/api/orders/${createdOrderId}/pay`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
        },
      },
      {
        id: `CHAPA-TEST-TXN-${Date.now()}`,
        status: 'COMPLETED',
      }
    );

    assert(payRes.statusCode === 200, 'Payment confirmation succeeds (200 OK)');
    const productAfterPayment = await Product.findById(inStockProduct._id);
    assert(
      productAfterPayment.countInStock === 3,
      'Product stock atomically decremented from 5 to 3 (5 - 2 = 3)',
      `Actual stock: ${productAfterPayment.countInStock}`
    );

    // Phase 6: Idempotent Payment Processing (Prevent Double Deduction)
    console.log('\n[Phase 6] Verifying Idempotent Payment Callbacks (No Double Deduction)...');
    const duplicatePayRes = await request(
      {
        hostname: 'localhost',
        port: 5003,
        path: `/api/orders/${createdOrderId}/pay`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
        },
      },
      {
        id: `CHAPA-TEST-TXN-DUPLICATE`,
        status: 'COMPLETED',
      }
    );

    assert(duplicatePayRes.statusCode === 200, 'Duplicate payment call handles idempotently');
    const productAfterDuplicate = await Product.findById(inStockProduct._id);
    assert(
      productAfterDuplicate.countInStock === 3,
      'Stock was NOT double-deducted on duplicate payment callback',
      `Stock remains: ${productAfterDuplicate.countInStock}`
    );

    // Phase 7: Safe Stock Restoration on Order Cancellation
    console.log('\n[Phase 7] Verifying Stock Restoration on Cancellation...');
    const cancelRes = await request(
      {
        hostname: 'localhost',
        port: 5003,
        path: `/api/orders/${createdOrderId}/status`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      },
      {
        status: 'Cancelled',
      }
    );

    assert(cancelRes.statusCode === 200, 'Order status updated to Cancelled');
    const productAfterCancellation = await Product.findById(inStockProduct._id);
    assert(
      productAfterCancellation.countInStock === 5,
      'Stock successfully restored from 3 back to 5 on order cancellation',
      `Restored stock: ${productAfterCancellation.countInStock}`
    );

    // Phase 8: Admin Stock Adjustment Endpoint
    console.log('\n[Phase 8] Verifying Admin Stock Adjustment (PUT /api/products/:id/stock)...');
    const adminStockRes = await request(
      {
        hostname: 'localhost',
        port: 5003,
        path: `/api/products/${inStockProduct._id}/stock`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      },
      {
        countInStock: 25,
      }
    );

    assert(adminStockRes.statusCode === 200, 'Admin can adjust product stock (200 OK)');
    assert(adminStockRes.body.countInStock === 25, 'Stock updated to 25');

    // Negative stock protection
    const negativeStockRes = await request(
      {
        hostname: 'localhost',
        port: 5003,
        path: `/api/products/${inStockProduct._id}/stock`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      },
      {
        countInStock: -5,
      }
    );
    assert(negativeStockRes.statusCode === 400, 'Negative stock values are rejected with 400 Bad Request');

  } catch (error) {
    console.error('Unhandled error in test runner:', error);
    failed++;
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await disconnectDB();

    console.log('\n================================================================');
    console.log(`INVENTORY AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  }
}

runInventoryTests();
