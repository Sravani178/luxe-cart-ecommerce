import { useEffect, useState } from "react";
import api from "../services/api";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders || []);
    } catch (error) {
      console.log("Fetch orders error:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (
    orderId,
    status
  ) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/orders/${orderId}/status`,
        {
          status,
          trackingNumber:
            status === "shipped"
              ? "TRACK123456"
              : "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order updated successfully 🚀");
      fetchOrders();
    } catch (error) {
      console.log("Update status error:", error);
      alert("Failed to update order");
    }
  };

  return (
    <div className="min-h-screen px-10 py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-12">
          Admin Orders Dashboard 🚀
        </h1>

        {orders.length === 0 ? (
          <p className="text-xl">
            No orders found
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl shadow-xl p-6"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xl font-bold">
                      Order: {order.orderNumber}
                    </p>

                    <p className="text-gray-600 mt-2">
                      Customer:{" "}
                      {order.user?.name || "N/A"}
                    </p>

                    <p className="text-gray-600">
                      Email:{" "}
                      {order.user?.email || "N/A"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-700">
                      ${order.totalPrice}
                    </p>

                    <p className="text-gray-500 mt-2">
                      Status: {order.status}
                    </p>

                    {order.trackingNumber && (
                      <p className="text-sm text-gray-500 mt-1">
                        Tracking: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">
                    Order Items
                  </h3>

                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between py-2"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>

                      <span>
                        ${item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-6 flex-wrap">
                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        order._id,
                        "processing"
                      )
                    }
                    className="bg-yellow-500 text-white px-5 py-2 rounded-xl font-semibold"
                  >
                    Processing
                  </button>

                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        order._id,
                        "shipped"
                      )
                    }
                    className="bg-blue-500 text-white px-5 py-2 rounded-xl font-semibold"
                  >
                    Shipped
                  </button>

                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        order._id,
                        "delivered"
                      )
                    }
                    className="bg-green-500 text-white px-5 py-2 rounded-xl font-semibold"
                  >
                    Delivered
                  </button>

                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        order._id,
                        "cancelled"
                      )
                    }
                    className="bg-red-500 text-white px-5 py-2 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrdersPage;