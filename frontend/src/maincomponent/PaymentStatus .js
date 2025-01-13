import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentStatus = () => {
  const [status, setStatus] = useState('Processing');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('orderId');
    
    if (orderId) {
      verifyPayment(orderId);
    }
  }, [location]);

  const verifyPayment = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payments/verify/${orderId}`);
      const data = await response.json();
      
      if (data.orderStatus === 'PAID') {
        setStatus('Payment Successful');
      } else {
        setStatus('Payment Failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setStatus('Payment Verification Failed');
    }
  };

  return (
    <div className="payment-status">
      <h2>{status}</h2>
      <button onClick={() => navigate('/')}>Return to Home</button>
    </div>
  );
};

export default PaymentStatus;