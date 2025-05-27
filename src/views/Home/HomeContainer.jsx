import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, applyFilters } from "../../redux/slices/productSlice";
import { postCart } from "../../redux/slices/cartSlice";
import useConversionRate from "../../hooks/useConversionRate";
import Home from "./Home";

const HomeContainer = () => {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);
  const { conversionRates, loading: rateLoading, error: rateError } = useConversionRate(); // Use conversionRates directly

  // Fetch products
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
      conversionRates={conversionRates} // Pass conversionRates to Home
      rateLoading={rateLoading} // Pass loading state for conversion rates
      rateError={rateError} // Pass error state for conversion rates
      applyFilters={handleApplyFilters}
      postCart={handlePostCart}
    />
  );
};

export default HomeContainer;