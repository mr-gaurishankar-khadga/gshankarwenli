// CashFree.jsx
import React, { useState } from 'react';
import axios from 'axios';

const CashFree = () => {
  const [paymentData, setPaymentData] = useState({
    amount: '',
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const initializePayment = (orderDetails) => {
    if (typeof window.Cashfree !== 'undefined') {
      const cashfree = new window.Cashfree({
        mode: 'sandbox'
      });

      const checkoutOptions = {
        paymentSessionId: orderDetails.payment_session_id,
        returnUrl: orderDetails.order_meta.return_url,
        paymentMethods: {
          upi: {
            gpay: true,    // Enable Google Pay
            phonepe: true, // Enable PhonePe
            paytm: true    // Enable Paytm UPI
          },
          wallet: {
            paytm: true    // Enable Paytm Wallet
          },
          card: {
            enabled: true  // Enable Card Payments
          }
        },
        style: {
          backgroundColor: '#ffffff',
          color: '#11385b',
          theme: 'light', // or 'dark'
          // Highlight UPI options
          primaryColor: '#11385b',
          showBackButton: true,
          borderRadius: '5px'
        }
      };

      cashfree.checkout(checkoutOptions)
        .then(function(result) {
          if (result.error) {
            setError(result.error.message);
            return;
          }
          console.log("Payment Result:", result);
          // Handle successful payment
          alert('Payment successful!');
        })
        .catch(function(error) {
          console.error("Payment failed:", error);
          setError('Payment failed. Please try again.');
        });
    } else {
      setError('Payment SDK not loaded. Please refresh the page.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/create-order', paymentData);
      console.log('Order created:', response.data);
      
      if (response.data.payment_session_id) {
        initializePayment(response.data);
      } else {
        setError('Failed to create payment session');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Make Payment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Amount (INR)</label>
          <input
            type="number"
            name="amount"
            value={paymentData.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="customerName"
            value={paymentData.customerName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="customerEmail"
            value={paymentData.customerEmail}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Phone</label>
          <input
            type="tel"
            name="customerPhone"
            value={paymentData.customerPhone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default CashFree;