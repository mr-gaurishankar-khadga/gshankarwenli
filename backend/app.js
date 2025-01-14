// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const crypto = require('crypto');
const { initializeGoogleStrategy, googleAuthRoutes } = require('./auth/googleAuth');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const slideRoutes = require('./routes/slideRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');


const reviewRoutes = require('./routes/reviewRoutes');



const app = express();

app.use(cors({
  origin: 'https://www.wenli.in',

  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

const generateRandomSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};


app.use(session({
  secret: process.env.SESSION_SECRET || generateRandomSecretKey(),
  resave: false,
  saveUninitialized: false,
}));


// Initialize Passport and Google Strategy
app.use(passport.initialize());
app.use(passport.session());
initializeGoogleStrategy();




// MongoDB Connection
mongoose.connect(process.env.MONGO_DB_CONNECTION_MY_DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));



// Initialize Google Auth Routes
googleAuthRoutes(app);

// Other Routes
app.use('/auth', authRoutes);

app.use('/api/products', productRoutes);

app.use('/', paymentRoutes);

app.use('/api/payments', paymentRoutes);

app.use('/api/slides', slideRoutes);

app.use('/api/users', userRoutes);

app.use('/', messageRoutes);

app.use('/api/reviews', reviewRoutes);



// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});



const PORT = process.env.PORT || 8000;


app.listen(PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});