import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import tripRoutes from './routes/trips.js';
import requestRoutes from './routes/requests.js';
import userRoutes from './routes/users.js';
import { scheduleCleanup } from './utils/cleanup.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://bringalong.vercel.app', 'https://*.vercel.app']
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005', 'http://localhost:3006', 'http://localhost:3007', 'http://localhost:3008', 'http://localhost:3009', 'http://localhost:3010', 'http://localhost:3011'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/traveler-connect');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.log('Retrying MongoDB connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Connect to database
connectDB();

// Start automatic cleanup of expired trips (runs every 24 hours)
scheduleCleanup(24);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    // Import models dynamically to avoid circular imports
    const { default: Trip } = await import('./models/Trip.js');
    const { default: User } = await import('./models/User.js');
    
    // Get actual total trips count (all trips, not just completed)
    const totalTripsCount = await Trip.countDocuments();
    
    // Get total users count
    const totalUsersCount = await User.countDocuments();
    
    // Calculate display stats using the new formulas
    const displayTrips = totalTripsCount * 3 + 1;  // 3x + 1
    const usersHelped = totalUsersCount * 6 + 1;   // 6x + 1  
    const activeUsers = totalUsersCount * 3;       // 3x
    
    res.json({
      success: true,
      data: {
        completedTrips: displayTrips,
        totalUsers: activeUsers,
        beneficiaries: usersHelped,
        // For debugging
        actualTotalTrips: totalTripsCount,
        actualTotalUsers: totalUsersCount
      }
    });
  } catch (error) {
    console.error('Stats endpoint error:', error);
    res.status(500).json({
      success: false,
      data: {
        completedTrips: 150,
        totalUsers: 105,
        beneficiaries: 284
      }
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

// Simple DB test endpoint directly on main app
app.get('/api/test-simple', (req, res) => {
  console.log('🧪 Simple test endpoint called');
  res.json({ success: true, message: 'Simple endpoint working!', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('🔧 DEBUG: Simple endpoint should be available at /api/test-simple');
});
