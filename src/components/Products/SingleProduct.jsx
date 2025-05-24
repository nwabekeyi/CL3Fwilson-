import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { postCart } from "../../redux/slices/cartSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const currencySymbols = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
};

function SingleProduct({ productItem, addToBag, onProductClick }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState({ price: 0, oldPrice: 0, symbol: "₦" });
  const [preferredCurrency, setPreferredCurrency] = useState(
    sessionStorage.getItem("preferredCurrency") || "NGN"
  );

  // Conversion rates
  const conversionRates = {
    NGN: 1,
    USD: 0.00061, // 1 NGN ≈ 0.00061 USD
    EUR: 0.00057, // 1 NGN ≈ 0.00057 EUR
  };

  // Save conversion rates to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("conversionRates", JSON.stringify(conversionRates));
  }, []); // Run once on mount to save conversion rates

  // Function to convert NGN price to selected currency
  const convertPrice = (ngnPrice, currency) => {
    return Number((ngnPrice * conversionRates[currency]).toFixed(2));
  };

  // Get the default variant or fallback to product price
  const defaultVariant = productItem.variants?.[0] || {
    price: productItem.price || 0,
    imagePath: productItem.imagePath || "",
  };

  useEffect(() => {
    // Ensure the preferred currency is valid, fallback to NGN
    const validCurrency = ["NGN", "USD", "EUR"].includes(preferredCurrency) ? preferredCurrency : "NGN";

    // Get the base price in NGN and convert to selected currency
    const basePriceNGN = parseFloat(defaultVariant.price) || 0;
    const convertedPrice = convertPrice(basePriceNGN, validCurrency);
    const oldPrice = (convertedPrice + 30).toFixed(2); // Add 30 in selected currency

    // Set price data with the correct symbol
    const symbol = currencySymbols[validCurrency] || "₦";
    setPriceData({
      price: convertedPrice.toFixed(2),
      oldPrice,
      symbol,
    });

    setLoading(false);
  }, [defaultVariant.price, preferredCurrency]);

  const handleProductClick = (e) => {
    e.preventDefault();
    // Save product details in sessionStorage as selectedProduct
    sessionStorage.setItem("selectedProduct", JSON.stringify(productItem));
    onProductClick();
    navigate(`/fashion-cube/single-product/${productItem._id}`);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const variant = productItem.variants[0];
    dispatch(
      postCart({
        productId: variant._id,
        variantDetails: {
          size: variant.size,
          color: variant.color,
          imagePath: variant.imagePath,
          price: variant.price, // Store NGN price
          title: productItem.title,
          currency: preferredCurrency, // Include currency
        },
      })
    );
    addToBag(productItem._id);
  };

  if (loading) return null;

  return (
    <div className="product-item men">
      <div className="product discount product_filter" onClick={handleProductClick}>
        <div className="product_image">
          <img
            src={defaultVariant.imagePath}
            alt={productItem.title}
            className="img-fluid"
          />
        </div>
        <div className="favorite ft" onClick={handleLikeClick}>
          {isLiked ? <FaHeart className="liked" /> : <FaRegHeart />}
        </div>
        <div className="product_info">
          <h6 className="product_name">
            <div>{productItem.title}</div>
          </h6>
          <div className="product_price">
            {priceData.symbol} {priceData.price}
            <span> {priceData.symbol} {priceData.oldPrice}</span>
          </div>
        </div>
      </div>
      <div className="red_button add_to_cart_button" onClick={handleAddToCart}>
        <div style={{ color: "#ffffff" }}>add to cart</div>
      </div>
    </div>
  );
}

export default SingleProduct;