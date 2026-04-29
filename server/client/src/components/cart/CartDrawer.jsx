import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX, HiOutlineShoppingBag } from 'react-icons/hi';
import useCartStore from '../../store/cartStore';
import CartItem from './CartItem';
import Button from '../common/Button';

export default function CartDrawer() {
  const { cart, isOpen, closeCart, isLoading } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <HiOutlineShoppingBag className="w-6 h-6" />
                Your Cart
              </h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <HiOutlineX className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {!cart?.items?.length ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <HiOutlineShoppingBag className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add some products to get started</p>
                  <Button variant="primary" onClick={closeCart}>
                    <Link to="/products">Continue Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <CartItem key={item._id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart?.items?.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-4 bg-gray-50">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-medium text-gray-600">Subtotal</span>
                  <span className="font-bold text-gray-900">
                    ${cart.totalAmount?.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Shipping and taxes calculated at checkout
                </p>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}
