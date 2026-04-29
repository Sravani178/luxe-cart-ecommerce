import { useState } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import api from "../services/api";

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedItems =
    location.state?.selectedItems || [];

  const [formData, setFormData] =
    useState({
      fullName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      phone: "",
      paymentMethod: "cod",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handlePlaceOrder = async (
    e
  ) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem(
          "token"
        );

      //
      // STEP 1 → Create Order
      //
      const orderResponse =
        await api.post(
          "/orders",
          {
            shippingAddress: {
              fullName:
                formData.fullName,
              address:
                formData.address,
              city: formData.city,
              postalCode:
                formData.postalCode,
              country:
                formData.country,
              phone:
                formData.phone,
            },
            paymentMethod:
              formData.paymentMethod,
            selectedItems,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const createdOrder =
        orderResponse.data.order;

      //
      // STEP 2 → If Stripe, redirect
      //
      if (
        formData.paymentMethod ===
        "stripe"
      ) {
        const stripeResponse =
          await api.post(
            `/orders/${createdOrder._id}/pay`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        window.location.href =
          stripeResponse.data.url;

        return;
      }

      //
      // STEP 3 → COD Success
      //
      alert(
        "Order placed successfully 🎉"
      );

      navigate("/cart");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Order failed"
      );
    }
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-10">

        <h1 className="text-4xl font-bold text-purple-700 mb-4">
          Checkout 🚀
        </h1>

        <p className="text-gray-500 mb-8">
          Selected Items:{" "}
          {selectedItems.length}
        </p>

        <form
          onSubmit={
            handlePlaceOrder
          }
          className="space-y-6"
        >
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={
              handleChange
            }
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            onChange={
              handleChange
            }
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={
              handleChange
            }
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            onChange={
              handleChange
            }
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="text"
            name="country"
            placeholder="Country"
            onChange={
              handleChange
            }
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={
              handleChange
            }
            className="w-full border rounded-xl px-4 py-3"
          />

          <select
            name="paymentMethod"
            onChange={
              handleChange
            }
            className="w-full border rounded-xl px-4 py-3"
          >
            <option value="cod">
              Cash on Delivery
            </option>

            <option value="stripe">
              Stripe Payment
            </option>
          </select>

          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-4 rounded-2xl font-semibold text-lg"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;