import React, { useEffect, useState } from 'react';
import im1 from './images/m2.jpg';

const MensSlider = () => {
  const [zoomIn, setZoomIn] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setZoomIn(true);
    setFadeIn(true);
  }, []);

  return (
    <>
      <div className="mensslider" style={{ width: '100%' }}>
        <div 
          className="frameofslider" 
          style={{ width: '100%', height: '60vh', overflow: 'hidden', position: 'relative' }}
        >
          <img 
            src={im1} 
            alt="Men's Fashion" 
            style={{ 
              height: '100%', 
              width: '100%', 
              objectFit: 'cover', 
              display: 'block', 
              transform: zoomIn ? 'scale(1)' : 'scale(1.4)', 
              transition: 'transform 8s ease-in-out, opacity 8s ease-in-out',
            }} 
          />
        </div>
      </div>
    </>
  );
};

export default MensSlider;
