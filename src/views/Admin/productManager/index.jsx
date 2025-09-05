// src/components/productManager/ProductManager.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import useProductManager from "../../../hooks/useProductManager";
import useConversionRate from "../../../hooks/useConversionRate";
import "./ProductManager.css";
import "../../../assets/css/style.css";
import "../../../assets/css/responsive.css";

const ProductManager = () => {
  const {
    products = [], // Ensure products is always an array
    loading: productLoading,
    error: productError,
    addProductWithImages,
    deleteProduct,
    updateProduct, // Assume this exists in useProductManager
  } = useProductManager();

  const {
    conversionRates = { NGN: 1, USD: 0, EUR: 0 }, // Default rates
    loading: rateLoading,
    error: rateError,
    updateConversionRates,
  } = useConversionRate();

  const [imageInputs, setImageInputs] = useState([{ id: Date.now(), file: null, preview: null }]);
  const [editProduct, setEditProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    price: "",
    department: "",
  });
  const [editImageInputs, setEditImageInputs] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Add state for search input

  // Handle image selection for add product
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

  // Add a new image input field for add product
  const handleAddMoreImages = () => {
    setImageInputs((prev) => [...prev, { id: Date.now(), file: null, preview: null }]);
  };

  // Remove an image input field for add product
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
      setSearchQuery(""); // Reset search query after adding product
    } catch (err) {
      alert(`Failed to add product: ${err.message}`);
      console.error("Add product error:", err);
    }
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    if (window.confirm("Delete this product?")) {
      try {
        await deleteProduct(productId);
        alert("Product deleted successfully!");
      } catch (err) {
        alert(`Failed to delete product: ${err.message}`);
        console.error("Delete product error:", err);
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
      alert(`Failed to update conversion rates: ${err.message}`);
      console.error("Update rates error:", err);
    }
  };

  // Open edit modal and initialize form
  const handleEdit = (product) => {
    setEditProduct(product);
    setEditFormData({
      name: product.name || "",
      price: product.price || "",
      department: product.department || "",
    });
    setExistingImages(product.images || []);
    setEditImageInputs([{ id: Date.now(), file: null, preview: null }]);
    setShowEditModal(true);
  };

  // Handle image selection for edit product
  const handleEditImageChange = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setEditImageInputs((prev) =>
        prev.map((input) =>
          input.id === id ? { ...input, file, preview } : input
        )
      );
    }
  };

  // Add a new image input field for edit product
  const handleAddMoreEditImages = () => {
    setEditImageInputs((prev) => [...prev, { id: Date.now(), file: null, preview: null }]);
  };

  // Remove an image input field for edit product
  const handleRemoveEditImageInput = (id) => {
    setEditImageInputs((prev) => {
      const input = prev.find((input) => input.id === id);
      if (input?.preview) URL.revokeObjectURL(input.preview);
      return prev.filter((input) => input.id !== id);
    });
  };

  // Remove an existing image
  const handleRemoveExistingImage = (imageUrl) => {
    setExistingImages((prev) => prev.filter((url) => url !== imageUrl));
  };

  // Handle form submission for updating a product
  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedData = {
      name: formData.get("name"),
      price: parseFloat(formData.get("price")),
      department: formData.get("department"),
      images: existingImages, // Start with existing images
    };

    const newPhotoFiles = editImageInputs.map((input) => input.file).filter((file) => file !== null);

    try {
      await updateProduct(editProduct.id, updatedData, newPhotoFiles);
      alert("Product updated successfully!");
      setShowEditModal(false);
      setEditProduct(null);
      setEditFormData({ name: "", price: "", department: "" });
      editImageInputs.forEach((input) => {
        if (input.preview) URL.revokeObjectURL(input.preview);
      });
      setEditImageInputs([]);
      setExistingImages([]);
      setSearchQuery(""); // Reset search query after updating product
    } catch (err) {
      alert(`Failed to update product: ${err.message}`);
      console.error("Update product error:", err);
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      imageInputs.forEach((input) => {
        if (input.preview) URL.revokeObjectURL(input.preview);
      });
      editImageInputs.forEach((input) => {
        if (input.preview) URL.revokeObjectURL(input.preview);
      });
    };
  }, [imageInputs, editImageInputs]);

  // Check if the first image input has a file for add product
  const isFirstImageSelected = imageInputs[0]?.file !== null;

  return (
    <div className="product-manager">
      <h2>Product Manager</h2>

      {/* Conversion Rates Section */}
      <div className="conversion-rates">
        <h5>Conversion Rates (Against NGN)</h5>
        {rateLoading && <div className="loading">Loading rates...</div>}
        {rateError && <div className="error">{rateError}</div>}
        <div className="current-rates">
          <p>NGN: {conversionRates.NGN || 1}</p>
          <p>USD: {conversionRates.USD || 0}</p>
          <p>EUR: {conversionRates.EUR || 0}</p>
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
                defaultValue={conversionRates.USD || 0}
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
                defaultValue={conversionRates.EUR || 0}
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

      {/* Product List Section */}
      <div className="product-list-section">
        <h5>Product List</h5>
        {/* Search Input */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or department..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        <div className="product-list">
          {productLoading && <div className="loading">Loading products...</div>}
          {productError && <div className="error">{productError}</div>}
          {filteredProducts.length === 0 && !productLoading && (
            <p className="no-products">No products found.</p>
          )}
          {filteredProducts.map((product) => (
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
                <p>Price: ₦{product.price}</p>
                <p>Department: {product.department}</p>
                <button
                  onClick={() => handleEdit(product)}
                  className="edit-button"
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </button>
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
              {imageInputs.filter((input) => input.file).length} image
              {imageInputs.filter((input) => input.file).length !== 1 ? "s" : ""} selected
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

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered 
        style={{height:'70vh',overflowY:'auto',marginTop:'70px'}}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdateProduct}>
            <div className="form-group">
              <label htmlFor="edit-department">Department:</label>
              <select
                id="edit-department"
                name="department"
                value={editFormData.department}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, department: e.target.value })
                }
                required
              >
                <option value="">Select a Department</option>
                <option value="cl3fwilson">cl3fwilson</option>
                <option value="wilster">wilster</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="edit-name">Name:</label>
              <input
                type="text"
                id="edit-name"
                name="name"
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-price">Price:</label>
              <input
                type="number"
                id="edit-price"
                name="price"
                step="0.01"
                value={editFormData.price}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, price: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Existing Images:</label>
              {existingImages.length > 0 ? (
                existingImages.map((image, index) => (
                  <div key={index} className="image-preview-container">
                    <img
                      src={image}
                      alt={`Existing ${index + 1}`}
                      className="image-preview"
                      style={{ maxWidth: "100px", margin: "5px" }}
                    />
                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={() => handleRemoveExistingImage(image)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p>No existing images.</p>
              )}
            </div>
            <div className="form-group">
              <label>Add New Images:</label>
              {editImageInputs.map((input, index) => (
                <div key={input.id} className="image-input-group">
                  <input
                    type="file"
                    id={`edit-image-${input.id}`}
                    name={`edit-image-${input.id}`}
                    accept="image/*"
                    onChange={(event) => handleEditImageChange(input.id, event)}
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
                        onClick={() => handleRemoveEditImageInput(input.id)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-more-images-button"
                onClick={handleAddMoreEditImages}
              >
                Add More Images
              </button>
              <p className="image-count">
                {editImageInputs.filter((input) => input.file).length} new image
                {editImageInputs.filter((input) => input.file).length !== 1 ? "s" : ""} selected
              </p>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={productLoading}
              >
                Update Product
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductManager;