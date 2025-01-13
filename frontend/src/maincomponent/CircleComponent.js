import React, { useState, useRef, useEffect, lazy, Suspense, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import './CircleComponent.css';

import imag1 from '../maincomponent/images/g1.webp';
import imag2 from '../maincomponent/images/g2.webp';
import imag3 from '../maincomponent/images/g3.avif';
import imag4 from '../maincomponent/images/g4.avif';
import imag5 from '../maincomponent/images/g5.webp';
import imag6 from '../maincomponent/images/g6.webp';

// Lazy load images
const imageLoader = (imagePath) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imagePath;
    img.onload = () => resolve(imagePath);
  });
};

// Memoized category button component
const CategoryButton = memo(({ category, index, isActive, isMobile, mousePosition, onMouseEnter, onMouseLeave, onClick }) => (
  <button
    className="category-btn"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onClick}
    style={{
      '--index': index,
      '--mouse-x': `${mousePosition.x}px`,
      '--mouse-y': `${mousePosition.y}px`
    }}
  >
    <div className={`circle-border ${category.isNew ? 'highlight' : 'seen'} ${isActive ? 'active' : ''}`}>
      <div className="circle-inner">
        <div className="circle-content">
          <div className="image-wrapper">
            <img 
              src={category.image} 
              alt={category.name} 
              loading="lazy"
              width="100"
              height="100"
              decoding="async"
            />
            <div className="shimmer"></div>
          </div>
        </div>
      </div>
    </div>
    <span className="category-name">{category.name}</span>
  </button>
));

// Preload images
const preloadImages = async (images) => {
  return Promise.all(images.map(imageLoader));
};

const CircleComponent = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Categories with routes
  const categoriesmobile = [
    { id: 1, name: 'Organza', image: imag1, isNew: true, route: '/organza' },
    { id: 2, name: 'New Arrivals', image: imag2, isNew: true, route: '/new-arrivals' },
    { id: 3, name: 'Best Sellers', image: imag3, isNew: true, route: '/best-sellers' },
  ];

  const categoriesdesktop = [
    { id: 1, name: 'Organza', image: imag1, isNew: true, route: '/organza' },
    { id: 2, name: 'New Arrivals', image: imag2, isNew: true, route: '/new-arrivals' },
    { id: 3, name: 'Best Sellers', image: imag3, isNew: true, route: '/best-sellers' },
    { id: 4, name: 'Dresses', image: imag4, isNew: true, route: '/dresses' },
    { id: 5, name: 'Casual Wears', image: imag5, isNew: true, route: '/casual-wear' },
    { id: 6, name: 'Maternity', image: imag6, isNew: true, route: '/maternity' }
  ];

  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 150);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      requestAnimationFrame(() => {
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      });
    };

    containerRef.current?.addEventListener('mousemove', handleMouseMove);
    return () => containerRef.current?.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  useEffect(() => {
    const images = [...new Set([...categoriesmobile, ...categoriesdesktop].map(cat => cat.image))];
    preloadImages(images).then(() => setImagesLoaded(true));
  }, []);

  const handleCategoryClick = (category) => {
    // First handle the touch/active state
    if (isMobile) {
      setActiveCategory(prev => prev === category.id ? null : category.id);
    }
    
    // Add a small delay for the animation to complete
    setTimeout(() => {
      // Navigate to the category route
      navigate(category.route);
    }, 200);
  };

  const categories = isMobile ? categoriesmobile : categoriesdesktop;

  if (!imagesLoaded) {
    return <div className="loading-placeholder">Loading categories...</div>;
  }

  return (
    <div className="category-container" ref={containerRef}>
      <div className="category-scroll">
        {categories.map((category, index) => (
          <CategoryButton
            key={category.id}
            category={category}
            index={index}
            isActive={activeCategory === category.id}
            isMobile={isMobile}
            mousePosition={mousePosition}
            onMouseEnter={() => !isMobile && setActiveCategory(category.id)}
            onMouseLeave={() => !isMobile && setActiveCategory(null)}
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(CircleComponent);