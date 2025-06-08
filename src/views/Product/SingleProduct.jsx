import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useConversionRate from "../../hooks/useConversionRate";

const SingleProduct = ({ product, postCart }) => {
  const location = useLocation();
  const { conversionRates, loading: rateLoading, error: rateError } = useConversionRate();
  const [state, setState] = useState({
    pic: "", // Current main image
    quantity: 1,
  });
  const [preferredCurrency, setPreferredCurrency] = useState("NGN");

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

  const convertPrice = (ngnPrice, currency) => {
    if (!ngnPrice || isNaN(ngnPrice)) return 0;
    if (!conversionRates || !conversionRates[currency] || rateLoading) {
      return currency === "NGN" ? Number(ngnPrice.toFixed(2)) : 0;
    }
    return Number((ngnPrice * conversionRates[currency]).toFixed(2));
  };

  const dummyProduct = {
    id: "dummy",
    name: "Product Not Available",
    price: 0,
    images: ["https://via.placeholder.com/800x600?text=Product+Not+Found"],
    department: "Men",
    category: "Unknown",
    description: "This product is currently unavailable. Please check back later or browse other items.",
  };

  const displayProduct = product || dummyProduct;
  const isDummy = displayProduct === dummyProduct;

  const convertedPrice = convertPrice(displayProduct.price, preferredCurrency);

  useEffect(() => {
    if (displayProduct.images?.length > 0 && !state.pic) {
      setState((prev) => ({
        ...prev,
        pic: displayProduct.images[0],
      }));
    }
  }, [displayProduct, state.pic]);

  const handleThumbnailClick = (image) => {
    setState((prev) => ({
      ...prev,
      pic: image,
    }));
  };

  const onAddClicked = () => {
    if (!isDummy) {
      setState((prev) => ({ ...prev, quantity: prev.quantity + 1 }));
    }
  };

  const onRemoveClicked = () => {
    if (!isDummy && state.quantity > 1) {
      setState((prev) => ({ ...prev, quantity: prev.quantity - 1 }));
    }
  };

  const addToBag = () => {
    if (!isDummy) {
      postCart({
        productId: displayProduct.id,
        quantity: state.quantity,
        variantDetails: {
          imagePath: state.pic || displayProduct.images[0],
          title: displayProduct.name,
          currency: preferredCurrency,
          price: displayProduct.price,
        },
      })
        .catch((err) => {
          console.error("Error updating cart:", err);
        });
    }
  };

  return (
    <div className="container single_product_container">
      <div>
        {rateLoading && <div className="loading">Loading conversion rates...</div>}
        {rateError && <div className="error">{rateError}</div>}
        <div className="row">
          <div className="col">
            <div className="breadcrumbs d-flex flex-row align-items-center">
              <ul>
                <li><a href="/">Home</a></li>
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
                      {displayProduct.images && displayProduct.images.length > 0 ? (
                        displayProduct.images.slice(0, 4).map((image, index) => (
                          <li key={index} onClick={() => handleThumbnailClick(image)}>
                            <img
                              src={image}
                              alt={`${displayProduct.name} ${index + 1}`}
                              className="img-fluid"
                            />
                          </li>
                        ))
                      ) : (
                        <li>
                          <img
                            src="https://via.placeholder.com/800x600?text=No+Image"
                            alt={displayProduct.name}
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
                      style={{ backgroundImage: `url(${state.pic || displayProduct.images[0] || "https://via.placeholder.com/800x600?text=No+Image"})` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="product_details">
              <div className="product_details_title">
                <h2>{displayProduct.name}</h2>
                <p>{displayProduct.description}</p>
              </div>
              <div className="product_price">
                {currencySymbol}
                {convertedPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <ul className="star_rating">
                <li><i className="fa fa-star" aria-hidden="true"></i></li>
                <li><i className="fa fa-star" aria-hidden="true"></i></li>
                <li><i className="fa fa-star" aria-hidden="true"></i></li>
                <li><i className="fa fa-star" aria-hidden="true"></i></li>
                <li><i className="fa fa-star-o" aria-hidden="true"></i></li>
              </ul>
              <div className="quantity d-flex flex-sm-row align-items-sm-center">
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
              </div>
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
