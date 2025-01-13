import React, { useState } from "react";
import "./Signup.css";
import Popup from "./Popup";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstname] = useState('');
  const [lastName, setLastname] = useState('');
  const [phoneNumber, setNumber] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [otp, setOtp] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/signup', {
        email,
        firstName,
        lastName,
        password,
        phoneNumber,
        addressLine,
        city,
        state,
      });
      setSuccess(response.data.message);
      setIsPopupOpen(true);
    } catch (error) {
      alert('Signup failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/verify-otp', { email, otp });
      alert(response.data.message);

      // Store token if your backend sends one after OTP verification
      const { token } = response.data;
      localStorage.setItem('token', token);

      // Navigate to the Profile page on successful OTP verification
      navigate('/Profile');
    } catch (error) {
      alert('OTP verification failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="form-section">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3 className="shippinginfo" style={{fontFamily:'Twentieth Century sans-serif'}}>Shipping Info</h3>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
          <div className="name-fields">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstname(e.target.value)}
              required
              className="form-input half-width"
              style={{ marginRight: '10px' }}
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastname(e.target.value)}
              required
              className="form-input half-width"
            />
          </div>
          <input
            type="text"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setNumber(e.target.value)}
            required
            className="form-input"
          />
          <input
            type="text"
            placeholder="Enter Your Address"
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            required
            className="form-input"
          />
          <div className="location-fields">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="form-input half-width"
              style={{ marginRight: '10px' }}
            />
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              className="form-input half-width"
            />
          </div>
          <button type="submit" className="confirm-payment-btn" disabled={loading} style={{fontFamily:'Twentieth Century sans-serif'}}>
            {loading ? 'Signing Up...' : 'Signup'}
          </button>
        </form>
      </div>

<Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
  <form onSubmit={handleOtpSubmit}>
    <input
      type="text"
      placeholder="Enter your OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      required
      className="form-input"
      style={{paddingRight:'10px'}}
    />
    <button type="submit" className="confirm-payment-btn" disabled={loading}>
      {loading ? 'Verifying...' : 'Verify OTP'}
    </button>
  </form>
</Popup>

    </div>
  );
};

export default Signup;
