import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPasswordModal.css';
import Logo from './images/logo.png';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const response = await fetch('https://mrrapo.onrender.com/api/send-otp', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                console.log("Sending OTP to:", email);
                setShowOtpModal(true);
            } else {
                const errorMsg = await response.text();
                alert(`Error sending OTP: ${errorMsg}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert('Failed to send OTP. Please try again later.');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await fetch('https://mrrapo.onrender.com/api/verify-otp1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            if (response.ok) {
                alert('OTP verified successfully! Navigating to profile...');
                navigate('/profile');
            } else {
                alert('Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error("Error:", error);
            alert('Failed to verify OTP. Please try again later.');
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-container">
                    <img src={Logo} alt="Logo" className="modal-logo" />
                    <h2 className="modal-title">Forgot Password</h2>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="modal-input" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className="modal-buttons">
                        <button className="modal-button close-button" onClick={onClose}>
                            Close
                        </button>
                        <button className="modal-button submit-button" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>

            {showOtpModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h3 className="modal-title">Enter OTP</h3>
                        <input 
                            type="text" 
                            placeholder="Enter your OTP" 
                            className="modal-input" 
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <div className="modal-buttons">
                            <button className="modal-button close-button" onClick={() => setShowOtpModal(false)}>
                                Close
                            </button>
                            
                            <button className="modal-button submit-button" onClick={handleVerifyOtp}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ForgotPasswordModal;
