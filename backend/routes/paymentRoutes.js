
const express = require('express');
const router = express.Router();
const Payment = require('../models/paymentModel');
const nodemailer = require('nodemailer');

const otpStore = new Map();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ggs699000@gmail.com',  
    pass: 'kczn nqwm xwbe gclc'  
  }
});


transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});


router.post('/', async (req, res) => {
  const { product, quantity, paymentMethod, price, cardNumber, address, expiryDate, cvv, email,name,phone } = req.body;

  try {
    const newPayment = new Payment({
      product,
      quantity,
      paymentMethod,
      price,
      cardNumber,
      expiryDate,
      address,
      email,
      name,
      phone,
      cvv,
    });

    await newPayment.save();

  
    const mailOptions = {
      from: 'ggs699000@gmail.com',
      to: email,
      subject: 'Payment Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Payment Confirmation</h2>
          <p>Thank you for your payment of Rs.${price}</p>
          <p>Order details:</p>
          <ul>
            <li>Product: ${product.title}</li>
            <li>Quantity: ${quantity}</li>
            <li>Payment Method: ${paymentMethod}</li>
          </ul>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ 
      success: true,
      message: 'Payment processed successfully',
      payment: newPayment 
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error processing payment',
      error: error.message 
    });
  }
});





// API endpoint to fetch all payments
router.get('/api/payments', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching payment data', error });
  }
});




router.post('/send-payment-otp', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email is required' 
    });
  }

  try {
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
  
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000 
    });
    
    const mailOptions = {
      from: 'ggs699000@gmail.com',
      to: email,
      subject: 'Payment Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Payment Verification OTP</h2>
          <p>Your OTP for payment verification is:</p>
          <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      success: true, 
      message: 'OTP sent successfully'
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP',
      error: error.message 
    });
  }
});


router.post('/verify-payment-otp', (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Email and OTP are required'
    });
  }

  const storedData = otpStore.get(email);
  
  if (!storedData) {
    return res.status(400).json({
      success: false,
      message: 'No OTP found for this email'
    });
  }
  
  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({
      success: false,
      message: 'OTP has expired'
    });
  }
  
  if (storedData.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP'
    });
  }


  otpStore.delete(email);
  
  res.status(200).json({
    success: true,
    message: 'OTP verified successfully'
  });
});


setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(email);
    }
  }
}, 5 * 60 * 1000);

module.exports = router;