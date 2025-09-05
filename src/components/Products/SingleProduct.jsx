import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { postCart } from "../../redux/slices/cartSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useConversionRate from "../../hooks/useConversionRate";

const currencySymbols = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
};

function SingleProduct({ productItem, addToBag, onProductClick }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { conversionRates, loading: rateLoading, error: rateError } = useConversionRate();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preferredCurrency, setPreferredCurrency] = useState("NGN");
  const [convertedPrice, setConvertedPrice] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState("₦");

  // Get preferred currency from sessionStorage
  useEffect(() => {
    const storedCurrency = sessionStorage.getItem("preferredCurrency");
    if (storedCurrency) {
      setPreferredCurrency(storedCurrency);
    }
  }, []);

  // Currency conversion and formatting logic
  useEffect(() => {
    const validCurrency = ["NGN", "USD", "EUR"].includes(preferredCurrency)
      ? preferredCurrency
      : "NGN";

    const basePriceNGN = parseFloat(productItem.price) || 0;
    const rate = conversionRates[validCurrency] || 1;
    const converted = basePriceNGN * rate;

    const symbol = currencySymbols[validCurrency] || "₦";

    // Format the price with comma separators (rounded to whole number)
    const formattedPrice = Math.round(converted).toLocaleString();

    setConvertedPrice(formattedPrice);
    setCurrencySymbol(symbol);
    setLoading(false);
  }, [preferredCurrency, conversionRates, productItem.price]);

  const handleProductClick = (e) => {
    e.preventDefault();
    sessionStorage.setItem("selectedProduct", JSON.stringify(productItem));
    onProductClick();
    navigate(`/fashion-cube/single-product/${productItem.id}`);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(
      postCart({
        productId: productItem.id,
        variantDetails: {
          imagePath: productItem.images[0] || "https://via.placeholder.com/800x600?text=No+Image",
          price: productItem.price, // original price in NGN
          title: productItem.name,
          currency: preferredCurrency,
        },
      })
    );
    addToBag(productItem.id);
  };

  if (loading || rateLoading) {
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
            src={productItem.images[0] || "https://via.placeholder.com/800x600?text=No+Image"}
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
