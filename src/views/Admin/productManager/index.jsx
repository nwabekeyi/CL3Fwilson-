import React, { useState } from "react";
import useProductManager from "../../../hooks/useProductManager";
import useConversionRate from "../../../hooks/useConversionRate";
import "./ProductManager.css";
import "../../../assets/css/style.css";
import "../../../assets/css/responsive.css";

const ProductManager = () => {
  const {
    products,
    loading: productLoading,
    error: productError,
    addProductWithImages,
    deleteProduct,
  } = useProductManager();

  const {
    conversionRates,
    loading: rateLoading,
    error: rateError,
    updateConversionRates,
  } = useConversionRate();

  const [imageInputs, setImageInputs] = useState([{ id: Date.now(), file: null, preview: null }]);

  // Handle image selection for a specific input
  const handleImageChange = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImageInputs((prev) =>
        prev.map((input) =>
          input.id === id ? { ...input, file, preview } : input
        )
      );
    }
  };

  // Add a new image input field
  const handleAddMoreImages = () => {
    setImageInputs((prev) => [...prev, { id: Date.now(), file: null, preview: null }]);
  };

  // Remove an image input field
  const handleRemoveImageInput = (id) => {
    setImageInputs((prev) => {
      const input = prev.find((input) => input.id === id);
      if (input?.preview) URL.revokeObjectURL(input.preview);
      return prev.filter((input) => input.id !== id);
    });
  };

  // Handle form submission for adding a product
  const handleAddProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const productData = {
      name: formData.get("name"),
      price: parseFloat(formData.get("price")),
      department: formData.get("department"),
      images: [],
    };

    const photoFiles = imageInputs.map((input) => input.file).filter((file) => file !== null);

    try {
      await addProductWithImages(productData, photoFiles);
      alert("Product added successfully!");
      event.target.reset();
      imageInputs.forEach((input) => {
        if (input.preview) URL.revokeObjectURL(input.preview);
      });
      setImageInputs([{ id: Date.now(), file: null, preview: null }]);
    } catch (err) {
      alert("Failed to add product.");
    }
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    if (window.confirm("Delete this product?")) {
      try {
        await deleteProduct(productId);
        alert("Product deleted successfully!");
      } catch (err) {
        alert("Failed to delete product.");
      }
    }
  };

  // Handle form submission for updating conversion rates
  const handleUpdateRates = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newRates = {
      USD: parseFloat(formData.get("USD")),
      EUR: parseFloat(formData.get("EUR")),
    };

    try {
      await updateConversionRates(newRates);
      alert("Conversion rates updated successfully!");
    } catch (err) {
      alert("Failed to update conversion rates.");
    }
  };

  // Check if the first image input has a file
  const isFirstImageSelected = imageInputs[0]?.file !== null;

  return (
    <div className="product-manager">
      <h2>Product Manager</h2>

      {/* Product Loading and Error States */}
      {productLoading && <div className="loading">Loading products...</div>}
      {productError && <div className="error">{productError}</div>}

      {/* Conversion Rates Section */}
      <div className="conversion-rates">
        <h5>Conversion Rates (Against NGN)</h5>
        {rateLoading && <div className="loading">Loading rates...</div>}
        {rateError && <div className="error">{rateError}</div>}
        <div className="current-rates">
          <p>NGN: {conversionRates.NGN}</p>
          <p>USD: {conversionRates.USD}</p>
          <p>EUR: {conversionRates.EUR}</p>
        </div>
        <div className="update-rates-form">
          <h5>Update Conversion Rates</h5>
          <form onSubmit={handleUpdateRates}>
            <div className="form-group">
              <label htmlFor="USD">USD (1 NGN = ? USD):</label>
              <input
                type="number"
                id="USD"
                name="USD"
                step="0.00001"
                defaultValue={conversionRates.USD}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="EUR">EUR (1 NGN = ? EUR):</label>
              <input
                type="number"
                id="EUR"
                name="EUR"
                step="0.00001"
                defaultValue={conversionRates.EUR}
                required
              />
            </div>
            <div id="btn">
              <button
                type="submit"
                disabled={rateLoading}
                className="submit-button"
              >
                Update Rates
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Product List */}
      <div className="product-list-section">
        <h5>Product List</h5>
        <div className="product-list">
          {products.length === 0 && !productLoading && (
            <p className="no-products">No products found.</p>
          )}
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              style={{ maxWidth: "100%", height: "100%" }}
            >
              <div className="product-images">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="product-image"
                  />
                ))}
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>Department: {product.department}</p>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Product Form */}
      <div className="add-product-form">
        <h5>Add New Product</h5>
        <form onSubmit={handleAddProduct}>
          <div className="form-group">
            <label htmlFor="department">Department:</label>
            <select id="department" name="department" required>
              <option value="">Select a Department</option>
              <option value="cl3fwilson">cl3fwilson</option>
              <option value="wilster">wilster</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label>Product Images:</label>
            {imageInputs.map((input, index) => (
              <div key={input.id} className="image-input-group">
                <input
                  type="file"
                  id={`image-${input.id}`}
                  name={`image-${input.id}`}
                  accept="image/*"
                  onChange={(event) => handleImageChange(input.id, event)}
                />
                {input.preview && (
                  <div className="image-preview-container">
                    <img
                      src={input.preview}
                      alt={`Preview ${index + 1}`}
                      className="image-preview"
                      style={{ maxWidth: "100px", margin: "5px" }}
                    />
                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={() => handleRemoveImageInput(input.id)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
            {isFirstImageSelected && (
              <button
                type="button"
                className="add-more-images-button"
                onClick={handleAddMoreImages}
              >
                Add More Images
              </button>
            )}
            <p className="image-count">
              {imageInputs.filter((input) => input.file).length} image{imageInputs.filter((input) => input.file).length !== 1 ? "s" : ""} selected
            </p>
          </div>
          <button
            type="submit"
            disabled={productLoading || !isFirstImageSelected}
            className="submit-button"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductManager;