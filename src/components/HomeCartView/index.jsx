import React from "react";
import { Modal } from "react-bootstrap";
import "./style.css";
import Auth from "../../modules/Auth";
import EmptyCart from "../../assets/images/emptyCart.png";
import jumpTo from "../../modules/Navigation";

const HomeCartView = (props) => {
  const goToCheckout = () => {
    jumpTo("/fashion-cube/cart");
  };

  const { items, totalPrice } = props.cart || {};

  return (
    <Modal {...props} className="right">
      <Modal.Header closeButton>
        <Modal.Title>Your Cart</Modal.Title>
        {items ? (
          <span className="checkout--btn" onClick={goToCheckout}>
            checkout
          </span>
        ) : null}
      </Modal.Header>

      <Modal.Body className="modal-body-content">
        {Auth.getUserDetails() && Auth.getToken() ? (
          <div>
            {!items ? (
              <div className="empty--basket">
                <img src={EmptyCart} className="img-fluid" alt="Empty cart" />
                <h4 style={{ textAlign: "center" }}>Empty cart</h4>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="empty--basket">
            <h4>Please login to view cart</h4>
            <img src={EmptyCart} className="img-fluid" alt="Please login" />
          </div>
        )}

        {items &&
          Object.keys(items).map((id) => (
            <div key={id} className="basket--item">
              <div className="basket--item--img">
                <img src={items[id].item.imagePath} alt="" />
              </div>
              <div className="basket--item--details">
                <div className="basket--item--title">
                  {items[id].item.title}
                </div>
                <div className="basket--item--quantity">
                  Quantity: <span>{items[id].qty}</span>
                </div>
                <div className="basket--item--price">
                  Price: <span>₹{items[id].price}</span>
                </div>
              </div>
            </div>
          ))}

        {items && (
          <div className="total--price-container">
            <h3 style={{ textAlign: "center" }}>
              Total: <span style={{ color: "#FE4C50" }}>₹{totalPrice}</span>
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
