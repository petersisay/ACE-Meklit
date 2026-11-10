const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET || 'ace_meklit_jwt_secret_key_change_in_production_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone || '',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id, user.email, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@acemeklit.org').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
    const demoEmail = (process.env.DEMO_USER_EMAIL || 'bereket@example.com').toLowerCase();
    const demoPassword = process.env.DEMO_USER_PASSWORD || 'password123';

    // Auto-initialize or self-heal default admin or demo accounts on-the-fly
    if (!user) {
      if (normalizedEmail === adminEmail && password === adminPassword) {
        user = await User.create({
          name: process.env.ADMIN_NAME || 'Admin Petros Sisay',
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
          phone: process.env.ADMIN_PHONE || '+251911000000',
        });
      } else if (normalizedEmail === demoEmail && password === demoPassword) {
        user = await User.create({
          name: 'Bereket Tesfaye',
          email: demoEmail,
          password: demoPassword,
          role: 'user',
          phone: '+251922000000',
        });
      }
    } else if (
      (normalizedEmail === adminEmail && password === adminPassword) ||
      (normalizedEmail === demoEmail && password === demoPassword)
    ) {
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        user.password = password;
        if (normalizedEmail === adminEmail) {
          user.role = 'admin';
        }
        await user.save();
      }
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id, user.email, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email ? req.body.email.trim().toLowerCase() : user.email;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
};
