import React, { useState } from "react";
import useProductManager from "../../hooks/useProductManager"; // Adjust path

const ProductManager = () => {
  const {
    products,
    loading,
    error,
    addProductWithImages,
    updateProductWithImages,
    deleteProduct,
  } = useProductManager();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    imagePath: "",
    department: "",
    category: "",
    description: "",
    variants: [{ _id: `v${Date.now()}`, size: "", color: "", price: "", imagePath: "" }],
  });
  const [photoFiles, setPhotoFiles] = useState({ main: null, variants: {} });
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState(null);

  // Handle form input changes
  const handleInputChange = (e, index = null, field = null) => {
    if (index !== null && field) {
      // Handle variant changes
      const updatedVariants = [...formData.variants];
      updatedVariants[index] = { ...updatedVariants[index], [field]: e.target.value };
      setFormData({ ...formData, variants: updatedVariants });
    } else {
      // Handle main product fields
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Handle file input changes
  const handleFileChange = (e, index = null) => {
    const file = e.target.files[0];
    if (index !== null) {
      // Variant image
      setPhotoFiles((prev) => ({
        ...prev,
        variants: { ...prev.variants, [formData.variants[index]._id]: file },
      }));
    } else {
      // Main product image
      setPhotoFiles((prev) => ({ ...prev, main: file }));
    }
  };

  // Add a new variant
  const addVariant = () => {
    const newVariantId = `v${Date.now()}`;
    setFormData({
      ...formData,
      variants: [...formData.variants, { _id: newVariantId, size: "", color: "", price: "", imagePath: "" }],
    });
  };

  // Remove a variant
  const removeVariant = (index) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    const updatedVariantFiles = { ...photoFiles.variants };
    delete updatedVariantFiles[formData.variants[index]._id];
    setFormData({ ...formData, variants: updatedVariants });
    setPhotoFiles({ ...photoFiles, variants: updatedVariantFiles });
  };

  // Handle form submission (add or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        variants: formData.variants.map((variant) => ({
          ...variant,
          price: parseFloat(variant.price) || 0,
        })),
      };

      if (editingId) {
        // Edit existing product
        await updateProductWithImages(editingId, productData, photoFiles);
      } else {
        // Add new product
        await addProductWithImages(productData, photoFiles);
      }

      // Reset form
      setFormData({
        title: "",
        price: "",
        imagePath: "",
        department: "",
        category: "",
        description: "",
        variants: [{ _id: `v${Date.now()}`, size: "", color: "", price: "", imagePath: "" }],
      });
      setPhotoFiles({ main: null, variants: {} });
      setEditingId(null);

      // Clear file inputs
      document.querySelectorAll('input[type="file"]').forEach((input) => {
        input.value = "";
      });
    } catch (err) {
      setFormError("Failed to save product");
      console.error("Error saving product:", err);
    }
  };

  // Handle edit button click
  const handleEdit = (product) => {
    setFormData({
      title: product.title,
      price: product.price.toString(),
      imagePath: product.imagePath,
      department: product.department,
      category: product.category,
      description: product.description,
      variants: product.variants.map((v) => ({
        ...v,
        price: v.price.toString(),
      })),
    });
    setPhotoFiles({ main: null, variants: {} }); // Reset file inputs
    setEditingId(product.id);
  };

  // Handle delete button click
  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
      } catch (err) {
        setFormError("Failed to delete product");
        console.error("Error deleting product:", err);
      }
    }
  };

  return (
    <div className="container my-4">
      <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
      {(error || formError) && <div className="alert alert-danger">{error || formError}</div>}
      {loading && <p>Loading...</p>}

      {/* Product Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price (NGN)</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Main Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => handleFileChange(e)}
          />
          {formData.imagePath && (
            <img src={formData.imagePath} alt="Preview" style={{ maxWidth: "100px", marginTop: "10px" }} />
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Department</label>
          <input
            type="text"
            name="department"
            className="form-control"
            value={formData.department}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            name="category"
            className="form-control"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Variants */}
        <h4>Variants</h4>
        {formData.variants.map((variant, index) => (
          <div key={variant._id} className="border p-3 mb-3">
            <div className="mb-3">
              <label className="form-label">Size</label>
              <input
                type="text"
                className="form-control"
                value={variant.size}
                onChange={(e) => handleInputChange(e, index, "size")}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Color</label>
              <input
                type="text"
                className="form-control"
                value={variant.color}
                onChange={(e) => handleInputChange(e, index, "color")}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Price (NGN)</label>
              <input
                type="number"
                className="form-control"
                value={variant.price}
                onChange={(e) => handleInputChange(e, index, "price")}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Variant Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => handleFileChange(e, index)}
              />
              {variant.imagePath && (
                <img src={variant.imagePath} alt="Preview" style={{ maxWidth: "100px", marginTop: "10px" }} />
              )}
            </div>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => removeVariant(index)}
              disabled={formData.variants.length === 1}
            >
              Remove Variant
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3" onClick={addVariant}>
          Add Variant
        </button>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {editingId ? "Update Product" : "Add Product"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setFormData({
                title: "",
                price: "",
                imagePath: "",
                department: "",
                category: "",
                description: "",
                variants: [{ _id: `v${Date.now()}`, size: "", color: "", price: "", imagePath: "" }],
              });
              setPhotoFiles({ main: null, variants: {} });
              setEditingId(null);
              document.querySelectorAll('input[type="file"]').forEach((input) => {
                input.value = "";
              });
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* Product List */}
      <h2 className="mt-5">Product List</h2>
      {products.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price (NGN)</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.title}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>
                  <button className="btn btn-warning me-2" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default ProductManager;