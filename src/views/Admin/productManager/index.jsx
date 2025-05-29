import React from "react";
import useProductManager from "../../../hooks/useProductManager";
import useConversionRate from "../../../hooks/useConversionRate"; // Import conversion rate hook
import "./ProductManager.css"; // External CSS for styling
import "../../../assets/css/style.css"
import "../../../assets/css/responsive.css"
const ProductManager = () => {
  const {
    products,
    loading: productLoading,
    error: productError,
    addProductWithImages,
    deleteProduct,
    fetchProducts,
  } = useProductManager();

  const {
    conversionRates,
    loading: rateLoading,
    error: rateError,
    updateConversionRates,
  } = useConversionRate();

  // Handle form submission for adding a product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      name: formData.get("name"),
      price: parseFloat(formData.get("price")),
      oldPrice: parseFloat(formData.get("oldPrice")) || null, // Add oldPrice, allow null if empty
      department: formData.get("department"),
      variants: [{ _id: "variant1", color: formData.get("variantColor") }],
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
  const handleUpdateRates = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRates = {
      USD: formData.get("USD"),
      EUR: formData.get("EUR"),
    };

    try {
      await updateConversionRates(newRates);
      alert("Conversion rates updated successfully!");
    } catch (err) {
      alert("Failed to update conversion rates.");
    }
  };

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
          <div key={product.id} className="product-card"
                style={{maxWidth:"100%", height: "100%"}}>
            <img
              src={product.imagePath}
              alt={product.name}
              className="product-image"
            />
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              {product.oldPrice && <p>Old Price: ${product.oldPrice}</p>} {/* Display oldPrice if exists */}
              <p>Department: {product.department}</p>
              <div className="variants">
                {product.variants.map((variant) => (
                  <div key={variant._id} className="variant">
                    <span>{variant.color}</span>
                    <img
                      src={variant.imagePath}
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