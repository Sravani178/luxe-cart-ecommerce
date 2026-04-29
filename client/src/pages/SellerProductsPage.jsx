import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function SellerProductsPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/products/my-products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(
        response.data.products || []
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(
        `/products/id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Product deleted successfully"
      );

      fetchProducts();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  const handleAddProduct = () => {
    navigate("/add-product");
  };

  const handleEditProduct = (id) => {
    navigate(`/edit-product/${id}`);
  };

  return (
    <div className="min-h-screen px-10 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold">
            Seller Products 🚀
          </h1>

          <button
            onClick={handleAddProduct}
            className="bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-800 transition"
          >
            Add Product
          </button>
        </div>

        {products.length === 0 ? (
          <p className="text-xl">
            No products found
          </p>
        ) : (
          <div className="space-y-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-3xl shadow-xl p-6 flex justify-between items-center"
              >
                <div className="flex items-center gap-6">
                  <img
                    src={
                      product.images?.[0]?.url ||
                      "https://via.placeholder.com/150"
                    }
                    alt={product.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />

                  <div>
                    <h2 className="text-2xl font-bold">
                      {product.name}
                    </h2>

                    <p className="text-gray-500">
                      ${product.price}
                    </p>

                    <p className="text-gray-500">
                      Stock: {product.inventory}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      handleEditProduct(
                        product._id
                      )
                    }
                    className="bg-blue-500 text-white px-5 py-2 rounded-xl font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        product._id
                      )
                    }
                    className="bg-red-500 text-white px-5 py-2 rounded-xl font-semibold"
                  >
                    Delete
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

export default SellerProductsPage;