const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://composit-matrial-front.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

// MongoDB Connection with better serverless handling
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

// Connect on startup
connectDB();

// Middleware to ensure connection before each request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', message: error.message });
  }
});

// Routes
app.use('/materials', require('./routes/materials'));
app.use('/composites', require('./routes/composites'));
app.use('/load-deflection', require('./routes/loadDeflection'));

// Health check
app.get('/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    // Try to count documents
    const CompositeData = require('./models/CompositeData');
    const count = await CompositeData.countDocuments();
    
    res.json({ 
      status: 'OK', 
      message: 'Server is running',
      database: states[dbState],
      isConnected: isConnected,
      documentsCount: count
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: error.message,
      database: 'error'
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
