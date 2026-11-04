const express = require('express');
const router = express.Router();
const {
  submitContactMessage,
  getContactMessages,
  updateMessageStatus,
  deleteMessage,
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(submitContactMessage)
  .get(protect, admin, getContactMessages);

router.route('/:id')
  .put(protect, admin, updateMessageStatus)
  .delete(protect, admin, deleteMessage);

module.exports = router;
