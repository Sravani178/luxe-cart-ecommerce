import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddProductPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    inventory: "",
  });

  const [imageFile, setImageFile] =
    useState(null);

  const [uploading, setUploading] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImageFile(
      e.target.files[0]
    );
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

      let imageUrl = "";

      // Upload image first
      if (imageFile) {
        setUploading(true);

        const uploadData =
          new FormData();

        uploadData.append(
          "image",
          imageFile
        );

        const uploadResponse =
          await api.post(
            "/upload",
            uploadData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        imageUrl =
          uploadResponse.data
            .imageUrl;

        setUploading(false);
      }

      // Create product
      await api.post(
        "/products",
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
              url: imageUrl,
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
        "Product added successfully 🚀"
      );

      navigate(
        "/seller/products"
      );
    } catch (error) {
      console.log(error);
      alert(
        "Failed to add product"
      );
    }
  };

  return (
    <div className="min-h-screen px-10 py-16">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-4xl font-bold mb-8">
          Add New Product 🚀
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
            placeholder="Stock Quantity"
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
            type="file"
            accept="image/*"
            onChange={
              handleImageChange
            }
            className="w-full border p-4 rounded-xl"
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-4 rounded-xl font-semibold text-lg"
          >
            {uploading
              ? "Uploading..."
              : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProductPage;