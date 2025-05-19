import React from "react";
import { useDispatch } from "react-redux";
import { setSelectedProduct } from "../../redux/slices/productSlice";
import SingleProduct from "./SingleProduct";

function MensProducts() {
  const dispatch = useDispatch();

  const addToBag = (id) => {
    console.log(`Added product ${id} to cart`);
  };

  const handleProductClick = (product) => {
    dispatch(setSelectedProduct(product));
  };

  const products = [
    {
      _id: "1",
      title: "Classic Navy Suit",
      price: 15000,
      imagePath: "https://images.unsplash.com/photo-1593032465170-8adf1100b39c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      department: "Men",
      category: "Suits",
      description: "A timeless navy suit perfect for formal occasions.",
      variants: [
        {
          _id: "v1",
          size: "M",
          color: "Navy",
          price: 15000,
          imagePath: "https://images.unsplash.com/photo-1593032465170-8adf1100b39c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
          _id: "v2",
          size: "L",
          color: "Navy",
          price: 15200,
          imagePath: "https://images.unsplash.com/photo-1593032465170-8adf1100b39c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
          _id: "v3",
          size: "M",
          color: "Black",
          price: 15500,
          imagePath: "https://images.unsplash.com/photo-1594938298603-3b7e935c26fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      _id: "2",
      title: "White Cotton Shirt",
      price: 3500,
      imagePath: "https://images.unsplash.com/photo-1603251578711-3a6ea8f0e5d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      department: "Men",
      category: "Shirts",
      description: "A crisp white shirt for a sharp look.",
      variants: [
        {
          _id: "v4",
          size: "S",
          color: "White",
          price: 3500,
          imagePath: "https://images.unsplash.com/photo-1603251578711-3a6ea8f0e5d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
          _id: "v5",
          size: "M",
          color: "White",
          price: 3600,
          imagePath: "https://images.unsplash.com/photo-1603251578711-3a6ea8f0e5d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
          _id: "v6",
          size: "M",
          color: "Blue",
          price: 3700,
          imagePath: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      _id: "3",
      title: "Leather Dress Shoes",
      price: 8000,
      imagePath: "https://images.unsplash.com/photo-1549294413-44f6d0ab4e7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      department: "Men",
      category: "Footwear",
      description: "Polished leather shoes for any occasion.",
      variants: [
        {
          _id: "v7",
          size: "9",
          color: "Black",
          price: 8000,
          imagePath: "https://images.unsplash.com/photo-1549294413-44f6d0ab4e7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
          _id: "v8",
          size: "10",
          color: "Black",
          price: 8200,
          imagePath: "https://images.unsplash.com/photo-1549294413-44f6d0ab4e7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
          _id: "v9",
          size: "9",
          color: "Brown",
          price: 8500,
          imagePath: "https://images.unsplash.com/photo-1512372802706-2c5a445d3f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      _id: "4",
      title: "Slim Fit Chinos",
      price: 5000,
      imagePath: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      department: "Men",
      category: "Pants",
      description: "Versatile chinos for a modern fit.",
      variants: [
        {
          _id: "v10",
          size: "32",
          color: "Khaki",
          price: 5000,
          imagePath: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
          _id: "v11",
          size: "34",
          color: "Khaki",
          price: 5100,
          imagePath: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
          _id: "v12",
          size: "32",
          color: "Navy",
          price: 5200,
          imagePath: "https://images.unsplash.com/photo-1595435282698-7f12c7c32b45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      _id: "5",
      title: "Silk Tie Set",
      price: 2500,
      imagePath: "https://images.unsplash.com/photo-1519235106711-6e91e4ea8a1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      department: "Men",
      category: "Accessories",
      description: "Elegant silk ties to complete your look.",
      variants: [
        {
          _id: "v13",
          size: "One Size",
          color: "Red",
          price: 2500,
          imagePath: "https://images.unsplash.com/photo-1519235106711-6e91e4ea8a1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
          _id: "v14",
          size: "One Size",
          color: "Blue",
          price: 2600,
          imagePath: "https://images.unsplash.com/photo-1551489187-140f97a317eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      _id: "6",
      title: "Denim Jacket",
      price: 6000,
      imagePath: "https://images.unsplash.com/photo-1601333147855-1066d7d3d3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      department: "Men",
      category: "Jackets",
      description: "A rugged denim jacket for casual style.",
      variants: [
        {
          _id: "v15",
          size: "M",
          color: "Blue",
          price: 6000,
          imagePath: "https://images.unsplash.com/photo-1601333147855-1066d7d3d3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
          _id: "v16",
          size: "L",
          color: "Blue",
          price: 6200,
          imagePath: "https://images.unsplash.com/photo-1601333147855-1066d7d3d3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
          _id: "v17",
          size: "M",
          color: "Black",
          price: 6300,
          imagePath: "https://images.unsplash.com/photo-1516824467205-afa656d31a79?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
  ];

  return (
    <div className="mens-products-page">
      <div
        className="products-banner"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1507680432347-45e84e0436c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)`,
        }}
      >
        <div className="products-banner-overlay">
          <h1>Men's Fashion Collection</h1>
          <p>Discover the latest in style and sophistication.</p>
        </div>
      </div>

      <div className="container products-container" data-aos="fade-up">
        <div className="section_title">
          <h2>Shop Men's Products</h2>
        </div>
        <div className="row">
          {products.map((product) => (
            <div
              key={product._id}
              className="col-lg-4 col-md-6 col-sm-12"
              data-aos="fade-up"
              data-aos-delay={products.indexOf(product) * 100}
            >
              <SingleProduct
                productItem={product}
                addToBag={addToBag}
                onProductClick={() => handleProductClick(product)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MensProducts;