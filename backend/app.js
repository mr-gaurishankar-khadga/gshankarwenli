// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const crypto = require('crypto');

// More resilient connect-mongo import
let MongoStore;
try {
  MongoStore = require('connect-mongo');
} catch (err) {
  console.error('Failed to load connect-mongo:', err);
  try {
    const mongoStoreModule = require('connect-mongo');
    MongoStore = mongoStoreModule.default || mongoStoreModule;
  } catch (fallbackErr) {
    console.error('Failed to load connect-mongo with fallback:', fallbackErr);
    throw new Error('Unable to initialize MongoStore. Please check connect-mongo installation.');
  }
}

const { initializeGoogleStrategy, googleAuthRoutes } = require('./auth/googleAuth');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const slideRoutes = require('./routes/slideRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Generate random secret key
const generateRandomSecretKey = () => {
  return crypto.randomBytes(64).toString('hex');
};

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoOptions = {
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      retryReads: true
    };

    await mongoose.connect(process.env.MONGO_DB_CONNECTION_MY_DATABASE, mongoOptions);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Initialize MongoDB connection
connectDB();

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || generateRandomSecretKey(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
};

try {
  sessionConfig.store = MongoStore.create({
    mongoUrl: process.env.MONGO_DB_CONNECTION_MY_DATABASE,
    ttl: 24 * 60 * 60,
    autoRemove: 'native',
    crypto: {
      secret: process.env.SESSION_SECRET || generateRandomSecretKey()
    },
    touchAfter: 24 * 3600,
    autoReconnect: true,
    collection: 'sessions'
  });
} catch (err) {
  console.error('Failed to create MongoStore:', err);
  if (process.env.NODE_ENV !== 'production') {
    console.warn('Using memory store for sessions (not suitable for production)');
    const MemoryStore = require('memorystore')(session);
    sessionConfig.store = new MemoryStore({
      checkPeriod: 86400000
    });
  } else {
    throw new Error('Unable to initialize session store in production');
  }
}

app.use(session(sessionConfig));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
initializeGoogleStrategy();

// Routes
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/slides', slideRoutes);
app.use('/api/users', userRoutes);
app.use('/', messageRoutes);
app.use('/api/reviews', reviewRoutes);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.use('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle specific errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.message
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      details: 'Invalid token or no authentication provided'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`
  });
});

// Start server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown handling
const gracefulShutdown = async () => {
  console.log('Received shutdown signal. Starting graceful shutdown...');
  
  try {
    // Close the HTTP server
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('HTTP server closed');

    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');

    // Exit process
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

// Handle various shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown();
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown();
});