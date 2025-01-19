import React, { useState } from 'react';
import axios from 'axios';
import { Star, Upload, Send } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ReviewComponent.css';

const ReviewComponent = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [file, setFile] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form only on submit
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }

    if (!review.trim()) {
      toast.error('Please write a review');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('review', review);
    if (file) {
      formData.append('file', file);
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/reviews`, formData);

      
      toast.success('Review submitted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form
      setRating(0);
      setReview('');
      setFile(null);
      setFileName('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error submitting review';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (5MB) and type silently
      if (selectedFile.size > 5 * 1024 * 1024) {
        setFile(null);
        setFileName('');
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
      if (!validTypes.includes(selectedFile.type)) {
        setFile(null);
        setFileName('');
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  return (
    <div className="review-container">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="review-form">
        <h2>Write a Review</h2>
        
        <div className="rating-container">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="star-button"
              disabled={isSubmitting}
            >
              <Star 
                className={`star-icon ${
                  (hoverRating || rating) >= star ? 'star-filled' : 'star-empty'
                }`}
                size={28}
              />
            </button>
          ))}
        </div>

        <div className="textarea-container">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        <div className="file-upload-container">
          <label className="file-upload-label">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/gif,video/mp4"
              className="file-input"
              disabled={isSubmitting}
            />
            <Upload size={20} />
            <span>{fileName || 'Upload Photos || videos'}</span>
          </label>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          <Send size={20} />
          <span>{isSubmitting ? 'Submitting...' : 'Submit Review'}</span>
        </button>
      </form>
    </div>
  );
};

export default ReviewComponent;