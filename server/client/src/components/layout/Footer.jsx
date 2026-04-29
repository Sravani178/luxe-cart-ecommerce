import { Link } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';
import { FaTwitter, FaInstagram, FaFacebook, FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-display font-bold text-white">ShopVerse</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your premium destination for quality products. Shop with confidence and style.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
                <FaGithub className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><Link to="/products" className="hover:text-primary-400 transition-colors">All Products</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-primary-400 transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=Clothing" className="hover:text-primary-400 transition-colors">Clothing</Link></li>
              <li><Link to="/products?category=Home & Garden" className="hover:text-primary-400 transition-colors">Home & Garden</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Track Order</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to get special offers and updates.</p>
            <form className="flex gap-2">
              <div className="relative flex-1">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                />
              </div>
              <button type="submit" className="px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} ShopVerse. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
