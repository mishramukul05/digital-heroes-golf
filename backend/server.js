require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(cors({ 
  origin: true, 
  credentials: true 
}));
app.use(cookieParser());

// Stripe Webhook needs raw body, so it must be configured before express.json()
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }), require('./routes/paymentWebhook'));

// This must come AFTER the webhook route
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('✅ MongoDB Connected successfully'))
  .catch(err => console.log('❌ MongoDB Connection Error: ', err));

// Routes
app.use('/api/scores', require('./routes/scores'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/draws', require('./routes/draws'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/charities', require('./routes/charities'));

// Basic health check route
app.get('/', (req, res) => {
  res.send('Digital Heroes Golf Charity API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));