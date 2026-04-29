import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineHeart, HiOutlineShoppingBag, HiStar } from 'react-icons/hi';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    addToCart(product._id);
  };

  const discount = product.compareAtPrice 
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/products/${product.slug}`} className="group">
        <div className="card">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <img
              src={product.images?.[0]?.url || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.featured && (
                <span className="px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">
                  Featured
                </span>
              )}
              {discount && (
                <span className="px-3 py-1 bg-accent-500 text-white text-xs font-bold rounded-full">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <HiOutlineHeart className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Add to Cart */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full py-3 bg-white text-gray-900 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
              >
                <HiOutlineShoppingBag className="w-5 h-5" />
                Add to Cart
              </motion.button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
            
            {/* Rating */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <HiStar className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700">{product.rating?.toFixed(1)}</span>
                <span className="text-sm text-gray-400">({product.numReviews})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">${product.price?.toFixed(2)}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-gray-400 line-through">${product.compareAtPrice?.toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
