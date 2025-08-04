import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Get user by ID (public profile)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email'); // Exclude sensitive information

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile (protected)
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const {
      name,
      phone,
      bio,
      linkedinUrl
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (bio) updateData.bio = bio;
    if (linkedinUrl) updateData.linkedinUrl = linkedinUrl;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Import models here to avoid circular dependency issues
    const Trip = (await import('../models/Trip.js')).default;
    const Request = (await import('../models/Request.js')).default;

    const [
      totalTrips,
      activeTrips,
      completedTrips,
      totalRequests,
      acceptedRequests
    ] = await Promise.all([
      Trip.countDocuments({ userId }),
      Trip.countDocuments({ userId, status: 'active' }),
      Trip.countDocuments({ userId, status: 'completed' }),
      Request.countDocuments({ requesterId: userId }),
      Request.countDocuments({ requesterId: userId, status: 'accepted' })
    ]);

    res.json({
      trips: {
        total: totalTrips,
        active: activeTrips,
        completed: completedTrips
      },
      requests: {
        total: totalRequests,
        accepted: acceptedRequests
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
