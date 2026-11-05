const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderStatus,
  initializeChapa,
  verifyChapa,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getOrders);

router.get('/myorders', protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.put('/:id/pay', protect, updateOrderToPaid);
router.post('/:id/chapa/initialize', protect, initializeChapa);
router.get('/chapa/verify/:tx_ref', protect, verifyChapa);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
