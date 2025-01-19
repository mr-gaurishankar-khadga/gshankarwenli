import React, { useState } from 'react';
import './PaymentSelector.css';

const PaymentSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('visa');

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      logo: (
        <svg viewBox="0 0 24 24" width="25" height="25">
          <path fill="#00a86b" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
        </svg>
      )
    },


    {
      id: 'visa',
      name: 'VISA',
      logo: (
        <svg viewBox="0 0 1000 324" width="40" height="25">
          <path fill="#1434CB" d="M651.19,0.39h-99.54c-18.56,0-32.45,5.13-40.65,23.89L408.4,321.05h99.54c0,0,11.95-31.45,14.64-38.34c8,0,79.14,0.11,89.33,0.11c2.07,8.89,8.48,38.23,8.48,38.23h87.97L651.19,0.39z M541.79,214.33c5.77-14.76,27.77-71.68,27.77-71.68c-0.41,0.67,5.72-14.83,9.23-24.44l4.7,21.93c0,0,13.31,61.17,16.12,74.19H541.79z"/>
          <path fill="#1434CB" d="M895.22,0.39h-76.42c-17.43,0-27.33,9.48-34.09,20.13L656.64,321.05h99.54l18.12-49.86h111.04l10.46,49.86h87.97L895.22,0.39z M798.04,204.76c7.16-18.27,34.56-88.19,34.56-88.19c-0.48,0.79,7.12-18.31,11.48-30.25l5.85,27.22c0,0,16.55,75.77,20.04,91.22H798.04z"/>
          <path fill="#1434CB" d="M285.2,0.39L190.06,219.52l-10.15-50.87c-17.72-57.04-72.98-118.72-134.87-149.6l87.03,301.61l102.93-0.41L377.23,0.39H285.2z"/>
          <path fill="#F7B600" d="M131.52,0.39H0.46l-0.84,4.93c101.56,24.55,168.86,83.93,196.67,155.33L168.27,23.71C163.1,4.33,148.56,0.81,131.52,0.39z"/>
        </svg>
      )
    },
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
      name: 'Google Pay',
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

  return (
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
  );
};

export default PaymentSelector;