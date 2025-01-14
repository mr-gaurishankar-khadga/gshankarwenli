import React, { useEffect, useState } from 'react';
import '../maincomponent/ShoppingCartView.css';
import { useNavigate } from 'react-router-dom';
const Likes = () => {
  const [likedItems, setLikedItems] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem('likedItems')) || [];
    setLikedItems(storedLikes);
  }, []);

  const handleRemoveLike = (id) => {
    const updatedLikes = likedItems.filter(item => item.id !== id);
    setLikedItems(updatedLikes);
    localStorage.setItem('likedItems', JSON.stringify(updatedLikes));
  };

  const handleBuyNow = (item) => {
    navigate('/Payment', { state: { product: item, quantity: item.quantity } });
  };
  
  return (
    <div className="cart-container">
      {likedItems.length > 0 ? (
        <div className="cart-grid">
          {likedItems.map((item) => (
            <div className="cart-card" key={item.id}>
              <div className="cart-card-image-wrapper">
                <img src={`https://mrrapo.onrender.com/${item.image}`} alt={item.name} className="cart-card-image" />
              </div>
              <div className="cart-card-details">
                <h4 className="cart-card-name">{item.name}</h4>
                <p className="cart-card-info">{item.color} | {item.size}</p>
                <p className="cart-card-quantity">Qty: {item.quantity}</p>
                <p className="cart-card-price">${(item.price * item.quantity).toFixed(2)}</p>
                <button className="cart-card-remove" onClick={() => handleRemoveLike(item.id)}>Remove</button>
                <button className="cart-card-pay" onClick={() => handleBuyNow(item)}>Buy Now</button> 
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="cart-empty">No Likes Item</p>
      )}
    </div>
  );
};

export default Likes;
