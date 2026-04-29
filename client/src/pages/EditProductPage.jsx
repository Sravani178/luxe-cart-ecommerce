import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import api from "../services/api";

function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      category: "",
      price: "",
      inventory: "",
      imageUrl: "",
    });

  const fetchProduct = async () => {
    try {
      const response =
        await api.get(
          `/products/id/${id}`
        );

      const product =
        response.data.product;

      setFormData({
        name: product.name || "",
        description:
          product.description || "",
        category:
          product.category || "",
        price: product.price || "",
        inventory:
          product.inventory || "",
        imageUrl:
          product.images?.[0]?.url ||
          "",
      });
    } catch (error) {
      console.log(error);
      alert(
        "Failed to load product"
      );
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem(
          "token"
        );

      await api.put(
        `/products/id/${id}`,
        {
          name: formData.name,
          description:
            formData.description,
          category:
            formData.category,
          price: Number(
            formData.price
          ),
          inventory: Number(
            formData.inventory
          ),
          images: [
            {
              url: formData.imageUrl,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Product updated successfully 🚀"
      );

      navigate(
        "/seller/products"
      );
    } catch (error) {
      console.log(error);
      alert(
        "Failed to update product"
      );
    }
  };

  return (
    <div className="min-h-screen px-10 py-16">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-4xl font-bold mb-8">
          Edit Product 🚀
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-6"
        >
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={
              handleChange
            }
            className="w-full border p-4 rounded-xl"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={
              formData.description
            }
            onChange={
              handleChange
            }
            className="w-full border p-4 rounded-xl"
            rows="4"
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={
              formData.category
            }
            onChange={
              handleChange
            }
            className="w-full border p-4 rounded-xl"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={
              handleChange
            }
            className="w-full border p-4 rounded-xl"
            required
          />

          <input
            type="number"
            name="inventory"
            placeholder="Stock"
            value={
              formData.inventory
            }
            onChange={
              handleChange
            }
            className="w-full border p-4 rounded-xl"
            required
          />

          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={
              formData.imageUrl
            }
            onChange={
              handleChange
            }
            className="w-full border p-4 rounded-xl"
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-4 rounded-xl font-semibold text-lg"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProductPage;