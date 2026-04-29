import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user cart
// @route   GET /api/cart
export const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.json({ success: true, cart });
};

// @desc    Add item to cart
// @route   POST /api/cart
export const addToCart = async (req, res) => {
  const { productId, quantity = 1, selectedAttributes } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.inventory < quantity) {
    res.status(400);
    throw new Error('Not enough inventory');
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  // Check if item already exists
  const existingItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId &&
    JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
      selectedAttributes
    });
  }

  await cart.save();
  await cart.populate('items.product');

  res.json({ success: true, cart });
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const itemIndex = cart.items.findIndex(
    item => item._id.toString() === req.params.itemId
  );

  if (itemIndex === -1) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();
  await cart.populate('items.product');

  res.json({ success: true, cart });
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
export const removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(
    item => item._id.toString() !== req.params.itemId
  );

  await cart.save();
  await cart.populate('items.product');

  res.json({ success: true, cart });
};

// @desc    Clear cart
// @route   DELETE /api/cart
export const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.items = [];
    await cart.save();
  }

  res.json({ success: true, message: 'Cart cleared' });
};
