import React, { useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
import {Building, MapPin, SendHorizontal} from 'lucide-react'
import './Payment.css';
import './PaymentSelector.css';

import paytm from './images/paytm.svg'
import gpay from './images/gpay.svg'
import phonepay from './images/phonepay.svg'

import { ToastContainer, toast } from 'react-toastify';

const Payment = () => {
  const location = useLocation();
  const { product, quantity } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [address, setAddress] = useState('');

  const [secAddress, setsecAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [building, setBuilding] = useState('');

  const [addressError, setAddressError] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [buildingError, setBuildingError] = useState('');


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


  //navigate to back
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };



  

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





  const validateAddress = (value) => {
    if (value.length < 5) {
      setAddressError('Address must be at least 5 characters long');
    } else {
      setAddressError('');
    }
  };
  
  const validatePincode = (value) => {
    const pincodeRegex = /^\d{6}$/;  
    if (!pincodeRegex.test(value)) {
      setPincodeError('Please enter a valid 6-digit pincode');
    } else {
      setPincodeError('');
    }
  };
  
  const validateBuilding = (value) => {
    if (value.trim() === '') {
      setBuildingError('Building name cannot be empty');
    } else {
      setBuildingError('');
    }
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


  const handlesecAddressChange = (e) => {
  const value = e.target.value;
  setsecAddress(value);
  validateAddress(value);
};

const handlepincodeChange = (e) => {
  const value = e.target.value;
  setPincode(value);
  validatePincode(value);
};

const handlebuildingChange = (e) => {
  const value = e.target.value;
  setBuilding(value);
  validateBuilding(value);
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
      const response = await fetch('https://wenliecommerce.onrender.com/api/payments/send-payment-otp', {

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
      const response = await fetch('https://wenliecommerce.onrender.com/api/payments/verify-payment-otp', {

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




    // if (!address || !email || !name || !phone || !secAddress || !pincode || building) {
    //   alert('Please fill in all required fields.');
    //   return;
    // }

    // if (!validateEmail(email) || !validateName(name) || !validatePhone(phone)) {
    //   alert('Please correct the errors in the form.');
    //   return;
    // }
    
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
      secAddress,
      pincode,
      building,
      cardNumber: paymentMethod === 'Card Payment' ? cardNumber : undefined,
      expiryDate: paymentMethod === 'Card Payment' ? expiryDate : undefined,
      cvv: paymentMethod === 'Card Payment' ? cvv : undefined,
    };

    try {
      const response = await fetch('https://wenliecommerce.onrender.com/api/payments', {

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

    {
      id: 'phonepe',
      name: 'PhonePe',
      logo: (
        <img
          src={phonepay}
          alt="PhonePe"
          width="25"
          height="25"
        />
      )
    },
    {
      id: 'googlepay',
      name: 'GooglePay',
      logo: (
        <img
          src={gpay}
          alt="GooglePay"
          width="25"
          height="25"
        />
      )
    },
    {
      id: 'paytm',
      name: 'Paytm',
      logo: (
        <img
          src={paytm}
          alt="Paytm"
          width="25"
          height="25"
        />
      )
    },
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

    <>
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
              <button className="navigation-back-button" onClick={handleBackClick}>
                <span> ← </span>
              </button>
              <div className="company-logo-text">Back</div>
            </div>
            </header>
            
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
            {/* )} */}
          </div>














          <div className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`} style={{border:'1px solid rgb(18,18,18)', justifyContent:'center', marginLeft:'30px',maxWidth:'100px'}}>
            <input
              type="radio"
              id="cod"
              name="payment-method"
              value="COD"
              checked={paymentMethod === 'COD'}  
              onChange={handlePaymentMethodChange}
              style={{display:'none'}}
            />
            <label htmlFor="cod" style={{fontSize:'15px',textAlign:'center'}}>
              COD
            </label>
          </div>




            

{/* 
        <div className="payment-selector">
          <h3 className="payment-method-title">Select Payment Method</h3>
          <div className="desktop-view">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                className={`payment-option ${selectedMethod === method.id ? 'selected' : ''}`}
                onClick={() => selectMethod(method.id)}
                style={{border: '1px solid #1a1a1a'}}
              >
                <div className="payment-logo">{method.logo}</div>
                <span className="payment-name">{method.name}</span>
              </button>
            ))}
          </div>


          <div className="mobile-view">
            <button className="dropdown-toggle" onClick={toggleDropdown} style={{border: '1px solid #1a1a1a'}}>
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
        </div> */}























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

            







            <div className="input-group" style={{marginTop:'20px'}}>
                <input
                  type="text"
                  id="secAddress"
                  value={secAddress}
                  onChange={handlesecAddressChange}
                  placeholder=" "
                  required
                  style={{width:'95%'}}
                />
                <label htmlFor="secAddress" className="input-label" style={{marginTop:'1px'}}>Second Address</label>
              </div>

              <div className="form-container">
                <div className="input-group">
                  <input
                    type="text"
                    id="pincode"
                    value={pincode}
                    onChange={handlepincodeChange}
                    placeholder=" "
                    required
                    style={{width:'95%'}}
                  />
                  <label htmlFor="pincode" className="input-label" style={{marginTop:'1px'}}>Pincode</label>
                </div>
              </div>

              <div className="form-container">
                <div className="input-group">
                  <input
                    type="text"
                    id="building"
                    value={building}
                    onChange={handlebuildingChange}
                    placeholder=" "
                    required
                    style={{width:'95%'}}
                    
                  />
                  <label htmlFor="building" className="input-label" style={{marginTop:'1px'}}>Building</label>
                </div>
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
                  style={{width:'95%',paddingLeft:'20px'}}
                 
                />
                <label htmlFor="email" className="input-label" style={{paddingLeft:'20px'}}>Email Address</label>
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
              <div className="otp-popup" style={{display:'flex',justifyContent:'center',width:'100%'}}>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  style={{maxWidth:'70%'}}
                />
                <button 
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isLoading || !otp}
                  style={{
                    maxWidth:'30%',
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
              backgroundColor: '#1a1a1a',
              cursor: (!otpVerified || isLoading) ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Processing...' : 'Submit Order'}
          </button>

          <ToastContainer />

          

        </div>
      </div>
    </div>
    </>
  );
};

export default Payment;