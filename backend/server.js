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
const expenseRoutes = require('./routes/expense');
// Default
app.get('/', (req, res) => {
    res.send('API is running...');
});

// User Authentication
app.use('/api/auth', authRoutes);

// Protected Route
app.use('/api/protected', protectedRoutes);

// Expense Route
app.use('/api/expense', expenseRoutes);


// ------------------------ Routes ---------------------//
// Connect to Database
connectDB();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
