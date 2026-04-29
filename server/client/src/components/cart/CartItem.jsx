import { motion } from 'framer-motion';
import { HiOutlineTrash, HiPlus, HiMinus } from 'react-icons/hi';
import useCartStore from '../../store/cartStore';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore();

  const product = item.product;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex gap-4 p-4 bg-white rounded-xl"
    >
      {/* Image */}
      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={product?.images?.[0]?.url || '/placeholder.jpg'}
          alt={product?.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{product?.name}</h3>
        <p className="text-sm text-gray-500">${item.price?.toFixed(2)}</p>
        
        {/* Selected Attributes */}
        {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
          <div className="flex gap-2 mt-1">
            {Object.entries(item.selectedAttributes).map(([key, value]) => (
              <span key={key} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {key}: {value}
              </span>
            ))}
          </div>
        )}

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item._id, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <HiMinus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <HiPlus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => removeItem(item._id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <HiOutlineTrash className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
