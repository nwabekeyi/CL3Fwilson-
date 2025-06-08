import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { removeCartItem, clearCart } from "../../redux/slices/cartSlice";
import useConversionRate from "../../hooks/useConversionRate";
import CheckoutDetailsModal from "./modal";
import { db } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import EmptyCart from "../../assets/images/emptyCart.png";

// Currency symbol logic
const getCurrencySymbol = (currency) => {
  switch (currency?.toUpperCase()) {
    case "NGN":
      return "₦";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    default:
      return "₦";
  }
};

// Format price as 100,000,000 (no decimals)
const formatPrice = (amount) => {
  if (typeof amount !== "number") return amount;
  return amount.toLocaleString(undefined, { maximumFractionDigits: 0 });
};

// Sanitize data to replace undefined with null
const sanitizeData = (data) => {
  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }
  if (data && typeof data === "object") {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) {
        sanitized[key] = null; // Replace undefined with null
      } else if (typeof value === "object" && value !== null) {
        sanitized[key] = sanitizeData(value); // Recursively sanitize nested objects
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
  return data;
};

const HomeCartView = (props) => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const { conversionRates, loading: rateLoading, error: rateError } = useConversionRate();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isPaystackLoading, setIsPaystackLoading] = useState(false); // State for Paystack loader

  const firstCurrency = items[0]?.currency || "NGN";

  const convertPrice = (ngnPrice, currency) => {
    if (!ngnPrice || isNaN(ngnPrice)) return 0;
    if (!conversionRates || !conversionRates[currency] || rateLoading) {
      return currency === "NGN" ? ngnPrice : 0;
    }
    return ngnPrice * conversionRates[currency];
  };

  const totalPrice = items.reduce((total, item) => {
    const itemCurrency = item.currency && ["NGN", "USD", "EUR"].includes(item.currency)
      ? item.currency
      : firstCurrency;
    const convertedPrice = convertPrice(item.price, itemCurrency);
    return total + convertedPrice * item.quantity;
  }, 0);

  const symbol = getCurrencySymbol(firstCurrency);
  const paystackKey = import.meta.env.VITE_PAYSTACK_KEY || "";

  const handlePay = (userDetails) => {
    setIsPaystackLoading(true);
    const handler = window.PaystackPop.setup({
      key: paystackKey,
      email: userDetails.email,
      amount: totalPrice * 100, // amount in kobo
      currency: firstCurrency,
      callback: (response) => {
        (async () => {
          try {
            const sanitizedItems = items.map((item) => ({
              productId: item.productId || "",
              title: item.title || "",
              price: item.price || 0,
              quantity: item.quantity || 1,
              currency: item.currency || firstCurrency,
              imagePath: item.imagePath || "",
            }));
            const orderData = sanitizeData({
              userDetails,
              items: sanitizedItems,
              total: totalPrice,
              currency: firstCurrency,
              paymentReference: response.reference,
              createdAt: new Date().toISOString(),
            });
            console.log("Sanitized order data:", JSON.stringify(orderData, null, 2));
            await addDoc(collection(db, "orders"), orderData);
            alert("Payment successful and order saved!");
            dispatch(clearCart());
            setShowDetailsModal(false);
            props.onHide();
          } catch (err) {
            console.error("Error saving order to Firestore:", err);
            alert("Payment succeeded but order saving failed.");
          } finally {
            setIsPaystackLoading(false);
          }
        })();
      },
      onClose: () => {
        setIsPaystackLoading(false);
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
            <span
              className="checkout--btn"
              onClick={() => setShowDetailsModal(true)}
              style={{ pointerEvents: isPaystackLoading ? "none" : "auto" }}
            >
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
                : firstCurrency;
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
                      Price: <span>{getCurrencySymbol(itemCurrency)}{formatPrice(convertedPrice)}</span>
                    </div>
                    <button
                      className="btn btn-sm log-btn"
                      style={{ marginTop: "10px" }}
                      onClick={() => dispatch(removeCartItem(item.productId))}
                      disabled={isPaystackLoading}
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
                Total: <span style={{ color: "#FE4C50" }}>{symbol}{formatPrice(totalPrice)}</span>
              </h3>
              <button
                className="btn btn-wide log-btn"
                style={{ marginTop: 20 }}
                onClick={() => setShowDetailsModal(true)}
                disabled={isPaystackLoading}
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
        isPaystackLoading={isPaystackLoading}
        setIsPaystackLoading={setIsPaystackLoading}
      />
    </>
  );
};

export default HomeCartView;
