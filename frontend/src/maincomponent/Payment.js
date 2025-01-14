import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import QRCode from 'qrcode.react';
import './Payment.css';

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
      const response = await fetch('https://gshankarwenli.onrender.com/api/payments/send-payment-otp', {
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
      const response = await fetch('https://gshankarwenli.onrender.com/api/payments/verify-payment-otp', {
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
      const response = await fetch('https://gshankarwenli.onrender.com/api/payments', {
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

  if (!product) {
    return <p className="no-product">No product selected.</p>;
  }

  return (
    <div className="mainpaymentcontainer" style={{display:'flex',justifyContent:'center'}}>
      <div className="payment-container">
        <div className="payment-view">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="product-image-cell">
                  <img
                    src={`https://gshankarwenli.onrender.com/${product.frontImage}`}
                    alt={product.title}
                    className="product-image-all"
                  />
                </td>
                <td>{product.title}</td>
                <td>Rs.{product.price}</td>
                <td>{quantity}</td>
                <td>Rs.{product.price * quantity}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="payment-method-title">Select Payment Method</h3>
          <div className="payment-methods">
            <div className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}>
              <input
                type="radio"
                id="cod"
                name="payment-method"
                value="COD"
                onChange={handlePaymentMethodChange}
              />
              <label htmlFor="cod" style={{fontSize:'15px'}}>COD</label>
            </div>
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
            <div className={`payment-option ${paymentMethod === 'UPI Payment' ? 'selected' : ''}`}>
              <input
                type="radio"
                id="upi"
                name="payment-method"
                value="UPI Payment"
                onChange={handlePaymentMethodChange}
              />
              <label htmlFor="upi" style={{fontSize:'15px'}}>UPI</label>
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
          )}

          {paymentMethod === 'UPI Payment' && (
            <div className="upi-details">
              <h3 className="upi-details-title">Scan the QR Code</h3>
              <QRCode value="upi://pay?pa=your-vpa@upi&pn=Your Name&am=10.00&cu=INR" style={{margin:'20px'}}/>
            </div>
          )}

          <div className="name-container">
            <label>Name: </label><br />
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter your name"
              className="address-of-user"
              style={{padding:'10px',margin:'10px',letterSpacing:'3px',width:'90%',maxWidth:'100%'}}
              required
            />
            {nameError && <span className="error" style={{color: 'red', fontSize: '12px', display: 'block'}}>{nameError}</span>}
          </div>

          <div className="phone-container">
            <label>Phone: </label>
            <br />
            <input
              type="text"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Enter your phone number"
              className="address-of-user"
              style={{padding:'10px',margin:'10px',letterSpacing:'3px',width:'90%',maxWidth:'100%'}}
              required
            />
            {phoneError && <span className="error" style={{color: 'red', fontSize: '12px', display: 'block'}}>{phoneError}</span>}
          </div>
          

          <label>Address:</label>
          <div className="address-container" style={{display:'flex',height:'auto'}}>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              className="address-of-user"
              style={{padding:'10px',margin:'10px',letterSpacing:'3px',width:'47%',maxWidth:'100%'}}
              required
            />

            <button 
              type="button" 
              className="location-btn" 
              onClick={fetchCurrentLocation}
              style={{padding:'10px',margin:'10px',letterSpacing:'3px',width:'40%'}}
            >
              Current Location
            </button>
          </div>

          <label>Email:</label>
          <div className="email-container">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className="address-of-user"
              style={{padding:'10px',margin:'10px',letterSpacing:'3px',width:'47%',maxWidth:'100%'}}
              required
      
            />
            <button 
              type="button"
              onClick={handleSendOtp}
              disabled={isLoading || !email || emailError}
              style={{
                padding:'10px',
                margin:'10px',
                letterSpacing:'3px',
                width:'40%',
                fontSize:'10px',
                opacity: (isLoading || !email || emailError) ? 0.7 : 1,
                cursor: (isLoading || !email || emailError) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
          {emailError && <span className="error" style={{color: 'red', fontSize: '12px', display: 'block'}}>{emailError}</span>}

          {otpSent && !otpVerified && (
            <>
              <label>Enter OTP:</label>
              <div className="otp-popup" style={{display:'flex',justifyContent:'center'}}>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{padding:'10px',marginLeft:'-10px',letterSpacing:'3px',width:'47%',height:'15px'}}
                  placeholder="Enter OTP"
                />
                <button 
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isLoading || !otp}
                  style={{
                    padding:'10px',
                    margin:'10px',
                    marginLeft:'20px',
                    letterSpacing:'3px',
                    width:'40%',
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
              padding:'10px',
              margin:'10px',
              letterSpacing:'3px',
              width:'87%',
              marginTop:'20px',
              color:'white',
              backgroundColor: (!otpVerified || isLoading) ? 'black' : 'black',
              cursor: (!otpVerified || isLoading) ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Processing...' : 'Submit Payment'}
          </button>

          {showNotification && (
            <div className="notification-popup" style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              padding: '15px',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              backgroundColor:'black',
              color:'white',
              zIndex: 1000
            }}>
              order Conform
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;