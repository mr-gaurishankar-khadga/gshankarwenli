import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GradeIcon from '@mui/icons-material/Grade';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './ProductGrid.css';

const SearchedProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const navigate = useNavigate();
  const location = useLocation();

  const baseURL = 'http://localhost:8000'; 

  // Get the search query from the URL
  const query = new URLSearchParams(location.search).get('query') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/products/search?query=${query}`);
        setProducts(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleClick = (product) => {
    navigate('/CompleteView', { state: { product } });
  };

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  if (loading) {
    return (
      <div className="product-grid">
        <h2>New Arrivals</h2>
        <div className="products">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="product-card" key={index}>
              <div className="skeleton-wave" />
              <div className="skeleton-wave" />
              <div className="skeleton-wave" />
              <div className="skeleton-wave" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p>Error loading products: {error.message}</p>;

  return (
    <div className="product-grid">
      {/* <h2>Search Results for</h2> */}
      <div className="products">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={product._id}
              className="product-card"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(product)}
            >
              
              <div className="image-container">
                <LazyLoad height={250} offset={100}>
                  <img
                    src={
                      hoveredIndex === index && product.backImage
                        ? `${baseURL}/${product.backImage}`
                        : `${baseURL}/${product.frontImage}`
                    }
                    alt={product.title}
                    className={`product-image ${loadedImages.has(index) ? 'fade-in' : 'hidden'}`}
                    onLoad={() => handleImageLoad(index)}
                  />
                </LazyLoad>

                <div className="likeiconbtn">
                  <FavoriteIcon className="like-icon" />
                </div>

                <div className="categories">
                  <span className="category">{product.categories}</span>
                </div>
              </div>

              <div className="product-details">
                <h3 style={{ fontFamily: 'Twentieth Century' }}>{product.title}</h3>

                <div className="price">
                  <span className="current-price" style={{ fontFamily: 'Twentieth Century sans-serif' }}>
                    Rs. {product.price}
                  </span>
                </div>

                <div className="rating" style={{ width: '50%', textAlign: 'center', marginLeft: '-15px', justifyContent: 'flex-start' }}>
                  <span><GradeIcon className="ratingicon" /></span>
                  <span><GradeIcon className="ratingicon" /></span>
                  <span><GradeIcon className="ratingicon" /></span>
                  <span><GradeIcon className="ratingicon" /></span>
                  <span><GradeIcon className="ratingicon" /></span>
                </div>

                <div className="Size-options">
                  <button className="size">S</button>
                  <button className="size">M</button>
                  <button className="size">L</button>
                  <button className="size">XL</button>
                  <ShoppingCartIcon className="cart-icon" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found matching "{query}"</p>
        )}
      </div>
    </div>
  );
};

export default SearchedProduct;
