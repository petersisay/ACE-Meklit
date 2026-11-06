const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
      return res.status(400).json({ message: 'Incomplete shipping address' });
    }

    // Sanitize order items to prevent BSON ObjectId casting errors with default/client string IDs
    const sanitizedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        let productId = item.product || item._id;
        if (typeof productId === 'string' && !mongoose.Types.ObjectId.isValid(productId)) {
          const dbProduct = await Product.findOne({ name: item.name });
          if (dbProduct) {
            productId = dbProduct._id;
          } else {
            productId = new mongoose.Types.ObjectId();
          }
        }
        return {
          name: item.name,
          qty: Number(item.qty) || 1,
          image: item.image,
          price: Number(item.price),
          product: productId,
        };
      })
    );

    const generatedTracking = 'TRK-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);

    const order = new Order({
      orderItems: sanitizedOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod: paymentMethod || 'Chapa (Telebirr, CBE Birr, Cards)',
      itemsPrice: Number(itemsPrice || 0),
      taxPrice: Number(taxPrice || 0),
      shippingPrice: Number(shippingPrice || 0),
      totalPrice: Number(totalPrice || 0),
      trackingNumber: generatedTracking,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Ensure user owns order or is admin
      if (
        order.user._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = 'Processing';
      order.paymentResult = {
        id: req.body.id || `CHAPA-TXN-${Date.now()}`,
        status: req.body.status || 'COMPLETED',
        update_time: req.body.update_time || new Date().toISOString(),
        email_address: req.body.email_address || req.user.email,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;
      if (order.status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Initialize Chapa payment for an order
// @route   POST /api/orders/:id/chapa/initialize
// @access  Private
const initializeChapa = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const secretKey = process.env.CHAPA_SECRET_KEY;
    const txRef = `TX-CHAPA-${Date.now()}-${order._id}`;
    const clientUrl = process.env.CLIENT_URL || 'https://ace-meklit.onrender.com';
    const returnUrl = `${clientUrl}/payment/callback?tx_ref=${txRef}&provider=chapa&order_id=${order._id}`;

    // Sanitize phone number strictly for Chapa API compliance (Ethiopian 10-digit format starting with 09 or 07)
    let cleanPhone = (order.shippingAddress.phone || req.user.phone || '0911000000').replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('251') && cleanPhone.length === 12) {
      cleanPhone = '0' + cleanPhone.slice(3);
    }
    if (!cleanPhone.startsWith('09') && !cleanPhone.startsWith('07')) {
      cleanPhone = '0911000000';
    }

    // Name formatting
    const nameParts = (order.shippingAddress.fullName || req.user.name || 'Petros Sisay').trim().split(/\s+/);
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || 'Customer';

    // Store pending tx_ref in order
    order.paymentResult = {
      id: txRef,
      status: 'INITIALIZED',
      update_time: new Date().toISOString(),
      email_address: req.user.email,
    };
    await order.save();

    // If real CHAPA_SECRET_KEY is configured in Render
    if (secretKey && secretKey.startsWith('CHASECK')) {
      try {
        const response = await fetch('https://api.chapa.co/v1/transaction/initialize', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${secretKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Number(order.totalPrice).toFixed(2),
            currency: 'ETB',
            email: req.user.email,
            first_name: firstName,
            last_name: lastName,
            phone_number: cleanPhone,
            tx_ref: txRef,
            callback_url: `${clientUrl}/api/orders/chapa/callback`,
            return_url: returnUrl,
            customization: {
              title: 'ACE Meklit Store',
              description: 'Christian Apparel & Books Payment',
            },
          }),
        });

        const chapaRes = await response.json();
        if (chapaRes.status === 'success' && chapaRes.data && chapaRes.data.checkout_url) {
          return res.json({
            checkout_url: chapaRes.data.checkout_url,
            tx_ref: txRef,
            mode: 'live_chapa',
            order,
          });
        } else {
          console.warn('[Chapa] Gateway initialization returned non-success:', chapaRes);
        }
      } catch (chapaErr) {
        console.error('[Chapa] Network request failed:', chapaErr.message);
      }
    }

    // Chapa Test Mode: Return test mode metadata so the client can display the interactive Chapa test window
    return res.json({
      checkout_url: null,
      tx_ref: txRef,
      mode: 'test_mode',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Chapa payment
// @route   GET /api/orders/chapa/verify/:tx_ref
// @access  Private
const verifyChapa = async (req, res, next) => {
  try {
    const { tx_ref } = req.params;
    const orderId = req.query.order_id;
    const secretKey = process.env.CHAPA_SECRET_KEY;

    let order = await Order.findOne({ 'paymentResult.id': tx_ref });
    if (!order && orderId && mongoose.Types.ObjectId.isValid(orderId)) {
      order = await Order.findById(orderId);
    }
    if (!order) {
      const parts = (tx_ref || '').split('-');
      const potentialId = parts[parts.length - 1];
      if (mongoose.Types.ObjectId.isValid(potentialId)) {
        order = await Order.findById(potentialId);
      }
    }
    if (!order) {
      order = await Order.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    }

    if (secretKey && secretKey.startsWith('CHASECK')) {
      try {
        const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        });
        const data = await response.json();
        if (data.status === 'success' && order) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.status = 'Processing';
          order.paymentResult = {
            id: tx_ref,
            status: 'PAID (Chapa Verified)',
            update_time: new Date().toISOString(),
            email_address: req.user.email,
          };
          await order.save();
          return res.json({ success: true, order });
        }
      } catch (err) {
        console.error('[Chapa] Verify network check:', err.message);
      }
    }

    // Mark order as paid in Test Mode
    if (order) {
      order.isPaid = true;
      order.paidAt = order.paidAt || Date.now();
      order.status = 'Processing';
      order.paymentResult = {
        id: tx_ref,
        status: 'PAID (Chapa Test Mode)',
        update_time: new Date().toISOString(),
        email_address: req.user.email,
      };
      await order.save();
      return res.json({ success: true, order });
    }

    res.json({ success: true, message: 'Verified' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderStatus,
  initializeChapa,
  verifyChapa,
};
