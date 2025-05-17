import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, applyFilters } from "../../redux/slices/productSlice";
import { postCart } from "../../redux/slices/cartSlice";
import Home from "./Home";

const HomeContainer = () => {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const handleApplyFilters = (filterString) => {
    dispatch(applyFilters(filterString));
  };

  const handlePostCart = (productId) => {
    dispatch(postCart(productId));
  };

  return (
    <Home
      products={products}
      loading={loading}
      applyFilters={handleApplyFilters}
      postCart={handlePostCart}
    />
  );
};

export default HomeContainer;
