require('dotenv').config();
const express = require('express');
const cors = require('cors');
const winston = require('winston');

// Winston Logger Configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }), // Log errors to file
    new winston.transports.Console(), // Log to console
  ],
});

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const storeRoutes = require('./routes/storeRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const itemRoutes = require('./routes/itemRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

app.use('/store', storeRoutes);
app.use('/user', userRoutes);
app.use('/upload', uploadRoutes); // Register Upload Routes
app.use('/item', itemRoutes); // Register Item Routes
app.use('/transaction', transactionRoutes);

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(`${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method}`);
  res.status(err.statusCode || 500).json({ success: false, message: err.message });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`); // Log server start using Winston
});