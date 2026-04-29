import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import SellerProductsPage from "./pages/SellerProductsPage";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/products"
          element={<ProductsPage />}
        />

        <Route
          path="/products/:slug"
          element={<ProductDetailsPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/cart"
          element={<CartPage />}
        />

        <Route
          path="/checkout"
          element={<CheckoutPage />}
        />

        <Route
          path="/my-orders"
          element={<MyOrdersPage />}
        />

        <Route
          path="/admin/orders"
          element={<AdminOrdersPage />}
        />

        <Route
          path="/seller/products"
          element={<SellerProductsPage />}
        />

        <Route
          path="/add-product"
          element={<AddProductPage />}
        />

        <Route
          path="/edit-product/:id"
          element={<EditProductPage />}
        />
      </Routes>
    </div>
  );
}

export default App;