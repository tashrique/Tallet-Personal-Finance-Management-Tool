const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

PORT = process.env.PORT || 5000;
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//------------------------ Routes ---------------------//
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

// User Authentication
app.use('/api/auth', authRoutes);

// Protected Route
app.use('/api/protected', protectedRoutes);


// ------------------------ Routes ---------------------//
// Connect to Database
connectDB();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
