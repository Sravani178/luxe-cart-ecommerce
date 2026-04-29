import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const items = response.data.cart?.items || [];

      const totalItems = items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCartCount(totalItems);
    } catch (error) {
      console.log("Cart badge error:", error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("user");

    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }

    fetchCartCount();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setCartCount(0);

    navigate("/login");
  };

  const isAdminOrSeller =
    user?.role === "admin" ||
    user?.role === "seller";

  return (
    <nav className="bg-white shadow-sm px-10 py-5 flex justify-between items-center">
      <Link to="/">
        <h1 className="text-3xl font-bold text-purple-700">
          LuxeCart ✨
        </h1>
      </Link>

      <div className="flex items-center gap-8 text-gray-700 font-medium text-lg">
        <Link to="/">Home</Link>

        <Link to="/products">Products</Link>

        <Link
          to="/cart"
          className="relative flex items-center"
        >
          <span>Cart</span>

          {cartCount > 0 && (
            <span className="absolute -top-3 -right-5 bg-pink-500 text-white text-xs font-bold min-w-[22px] h-[22px] flex items-center justify-center rounded-full shadow-md">
              {cartCount}
            </span>
          )}
        </Link>

        {user && (
          <Link to="/my-orders">
            My Orders
          </Link>
        )}

        {isAdminOrSeller && (
          <>
            <Link to="/admin/orders">
              Admin Dashboard
            </Link>

            <Link to="/seller/products">
              Seller Products
            </Link>
          </>
        )}

        {user ? (
          <>
            <span className="text-purple-700 font-semibold">
              Hi, {user.name} 👋
            </span>

            <button
              onClick={handleLogout}
              className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;