import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import QRCode from 'qrcode.react';
import {MapPin, SendHorizontal} from 'lucide-react'
import './Payment.css';
import './PaymentSelector.css';

import { ToastContainer, toast } from 'react-toastify';

const Payment = () => {
  const location = useLocation();
  const { product, quantity } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [userLocation, setUserLocation] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);



  

  // Card formatting handlers
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const formatCardNumber = (value) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = numericValue.replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    setCardNumber(formattedValue);
  };

  const formatExpiryDate = (value) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = numericValue.replace(/(\d{2})(\d{0,2})/, '$1/$2').slice(0, 5);
    setExpiryDate(formattedValue);
  };

  const formatCvv = (value) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 3);
    setCvv(numericValue);
  };

  // Name validation
  const validateName = (value) => {
    if (value.trim().length < 2) {
      setNameError('Name must be at least 2 characters long');
      return false;
    }
    if (!/^[a-zA-Z\s]*$/.test(value)) {
      setNameError('Name should only contain letters and spaces');
      return false;
    }
    setNameError('');
    return true;
  };

  // Phone validation
  const validatePhone = (value) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(value)) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  // Email validation
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      setEmailError('');
      return true;
    } else {
      setEmailError('Invalid email address');
      return false;
    }
  };

  // Card number validation
  const validateCardNumber = (value) => {
    const numericValue = value.replace(/\D/g, '');
    const isValid = (num) => {
      let sum = 0;
      let alternate = false;
      for (let i = num.length - 1; i >= 0; i--) {
        let n = parseInt(num.charAt(i), 10);
        if (alternate) {
          n *= 2;
          if (n > 9) n -= 9;
        }
        sum += n;
        alternate = !alternate;
      }
      return sum % 10 === 0;
    };
    return numericValue.length === 16 && isValid(numericValue);
  };

  // Handle input changes
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    validateName(value);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
    validatePhone(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  // Location handlers
  const fetchHumanReadableAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      if (!response.ok) throw new Error('Failed to fetch address');
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Unable to fetch address.';
    }
  };

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const address = await fetchHumanReadableAddress(latitude, longitude);
          setAddress(address);
          setUserLocation(`Lat: ${latitude}, Long: ${longitude}`);
        },
        (error) => {
          console.error('Error fetching location:', error);
          alert('Unable to fetch location. Please enter your address manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // OTP handlers
  const handleSendOtp = async () => {
    if (!validateEmail(email)) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/payments/send-payment-otp`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setOtpSent(true);
        alert('OTP sent to your email address.');
      } else {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };





  const handleVerifyOtp = async () => {
    if (!otp) {
      alert('Please enter OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/payments/verify-payment-otp`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setOtpVerified(true);
        alert('OTP verified successfully!');
      } else {
        throw new Error(data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert(error.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Payment submission handler
  const handlePaymentSubmission = async () => {

    if (isLoading) return;

    try {
      setIsLoading(true);
      // Show success toast
      toast.success('Order Confirmed!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      
    } catch (error) {
      // Show error toast
      toast.error('Payment failed. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }




    if (!address || !email || !name || !phone) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!validateEmail(email) || !validateName(name) || !validatePhone(phone)) {
      alert('Please correct the errors in the form.');
      return;
    }
    
    if (!otpVerified) {
      alert('Please verify your email OTP before proceeding with payment.');
      return;
    }

    const totalPrice = product.price * quantity;
    const paymentData = {
      product,
      quantity,
      paymentMethod,
      price: totalPrice,
      address,
      email,
      name,
      phone,
      cardNumber: paymentMethod === 'Card Payment' ? cardNumber : undefined,
      expiryDate: paymentMethod === 'Card Payment' ? expiryDate : undefined,
      cvv: paymentMethod === 'Card Payment' ? cvv : undefined,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/payments`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 4000);
      } else {
        throw new Error('Failed to process payment');
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('Payment failed. Please try again.');
    }
  };





  //paymment method from here ok
  const [isOpen, setIsOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('visa');
    const paymentMethods = [
    {
      id: 'cod',
      name: 'COD',
      logo: (
        <svg viewBox="0 0 24 24" width="25" height="25">
          <path fill="#00a86b" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
        </svg>
      )
    },
    // {
    //   id: 'visa',
    //   name: 'VISA',
    //   logo: (
    //     <svg viewBox="0 0 1000 324" width="40" height="25">
    //       <path fill="#1434CB" d="M651.19,0.39h-99.54c-18.56,0-32.45,5.13-40.65,23.89L408.4,321.05h99.54c0,0,11.95-31.45,14.64-38.34c8,0,79.14,0.11,89.33,0.11c2.07,8.89,8.48,38.23,8.48,38.23h87.97L651.19,0.39z M541.79,214.33c5.77-14.76,27.77-71.68,27.77-71.68c-0.41,0.67,5.72-14.83,9.23-24.44l4.7,21.93c0,0,13.31,61.17,16.12,74.19H541.79z"/>
    //       <path fill="#1434CB" d="M895.22,0.39h-76.42c-17.43,0-27.33,9.48-34.09,20.13L656.64,321.05h99.54l18.12-49.86h111.04l10.46,49.86h87.97L895.22,0.39z M798.04,204.76c7.16-18.27,34.56-88.19,34.56-88.19c-0.48,0.79,7.12-18.31,11.48-30.25l5.85,27.22c0,0,16.55,75.77,20.04,91.22H798.04z"/>
    //       <path fill="#1434CB" d="M285.2,0.39L190.06,219.52l-10.15-50.87c-17.72-57.04-72.98-118.72-134.87-149.6l87.03,301.61l102.93-0.41L377.23,0.39H285.2z"/>
    //       <path fill="#F7B600" d="M131.52,0.39H0.46l-0.84,4.93c101.56,24.55,168.86,83.93,196.67,155.33L168.27,23.71C163.1,4.33,148.56,0.81,131.52,0.39z"/>
    //     </svg>
    //   )
    // },
    {
      id: 'phonepe',
      name: 'PhonePe',
      logo: (
        <svg viewBox="0 0 24 24" width="25" height="25">
          <path fill="#5F259F" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
          <path fill="#5F259F" d="M8.5 7v10l8.5-5z"/>
        </svg>
      )
    },
    {
      id: 'googlepay',
      name: 'GooglePay',
      logo: (
        <svg viewBox="0 0 24 24" width="25" height="25">
          <path fill="#4285F4" d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm.14 19.018c-3.868 0-7-3.14-7-7.018c0-3.878 3.132-7.018 7-7.018c1.89 0 3.47.697 4.682 1.829l-1.974 1.978v-.004c-.735-.702-1.667-1.062-2.708-1.062c-2.31 0-4.187 1.956-4.187 4.273c0 2.315 1.877 4.277 4.187 4.277c2.096 0 3.522-1.202 3.816-2.852H12.14v-2.737h6.585c.088.47.135.96.135 1.474c0 4.01-2.677 6.86-6.72 6.86z"/>
        </svg>
      )
    },
    {
      id: 'paytm',
      name: 'Paytm',
      logo: (
        <svg viewBox="0 0 24 24" width="25" height="25">
          <path fill="#00BAF2" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1.5 16.5h-3v-9h3v9zm4.5-6h-3v6h3v-6z"/>
        </svg>
      )
    }
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectMethod = (methodId) => {
    setSelectedMethod(methodId);
    setIsOpen(false);
  };




  if (!product) {
    return <p className="no-product">No product selected.</p>;
  }

  return (
    <div className="mainpaymentcontainer" style={{display:'flex',justifyContent:'center'}}>
      <div className="payment-container">
        <div className="payment-view">
          
          
          
          
          {/* Component JSX */}
          <div className="checkout-content-container">
            <div className="promotional-discount-banner">
              <span className="promotional-discount-message">
                5% off on All order above Rs.800
              </span>
            </div>

            <header className="checkout-page-header">
              <div className="navigation-section-container">
                <button className="navigation-back-button">
                  <span> ← </span>
                </button>
                <div className="company-logo-text">WENLI</div>
              </div>
              
              <div 
                className="order-total-summary-section"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <div className="order-total-content-wrapper">
                  <span className="order-total-label-text">Order total</span>
                  <span className="order-total-amount-text">₹{product.price * quantity}</span>
                </div>
                <span className={`expandable-toggle-icon ${isExpanded ? 'expandable-toggle-icon-rotated' : ''}`}>
                  ▼
                </span>
              </div>
            </header>

            {isExpanded && (
              <div className="expanded-details-container">
                <div className="product-items-list-section">
                  <div className="product-item-card-container">
                    <div className="product-image-wrapper-container">
                      <img 
                        src={`${process.env.REACT_APP_BACKEND_URL}/${product.frontImage}`}

                        alt={product.title} 
                        className="product-image-element"
                      />
                    </div>
                    <div className="product-information-container">
                      <h3 className="product-title-heading">{product.title}</h3>
                      <p className="product-variant-description">{product.size}</p>
                    </div>
                    <div className="product-price-amount">₹{product.price}</div>
                  </div>
                </div>

                <div className="order-summary-breakdown-section">
                  <div className="order-summary-row-container">
                    <span>Subtotal</span>
                    <span className="order-amount-text">₹{product.price * quantity}</span>
                  </div>
                  
                  <div className="order-summary-row-container">
                    <span>Shipping</span>
                    <span className="shipping-calculation-status">Calculated at next step</span>
                  </div>
                  <div className="order-summary-row-container order-summary-row-total">
                    <span>Total</span>
                    <span className="order-amount-text">₹{product.price * quantity}</span>
                  </div>
                </div>
              </div>
            )}
          </div>






            {/* <div className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`} style={{border:'1px solid rgb(0,168,107)'}}>
              <input
                type="radio"
                id="cod"
                name="payment-method"
                value="COD"
                onChange={handlePaymentMethodChange}
              />
              <label htmlFor="cod" style={{fontSize:'15px',}}>COD</label>
            </div> */}
          

          {/* <h3 className="payment-method-title" style={{fontSize:'',color:'rgb(0,168,107)'}}>Select Payment Method</h3>
          <div className="payment-methods">
            <div className={`payment-option ${paymentMethod === 'Card Payment' ? 'selected' : ''}`}>
              <input
                type="radio"
                id="card"
                name="payment-method"
                value="Card Payment"
                onChange={handlePaymentMethodChange}
              />
              <label htmlFor="card" style={{fontSize:'15px'}}>Card</label>
            </div>
          </div>

          {paymentMethod === 'Card Payment' && (
            <div className="card-details">
              <h3 className="card-details-title">Enter Card Details</h3>
              <div className="card-details-row">
                <label>Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => formatCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                />
                {!validateCardNumber(cardNumber) && cardNumber && (
                  <span className="error">Invalid card number</span>
                )}
              </div>
              <div className="card-details-row">
                <label>Expiry Date</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => formatExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                />
              </div>
              <div className="card-details-row">
                <label>CVV</label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => formatCvv(e.target.value)}
                  placeholder="123"
                />
              </div>
            </div>
          )} */}











    <div className="payment-selector">
      <h3 className="payment-method-title" style={{color:'rgb(0,168,107)'}}>Select Payment Method</h3>
      
      {/* Desktop View */}
      <div className="desktop-view">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            className={`payment-option ${selectedMethod === method.id ? 'selected' : ''}`}
            onClick={() => selectMethod(method.id)}
            style={{border: '1px solid rgb(0,168,107)'}}
          >
            <div className="payment-logo">{method.logo}</div>
            <span className="payment-name">{method.name}</span>
          </button>
        ))}
      </div>

      {/* Mobile View */}
      <div className="mobile-view">
        <button className="dropdown-toggle" onClick={toggleDropdown} style={{border: '1px solid rgb(0,168,107)'}}>
          {paymentMethods.find(m => m.id === selectedMethod)?.logo}
          <span>{paymentMethods.find(m => m.id === selectedMethod)?.name}</span>
          <svg className={`arrow ${isOpen ? 'open' : ''}`} viewBox="0 0 24 24" width="24" height="24">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="dropdown-menu">
            
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                className={`dropdown-item ${selectedMethod === method.id ? 'selected' : ''}`}
                onClick={() => selectMethod(method.id)}
              >
                <div className="payment-logo">{method.logo}</div>
                <span className="payment-name">{method.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>























        {/* //another componet of this form  */}
        <div className="form-container">
          <div className="input-group">
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              className={`form-input ${nameError ? 'input-error' : name ? 'input-success' : ''}`}
              placeholder=" "
              required
            />
            <label htmlFor="name" className="input-label" >Full Name</label>
            {nameError && <span className="error-text">{nameError}</span>}
          </div>

          <div className="input-group">
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              className={`form-input ${phoneError ? 'input-error' : phone ? 'input-success' : ''}`}
              placeholder=" "
              required
            />
            <label htmlFor="phone" className="input-label">Phone Number</label>
            {phoneError && <span className="error-text">{phoneError}</span>}
          </div>

          <div className="input-group">
            <div className="address-group">
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-input"
                placeholder=" "
                required
              />
              <label htmlFor="address" className="input-label">Address</label>
              <button 
                type="button" 
                className="location-btn"
                onClick={fetchCurrentLocation}
                aria-label="Get current location"
              >
                <MapPin />
              </button>
            </div>
          </div>





          <div className="input-group">
            <div className="email-group">
              <div className='emailwithotp' style={{ width: '', position: 'relative' }}>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`form-input ${emailError ? 'input-error' : email ? 'input-success' : ''}`}
                  placeholder=" "
                  required
                  style={{width:''}}
                />
                <label htmlFor="email" className="input-label">Email Address</label>
              </div>
              <button 
                type="button"
                className={`otp-button ${isLoading ? 'loading-state' : ''}`}
                onClick={handleSendOtp}
                disabled={isLoading || !email || emailError}
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
            {emailError && <span className="error-text">{emailError}</span>}
          </div>
        </div>













        {/* from here final stage of order conferm state */}
          {otpSent && !otpVerified && (
            <>
              <label>Enter OTP:</label>
              <div className="otp-popup" style={{display:'flex',justifyContent:'center'}}>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                />
                <button 
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isLoading || !otp}
                  style={{
                    opacity: (isLoading || !otp) ? 0.7 : 1,
                    cursor: (isLoading || !otp) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </>
          )}

          {otpVerified && (
            <div style={{color: 'green', textAlign: 'center', margin: '10px'}}>
              Email verified successfully! ✓
            </div>
          )}

          <button 
            className="submit-payment-btn"
            onClick={handlePaymentSubmission}
            disabled={!otpVerified || isLoading}
            style={{
              backgroundColor: 'rgb(0,168,107)',
              cursor: (!otpVerified || isLoading) ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Processing...' : 'Submit Order'}
          </button>

          <ToastContainer />

          

        </div>
      </div>
    </div>
  );
};

export default Payment;