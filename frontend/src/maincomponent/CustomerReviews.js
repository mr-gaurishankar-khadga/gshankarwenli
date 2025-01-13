import React, { useState } from 'react';
import './CustomerReviews.css';
import ReviewComponent from './ReviewComponent';



const CustomerReviews = () => {
  const [showReviewComponent, setShowReviewComponent] = useState(false);

  const handleWriteReviewClick = () => {
    setShowReviewComponent(true);
  };

  return (
    <>
    <div className="customer-reviews" style={{marginTop: "50px"}}>
      
      <h2 className="customer-reviews-heading">Customer Reviews</h2>
      <div className="customer-reviews-content">
        <div className="rating-section">
          <div className="stars">
            {[...Array(5)].map((_, index) => (
              <span key={index} className="star">&#9734;</span> 
            ))}
          </div>
          <p className="review-prompt">Be the first to write a review</p>
        </div>
            
            {!showReviewComponent && (
        
          <button className="cancel-button" onClick={handleWriteReviewClick}>
            Write review
          </button>
        )}
      </div>
      {showReviewComponent && <ReviewComponent />}
    </div>

    
        </>
  );
};

export default CustomerReviews;
