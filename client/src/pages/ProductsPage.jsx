import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ProductsPage() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/cart",
        {
          productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Added to cart successfully 🛒");
    } catch (error) {
      alert(
        error.response?.data?.message || "Add to cart failed"
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="px-10 py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-12">
          Our Premium Products ✨
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden hover:scale-105 transition duration-300"
            >
              <Link to={`/products/${product.slug}`}>
                <img
                  src={
                    product.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                  }
                  alt={product.name}
                  className="w-full h-[300px] object-cover"
                />

                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-3">
                    {product.name}
                  </h2>

                  <p className="text-gray-500 mb-4">
                    {product.category}
                  </p>

                  <p className="text-2xl font-bold text-purple-700 mb-4">
                    ${product.price}
                  </p>
                </div>
              </Link>

              <div className="px-6 pb-6">
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="w-full bg-pink-500 text-white px-5 py-3 rounded-xl font-semibold hover:bg-pink-600 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;