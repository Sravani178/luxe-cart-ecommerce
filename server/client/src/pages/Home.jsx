import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiSparkles, HiTruck, HiShieldCheck, HiSupport } from 'react-icons/hi';
import api from '../api/axios';
import ProductGrid from '../components/products/ProductGrid';
import Button from '../components/common/Button';

const features = [
  { icon: HiTruck, title: 'Free Shipping', description: 'On orders over $100' },
  { icon: HiShieldCheck, title: 'Secure Payment', description: '100% secure checkout' },
  { icon: HiSupport, title: '24/7 Support', description: 'Dedicated support team' },
  { icon: HiSparkles, title: 'Best Quality', description: 'Premium products only' }
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featured, newest] = await Promise.all([
          api.get('/products?featured=true&limit=4'),
          api.get('/products?sort=newest&limit=8')
        ]);
        setFeaturedProducts(featured.data.products);
        setNewArrivals(newest.data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6">
                <HiSparkles className="w-4 h-4" />
                New Collection 2026
              </span>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight mb-6">
                Discover Your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                  Perfect Style
                </span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-lg">
                Explore our curated collection of premium products. Quality meets style in every piece we offer.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                    Shop Now
                    <HiArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/products?featured=true">
                  <Button variant="ghost" size="lg" className="text-white border-white/30 hover:bg-white/10">
                    View Featured
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl blur-2xl transform rotate-6" />
                <img
                  src="[images.unsplash.com](https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600)"
                  alt="Hero"
                  className="relative rounded-3xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-display font-bold text-gray-900">Featured Products</h2>
                <p className="text-gray-500 mt-2">Handpicked favorites just for you</p>
              </div>
              <Link to="/products?featured=true" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                View All <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <ProductGrid products={featuredProducts} isLoading={isLoading} />
          </div>
        </section>
      )}

      {/* Banner */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-40 -top-40 w-80 h-80 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full blur-3xl opacity-30"
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Become a Seller
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of sellers and start growing your business today. Easy setup, powerful tools, and a global audience.
            </p>
            <Link to="/register?role=seller">
              <Button variant="accent" size="lg">
                Start Selling
                <HiArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900">New Arrivals</h2>
              <p className="text-gray-500 mt-2">Fresh additions to our collection</p>
            </div>
            <Link to="/products?sort=newest" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View All <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={newArrivals} isLoading={isLoading} />
        </div>
      </section>
    </div>
  );
}
