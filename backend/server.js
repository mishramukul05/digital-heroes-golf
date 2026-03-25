require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(cors()); // Allows your React frontend to communicate with this backend

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected successfully'))
  .catch(err => console.log('❌ MongoDB Connection Error: ', err));

// Routes
app.use('/api/scores', require('./routes/scores'));
app.use('/api/auth', require('./routes/auth'));

// Basic health check route
app.get('/', (req, res) => {
  res.send('Digital Heroes Golf Charity API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));