import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const parseAddress = (addressString) => {
    const parts = addressString?.split(',').map(part => part.trim()) || [];
    return {
      building: parts[0] || '',
      area: parts[1] || '',
      city: parts[2] || '',
      state: parts[3] || '',
      pincode: parts[4] || '',
      country: parts[5] || ''
    };
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://gshankarwenli.onrender.com/api/payments');
        const transformedOrders = response.data.map(order => ({
          _id: order._id.$oid || order._id,
          createdAt: order.timestamp?.$date ? new Date(parseInt(order.timestamp.$date.$numberLong)) : new Date(order.timestamp),
          email: order.email,
          name: order.name,
          phone: order.phone,
          products: [{
            name: order.product.title,
            quantity: order.quantity.$numberInt || order.quantity,
            price: order.product.price.$numberInt || order.product.price,
            discount: order.product.discount?.$numberInt || order.product.discount
          }],
          totalAmount: order.price.$numberInt || order.price,
          paymentMethod: order.paymentMethod,
          parsedAddress: parseAddress(order.address),
          paymentStatus: order.paymentStatus || 'pending',
          upiId: `your-merchant-upi@bank` // Replace with your actual UPI ID
        }));
        
        const sortedOrders = transformedOrders.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
        console.error('Error:', err);
      }
    };

    fetchOrders();
  }, []);

  const handlePaymentConfirmation = async (orderId) => {
    try {
      await axios.post(`https://gshankarwenli.onrender.com/api/payments/${orderId}/confirm`);
      
      // Update local state
      const updatedOrders = orders.map(order => {
        if (order._id === orderId) {
          return { ...order, paymentStatus: 'confirmed' };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
      setShowQRModal(false);
    } catch (err) {
      console.error('Error confirming payment:', err);
    }
  };

  const generateQRData = (order) => {
    const qrData = {
      payee: order.upiId,
      amount: order.totalAmount,
      orderId: order._id,
      note: `Payment for order ${order._id}`
    };
    return `upi://pay?pa=${qrData.payee}&pn=YourStoreName&am=${qrData.amount}&tn=${qrData.note}`;
  };

  // QR Code Modal Component
  const QRCodeModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="modal-title">Scan to Pay</h2>
          <div className="modal-body">
            <QRCode value={generateQRData(order)} size={256} />
            <p className="modal-amount">Amount: ₹{order.totalAmount}</p>
            <p className="modal-order-id">Order ID: {order._id}</p>
            <div className="modal-buttons">
              <button
                onClick={() => handlePaymentConfirmation(order._id)}
                className="confirm-button"
              >
                Confirm Payment
              </button>
              <button
                onClick={onClose}
                className="close-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    filterOrdersByDate();
  }, [startDate, endDate, orders]);

  const filterOrdersByDate = () => {
    if (!startDate && !endDate) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date('9999-12-31');
      return orderDate >= start && orderDate <= end;
    });

    setFilteredOrders(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return price - (price * (discount / 100));
  };

  const exportToExcel = () => {
    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Phone Number',
      'Email',
      'Product Name',
      'Quantity',
      'Original Price',
      'Discount',
      'Final Price',
      'Total Amount',
      'Payment Method',
      'Payment Status',
      'Building/Hostel',
      'Area',
      'City',
      'State',
      'Pincode',
      'Country'
    ];

    const csvRows = [headers];

    filteredOrders.forEach(order => {
      order.products.forEach(product => {
        const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
        const row = [
          order._id,
          formatDate(order.createdAt),
          order.name,
          order.phone,
          order.email,
          product.name,
          product.quantity,
          product.price,
          product.discount || '-',
          discountedPrice,
          order.totalAmount,
          order.paymentMethod,
          order.paymentStatus,
          order.parsedAddress.building,
          order.parsedAddress.area,
          order.parsedAddress.city,
          order.parsedAddress.state,
          order.parsedAddress.pincode,
          order.parsedAddress.country
        ];
        csvRows.push(row);
      });
    });

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const today = new Date();
    const filename = `orders_${today.getFullYear()}_${(today.getMonth() + 1).toString().padStart(2, '0')}.csv`;
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="loading-spinner">Loading orders...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="orders-container">
      <h1 className="orders-title">Orders</h1>
      
      <div className="filters-container">
        <div className="date-filters">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
          />
          <span className="date-separator">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
          />
        </div>
        
        <button
          onClick={exportToExcel}
          className="export-button"
        >
          Export to Excel
        </button>
      </div>

      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Original Price</th>
              <th>Discount</th>
              <th>Final Price</th>
              <th>Total Amount</th>
              <th>Payment Method</th>
              <th>Payment Status</th>
              <th>Actions</th>
              <th>Building/Hostel</th>
              <th>Area</th>
              <th>City</th>
              <th>State</th>
              <th>Pincode</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              order.products.map((product, productIndex) => {
                const discountedPrice = calculateDiscountedPrice(
                  product.price,
                  product.discount
                );
                const showOrderDetails = productIndex === 0;
                
                return (
                  <tr key={`${order._id}-${productIndex}`}>
                    {showOrderDetails && (
                      <>
                        <td rowSpan={order.products.length} className="order-id">
                          {order._id}
                        </td>
                        <td rowSpan={order.products.length}>
                          {formatDate(order.createdAt)}
                        </td>
                        <td rowSpan={order.products.length}>
                          {order.name}
                        </td>
                        <td rowSpan={order.products.length}>
                          {order.phone}
                        </td>
                        <td rowSpan={order.products.length}>
                          {order.email}
                        </td>
                      </>
                    )}
                    <td>{product.name}</td>
                    <td className="text-center">{product.quantity}</td>
                    <td className="text-right">₹{product.price}</td>
                    <td className="text-center">
                      {product.discount ? (
                        <span className="discount-badge">{product.discount}%</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="text-right">₹{discountedPrice}</td>
                    {showOrderDetails && (
                      <>
                        <td rowSpan={order.products.length} className="text-right">
                          ₹{order.totalAmount}
                        </td>
                        <td rowSpan={order.products.length}>
                          <span className={`payment-badge ${order.paymentMethod.toLowerCase()}`}>
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td rowSpan={order.products.length}>
                          <span className={`status-badge ${order.paymentStatus.toLowerCase()}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td rowSpan={order.products.length}>
                          {order.paymentMethod === 'COD' && order.paymentStatus !== 'confirmed' && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowQRModal(true);
                              }}
                              className="qr-button"
                            >
                              Show QR
                            </button>
                          )}
                        </td>
                        <td rowSpan={order.products.length}>
                          {order.parsedAddress.building}
                        </td>
                        <td rowSpan={order.products.length}>
                          {order.parsedAddress.area}
                        </td>
                        <td rowSpan={order.products.length}>
                          {order.parsedAddress.city}
                        </td>
                        <td rowSpan={order.products.length}>
                          {order.parsedAddress.state}
                        </td>
                        <td rowSpan={order.products.length}>
                          {order.parsedAddress.pincode}
                        </td>
                        <td rowSpan={order.products.length}>
                          {order.parsedAddress.country}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            ))}
          </tbody>
        </table>
      </div>

      {showQRModal && (
        <QRCodeModal
          order={selectedOrder}
          onClose={() => {
            setShowQRModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default Orders;