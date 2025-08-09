import express from 'express';
import jwt from 'jsonwebtoken';
import TripNotification from '../models/TripNotification.js';

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
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Create trip notification (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { fromCity, fromCountry, toCity, toCountry, maxDate } = req.body;

    // Validation
    if (!fromCity || !fromCountry || !toCity || !toCountry) {
      return res.status(400).json({ 
        message: 'Origin and destination cities and countries are required' 
      });
    }

    // Check if user already has notification for this exact route
    const existingNotification = await TripNotification.findOne({
      userId: req.user.userId,
      fromCity: fromCity.trim(),
      fromCountry: fromCountry.trim(),
      toCity: toCity.trim(),
      toCountry: toCountry.trim(),
      notified: false
    });

    if (existingNotification) {
      return res.status(400).json({ 
        message: 'You already have a notification set up for this route' 
      });
    }

    // Create new notification
    const notification = new TripNotification({
      userId: req.user.userId,
      email: req.user.email,
      fromCity: fromCity.trim(),
      fromCountry: fromCountry.trim(),
      toCity: toCity.trim(),
      toCountry: toCountry.trim(),
      maxDate: maxDate ? new Date(maxDate) : null
    });

    await notification.save();

    res.status(201).json({
      message: 'Trip notification created successfully',
      notification: {
        id: notification._id,
        route: `${fromCity} → ${toCity}`,
        maxDate: notification.maxDate
      }
    });

  } catch (error) {
    console.error('Error creating trip notification:', error);
    res.status(500).json({ message: 'Server error creating notification' });
  }
});

// Get user's active notifications (protected)
router.get('/my-notifications', verifyToken, async (req, res) => {
  try {
    const notifications = await TripNotification.find({
      userId: req.user.userId,
      notified: false
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error fetching notifications' });
  }
});

// Delete notification (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const notification = await TripNotification.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await TripNotification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted successfully' });

  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error deleting notification' });
  }
});

export default router;
