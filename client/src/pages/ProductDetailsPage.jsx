import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${slug}`);
      setProduct(response.data.product);
    } catch (error) {
      console.log("Product fetch error:", error);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/cart",
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Added to cart successfully 🛒");
      
      window.location.reload();
      
    } catch (error) {
      alert(
        error.response?.data?.message || "Add to cart failed"
      );
    }
  };

  const handleBuyNow = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/cart",
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/checkout");
    } catch (error) {
      alert(
        error.response?.data?.message || "Buy now failed"
      );
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  if (!product) {
    return (
      <div className="p-10 text-xl font-semibold">
        Loading product...
      </div>
    );
  }

  return (
    <div className="px-10 py-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <img
            src={
              product.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
            }
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-3xl"
          />
        </div>

        <div>
          <p className="text-purple-600 font-semibold mb-2">
            {product.category}
          </p>

          <h1 className="text-5xl font-bold mb-6">
            {product.name}
          </h1>

          <p className="text-gray-600 text-lg mb-6">
            {product.description}
          </p>

          <p className="text-4xl font-bold text-purple-700 mb-6">
            ${product.price}
          </p>

          <p className="text-lg mb-8">
            Stock Available: {product.inventory}
          </p>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="bg-pink-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg"
            >
              Buy Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetailsPage;