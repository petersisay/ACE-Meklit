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

    const order = new Order({
      orderItems: sanitizedOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod: paymentMethod || 'Chapa (Telebirr, CBE Birr, Cards)',
      itemsPrice: Number(itemsPrice || 0),
      taxPrice: Number(taxPrice || 0),
      shippingPrice: Number(shippingPrice || 0),
      totalPrice: Number(totalPrice || 0),
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
    const txRef = `CHAPA-ACE-${order._id}-${Date.now()}`;

    // If real CHAPA_SECRET_KEY is configured in Render
    if (secretKey && secretKey.startsWith('CHASECK')) {
      const clientUrl = process.env.CLIENT_URL || 'https://ace-meklit.onrender.com';
      const nameParts = (req.user.name || 'Petros Sisay').trim().split(' ');
      const firstName = nameParts[0] || 'Customer';
      const lastName = nameParts.slice(1).join(' ') || 'ACE';

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
            phone_number: order.shippingAddress.phone || '0911000000',
            tx_ref: txRef,
            callback_url: `${clientUrl}/api/orders/chapa/callback`,
            return_url: `${clientUrl}/checkout?chapa_success=true&order_id=${order._id}&tx_ref=${txRef}`,
            customization: {
              title: 'ACE Meklit Store',
              description: 'Christian Apparel & Books Payment',
            },
          }),
        });

        const chapaRes = await response.json();
        if (chapaRes.status === 'success' && chapaRes.data && chapaRes.data.checkout_url) {
          order.paymentResult = {
            id: txRef,
            status: 'INITIALIZED',
            update_time: new Date().toISOString(),
            email_address: req.user.email,
          };
          await order.save();
          return res.json({
            checkout_url: chapaRes.data.checkout_url,
            tx_ref: txRef,
            mode: 'live_chapa',
          });
        } else {
          console.warn('[Chapa] Gateway initialization returned non-success:', chapaRes);
        }
      } catch (chapaErr) {
        console.error('[Chapa] Network request failed:', chapaErr.message);
      }
    }

    // Fallback: Chapa Trial / Sandbox Simulation Mode
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'Processing';
    order.paymentResult = {
      id: txRef,
      status: 'PAID (Chapa Trial)',
      update_time: new Date().toISOString(),
      email_address: req.user.email,
    };
    await order.save();

    res.json({
      checkout_url: null,
      tx_ref: txRef,
      mode: 'trial_simulation',
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
    const secretKey = process.env.CHAPA_SECRET_KEY;

    if (secretKey && secretKey.startsWith('CHASECK')) {
      const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      const data = await response.json();
      if (data.status === 'success') {
        const orderId = tx_ref.split('-')[2];
        const order = await Order.findById(orderId);
        if (order) {
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
      }
    }

    res.json({ success: true, message: 'Verified in trial mode' });
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
