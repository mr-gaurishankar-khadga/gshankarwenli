import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import axios from 'axios';
import './MyProducts.css';  



const MyProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    categories: '',
    description: '',
    price: '',
    sizes: '',
    colors: '',
    quantity: '',
    discount: '',
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products');
        setProducts(response.data.products);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };



  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      categories: Array.isArray(product.categories) ? product.categories.join(', ') : product.categories,
      description: product.description,
      price: product.price,
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes,
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : product.colors,
      quantity: product.quantity,
      discount: product.discount,
    });
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false); 
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProduct = async () => {
    try {
      const updatedProduct = {
        ...formData,
        sizes: formData.sizes.split(',').map(size => size.trim()),
        colors: formData.colors.split(',').map(color => color.trim()),
      };
      await axios.put(
        `http://localhost:8000/api/products/${editingProduct._id}`,
        updatedProduct
      );
      alert('Product updated successfully');
      setEditingProduct(null);
      setIsPopupOpen(false);
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  const handleDeleteClick = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/api/products/${productId}`);
      alert('Product deleted successfully');
      setProducts(products.filter(product => product._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading products: {error.message}</p>;

  return (
    <div className="product-showcase-grid">
      <div className="product-showcase-products">
        {products.map((product, index) => (
          <div
            key={product._id}
            className={`product-showcase-card ${hoveredIndex === index ? 'hovered' : ''}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="product-showcase-image-container">
              <LazyLoad height={250} offset={100}>
                <img
                  src={
                    hoveredIndex === index && product.backImage
                      ? `http://localhost:8000/${product.backImage}`
                      : `http://localhost:8000/${product.frontImage}`
                  }
                  alt={product.title}
                  className="product-showcase-image"
                />
              </LazyLoad>
              <div className="product-showcase-categories">
                <span className="product-showcase-category">
                  {Array.isArray(product.categories) ? product.categories.join(', ') : product.categories}
                </span>
              </div>
            </div>

            <div className="product-showcase-details">
              <h3 style={{fontSize:'18px'}}>{product.title}</h3>
              <div className="product-showcase-price">
                <span className="current-price">Rs. {product.price}</span>
              </div>
              <div className="product-showcase-sizes">
                {Array.isArray(product.sizes) ? product.sizes.map(size => (
                  <span key={size} className="product-showcase-size">{size}</span>
                )) : product.sizes}
              </div>
              <div className="deleteandupdate" style={{display:'flex',justifyContent:'center'}}>
                <button className="product-showcase-delete-button" onClick={() => handleDeleteClick(product._id)} style={{marginRight:'4px',width:'40%'}}>Delete</button>
                <button className="product-showcase-edit-button" onClick={() => handleEditClick(product)} >Edit</button>
              </div>


            </div>
          </div>
        ))}
      </div>

      {/* Custom Popup */}
      {isPopupOpen && (
        <div className="custom-popup-overlay" onClick={closePopup}>
          <div className="custom-popup" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Product: {editingProduct.title}</h3>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="product-showcase-input"
            />
            <input
              type="text"
              name="categories"
              value={formData.categories}
              onChange={handleInputChange}
              placeholder="Categories (comma-separated)"
              className="product-showcase-input"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="product-showcase-textarea"
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Price"
              className="product-showcase-input"
            />
            <input
              type="text"
              name="sizes"
              value={formData.sizes}
              onChange={handleInputChange}
              placeholder="Sizes (comma-separated)"
              className="product-showcase-input"
            />
            <input
              type="text"
              name="colors"
              value={formData.colors}
              onChange={handleInputChange}
              placeholder="Colors (comma-separated)"
              className="product-showcase-input"
            />
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
              className="product-showcase-input"
            />

            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              placeholder="Discount"
              className="product-showcase-input"
            />
            <button className="product-showcase-update-button" onClick={handleUpdateProduct}>Update Product</button>
            <button className="product-showcase-close-button" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProduct;
