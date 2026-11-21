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
    } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
      return res.status(400).json({ message: 'Incomplete shipping address' });
    }

    // Server-side price verification and total calculation to prevent client-side price tampering
    let calculatedItemsPrice = 0;
    const sanitizedOrderItems = [];

    for (const item of orderItems) {
      const qty = Math.max(1, parseInt(item.qty, 10) || 1);
      let dbProduct = null;

      const rawId = item.product || item._id;
      if (rawId && mongoose.Types.ObjectId.isValid(rawId)) {
        dbProduct = await Product.findById(rawId);
      }
      if (!dbProduct && item.name) {
        dbProduct = await Product.findOne({ name: item.name });
      }

      // Enforce server-side product price from database; fallback to item.price only if legacy product
      const verifiedPrice = dbProduct ? Number(dbProduct.price) : (Number(item.price) || 0);
      const verifiedName = dbProduct ? dbProduct.name : (item.name || 'ACE Product');
      const verifiedImage = dbProduct ? dbProduct.image : (item.image || '/Images/ace logo.jpg');
      const verifiedProductId = dbProduct ? dbProduct._id : (mongoose.Types.ObjectId.isValid(rawId) ? rawId : new mongoose.Types.ObjectId());

      // Server-side inventory and stock availability validation
      if (dbProduct) {
        if (dbProduct.countInStock <= 0) {
          return res.status(400).json({
            message: `"${dbProduct.name}" is currently out of stock.`,
          });
        }
        if (dbProduct.countInStock < qty) {
          return res.status(400).json({
            message: `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.countInStock} available, but ${qty} requested.`,
          });
        }
      }

      calculatedItemsPrice += verifiedPrice * qty;

      sanitizedOrderItems.push({
        name: verifiedName,
        qty,
        image: verifiedImage,
        price: verifiedPrice,
        product: verifiedProductId,
      });
    }

    // Deterministic server-side total calculation: itemsPrice + tax (0%) + shipping (0)
    const itemsPrice = Math.round(calculatedItemsPrice * 100) / 100;
    const taxPrice = 0;
    const shippingPrice = 0;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const generatedTracking = 'TRK-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);

    const order = new Order({
      orderItems: sanitizedOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod: paymentMethod || 'Chapa (Telebirr, CBE Birr, Cards)',
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
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

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ownership check: User must own the order or be admin
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Idempotency: Prevent duplicate payment processing & duplicate stock deduction
    if (order.isPaid) {
      return res.json(order);
    }

    // Atomically decrement stock for each purchased item
    for (const item of order.orderItems) {
      if (item.product) {
        await Product.findOneAndUpdate(
          { _id: item.product, countInStock: { $gte: item.qty } },
          { $inc: { countInStock: -item.qty } }
        );
      }
    }

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
      const previousStatus = order.status;
      const newStatus = req.body.status || order.status;

      // Safe stock restoration if a paid order is cancelled
      if (newStatus === 'Cancelled' && previousStatus !== 'Cancelled' && order.isPaid) {
        for (const item of order.orderItems) {
          if (item.product) {
            await Product.findByIdAndUpdate(item.product, {
              $inc: { countInStock: item.qty },
            });
          }
        }
      }

      order.status = newStatus;
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

    // Ownership check: User must own the order or be admin
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to initialize payment for this order' });
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

    if (order) {
      // Ownership check: User must own the order or be admin
      if (
        order.user.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Not authorized to verify this order' });
      }
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
          if (!order.isPaid) {
            for (const item of order.orderItems) {
              if (item.product) {
                await Product.findOneAndUpdate(
                  { _id: item.product, countInStock: { $gte: item.qty } },
                  { $inc: { countInStock: -item.qty } }
                );
              }
            }
          }
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
      if (!order.isPaid) {
        for (const item of order.orderItems) {
          if (item.product) {
            await Product.findOneAndUpdate(
              { _id: item.product, countInStock: { $gte: item.qty } },
              { $inc: { countInStock: -item.qty } }
            );
          }
        }
      }
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
