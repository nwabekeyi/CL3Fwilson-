import { connect } from "react-redux";
import SingleProduct from "./SingleProduct";
import { postCart } from "../../redux/slices/cartSlice";

const mapStoreToProps = (state) => ({
  product: state.product.selectedProduct,
});

const mapDispatchToProps = {
  postCart,
};

export default connect(mapStoreToProps, mapDispatchToProps)(SingleProduct);