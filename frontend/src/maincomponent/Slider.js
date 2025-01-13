import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import './Slider.css'; 
import LazyLoad from 'react-lazyload';

// Import images
import slider1 from './images/m1.webp';
import slider2 from './images/m2.jpg';
import slider3 from './images/m3.jpg';
import slider4 from './images/m4.webp';

import ProductGrid from './ProductGrid';
import CircleComponent from './CircleComponent';

const ZoomImageSlider = () => {
  const [zoomedIndex, setZoomedIndex] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [scale, setScale] = useState(1.3);
  const [opacity, setOpacity] = useState(1);
  const [blur, setBlur] = useState(1);

  useEffect(() => {
    if (initialLoad) {
      requestAnimationFrame(() => {
        setScale(1);
        setOpacity(1);
        setBlur(0);
      });

      const timer = setTimeout(() => {
        setInitialLoad(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [initialLoad]);

  const handleAfterChange = (current) => {
    setZoomedIndex(current);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: autoplay,
    autoplaySpeed: 5000,
    afterChange: handleAfterChange,
    centerMode: true,
    centerPadding: '0',
    arrows: false,
    initialSlide: 0,
    waitForAnimate: false,
    lazyLoad: true,
    pauseOnHover: true,
    cssEase: 'cubic-bezier(0.87, 0.03, 0.41, 0.9)'
  };

  const images = [slider1, slider4, slider1, slider4, slider1, slider4];

  const getSlideStyle = (index) => {
    if (index === 0 && initialLoad) {
      return {
        transform: `scale(${scale})`,
        opacity: opacity,
        filter: `blur(${blur}px)`,
        transition: 'all 7s cubic-bezier(0.4, 0, 0.2, 1)'
      };
    }
    return {};
  };

  return (
    <div className="slider-container">
      <div className="slider-wrapper">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div 
              key={index} 
              className={`zoom-effect ${index === zoomedIndex && !initialLoad ? 'zoomed' : ''}`}
            >
              <LazyLoad height={250} offset={100}>
                <img 
                  src={image} 
                  alt={`slide-${index}`} 
                  className="slider-image"
                  style={getSlideStyle(index)}
                />
              </LazyLoad>
            </div>
          ))}
        </Slider>
      </div>

      <div className="bottmCircle">
        <CircleComponent/>
      </div>

      <div className="main-bottom-container" style={{marginTop:'20px'}}>
        <div className="bottom-content">
          <h1 style={{fontFamily:'Twentieth Century sans-serif'}}>Bold, Stylish & Confident</h1>
          <p>Our collection features a range of stylish and versatile outfits perfect for any casual occasion. From breezy kurtas to comfy palazzos, each piece is crafted with care and attention to detail. We use high-quality fabrics that are breathable and easy to care for, ensuring that you look and feel your best all day long.</p>
        </div>
      </div>

      <ProductGrid/>
    </div>
  );
};

export default ZoomImageSlider;