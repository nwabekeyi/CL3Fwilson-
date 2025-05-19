import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { postCart } from "../../redux/slices/cartSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function SingleProduct({ productItem, addToBag, onProductClick }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(false);

  const defaultVariant = productItem.variants?.[0] || {
    price: productItem.price || 0,
    imagePath: productItem.imagePath || "",
  };

  const handleProductClick = (e) => {
    e.preventDefault();
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
          price: variant.price,
          title: productItem.title,
        },
      })
    );
    addToBag(productItem._id); // Keep for logging
  };

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
            ₹ {defaultVariant.price.toFixed(2)}
            <span> ₹ {(parseFloat(defaultVariant.price) + 30).toFixed(2)}</span>
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