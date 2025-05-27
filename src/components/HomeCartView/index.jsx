import React from "react";
import { Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { removeCartItem } from "../../redux/slices/cartSlice";
import useConversionRate from "../../hooks/useConversionRate"; // Import the hook
import "./style.css";
import EmptyCart from "../../assets/images/emptyCart.png";
import jumpTo from "../../modules/Navigation";

const getCurrencySymbol = (currency) => {
  switch (currency?.toUpperCase()) {
    case "NGN":
    case "NAIRA":
      return "₦";
    case "USD":
    case "DOLLAR":
      return "$";
    case "EUR":
    case "EURO":
      return "€";
    default:
      return "₦"; // fallback
  }
};

const HomeCartView = (props) => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const { conversionRates, loading: rateLoading, error: rateError } = useConversionRate(); // Use hook

  // Function to convert NGN price to target currency
  const convertPrice = (ngnPrice, currency) => {
    if (!ngnPrice || isNaN(ngnPrice)) return 0;
    if (!conversionRates || !conversionRates[currency] || rateLoading) {
      return currency === "NGN" ? Number(ngnPrice.toFixed(2)) : 0; // Fallback to NGN or 0
    }
    return Number((ngnPrice * conversionRates[currency]).toFixed(2));
  };

  const goToCheckout = () => {
    jumpTo("/fashion-cube/cart");
  };

  // Compute total price in the first item's currency
  const firstCurrency = items[0]?.currency || "NGN";
  const totalPrice = items.reduce((total, item) => {
    const itemCurrency = item.currency && ["NGN", "USD", "EUR"].includes(item.currency)
      ? item.currency
      : firstCurrency; // Fallback to firstCurrency
    const convertedPrice = convertPrice(item.price, itemCurrency);
    return total + convertedPrice * item.quantity;
  }, 0);

  const symbol = getCurrencySymbol(firstCurrency);
console.log(items);
  return (
    <Modal {...props} className="right">
      <Modal.Header closeButton>
        <Modal.Title>Your Cart</Modal.Title>
        {items.length > 0 && (
          <span className="checkout--btn" onClick={goToCheckout}>
            checkout
          </span>
        )}
      </Modal.Header>

      <Modal.Body className="modal-body-content">
        {rateLoading && <div className="loading">Loading conversion rates...</div>}
        {rateError && <div className="error">{rateError}</div>}
        {items.length === 0 ? (
          <div className="empty--basket">
            <img src={EmptyCart} className="img-fluid" alt="Empty cart" />
            <h4 style={{ textAlign: "center" }}>Empty cart</h4>
          </div>
        ) : (
          items.map((item) => {
            const itemCurrency = item.currency && ["NGN", "USD", "EUR"].includes(item.currency)
              ? item.currency
              : firstCurrency; // Fallback to firstCurrency
            const convertedPrice = convertPrice(item.price, itemCurrency);
            return (
              <div key={item.productId} className="basket--item">
                <div className="basket--item--img">
                  <img src={item.imagePath} alt={item.title} />
                </div>
                <div className="basket--item--details">
                  <div className="basket--item--title">{item.title}</div>
                  <div className="basket--item--quantity">
                    Quantity: <span>{item.quantity}</span>
                  </div>
                  <div className="basket--item--price">
                    Price:{" "}
                    <span>
                      {getCurrencySymbol(itemCurrency)}
                      {convertedPrice.toFixed(2)}
                    </span>
                  </div>
                  <button
                    className="btn btn-sm log-btn"
                    style={{ marginTop: "10px" }}
                    onClick={() => dispatch(removeCartItem(item.productId))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        )}

        {items.length > 0 && (
          <div className="total--price-container">
            <h3 style={{ textAlign: "center" }}>
              Total:{" "}
              <span style={{ color: "#FE4C50" }}>
                {symbol}
                {totalPrice.toFixed(2)}
              </span>
            </h3>
            <button
              className="btn btn-wide log-btn"
              style={{ marginTop: 20 }}
              onClick={goToCheckout}
            >
              Checkout
            </button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default HomeCartView;