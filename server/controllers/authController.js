import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Stripe from 'stripe';

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY);

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      token
    });
};

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const stripe = getStripe();

  // Create Stripe customer
  const stripeCustomer = await stripe.customers.create({
    email,
    name
  });

  const user = await User.create({
    name,
    email,
    password,
    role: role === 'seller' ? 'seller' : 'customer',
    stripeCustomerId: stripeCustomer.id
  });

  sendTokenResponse(user, 201, res);
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  sendTokenResponse(user, 200, res);
};

// @desc    Logout user
// @route   POST /api/auth/logout
export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({
    success: true,
    message: 'Logged out'
  });
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
};