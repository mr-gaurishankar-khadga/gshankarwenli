import React from 'react';
import './Popup.css';

const Popup = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2 style={{fontFamily:'Twentieth Century sans-serif'}}>varify OTP</h2>
        <div className="popup-body" style={{fontFamily:'Twentieth Century sans-serif'}}>{children} </div>
        <button className="confirm-payment-btn" onClick={onClose} style={{fontFamily:'Twentieth Century sans-serif'}}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
