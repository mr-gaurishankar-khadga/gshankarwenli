// Boys.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GradeIcon from '@mui/icons-material/Grade';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import '../ProductGrid.css';
import MensSlider from './MensSlider';

const WomensWearPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://mrrapo.onrender.com/api/products');
        // Filter products based on category "Boys"
        const boysProducts = response.data.products.filter(
          (product) => product.categories.toLowerCase() === 'girls'
        );
        setProducts(boysProducts);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
              <MensSlider/>
      <div className="products" style={{marginTop:'-100px'}}>
        {products.map((product, index) => (
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
                      ? `https://mrrapo.onrender.com/${product.backImage}`
                      : `https://mrrapo.onrender.com/${product.frontImage}`
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

              <div className="rating" style={{ width: '50%', textAlign: 'center', marginLeft: '-15px',justifyContent:'flex-start' }}>
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
        ))}
      </div>
    </div>
  );
};

export default WomensWearPage;
