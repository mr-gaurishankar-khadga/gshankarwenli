import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Globe } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './ContactPage.css';

const ContactPage = () => {
  const [focused, setFocused] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  
  const handleFocus = (field) => setFocused(field);
  const handleBlur = () => setFocused('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      const response = await axios.post('https://mrrapo.onrender.com/api/messages', { 
        name, 
        email, 
        message 
      });
      
      if (response.data.success) {
        toast.success('Message sent successfully!');
        setSuccess('Message sent successfully!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        toast.error('Failed to send message. Please try again.');
        setError('Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="contact-container">
      <ToastContainer />
      
      <div className="contact-page">
        <div className="left-column">
          <div className="location-section">
            <h2 className="heading">
              location
              <div className="heading-underline"></div>
            </h2>
            <p className="location-text">
              gshankar from Nepal Computer Science Engineer
            </p>
          </div>

          <div>
            <h2 className="heading">
              follow us
              <div className="heading-underline"></div>
            </h2>
            <div className="social-container">
              {[Facebook, Twitter, Instagram, Globe].map((Icon, index) => (
                <div key={index} className="social-icon">
                  <Icon size={window.innerWidth <= 768 ? 18 : 20} />
                </div>
              ))}
            </div>
            <p className="copyright">©2024 Privacy policy</p>
          </div>
        </div>

        <div className="form-container">
          <h2 className="heading">
            contact form
            <div className="heading-underline"></div>
          </h2>
          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter your Name"
              className={`form-input ${focused === 'name' ? 'focused' : ''}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => handleFocus('name')}
              onBlur={handleBlur}
              required
              style={{borderRadius:'5px'}}
            />
            <input
              type="email"
              placeholder="Enter a valid email address"
              className={`form-input ${focused === 'email' ? 'focused' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              required
              style={{borderRadius:'5px'}}
            />
            <textarea
              placeholder="Enter your message"
              rows={window.innerWidth <= 768 ? 4 : 6}
              className={`form-input ${focused === 'message' ? 'focused' : ''}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => handleFocus('message')}
              onBlur={handleBlur}
              required
              style={{borderRadius:'5px'}}
            />
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;