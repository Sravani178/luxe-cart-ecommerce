import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineSearch, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuthStore();
  const { cart, openCart } = useCartStore();

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-display font-bold gradient-text">ShopVerse</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/products" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              All Products
            </Link>
            <Link to="/products?category=Electronics" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Electronics
            </Link>
            <Link to="/products?category=Clothing" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Clothing
            </Link>
            <Link to="/products?category=Home & Garden" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Home
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <HiOutlineSearch className="w-6 h-6 text-gray-600" />
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <HiOutlineShoppingBag className="w-6 h-6 text-gray-600" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[200px]">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                      My Orders
                    </Link>
                    {user?.role === 'seller' && (
                      <Link to="/seller/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                        Seller Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
              >
                <HiOutlineUser className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMenuOpen ? (
                <HiOutlineX className="w-6 h-6 text-gray-600" />
              ) : (
                <HiOutlineMenu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    autoFocus
                    className="w-full pl-12 pr-4 py-4 text-lg bg-gray-100 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <nav className="px-4 py-4 space-y-2">
              <Link
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                All Products
              </Link>
              <Link
                to="/products?category=Electronics"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                Electronics
              </Link>
              <Link
                to="/products?category=Clothing"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                Clothing
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
