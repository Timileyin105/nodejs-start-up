// Load environment variables from .env file
require('dotenv').config({ path: './config/.env' });

// Import required packages and modules
const express = require('express');
const cors = require('cors');
const app = express();

// Apply middlewares
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
// app.options('*', cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Define port number
const PORT = process.env.PORT;

// Import routes
const userRoutes = require('./Routes/user');
const adminRoutes = require('./Routes/admin');
const transactionRoutes = require('./Routes/admin');

// Define routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/transaction', transactionRoutes);


app.get('*', (req, res) => {
  res.status(404).json({ message: 'NOT FOUND' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started listening to port ${PORT} successfully`);
});
