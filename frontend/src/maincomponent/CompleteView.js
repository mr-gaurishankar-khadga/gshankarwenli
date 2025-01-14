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
                    src={`https://mrrapo.onrender.com/${src}`}
                    alt={product.title}
                    className={initialLoad ? 'initial-zoom' : ''}
                  />
                </div>
              ))}
            </div>



            <div className="product-info" style={{ marginTop: '10px', fontFamily:'ITC Benguiat' }}>
            <h1 style={{ fontFamily: 'ITC Benguiat', color:'#121212' }}> {product.title} </h1>



              <div className="price">
                <span className="current-price">Rs.{product.price}</span>
                <span className="discount" style={{ fontFamily: 'Twentieth Century sans-serif' }}>Save {product.discount}% right now</span>
              </div>





              <div style={styles.giftcontainer}>
                <p style={styles.taxText}>Tax included. <span style={styles.shippingText}>Shipping calculated at checkout.</span></p>
                <div style={styles.offer}>
                  <div style={styles.icon}> <CiGift style={{opacity:''}}/></div>
                  <div>
                    <p style={styles.titleset}>BUY 3 OVERSIZED TEES @1099</p>
                    <p style={styles.descriptionset}>Add 3 tees in cart and checkout offer will be automatically applied</p>
                  </div>
                </div>
                <div style={styles.offer}>
                  <div style={styles.icon}> <CiGift/> </div>
                  <div>
                    <p style={styles.titleset}>BUY 3 SHIRTS AT 499 EACH</p>
                    <p style={styles.descriptionset}>Offer will be applied automatically</p>
                  </div>
                </div>
                <div style={styles.offer}>
                  <div style={styles.icon}><CiGift/></div>
                  <div>
                    <p style={styles.titleset}>FLAT 30% OFF ON BOTTOM WEAR</p>
                    <p style={styles.descriptionset}>Add code: <span style={styles.code}>MONSOON</span></p>
                  </div>
                </div>
              </div>



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





                {/* <h4>Size <span style={{ textDecoration: 'underline',cursor:'pointer' }}> Chart </span></h4> */}
              <div className="Size-optionx" style={{marginLeft:'5px'}}>
                <div className="Size-optionsx">
                  {product.sizes.map((size, index) => (
                    <button key={index} className={`sizex ${size}`}>{size}</button>
                  ))}
                </div>









                <div className="selectitem">
                  <select name="quantity" id="quantity" onChange={handleQuantityChange} value={quantity}>
                    {[1, 2, 3, 4, 5].map((q) => (
                      <option key={q} value={q}>  {q}  </option>
                    ))}
                  </select>
                </div>
              </div>





              <div className="action-buttons" style={{width:'400px',display:'block',margin:'',height:''}}>
                <Button 
                  onClick={handleAddToCart} 
                  style={{
                    backgroundColor: 'rgb(251, 100, 27)',
                    color: 'white',
                    padding: '10px 20px',
                    fontSize: '18px',
                    fontWeight: '',
                    textTransform: 'none',
                    borderRadius: '5px',
                    transition: 'transform 0.3s ease-in-out',
                    marginRight: '10px',
                    width:'350px',
                    background:'rgb(18,18,18)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Add to Cart
                </Button>









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
                    },
                  }}
                >
                  <Paper>
                    <ShoppingCart />
                  </Paper>
                </Popover>




                <Button 
                  onClick={handleBuyNow}
                  style={{
                    backgroundColor: 'rgb(52, 215, 57)',
                    color: 'white',
                    padding: '10px 20px',
                    fontSize: '18px',
                    fontWeight: '',
                    textTransform: 'none',
                    borderRadius: '5px',
                    transition: 'transform 0.3s ease-in-out',
                    width:'350px',
                    marginTop:'10px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Buy Now
                </Button>
              </div>



              {/* <div className="featuresection" style={{ backgroundColor: '', overflowX: 'auto', maxWidth: '350px', marginLeft: '-25px', marginTop: '20px',padding:'10px'}}>
                <FeatureSection />
              </div> */}



              {/* Product Features */}
              <div className="features" style={{ marginTop: '20px' }}>
                <h4 style={{ fontFamily: 'Twentieth Century sans-serif' }}>Features</h4>
                <ul>
                  <li style={{ paddingRight: '20px', letterSpacing: '2px' }}>{product.description}</li>
                </ul>
              </div>





              <div className="features" style={{ marginTop: '10px' }}>
                <h4 style={{ fontFamily: 'Twentieth Century sans-serif' }}> Size & Fit  </h4>
                <ul>
                  <li style={{ paddingRight: '20px', letterSpacing: '2px' }}>   {product.minitext1}</li>
                </ul>

                <ul>
                  <li style={{ paddingRight: '20px', letterSpacing: '2px' }}>   {product.minitext2}</li>
                </ul>

                <h4 style={{ fontFamily: 'Twentieth Century sans-serif' }}> Wash Care  </h4>
                <ul>
                  <li style={{ paddingRight: '20px', letterSpacing: '2px' }}>   {product.minitext3}</li>
                </ul>

                <ul>
                  <li style={{ paddingRight: '20px', letterSpacing: '2px' }}>  {product.minitext4}</li>
                </ul>

                <h4 style={{ fontFamily: 'Twentieth Century sans-serif' }}> Specifications  </h4>
                <ul>
                  <li style={{ paddingRight: '20px', letterSpacing: '2px' }}>  {product.minitext5}</li>
                </ul>

                <ul>
                  <li style={{ paddingRight: '20px', letterSpacing: '2px' }}>  {product.minitext6}</li>
                </ul>


                <h4 style={{ fontFamily: 'Twentieth Century sans-serif' }}> Notes:   </h4>

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



      
      <CustomerReviews/>
      <br />
      <br />
      <br />


      <ProductGrid/>
    </>
  );
};



const styles = {
  giftcontainer: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    color: '#000',
    lineHeight: '24.4px',
  },
  taxText: {
    marginTop:'20px',
    marginBottom: '20px',
    fontSize:'15px',
  },
  shippingText: {
    color: '#555',
    fontFamily:'Assistant (woff2) sans-serif',
    fontSize:'15px'
  },
  offer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  },
  icon: {
    fontSize: '45px',
    marginRight: '10px',
    maxWidth:'50px',
    marginTop:'-10px',
    opacity:'80%'
  },
  titleset: {
    fontWeight: 'bold',
    margin: '0',
    fontSize:'10.8px'
  },
  descriptionset: {
    margin: '0',
    color: '#555',
    marginTop:'-7px',
    fontSize:'9px'
  },
  code: {
    fontWeight: 'bold',
  },
};

export default CompleteView;
