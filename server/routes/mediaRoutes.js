const express = require('express');
const router = express.Router();
const {
  getAllMedia,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
} = require('../controllers/mediaController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAllMedia)
  .post(protect, admin, createMedia);

router.route('/:id')
  .get(getMediaById)
  .put(protect, admin, updateMedia)
  .delete(protect, admin, deleteMedia);

module.exports = router;
