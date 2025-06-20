
 import React, { Component } from "react";
 import Heading from "../../components/Heading";
 import CartItem from "./CartItem";
 import { Button } from "react-bootstrap";
 import CalculateTax from "../../utils/CalculateTax";
 import EmptyCart from "../../assets/images/empty_cart.png";
 
 class Cart extends Component {
   constructor(props) {
     super(props);
     this.state = {};
   }
 
   formatPrice = (amount) => {
     if (typeof amount !== "number") return amount;
     return amount.toLocaleString(undefined, {
       minimumFractionDigits: 2,
       maximumFractionDigits: 2,
     });
   };
 
   render() {
     const { totalPrice, items } = this.props.cart;
     const { postCart } = this.props;
 
     return (
       <div className="shopping--cart" data-aos="fade-up">
         <div className="container">
           <div className="shopping--cart--container">
             <div className="row ">
               <Heading title="Your Shopping Cart" data-aos="fade-up" />
             </div>
             <div style={{ height: 30 }}></div>
             <CartItem
               items={items || {}}
               handleClick={(pid, increase, decrease) =>
                 postCart(pid, increase, decrease)
               }
             />
             {items !== undefined && items !== null && Object.keys(items).length > 0 ? (
               <div
                 className="d-flex flex-column justify-content-end align-items-end"
                 style={{ paddingRight: 50 }}
               >
                 <p>
                   SubTotal:{" "}
                   <span style={{ color: "#FE4C50" }}>
                     ₹{this.formatPrice(totalPrice)}
                   </span>
                 </p>
                 <p>
                   Shipping: <span style={{ color: "#FE4C50" }}>Free</span>
                 </p>
 
                 <p>
                   Taxes:{" "}
                   <span style={{ color: "#FE4C50" }}>
                     ₹{this.formatPrice(CalculateTax(totalPrice).taxes)}
                   </span>
                 </p>
 
                 <h3 style={{ textAlign: "center" }}>
                   Total:{" "}
                   <span style={{ color: "#FE4C50" }}>
                     ₹{this.formatPrice(CalculateTax(totalPrice).total)}
                   </span>
                 </h3>
                 <hr />
 
                 <Button variant="danger" size="sm" style={{ marginTop: 30 }}>
                   Confirm Checkout
                 </Button>
               </div>
             ) : (
               <div style={{ textAlign: "center" }}>
                 <img
                   src={EmptyCart}
                   alt="Empty Cart"
                   style={{ maxHeight: 400, maxWidth: 400 }}
                   className="img-fluid"
                 />
               </div>
             )}
           </div>
         </div>
       </div>
     );
   }
 }
 
 export default Cart;
 