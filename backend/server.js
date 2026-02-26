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

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

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
