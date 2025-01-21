import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './Completeview.css';
import './ProductDetail.css';

import FeatureSection from './FeatureSection';
import ShoppingCart from './ShoppingCart';
import { IconButton, Popover, Paper, Button } from '@mui/material';

import { CiGift } from "react-icons/ci";
import ProductGrid from './ProductGrid';
import ReviewComponent from './ReviewComponent';
import CustomerReviews from './CustomerReviews';





const CompleteView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product;

  const [initialLoad, setInitialLoad] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [shopAnchor, setShopAnchor] = useState(null);
  const [showLikeNotification, setShowLikeNotification] = useState(false);

  useEffect(() => {
    if (!product) {
      navigate('/');
    }
  }, [product, navigate]);

  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(savedCartItems);

    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value, 10));
  };

  const handleAddToCart = (event) => {
    if (product) {
      setCartItems((prevItems) => [
        ...prevItems,
        {
          id: product.id,
          name: product.title,
          price: product.price,
          image: product.frontImage,
          color: product.colors[0] || 'Default Color',
          size: product.sizes[0] || 'Default Size',
          quantity: quantity,
        },
      ]);

      // Show notification
      setShowNotification(true);
      setShopAnchor(event.currentTarget);
      setTimeout(() => {
        setShowNotification(false);
        setShopAnchor(null);
      }, 2000);
    }
  };

  const handleLikes = () => {
    if (product) {
      const likedItems = JSON.parse(localStorage.getItem('likedItems')) || [];
      
      // Check if the product is already liked
      const isAlreadyLiked = likedItems.some(item => item.id === product.id);
      if (!isAlreadyLiked) {
        likedItems.push({
          id: product.id,
          name: product.title,
          price: product.price,
          image: product.frontImage,
          color: product.colors[0] || 'Default Color',
          size: product.sizes[0] || 'Default Size',
        });
        localStorage.setItem('likedItems', JSON.stringify(likedItems));

        // Show like notification
        setShowLikeNotification(true);
        setTimeout(() => {
          setShowLikeNotification(false);
        }, 2000);
      }
    }
  };

  const handleBuyNow = () => {
    if (product) {
      navigate('/payment', { state: { product, quantity } });
    }
  };





  return (
    <>
      
      
      <p className='topheadingtitle'> Home / {product.title} </p>
      <div className="complete-view">
        <div className="leftsideview"></div>

        {product ? (
          <>
            <div className="frames">
              {[product.frontImage, product.backImage, product.extraImage1, product.extraImage2].map((src, index) => (
                <div 
                  className="frame" 
                  key={index} 
                  style={{ overflow: 'hidden', position: 'relative' }}
                >
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/${src}`}

                    alt={product.title}
                    className={initialLoad ? 'initial-zoom' : ''}
                  />
                </div>
              ))}
            </div>


            <div className="product-info" style={{ marginTop: '10px'}}>
              <p className='tag'> BOMBAY PAISLEY </p>
              <p className='producttitle'> {product.title} </p>
              <div className="prices-cmp">
                <p className="current-price-cmp">₹.{product.price}  <span className='mrp'> MRP incl.of all taxes </span> </p>
                {/* <span className="discount">Save {product.discount}% right now</span> */}
              </div>
              <hr style={{opacity:'40%'}}/>




              {/* <div className="colors">
                <h4>Colors</h4>
                <div className="color-options">
                  {product.colors && product.colors.length > 0 ? (
                    product.colors.map((color, index) => (
                      <button key={index} className={`color ${color}`} />
                    ))
                  ) : (
                    <p>No colors available</p>
                  )}
                </div>
              </div> */}





              <p className='sizetap' style={{opacity:'70%'}}>Size <span style={{ textDecoration: 'underline',cursor:'pointer' }}> Chart </span></p>
              <div className="Size-optionx">
                <div className="Size-optionsx">
                  {product.sizes.map((size, index) => (
                    <button key={index} className={`sizex ${size}`} style={{padding:'10px 20px',justifyContent:'space-around',marginLeft:''}}>{size}</button>
                  ))}
                </div>



                {/* <div className="selectitem" style={{backgroundColor:'',width:'95%'}}>
                  <select name="quantity" id="quantity" onChange={handleQuantityChange} value={quantity} style={{backgroundColor:''}}>
                    {[1, 2, 3, 4, 5].map((q) => (
                      <option key={q} value={q}>  {q}  </option>
                    ))}
                  </select>
                </div> */}
              </div>





              <div className="action-buttons" style={{maxWidth:'540px',display:'',margin:'',height:''}}>
                <button 
                  className='add-to-cart-btn-cmp'
                    onClick={handleAddToCart} 
                  >
                  Add to Cart
                </button>









                {/* <Button 
                  onClick={handleLikes} 
                  style={{
                    backgroundColor: 'rgb(251, 100, 27)',
                    color: 'white',
                    padding: '10px 20px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderRadius: '5px',
                    transition: 'transform 0.3s ease-in-out',
                    marginRight: '10px',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Like
                </Button> */}



                <Popover
                  className='mypover'
                  open={Boolean(shopAnchor)}
                  onClose={() => setShopAnchor(null)}
                  anchorEl={shopAnchor}
                  anchorOrigin={{ vertical: '', horizontal: 'right' }}
                  transformOrigin={{ vertical: '', horizontal: 'right' }}
                  PaperProps={{
                    style: {
                      color: 'white',
                      backgroundColor: '',
                      overflowY: 'scroll',
                      scrollbarWidth: 'none',
                      transition: 'transform 1m ease-in-out',
                      marginLeft:'640px',
                      marginTop:'200px',
                      marginBottom:'10px'
                    },
                  }}
                >
                  <Paper>
                    <ShoppingCart />
                  </Paper>
                </Popover>




                <button  onClick={handleBuyNow} className='buynow-cmp' > Buy Now </button>


              </div>



              {/* <div className="featuresection" style={{ backgroundColor: '', overflowX: 'auto', maxWidth: '350px', marginLeft: '-25px', marginTop: '20px',padding:'10px'}}>
                <FeatureSection />
              </div> */}



              {/* Product Features */}
              <div className="features" style={{ marginTop: '20px' }}>
                <h4>Features</h4>
                <ul>
                  <li style={{ paddingRight: '20px'}}>{product.description}</li>
                </ul>
              </div>





              <div className="features" style={{ marginTop: '10px' }}>
                <h4> Size & Fit  </h4>
                <ul>
                  <li style={{ paddingRight: '20px'}}>   {product.minitext1}</li>
                </ul>

                <ul>
                  <li style={{ paddingRight: '20px'}}>   {product.minitext2}</li>
                </ul>

                <h4> Wash Care  </h4>
                <ul>
                  <li style={{ paddingRight: '20px'}}>   {product.minitext3}</li>
                </ul>

                <ul>
                  <li style={{ paddingRight: '20px'}}>  {product.minitext4}</li>
                </ul>

                <h4> Specifications  </h4>
                <ul>
                  <li style={{ paddingRight: '20px', letterSpacing: '2px' }}>  {product.minitext5}</li>
                </ul>

                <ul>
                  <li style={{ paddingRight: '20px', letterSpacing: '2px' }}>  {product.minitext6}</li>
                </ul>


                <h4> Notes:   </h4>

              </div>
            </div>
          </>
        ) : (
          <p>Loading product details...</p>
        )}
      </div>

      {showLikeNotification && (
        <div className="notification">
          Product liked successfully!
        </div>
      )}
      <br />



      
      {/* <CustomerReviews/> */}
      <br />
      <br />
      <br />


      {/* <ProductGrid/> */}
    </>
  );
};

export default CompleteView;
