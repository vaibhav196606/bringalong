import express from 'express';
import jwt from 'jsonwebtoken';
import Request from '../models/Request.js';
import Trip from '../models/Trip.js';

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

// Create new request (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      tripId,
      itemDescription,
      estimatedSize,
      urgency,
      maxBudget,
      deliveryLocation
    } = req.body;

    // Check if trip exists
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user is trying to request from their own trip
    if (trip.userId.toString() === req.user.userId) {
      return res.status(400).json({ message: 'Cannot request items from your own trip' });
    }

    const request = new Request({
      tripId,
      requesterId: req.user.userId,
      itemDescription,
      estimatedSize,
      urgency: urgency || 'medium',
      maxBudget,
      deliveryLocation
    });

    await request.save();

    // Increment request count on trip
    trip.requestCount += 1;
    await trip.save();

    const populatedRequest = await Request.findById(request._id)
      .populate('requesterId', 'name avatar rating verified')
      .populate('tripId', 'fromCity toCity travelDate');

    res.status(201).json(populatedRequest);
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get requests for a trip (protected)
router.get('/trip/:tripId', verifyToken, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user owns the trip
    if (trip.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view these requests' });
    }

    const requests = await Request.find({ tripId: req.params.tripId })
      .populate('requesterId', 'name avatar rating verified')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Get trip requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's requests (protected)
router.get('/user/my-requests', verifyToken, async (req, res) => {
  try {
    const requests = await Request.find({ requesterId: req.user.userId })
      .populate('tripId', 'fromCity toCity travelDate userId')
      .populate({
        path: 'tripId',
        populate: {
          path: 'userId',
          select: 'name avatar rating verified'
        }
      })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Get user requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update request status (protected)
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status, travelerNotes, estimatedCost } = req.body;
    
    const request = await Request.findById(req.params.id)
      .populate('tripId');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user owns the trip (for accepting/rejecting) or the request (for canceling)
    const isTripOwner = request.tripId.userId.toString() === req.user.userId;
    const isRequestOwner = request.requesterId.toString() === req.user.userId;

    if (!isTripOwner && !isRequestOwner) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    // Validate status changes
    if (isRequestOwner && !['cancelled'].includes(status)) {
      return res.status(400).json({ message: 'You can only cancel your own requests' });
    }

    if (isTripOwner && !['accepted', 'rejected', 'in-transit', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    const updateData = { status };
    if (travelerNotes) updateData.travelerNotes = travelerNotes;
    if (estimatedCost) updateData.estimatedCost = estimatedCost;

    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('requesterId', 'name avatar rating verified')
      .populate('tripId', 'fromCity toCity travelDate');

    res.json(updatedRequest);
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get request by ID (protected)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('requesterId', 'name avatar rating verified')
      .populate('tripId', 'fromCity toCity travelDate userId')
      .populate({
        path: 'tripId',
        populate: {
          path: 'userId',
          select: 'name avatar rating verified'
        }
      });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user is involved in this request
    const isTripOwner = request.tripId.userId._id.toString() === req.user.userId;
    const isRequestOwner = request.requesterId._id.toString() === req.user.userId;

    if (!isTripOwner && !isRequestOwner) {
      return res.status(403).json({ message: 'Not authorized to view this request' });
    }

    res.json(request);
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
