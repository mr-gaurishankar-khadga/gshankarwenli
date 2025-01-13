// src/CustomSkeleton.js
import React from 'react';
import './CustomSkeleton.css'; // Create your own CSS for skeleton styles

const CustomSkeleton = () => (
  <div className="custom-skeleton">
    <div className="skeleton-image" />
    <div className="skeleton-text" />
    <div className="skeleton-text" />
  </div>
);

export default CustomSkeleton;
