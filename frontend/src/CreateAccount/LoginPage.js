// LoginPage.jsx
import React, { useState } from 'react';
import { Github, Twitter, Facebook, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import ForgotPasswordModal from './ForgotPasswordModal';
import './LoginPage.css';
import google from './images/google.svg';

import LoginWithGoogle from './Loginwithgoogle'

const LoginPage = ({ setToken, setIsAdmin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [credentials, setCredentials] = useState({ firstname: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { firstname, password } = credentials;

            // Admin access check
            if (firstname === 'admin' && password === '1234') {
                setIsAdmin(true);
                navigate('/Setup');
                return;
            }

            // Authenticate with backend
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, { firstname, password });
            const { token } = response.data;

            // Decode the token
            const decodedToken = jwtDecode(token);

            setToken(token);
            setIsAdmin(decodedToken.role === 'admin');

            // Navigate based on role
            if (decodedToken.role === 'admin') {
                navigate('/Setup');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Login failed:', err);
            alert('Login failed. Please check your credentials.');
        }
    };

    const handleGoogleLogin = () => {
        // Implement Google login logic
        console.log('Google login clicked');
    };

    const handleSocialLogin = (platform) => {
        // Implement social login logic
        console.log(`${platform} login clicked`);
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <h2 className="login-title">Welcome Back!</h2>
                <p className="login-subtitle">Please enter your details</p>
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <input
                            type="text"
                            name="firstname"
                            placeholder="Username"
                            value={credentials.firstname}
                            onChange={handleChange}
                            className="login-input"
                            required

                            style={{width:'90%'}}
                        />
                    </div>

                    <div className="input-group password-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={handleChange}
                            className="login-input"
                            required
                            style={{width:'90%'}} 
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button type="submit" className="login-button">
                        Sign In
                    </button>


                    <div className="dividerr">
                        <span>or continue with</span>
                    </div>

                    <div className="social-login">
                       <LoginWithGoogle/>
                    </div>

                    <div className="login-footer">
                        <button 
                            type="button" 
                            className="forgot-password" 
                            onClick={() => setIsModalOpen(true)}
                        >
                            Forgot password?
                        </button>
                        <p className="signup-link">
                            Don't have an account? <a href="/signup">Sign up</a>
                        </p>
                    </div>
                </form>
            </div>
            <ForgotPasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default LoginPage;