const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Route files
const auth = require('./routes/authRoutes');
const events = require('./routes/eventRoutes');
const bookings = require('./routes/bookingRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/events', events);
// Re-route into other resource routers
app.use('/api/events/:eventId/bookings', bookings); // Also mount here for nested route
app.use('/api/bookings', bookings);
app.use('/api/upload', uploadRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
