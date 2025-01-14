// Message.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Message.css';

function Message() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [currentMessageId, setCurrentMessageId] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('https://mrrapo.onrender.com/api/messages');
        setMessages(response.data);
      } catch (error) {
        setError('Failed to fetch messages.');
      }
    };

    fetchMessages();
  }, []);

  const handleReplyChange = (event) => {
    setReplyMessage(event.target.value);
  };

  const handleReplySubmit = async () => {
    const email = messages[currentMessageId].email;

    try {
      await axios.post('https://mrrapo.onrender.com/api/reply', {
        email: email,
        message: replyMessage,
      });
      alert('Reply sent successfully!');
      setReplyMessage('');
      setCurrentMessageId(null);
    } catch (error) {
      alert('Failed to send reply.');
    }
  };

  return (
    <div className="message-page">
      {error && <p className="error-message">{error}</p>}
      <div className="message-container">
        {messages.map((msg, index) => (
          <div className="message-card" key={index}>
            <h3>{msg.name}</h3>
            <p>{msg.email}</p>
            <p>{msg.message}</p>

            <button
              className="reply-button"
              onClick={() => setCurrentMessageId(index)}
            >
              Reply
            </button>


            {currentMessageId === index && (
              <div className="reply-form">
                <textarea
                  value={replyMessage}
                  onChange={handleReplyChange}
                  placeholder="Write your reply here..."
                />

                <button
                  onClick={handleReplySubmit}
                >
                  
                  Send Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Message;
