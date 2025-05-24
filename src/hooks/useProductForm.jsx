import { db } from "../firebase"; // Adjust path to your Firebase config
import { 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { uploadImage } from "../utils/cloudinary"; // Your existing Cloudinary upload function

// Initialize Firestore collection
const productsCollection = collection(db, "products");

// Add Product
export const addProduct = async (formData, photoFiles) => {
  try {
    // Validate form data
    if (!formData.title || !formData.price || !formData.category || !formData.description) {
      throw new Error("Missing required fields");
    }

    // Upload main product image if exists using Cloudinary
    let mainImageUrl = formData.imagePath;
    if (photoFiles.main) {
      mainImageUrl = await uploadImage(photoFiles.main);
    }

    // Upload variant images using Cloudinary
    const variantsWithImages = await Promise.all(
      formData.variants.map(async (variant) => {
        let variantImageUrl = variant.imagePath;
        if (photoFiles.variants[variant._id]) {
          variantImageUrl = await uploadImage(photoFiles.variants[variant._id]);
        }
        return { ...variant, imagePath: variantImageUrl };
      })
    );

    // Prepare product data
    const productData = {
      ...formData,
      imagePath: mainImageUrl,
      variants: variantsWithImages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to Firestore
    const docRef = await addDoc(productsCollection, productData);
    return { id: docRef.id, ...productData };
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// Update Product
export const updateProduct = async (productId, formData, photoFiles) => {
  try {
    const productRef = doc(db, "products", productId);
    
    // Get existing product
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) {
      throw new Error("Product not found");
    }

    // Upload new main image if provided using Cloudinary
    let mainImageUrl = formData.imagePath;
    if (photoFiles.main) {
      mainImageUrl = await uploadImage(photoFiles.main);
    }

    // Upload new variant images using Cloudinary
    const variantsWithImages = await Promise.all(
      formData.variants.map(async (variant) => {
        let variantImageUrl = variant.imagePath;
        if (photoFiles.variants[variant._id]) {
          variantImageUrl = await uploadImage(photoFiles.variants[variant._id]);
        }
        return { ...variant, imagePath: variantImageUrl };
      })
    );

    // Prepare updated product data
    const updatedProductData = {
      ...formData,
      imagePath: mainImageUrl,
      variants: variantsWithImages,
      updatedAt: new Date().toISOString(),
    };

    // Update in Firestore
    await updateDoc(productRef, updatedProductData);
    return { id: productId, ...updatedProductData };
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete Product
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      throw new Error("Product not found");
    }

    // Note: Cloudinary image deletion requires the public_id
    // You'll need to implement deleteImage in your cloudinary.js
    // For now, images will remain in Cloudinary unless you add deletion logic

    // Delete from Firestore
    await deleteDoc(productRef);
    return { success: true, id: productId };
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Get Single Product
export const getProduct = async (productId) => {
  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      throw new Error("Product not found");
    }
    
    return { id: productSnap.id, ...productSnap.data() };
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
};

// Get All Products
export const getAllProducts = async () => {
  try {
    const productsSnapshot = await getDocs(productsCollection);
    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return products;
  } catch (error) {
    console.error("Error getting all products:", error);
    throw error;
  }
};