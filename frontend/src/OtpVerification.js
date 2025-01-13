import React, { useState } from 'react';
import axios from 'axios';

const OtpVerification = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('phone');
    const [message, setMessage] = useState('');
    const [simulatedOtp, setSimulatedOtp] = useState('');

    const handleSendOTP = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/send-otp', { phoneNumber });
            setMessage(response.data.message);
            setSimulatedOtp(response.data.otp); 
            setStep('otp');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error sending OTP');
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/verify-otp', { phoneNumber, otp });
            setMessage(response.data.message);
            setSimulatedOtp('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error verifying OTP');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>OTP Verification</h2>
            {step === 'phone' ? (
                <form onSubmit={handleSendOTP}>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter Nepali phone number"
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.button}>Send OTP</button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOTP}>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.button}>Verify OTP</button>
                </form>
            )}
            {message && <p style={styles.message}>{message}</p>}
            {simulatedOtp && (
                <p style={styles.simulatedOtp}>Simulated OTP: {simulatedOtp}</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '300px',
        margin: '0 auto',
        padding: '20px',
        textAlign: 'center',
    },
    title: {
        fontSize: '24px',
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    message: {
        marginTop: '20px',
        color: '#28a745',
    },
    simulatedOtp: {
        marginTop: '10px',
        color: '#dc3545',
        fontWeight: 'bold',
    },
};

export default OtpVerification;
