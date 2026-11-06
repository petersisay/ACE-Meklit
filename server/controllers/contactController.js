const ContactMessage = require('../models/ContactMessage');

// @desc    Submit a new contact message
// @route   POST /api/contact
// @access  Public
const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, message, subject } = req.body;

    if (!name || !name.trim() || !email || !email.trim() || !message || !message.trim()) {
      return res.status(400).json({ message: 'Please fill in all required fields (name, email, message)' });
    }

    const newMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim(),
      status: 'unread',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Update message status
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateMessageStatus = async (req, res, next) => {
  try {
    const contactMessage = await ContactMessage.findById(req.params.id);

    if (contactMessage) {
      contactMessage.status = req.body.status || contactMessage.status;
      const updated = await contactMessage.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteMessage = async (req, res, next) => {
  try {
    const contactMessage = await ContactMessage.findById(req.params.id);

    if (contactMessage) {
      await ContactMessage.deleteOne({ _id: contactMessage._id });
      res.json({ message: 'Message removed successfully' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactMessage,
  getContactMessages,
  updateMessageStatus,
  deleteMessage,
};
