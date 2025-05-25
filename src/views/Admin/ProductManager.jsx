import { useState, useEffect } from "react";
import { db } from "../../firebase/config"; // Adjust path to your Firebase config
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { uploadImage } from "../../utils/cloudinary"; // Import Cloudinary upload function

// Initialize Firestore collection
const productsCollection = collection(db, "products");

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
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (err) {
      setError("Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add product with Cloudinary uploads
  const addProductWithImages = async (productData, photoFiles) => {
    setLoading(true);
    setError(null);
    try {
      // Upload main image if provided
      let mainImageUrl = productData.imagePath;
      if (photoFiles.main) {
        mainImageUrl = await uploadImage(photoFiles.main);
      }

      // Upload variant images if provided
      const variantsWithImages = await Promise.all(
        productData.variants.map(async (variant, index) => {
          let variantImageUrl = variant.imagePath;
          if (photoFiles.variants[variant._id]) {
            variantImageUrl = await uploadImage(photoFiles.variants[variant._id]);
          }
          return { ...variant, imagePath: variantImageUrl };
        })
      );

      // Prepare product data
      const finalProductData = {
        ...productData,
        imagePath: mainImageUrl || "https://via.placeholder.com/800x600?text=No+Image",
        variants: variantsWithImages.map((v) => ({
          ...v,
          imagePath: v.imagePath || "https://via.placeholder.com/800x600?text=No+Image",
        })),
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

      // Upload main image if provided
      let mainImageUrl = productData.imagePath;
      if (photoFiles.main) {
        mainImageUrl = await uploadImage(photoFiles.main);
      }

      // Upload variant images if provided
      const variantsWithImages = await Promise.all(
        productData.variants.map(async (variant) => {
          let variantImageUrl = variant.imagePath;
          if (photoFiles.variants[variant._id]) {
            variantImageUrl = await uploadImage(photoFiles.variants[variant._id]);
          }
          return { ...variant, imagePath: variantImageUrl };
        })
      );

      // Prepare updated product data
      const updatedProductData = {
        ...productData,
        imagePath: mainImageUrl || productData.imagePath || "https://via.placeholder.com/800x600?text=No+Image",
        variants: variantsWithImages.map((v) => ({
          ...v,
          imagePath: v.imagePath || "https://via.placeholder.com/800x600?text=No+Image",
        })),
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

  // Delete product
  const deleteProductHandler = async (productId) => {
    setLoading(true);
    setError(null);
    try {
      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) {
        throw new Error("Product not found");
      }

      await deleteDoc(productRef);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      return { success: true, id: productId };
    } catch (error) {
      setError("Failed to delete product");
      console.error("Error deleting product:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []); // Empty dependency array to run once

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