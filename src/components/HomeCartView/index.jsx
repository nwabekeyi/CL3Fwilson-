import React from "react";
import { Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { removeCartItem } from "../../redux/slices/cartSlice";
import "./style.css";
import EmptyCart from "../../assets/images/emptyCart.png";
import jumpTo from "../../modules/Navigation";

const HomeCartView = (props) => {
  const dispatch = useDispatch();

  const goToCheckout = () => {
    jumpTo("/fashion-cube/cart");
  };

  // Get cart items from Redux store
  const items = useSelector((state) => state.cart.items);

  // Compute total price
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Modal {...props} className="right">
      <Modal.Header closeButton>
        <Modal.Title>Your Cart</Modal.Title>
        {items.length > 0 ? (
          <span className="checkout--btn" onClick={goToCheckout}>
            checkout
          </span>
        ) : null}
      </Modal.Header>

      <Modal.Body className="modal-body-content">
        {items.length === 0 ? (
          <div className="empty--basket">
            <img src={EmptyCart} className="img-fluid" alt="Empty cart" />
            <h4 style={{ textAlign: "center" }}>Empty cart</h4>
          </div>
        ) : (
          items.map((item) => (
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
                  Price: <span>₹{item.price}</span>
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
          ))
        )}

        {items.length > 0 && (
          <div className="total--price-container">
            <h3 style={{ textAlign: "center" }}>
              Total: <span style={{ color: "#FE4C50" }}>₹{totalPrice.toFixed(2)}</span>
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