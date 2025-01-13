// import React from 'react';
// import './CartItem.css';


// import slider2 from './images/sl1.webp';
// import slider1 from './images/sl2.webp';
// import slider3 from './images/sl3.webp';
// import slider4 from './images/sl4.webp';



// const CartItem = ({ item = {} }) => {
//     const { image, name, color, price, quantity } = item;

//     return (
//         <div className="cart-item">
//             <div className="item-image">
//                 <img src={image || 'default-image-url.jpg'} alt={name || 'Item'} />
//             </div>
//             <div className="item-details">
//                 <h4>{name || 'Item Name'}</h4>
//                 <p>{color || 'Item Color'}</p>
//             </div>
//             <div className="item-quantity">
//                 <select value={quantity} className="quantity-select">
//                     {[...Array(10).keys()].map(x => (
//                         <option key={x + 1} value={x + 1}>
//                             {x + 1}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//             <div className="item-price">${price || '0.00'}</div>
//             <div className="item-remove">
//                 <button className="remove-btn">🗑️</button>
//             </div>
//         </div>
//     );
// };










// const ParentComponent = () => {
//     const cartItems = [
//         {
//             id: 1,
//             name: 'Apple Watch Series 7 - 44mm',
//             image: slider2,
//             color: 'Golden',
//             price: 259.00,
//             quantity: 1
//         },
//         {
//             id: 2,
//             name: 'Beylob 90 Speaker',
//             image: slider2,
//             color: 'Space Gray',
//             price: 99.00,
//             quantity: 1
//         },
//         {
//             id: 3,
//             name: 'Beoplay M5 Bluetooth Speaker',
//             image: slider2,
//             color: 'Silver Collection',
//             price: 129.00,
//             quantity: 1
//         },
//         {
//             id: 4,
//             name: 'Apple Watch Series 7 - 44mm',
//             image: slider2,
//             color: 'Golden',
//             price: 379.00,
//             quantity: 1
//         }
//     ];

//     return (
//         <div className="cart-container">
//             {cartItems.map((item) => (
//                 <CartItem key={item.id} item={item} />
//             ))}
//             <div className="cart-summary">
//                 <div className="summary-item">
//                     <span>Subtotal</span>
//                     <span>$589</span>
//                 </div>
//                 <div className="summary-item">
//                     <span>Tax</span>
//                     <span>$0</span>
//                 </div>
//                 <div className="summary-item">
//                     <span>Shipping</span>
//                     <span>$10</span>
//                 </div>
//                 <div className="summary-total">
//                     <span>Total</span>
//                     <span>$599</span>
//                 </div>
//                 <button className="confirm-payment">Confirm payment</button>
//                 <button className="continue-shopping">Continue Shopping</button>
//             </div>
//         </div>
//     );
// };

// export default ParentComponent;
