import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { postCart } from "../../redux/slices/cartSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useConversionRate from "../../hooks/useConversionRate"; // Import the hook

const currencySymbols = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
};

function SingleProduct({ productItem, addToBag, onProductClick }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { conversionRates, loading: rateLoading, error: rateError } = useConversionRate(); // Use hook for conversionRates
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preferredCurrency, setPreferredCurrency] = useState("NGN"); // Default to NGN
  const [convertedPrice, setConvertedPrice] = useState(null);
  const [convertedOldPrice, setConvertedOldPrice] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState("₦");

  const defaultVariant = productItem.variants?.[0] || {
    price: productItem.price || 0,
    imagePath: productItem.imagePath || "",
  };

  // Retain preferredCurrency logic from sessionStorage
  useEffect(() => {
    const storedCurrency = sessionStorage.getItem("preferredCurrency");
    if (storedCurrency) {
      setPreferredCurrency(storedCurrency);
    }
  }, []);

  // Retain currency conversion logic
  useEffect(() => {
    const validCurrency = ["NGN", "USD", "EUR"].includes(preferredCurrency)
      ? preferredCurrency
      : "NGN";

    const basePriceNGN = parseFloat(productItem.price) || 0;
    const baseOldPriceNGN = parseFloat(productItem.oldPrice) || null; // Use oldPrice from product
    const rate = conversionRates[validCurrency] || 1;

    const converted = +(basePriceNGN * rate).toFixed(2);
    const old = baseOldPriceNGN
      ? +(baseOldPriceNGN * rate).toFixed(2)
      : +(converted + 30).toFixed(2); // Fallback if oldPrice is null
    const symbol = currencySymbols[validCurrency] || "₦";

    setConvertedPrice(converted.toFixed(2));
    setConvertedOldPrice(old.toFixed(2));
    setCurrencySymbol(symbol);
    setLoading(false);
  }, [preferredCurrency, conversionRates, productItem.price, productItem.oldPrice]);

  const handleProductClick = (e) => {
    e.preventDefault();
    console.log(productItem)
    sessionStorage.setItem("selectedProduct", JSON.stringify(productItem)); // Retain sessionStorage for product
    onProductClick();
    navigate(`/fashion-cube/single-product/${productItem.id}`);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };
console.log(productItem)
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
          price: variant.price, // NGN
          title: productItem.name,
          currency: preferredCurrency,
          price: productItem.price
        },
      })
    );
    addToBag(productItem._id);
  };

  if (loading || rateLoading || convertedPrice === null) {
    return <div className="loading">Loading...</div>;
  }

  if (rateError) {
    return <div className="error">{rateError}</div>;
  }

  return (
    <div className="product-item men">
      <div className="product discount product_filter" onClick={handleProductClick}>
        <div className="product_image">
          <img
            src={productItem.imagePath}
            alt={productItem.name}
            className="img-fluid"
          />
        </div>
        <div className="favorite ft" onClick={handleLikeClick}>
          {isLiked ? <FaHeart className="liked" /> : <FaRegHeart />}
        </div>
        <div className="product_info">
          <h6 className="product_name">
            <div>{productItem.name}</div>
          </h6>
          <div className="product_price">
            {currencySymbol} {convertedPrice}
            {convertedOldPrice && (
              <span> {currencySymbol} {convertedOldPrice}</span>
            )}
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