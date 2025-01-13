



import React, { useState, useEffect } from 'react';
import './TextSlider.css'; 




const TextSlider = () => {
  const texts = [
    "Our collection ", 
    "When a slide ",
    "This setup makes", 
    "Each of the four"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + texts.length) % texts.length);
  };

  useEffect(() => {
    const interval = setInterval(goToNextSlide, 4000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-slider">
      <div className="slide-container">
        {texts.map((text, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            style={{ fontFamily: 'Twentieth Century sans-serif' }}
          >
            {text}
          </div>
        ))}
      </div>
      <button className="left-arrow" onClick={goToPrevSlide}>&#10094;</button>
      <button className="right-arrow" onClick={goToNextSlide}>&#10095;</button>
    </div>
  );
};

export default TextSlider;
