import express from 'express';
import {
  createOrder,
  createCheckoutSession,
  stripeWebhook,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Webhook must be before JSON parser
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

router.use(protect);

router.route('/')
  .get(authorize('admin', 'seller'), getAllOrders)
  .post(createOrder);

router.get('/myorders', getMyOrders);
router.get('/:id', getOrderById);
router.post('/:id/pay', createCheckoutSession);
router.put('/:id/status', authorize('admin', 'seller'), updateOrderStatus);

export default router;
