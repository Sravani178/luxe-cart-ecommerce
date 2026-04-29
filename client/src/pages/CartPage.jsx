import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CartPage() {
  const [cart, setCart] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(response.data.cart);

      const allIds =
        response.data.cart?.items?.map(
          (item) => item._id
        ) || [];

      setSelectedItems(allIds);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const toggleItemSelection = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(
        selectedItems.filter(
          (id) => id !== itemId
        )
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        itemId,
      ]);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Item removed from cart");

      fetchCart();
    } catch (error) {
      console.log(error);
      alert("Failed to remove item");
    }
  };

  const handleCheckoutAll = () => {
    const allIds =
      cart.items.map(
        (item) => item._id
      );

    navigate("/checkout", {
      state: {
        selectedItems: allIds,
      },
    });
  };

  const handleCheckoutSelected = () => {
    if (selectedItems.length === 0) {
      alert(
        "Please select at least one item"
      );
      return;
    }

    navigate("/checkout", {
      state: {
        selectedItems,
      },
    });
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen px-10 py-20">
        <h1 className="text-5xl font-bold">
          My Cart 🛒
        </h1>

        <p className="mt-8 text-xl">
          Your cart is empty
        </p>
      </div>
    );
  }

  const selectedTotal =
    cart.items
      .filter((item) =>
        selectedItems.includes(
          item._id
        )
      )
      .reduce(
        (sum, item) =>
          sum +
          item.product.price *
            item.quantity,
        0
      );

  return (
    <div className="min-h-screen px-10 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-12">
          My Cart 🛒
        </h1>

        <div className="space-y-6">
          {cart.items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl shadow-xl p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-5">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(
                    item._id
                  )}
                  onChange={() =>
                    toggleItemSelection(
                      item._id
                    )
                  }
                  className="w-5 h-5"
                />

                <img
                  src={
                    item.product.images?.[0]
                      ?.url ||
                    "https://via.placeholder.com/150"
                  }
                  alt={item.product.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />

                <div>
                  <h2 className="text-2xl font-bold">
                    {item.product.name}
                  </h2>

                  <p className="text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-3xl font-bold text-purple-700">
                  $
                  {item.product.price *
                    item.quantity}
                </p>

                <button
                  onClick={() =>
                    handleRemoveItem(
                      item.product._id
                    )
                  }
                  className="mt-4 bg-red-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6">
              Selected Total: $
              {selectedTotal}
            </h2>

            <div className="flex gap-4">
              <button
                onClick={
                  handleCheckoutSelected
                }
                className="bg-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg"
              >
                Checkout Selected
              </button>

              <button
                onClick={handleCheckoutAll}
                className="bg-pink-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg"
              >
                Checkout All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;