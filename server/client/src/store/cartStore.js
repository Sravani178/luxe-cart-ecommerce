import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

const useCartStore = create((set, get) => ({
  cart: null,
  isOpen: false,
  isLoading: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/cart');
      set({ cart: data.cart, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1, selectedAttributes = {}) => {
    try {
      const { data } = await api.post('/cart', { productId, quantity, selectedAttributes });
      set({ cart: data.cart, isOpen: true });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      const { data } = await api.put(`/cart/${itemId}`, { quantity });
      set({ cart: data.cart });
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  },

  removeItem: async (itemId) => {
    try {
      const { data } = await api.delete(`/cart/${itemId}`);
      set({ cart: data.cart });
      toast.success('Item removed');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart');
      set({ cart: { items: [], totalAmount: 0 } });
    } catch (error) {
      console.error('Failed to clear cart');
    }
  },

  get itemCount() {
    return get().cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }
}));

export default useCartStore;
