import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { removeCartItem } from "../../redux/slices/cartSlice";
import useConversionRate from "../../hooks/useConversionRate";
import CheckoutDetailsModal from "./modal";
import { db } from "../../firebase/config"; // <-- Your firebase config
import { collection, addDoc } from "firebase/firestore";
import EmptyCart from "../../assets/images/emptyCart.png";
import jumpTo from "../../modules/Navigation";
import "./style.css";

// Currency symbol logic
const getCurrencySymbol = (currency) => {
  switch (currency?.toUpperCase()) {
    case "NGN": return "₦";
    case "USD": return "$";
    case "EUR": return "€";
    default: return "₦";
  }
};

const HomeCartView = (props) => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const { conversionRates, loading: rateLoading, error: rateError } = useConversionRate();

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const firstCurrency = items[0]?.currency || "NGN";
  const convertPrice = (ngnPrice, currency) => {
    if (!ngnPrice || isNaN(ngnPrice)) return 0;
    if (!conversionRates || !conversionRates[currency] || rateLoading) {
      return currency === "NGN" ? Number(ngnPrice.toFixed(2)) : 0;
    }
    return Number((ngnPrice * conversionRates[currency]).toFixed(2));
  };

  const totalPrice = items.reduce((total, item) => {
    const itemCurrency = item.currency && ["NGN", "USD", "EUR"].includes(item.currency)
      ? item.currency
      : firstCurrency;
    const convertedPrice = convertPrice(item.price, itemCurrency);
    return total + convertedPrice * item.quantity;
  }, 0);

  const symbol = getCurrencySymbol(firstCurrency);
  const paystackKey = import.meta.env.VITE_PAYSTACK_KEY || ""; // Make sure this key exists in your .env file

  const handlePay = (userDetails) => {
    const handler = window.PaystackPop.setup({
      key: paystackKey,
      email: userDetails.email,
      amount: totalPrice * 100, // Amount is in kobo
      currency: firstCurrency,
      callback: (response) => {
        (async () => {
          try {
            await addDoc(collection(db, "orders"), {
              userDetails,
              items,
              total: totalPrice,
              currency: firstCurrency,
              paymentReference: response.reference,
              createdAt: new Date().toISOString(),
            });
            alert("Payment successful and order saved!");
            items.length = 0; // Clear the cart
            console.log(items)
          } catch (err) {
            console.error("Error saving order to Firestore:", err.message, err.stack, err.code);            alert("Payment succeeded but order saving failed.");
          }
        })(); // Immediately-invoked async function
      },
      onClose: () => {
        alert("Payment was cancelled.");
      },
    });
  
    handler.openIframe();
  };
  
  return (
    <>
      <Modal {...props} className="right">
        <Modal.Header closeButton>
          <Modal.Title>Your Cart</Modal.Title>
          {items.length > 0 && (
            <span className="checkout--btn" onClick={() => setShowDetailsModal(true)}>checkout</span>
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
                : firstCurrency;
              const convertedPrice = convertPrice(item.price, itemCurrency);

              return (
                <div key={item.productId} className="basket--item">
                  <div className="basket--item--img">
                    <img src={item.imagePath} alt={item.title} />
                  </div>
                  <div className="basket--item--details">
                    <div className="basket--item--title">{item.title}</div>
                    <div className="basket--item--quantity">Quantity: <span>{item.quantity}</span></div>
                    <div className="basket--item--price">
                      Price: <span>{getCurrencySymbol(itemCurrency)}{convertedPrice.toFixed(2)}</span>
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
                Total: <span style={{ color: "#FE4C50" }}>{symbol}{totalPrice.toFixed(2)}</span>
              </h3>
              <button
                className="btn btn-wide log-btn"
                style={{ marginTop: 20 }}
                onClick={() => setShowDetailsModal(true)}
              >
                Checkout
              </button>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* User Detail Modal */}
      <CheckoutDetailsModal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        onPay={handlePay}
      />
    </>
  );
};

export default HomeCartView;
