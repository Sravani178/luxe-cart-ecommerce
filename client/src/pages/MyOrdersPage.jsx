import { useEffect, useState } from "react";
import api from "../services/api";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/orders/myorders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen px-10 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-12">
          My Orders 📦
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
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-bold text-xl">
                      Order: {order.orderNumber}
                    </p>

                    <p className="text-gray-500">
                      Payment: {order.paymentMethod}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-700">
                      ${order.totalPrice}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.status}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
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

                {order.trackingNumber && (
                  <div className="mt-4 text-sm text-gray-600">
                    Tracking: {order.trackingNumber}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrdersPage;