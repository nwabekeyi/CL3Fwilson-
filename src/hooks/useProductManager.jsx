import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { uploadImage } from "../utils/cloudinary";



const cloudinaryApiKey = import.meta.env.VITE_CLOUDINARY_KEY;
const cloudinarySecret= import.meta.env.VITE_CLOUDINARY_SECRET;
const cloudinaryName = import.meta.env.VITE_CLOUDINARY_NAME;
// Initialize Firestore collection
const productsCollection = collection(db, "products");

// Utility function to extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  try {
    // Extract public ID from URL (e.g., "https://res.cloudinary.com/.../public_id.extension")
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    const publicId = fileName.split(".")[0]; // Remove file extension
    return publicId;
  } catch (error) {
    console.error("Error extracting public ID from URL:", error);
    return null;
  }
};

// Utility function to delete image from Cloudinary
const deleteImage = async (imageUrl) => {
  try {
    const publicId = getPublicIdFromUrl(imageUrl);
    if (!publicId) {
      throw new Error("Invalid Cloudinary URL");
    }

    // Cloudinary API call to delete the image
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryName}/image/destroy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${cloudinaryApiKey}:${cloudinarySecret}`)}`, // Replace with your Cloudinary API key and secret
      },
      body: JSON.stringify({ public_id: publicId }),
    });

    const result = await response.json();
    if (result.result !== "ok") {
      throw new Error("Failed to delete image from Cloudinary");
    }
    return true;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return false;
  }
};

const useProductManager = () => {


  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const productsSnapshot = await getDocs(productsCollection);
      // If snapshot exists and has docs, map them; otherwise, return empty array
      const productsData = productsSnapshot?.docs?.length
        ? productsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        : [];
      setProducts(productsData);
      console.log(productsData);
    } catch (err) {
      // Handle critical Firestore errors (e.g., permissions or network issues)
      if (err.code === "permission-denied" || err.code === "unavailable") {
        setError("Failed to fetch products due to permissions or network issues");
        console.error("Error fetching products:", err);
      } else {
        // Non-existent collection: return empty array, no error state
        setProducts([]);
        console.warn("Products collection does not exist:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Add product with Cloudinary uploads
  const addProductWithImages = async (productData, photoFiles) => {
    setLoading(true);
    setError(null);
    try {
      // Upload multiple images if provided
      let imageUrls = productData.images || [];
      if (photoFiles?.length > 0) {
        imageUrls = await Promise.all(
          photoFiles.map(async (file) => await uploadImage(file))
        );
      }

      // Prepare product data
      const finalProductData = {
        ...productData,
        images: imageUrls.length > 0 ? imageUrls : ["https://via.placeholder.com/800x600?text=No+Image"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to Firestore
      const docRef = await addDoc(productsCollection, finalProductData);
      const newProduct = { id: docRef.id, ...finalProductData };
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      setError("Failed to add product");
      console.error("Error adding product:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update product with Cloudinary uploads
  const updateProductWithImages = async (productId, productData, photoFiles) => {
    setLoading(true);
    setError(null);
    try {
      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) {
        throw new Error("Product not found");
      }

      // Upload new images if provided, preserve existing images if no new ones
      let imageUrls = productData.images || [];
      if (photoFiles?.length > 0) {
        // Delete old images from Cloudinary if new images are provided
        const oldImages = productSnap.data().images || [];
        await Promise.all(
          oldImages.map(async (imageUrl) => {
            if (imageUrl && !imageUrl.includes("placeholder")) {
              await deleteImage(imageUrl);
            }
          })
        );

        // Upload new images
        imageUrls = await Promise.all(
          photoFiles.map(async (file) => await uploadImage(file))
        );
      }

      // Prepare updated product data
      const updatedProductData = {
        ...productData,
        images: imageUrls.length > 0 ? imageUrls : productData.images || ["https://via.placeholder.com/800x600?text=No+Image"],
        updatedAt: new Date().toISOString(),
      };

      // Update in Firestore
      await updateDoc(productRef, updatedProductData);
      const updatedProduct = { id: productId, ...updatedProductData };
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? updatedProduct : p))
      );
      return updatedProduct;
    } catch (error) {
      setError("Failed to update product");
      console.error("Error updating product:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete product and associated images
  const deleteProductHandler = async (productId) => {
    setLoading(true);
    setError(null);
    try {
      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) {
        throw new Error("Product not found");
      }

      // Delete all associated images from Cloudinary
      const productData = productSnap.data();
      const images = productData.images || [];
      await Promise.all(
        images.map(async (imageUrl) => {
          if (imageUrl && !imageUrl.includes("placeholder")) {
            await deleteImage(imageUrl);
          }
        })
      );

      // Delete from Firestore
      await deleteDoc(productRef);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      return { success: true, id: productId };
    } catch (error) {
      setError("Failed to delete product or images");
      console.error("Error deleting product:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    addProductWithImages,
    updateProductWithImages,
    deleteProduct: deleteProductHandler,
    fetchProducts,
  };
};

export default useProductManager;