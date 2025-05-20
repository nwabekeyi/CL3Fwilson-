import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const SingleProduct = ({ product, postCart }) => {
  const location = useLocation();
  const [state, setState] = useState({
    color: "",
    size: "",
    pic: "",
    selectedSize: "",
    id: "",
    quantity: 1,
  });

  // Dummy product for when no product is selected
  const dummyProduct = {
    _id: "dummy",
    title: "Product Not Available",
    price: 0,
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

  // Set default variant image when product or dummy product loads
  useEffect(() => {
    const currentProduct = product || dummyProduct;
    if (currentProduct.variants?.length > 0 && !state.pic) {
      setState((prev) => ({
        ...prev,
        pic: currentProduct.variants[0].imagePath,
        id: currentProduct.variants[0]._id,
        color: currentProduct.variants[0].color,
        size: currentProduct.variants[0].size,
        selectedSize: currentProduct.variants[0].size,
      }));
    }
  }, [product, state.pic]);

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
    if (product) {
      const selectedVariant = product.variants.find((v) => v._id === state.id) || product.variants[0];
      setState((prev) => ({ ...prev, quantity: prev.quantity + 1 }));
      postCart({
        productId: state.id || product.variants[0]._id,
        increase: true,
        variantDetails: {
          size: selectedVariant.size,
          color: selectedVariant.color,
          imagePath: selectedVariant.imagePath,
          price: selectedVariant.price,
          title: product.title,
        },
      });
    }
  };

  const onRemoveClicked = () => {
    if (product && state.quantity > 1) {
      const selectedVariant = product.variants.find((v) => v._id === state.id) || product.variants[0];
      setState((prev) => ({ ...prev, quantity: prev.quantity - 1 }));
      postCart({
        productId: state.id || product.variants[0]._id,
        decrease: true,
        variantDetails: {
          size: selectedVariant.size,
          color: selectedVariant.color,
          imagePath: selectedVariant.imagePath,
          price: selectedVariant.price,
          title: product.title,
        },
      });
    }
  };

  const addToBag = () => {
    if (product) {
      const selectedVariant = product.variants.find((v) => v._id === state.id) || product.variants[0];
      postCart({
        productId: state.id || product.variants[0]._id,
        variantDetails: {
          size: selectedVariant.size,
          color: selectedVariant.color,
          imagePath: selectedVariant.imagePath,
          price: selectedVariant.price,
          title: product.title,
        },
      }).then((res) => {
        console.log("Cart updated:", res);
      });
    }
  };

  // Use dummy product if no product is selected
  const displayProduct = product || dummyProduct;
  const isDummy = displayProduct === dummyProduct;

  return (
    <div className="container single_product_container">
      <div>
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
                        displayProduct.variants.slice(0, 4).map((item, index) => (
                          <li key={index} onClick={() => handleThumbnailClick(item)}>
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
              <div className="free_delivery d-flex flex-row align-items-center justify-content-center">
                <span>
                  <i className="fas fa-truck"></i>
                </span>
                <span>free delivery</span>
              </div>
              <div className="original_price">
                ₹{(parseFloat(displayProduct.price) + 30).toFixed(2)}
              </div>
              <div className="product_price">₹{displayProduct.price.toFixed(2)}</div>
              <ul className="star_rating">
                <li><i className="fa fa-star" aria-hidden="true"></i></li>
                <li><i className="fa fa-star" aria-hidden="true"></i></li>
                <li><i className="fa fa-star" aria-hidden="true"></i></li>
                <li><i className="fa fa-star" aria-hidden="true"></i></li>
                <li><i className="fa fa-star-o" aria-hidden="true"></i></li>
              </ul>
              <div className="product_color">
                <span>Select Color:</span>
                <ul>
                  {displayProduct.variants && displayProduct.variants.length > 0 ? (
                    displayProduct.variants.map((item, index) => (
                      <li
                        key={index}
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
              {isDummy && (
                <p className="text-danger mt-3">
                  This product is not available. Please browse other items.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;