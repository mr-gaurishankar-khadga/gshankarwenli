import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './ShoppingCartView.css';

const ShoppingCartView = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const navigate = useNavigate(); 

  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(savedCartItems);
    const total = savedCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setCartTotal(total);
  }, []);

  const removeFromCart = (id) => {
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    const total = updatedCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setCartTotal(total);
  };

  const handleBuyNow = (item) => {
    navigate('/Payment', { state: { product: item, quantity: item.quantity } });
  };


  return (
    <div className="cart-container">
      {/* <h2 className="cart-title">Shopping Cart</h2> */}
      {cartItems.length > 0 ? (
        <div className="cart-grid">
          {cartItems.map((item) => (
            <div className="cart-card" key={item.id}>
              <div className="cart-card-image-wrapper">
                <img src={`https://mrrapo.onrender.com/${item.image}`} alt={item.name} className="cart-card-image" />
              </div>
              <div className="cart-card-details">
                <h4 className="cart-card-name">{item.name}</h4>
                <p className="cart-card-info">{item.color} | {item.size}</p>
                <p className="cart-card-quantity">Qty: {item.quantity}</p>
                <p className="cart-card-price">${(item.price * item.quantity).toFixed(2)}</p>
                <button className="cart-card-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                <button className="cart-card-pay" onClick={() => handleBuyNow(item)}>Buy Now</button> 
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="cart-empty">No items in the cart.</p>
      )}
      <div className="cart-subtotal">
        <div className="subtotal-text">
          <h4>Subtotal</h4>
          <p>Shipping and taxes calculated at checkout.</p>
        </div>
        <h2 className="subtotal-amount">${cartTotal.toFixed(2)}</h2>
      </div>
    </div>
  );
};

export default ShoppingCartView;
