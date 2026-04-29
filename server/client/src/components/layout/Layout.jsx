import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

export default function Layout({ children }) {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
