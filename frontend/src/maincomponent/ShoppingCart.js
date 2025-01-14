import React, { useEffect, useState } from 'react';
import './ShoppingCart.css';
import { Link } from 'react-router-dom';
const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

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

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={`https://mrrapo.onrender.com/${item.image}`} alt={item.name} />
            <div className="item-details">
              <h4>{item.name}</h4>
              <p>{item.color} | {item.size}</p>
              <p>Qty {item.quantity}</p>
            </div>
            <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
            <button className="remove-button" onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))
      ) : (
        <p>No items in the cart.</p>
      )}
      <div className="subtotal-section">
        <div>
          <h4>Subtotal</h4>
          <p>Shipping and taxes calculated at checkout.</p>
        </div>
        <h2>${cartTotal.toFixed(2)}</h2>
      </div>

      <div className="cart-buttons">
        <button className="view-cart"><Link to='/ShoppingCartView'> View cart </Link>  </button>
        {/* <button className="checkout"> Check out </button> */}
      </div>

    </div>
  );
};

export default ShoppingCart;
