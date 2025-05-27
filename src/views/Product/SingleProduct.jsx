import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useConversionRate from "../../hooks/useConversionRate"; // Import the hook

const SingleProduct = ({ product, postCart }) => {
  const location = useLocation();
  const { conversionRates, loading: rateLoading, error: rateError } = useConversionRate(); // Use hook
  const [state, setState] = useState({
    color: "",
    size: "",
    pic: "",
    selectedSize: "",
    id: "",
    quantity: 1,
  });
  const [preferredCurrency, setPreferredCurrency] = useState("NGN"); // Default to NGN

  // Retrieve preferredCurrency from sessionStorage
  useEffect(() => {
    const storedCurrency = sessionStorage.getItem("preferredCurrency");
    if (storedCurrency && ["NGN", "USD", "EUR"].includes(storedCurrency)) {
      setPreferredCurrency(storedCurrency);
    }
  }, []);

  const currencySymbols = {
    NGN: "₦",
    USD: "$",
    EUR: "€",
  };
  const currencySymbol = currencySymbols[preferredCurrency] || "₦";

  // Function to convert NGN price to selected currency
  const convertPrice = (ngnPrice, currency) => {
    if (!ngnPrice || isNaN(ngnPrice)) return 0;
    if (!conversionRates || !conversionRates[currency] || rateLoading) {
      return currency === "NGN" ? Number(ngnPrice.toFixed(2)) : 0; // Fallback to NGN or 0
    }
    return Number((ngnPrice * conversionRates[currency]).toFixed(2));
  };

  // Dummy product for when no product is provided
  const dummyProduct = {
    _id: "dummy",
    title: "Product Not Available",
    price: 0,
    oldPrice: null,
    imagePath: "https://via.placeholder.com/800x600?text=Product+Not+Found",
    department: "Men",
    category: "Unknown",
    description: "This product is currently unavailable. Please check back later or browse other items.",
    variants: [
      {
        _id: "dummy-v1",
        size: "M",
        color: "Grey",
        price: 0,
        imagePath: "https://via.placeholder.com/800x600?text=Product+Not+Found",
      },
      {
        _id: "dummy-v2",
        size: "L",
        color: "Grey",
        price: 0,
        imagePath: "https://via.placeholder.com/800x600?text=Product+Not+Found",
      },
    ],
  };

  // Use the product prop or dummyProduct
  const displayProduct = product || dummyProduct;
  const isDummy = displayProduct === dummyProduct;

  // Convert prices for display
  const convertedPrice = convertPrice(displayProduct.price, preferredCurrency);
  const convertedOldPrice = displayProduct.oldPrice
    ? convertPrice(displayProduct.oldPrice, preferredCurrency)
    : convertPrice(displayProduct.price * 1.3, preferredCurrency); // 30% markup if no oldPrice

  // Set default variant image when product changes
  useEffect(() => {
    if (displayProduct.variants?.length > 0 && !state.pic) {
      setState((prev) => ({
        ...prev,
        pic: displayProduct.variants[0].imagePath,
        id: displayProduct.variants[0]._id,
        color: displayProduct.variants[0].color,
        size: displayProduct.variants[0].size,
        selectedSize: displayProduct.variants[0].size,
      }));
    }
  }, [displayProduct, state.pic]);

  const handleThumbnailClick = (item) => {
    setState((prev) => ({
      ...prev,
      color: item.color,
      size: item.size,
      pic: item.imagePath,
      selectedSize: item.size,
      id: item._id,
    }));
  };

  const onAddClicked = () => {
    if (!isDummy) {
      const selectedVariant = displayProduct.variants.find((v) => v._id === state.id) || displayProduct.variants[0];
      setState((prev) => ({ ...prev, quantity: prev.quantity + 1 }));
      postCart({
        productId: state.id || displayProduct.variants[0]._id,
        increase: true,
        variantDetails: {
          color: selectedVariant.color,
          imagePath: selectedVariant.imagePath,
          name: displayProduct.name,
          currency: preferredCurrency,
          price: product.price
        },
      });
    }
  };

  const onRemoveClicked = () => {
    if (!isDummy && state.quantity > 1) {
      const selectedVariant = displayProduct.variants.find((v) => v._id === state.id) || displayProduct.variants[0];
      setState((prev) => ({ ...prev, quantity: prev.quantity - 1 }));
      postCart({
        productId: state.id || displayProduct.variants[0]._id,
        decrease: true,
        variantDetails: {
          color: selectedVariant.color,
          imagePath: selectedVariant.imagePath,
          name: displayProduct.name,
          currency: preferredCurrency,
          price: product.price,
        },
      });
    }
  };

  const addToBag = () => {
    if (!isDummy) {
      const selectedVariant = displayProduct.variants.find((v) => v._id === state.id) || displayProduct.variants[0];
      postCart({
        productId: state.id || displayProduct.variants[0]._id,
        variantDetails: {
          size: selectedVariant.size,
          color: selectedVariant.color,
          imagePath: selectedVariant.imagePath,
          title: displayProduct.name,
          currency: preferredCurrency,
          price:product.price
        },
      })
        .then((res) => {
          console.log("Cart updated:", res);
        })
        .catch((err) => {
          console.error("Error updating cart:", err);
        });
    }
  };
console.log(product)
  return (
    <div className="container single_product_container">
      <div>
        {/* Loading and Error States for Conversion Rates */}
        {rateLoading && <div className="loading">Loading conversion rates...</div>}
        {rateError && <div className="error">{rateError}</div>}
        <div className="row">
          <div className="col">
            <div className="breadcrumbs d-flex flex-row align-items-center">
              <ul>
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-angle-right" aria-hidden="true"></i>
                    {displayProduct.department}
                  </a>
                </li>
                <li className="active">
                  <a href="#">
                    <i className="fa fa-angle-right" aria-hidden="true"></i>
                    {displayProduct.category}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-7">
            <div className="single_product_pics">
              <div className="row">
                <div className="col-lg-3 thumbnails_col order-lg-1 order-2">
                  <div className="single_product_thumbnails">
                    <ul>
                      {displayProduct.variants && displayProduct.variants.length > 0 ? (
                        displayProduct.variants.slice(0, 4).map((item) => (
                          <li key={item._id} onClick={() => handleThumbnailClick(item)}>
                            <img
                              src={item.imagePath}
                              alt={`${item.color} ${item.size}`}
                              className="img-fluid"
                            />
                          </li>
                        ))
                      ) : (
                        <li>
                          <img
                            src={displayProduct.imagePath}
                            alt={displayProduct.title}
                            className="img-fluid"
                          />
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="col-lg-9 image_col order-lg-2 order-1">
                  <div className="single_product_image">
                    <div
                      className="single_product_image_background"
                      style={{ backgroundImage: `url(${state.pic || displayProduct.imagePath})` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="product_details">
              <div className="product_details_title">
                <h2>{displayProduct.title}</h2>
                <p>{displayProduct.description}</p>
              </div>
              <div className="original_price">
                {currencySymbol}{convertedOldPrice.toFixed(2)}
              </div>
              <div className="product_price">
                {currencySymbol}{convertedPrice.toFixed(2)}
              </div>
              <ul className="star_rating">
                <li><i className="fa fa-star" aria-hidden="true"></i></li>
                <li><i className="fa fa-star" aria-hidden="true"></i></li>
                <li><i className="fa fa-star" aria-hidden="true"></i></li>
                <li><i className="fa fa-star" aria-hidden="true"></i></li>
                <li><i className="fa fa-star-o" aria-hidden="true"></i></li>
              </ul>
              <div className="product_color">
                <span>Select color:</span>
                <ul>
                  {displayProduct.variants && displayProduct.variants.length > 0 ? (
                    displayProduct.variants.map((item) => (
                      <li
                        key={item._id}
                        style={{ background: item.color.toLowerCase() }}
                        onClick={() => handleThumbnailClick(item)}
                      ></li>
                    ))
                  ) : (
                    <li style={{ background: "#e54e5d" }}></li>
                  )}
                </ul>
              </div>
              <div className="quantity d-flex flex-column flex-sm-row align-items-sm-center">
                <span>Quantity:</span>
                <div className="quantity_selector">
                  <span
                    className={state.quantity > 1 && !isDummy ? "minus" : "minus disabled"}
                    onClick={onRemoveClicked}
                  >
                    <i className="fa fa-minus" aria-hidden="true"></i>
                  </span>
                  <span id="quantity_value">{state.quantity}</span>
                  <span className={isDummy ? "plus disabled" : "plus"} onClick={onAddClicked}>
                    <i className="fa fa-plus" aria-hidden="true"></i>
                  </span>
                </div>
                <div
                  className={`red_button product-add_to_cart_button ${isDummy ? "disabled" : ""}`}
                  onClick={addToBag}
                >
                  <a href="#">{isDummy ? "Unavailable" : "add to cart"}</a>
                </div>
                <div className="product_favorite d-flex flex-column align-items-center justify-content-center">
                  <i className="far fa-heart"></i>
                </div>
              </div>
              {/* Delivery Section */}
              <div className="delivery_info mt-3">
                <h5>Delivery</h5>
                <p>
                  The cost of delivery will be determined by the method of dispatch. Delivery will take anywhere between 7 days to 3 weeks depending on the product, location, and delivery timeline. Please speak to our customer service representative for further information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;