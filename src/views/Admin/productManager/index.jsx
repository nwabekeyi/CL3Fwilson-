import React from "react";
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
    fetchProducts,
  } = useProductManager();

  const {
    conversionRates = { NGN: 1, USD: 0, EUR: 0 }, // Default rates
    loading: rateLoading,
    error: rateError,
    updateConversionRates,
  } = useConversionRate();

  // Debug products state
  console.log("Products in ProductManager:", products);

  // Handle form submission for adding a product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      name: formData.get("name")?.trim() || "",
      price: parseFloat(formData.get("price")) || 0,
      oldPrice: formData.get("oldPrice") ? parseFloat(formData.get("oldPrice")) : null,
      department: formData.get("department")?.trim() || "",
      variants: [
        {
          _id: "variant1",
          color: formData.get("variantColor")?.trim() || "default",
        },
      ],
    };
    const photoFiles = {
      main: formData.get("mainImage"),
      variants: { variant1: formData.get("variantImage") },
    };

    try {
      await addProductWithImages(productData, photoFiles);
      alert("Product added successfully!");
      e.target.reset();
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
  const handleUpdateRates = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRates = {
      USD: parseFloat(formData.get("USD")) || 0,
      EUR: parseFloat(formData.get("EUR")) || 0,
    };

    try {
      await updateConversionRates(newRates);
      alert("Conversion rates updated successfully!");
    } catch (err) {
      alert(`Failed to update conversion rates: ${err.message}`);
      console.error("Update rates error:", err);
    }
  };

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

      {/* Product List */}
      <div className="product-list-section">
        <h5>Product List</h5>
        <div className="product-list">
          {productLoading && <div className="loading">Loading products...</div>}
          {productError && <div className="error">{productError}</div>}
          {!productLoading && !productError && products.length === 0 && (
            <p className="no-products">No products found.</p>
          )}
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              style={{ maxWidth: "100%", height: "100%" }}
            >
              <img
                src={product.imagePath || "https://via.placeholder.com/800x600?text=No+Image"}
                alt={product.name}
                className="product-image"
              />
              <div className="product-details">
                <h3>{product.name || "Unnamed Product"}</h3>
                <p>Price: ${product.price || 0}</p>
                {product.oldPrice && <p>Old Price: ${product.oldPrice}</p>}
                <p>Department: {product.department || "N/A"}</p>
                <div className="variants">
                  {(product.variants || []).map((variant) => (
                    <div key={variant._id} className="variant">
                      <span>{variant.color || "N/A"}</span>
                      <img
                        src={variant.imagePath || "https://via.placeholder.com/800x600?text=No+Image"}
                        alt={variant.color || "Variant"}
                        className="variant-image"
                      />
                    </div>
                  ))}
                </div>
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
            <label htmlFor="oldPrice">Old Price:</label>
            <input
              type="number"
              id="oldPrice"
              name="oldPrice"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor="mainImage">Main Image:</label>
            <input
              type="file"
              id="mainImage"
              name="mainImage"
              accept="image/*"
            />
          </div>
          <div className="form-group">
            <label htmlFor="variantColor">Variant Color:</label>
            <input type="text" id="variantColor" name="variantColor" />
          </div>
          <div className="form-group">
            <label htmlFor="variantImage">Variant Image:</label>
            <input
              type="file"
              id="variantImage"
              name="variantImage"
              accept="image/*"
            />
          </div>
          <button
            type="submit"
            disabled={productLoading}
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