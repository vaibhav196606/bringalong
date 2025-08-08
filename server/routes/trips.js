import express from 'express';
import jwt from 'jsonwebtoken';
import Trip from '../models/Trip.js';
import User from '../models/User.js';
import { isCountrySearch, createCountryRegex } from '../utils/countryUtils.js';
import { manualCleanup } from '../utils/cleanup.js';
import emailService from '../utils/emailService.js';

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

// Get all trips with search and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      from, // Updated to use 'from' parameter from frontend
      to,   // Updated to use 'to' parameter from frontend
      fromCity, 
      toCity,
      fromCountry,
      toCountry,
      fromDate, 
      toDate,
      sortBy = 'travelDate',
      sortOrder = 'asc',
      status = 'active'
    } = req.query;

    // Helper function to extract city and country from location string
    const parseLocation = (location) => {
      if (!location) return { city: null, country: null };
      
      // Check if location contains comma (city, country format)
      if (location.includes(',')) {
        const parts = location.split(',').map(p => p.trim());
        return { city: parts[0], country: parts[1] };
      }
      
      // Single location - could be city or country
      return { city: location, country: location };
    };

    const fromLocation = parseLocation(from);
    const toLocation = parseLocation(to);

    const baseQuery = { status };

    // Build search conditions for exact matches first
    const exactSearchConditions = [];

    // Original direction exact search
    const exactOriginalDirection = { ...baseQuery };
    const exactReverseDirection = { ...baseQuery };

    // Handle 'from' parameter for exact search
    if (from) {
      if (isCountrySearch(from)) {
        exactOriginalDirection.fromCountry = createCountryRegex(from);
        exactReverseDirection.toCountry = createCountryRegex(from);
      } else {
        exactOriginalDirection.fromCity = { $regex: from, $options: 'i' };
        exactReverseDirection.toCity = { $regex: from, $options: 'i' };
      }
    }

    // Handle 'to' parameter for exact search
    if (to) {
      if (isCountrySearch(to)) {
        exactOriginalDirection.toCountry = createCountryRegex(to);
        exactReverseDirection.fromCountry = createCountryRegex(to);
      } else {
        exactOriginalDirection.toCity = { $regex: to, $options: 'i' };
        exactReverseDirection.fromCity = { $regex: to, $options: 'i' };
      }
    }

    // Legacy support for old parameters
    if (fromCity) {
      if (isCountrySearch(fromCity)) {
        exactOriginalDirection.fromCountry = createCountryRegex(fromCity);
      } else {
        exactOriginalDirection.fromCity = { $regex: fromCity, $options: 'i' };
      }
    }
    
    if (fromCountry) {
      exactOriginalDirection.fromCountry = createCountryRegex(fromCountry);
    }

    if (toCity) {
      if (isCountrySearch(toCity)) {
        exactOriginalDirection.toCountry = createCountryRegex(toCity);
      } else {
        exactOriginalDirection.toCity = { $regex: toCity, $options: 'i' };
      }
    }
    
    if (toCountry) {
      exactOriginalDirection.toCountry = createCountryRegex(toCountry);
    }

    // Add date filters to both directions
    if (fromDate || toDate) {
      const dateFilter = {};
      if (fromDate) dateFilter.$gte = new Date(fromDate);
      if (toDate) dateFilter.$lte = new Date(toDate);
      
      exactOriginalDirection.travelDate = dateFilter;
      exactReverseDirection.travelDate = dateFilter;
    }

    // Build exact query
    let exactQuery;
    if (from && to) {
      exactQuery = {
        $or: [exactOriginalDirection, exactReverseDirection]
      };
    } else {
      exactQuery = exactOriginalDirection;
    }

    // Get exact matches first
    let sortObj = {};
    if (sortBy === 'price') {
      sortObj = { serviceFee: sortOrder === 'desc' ? -1 : 1 };
    } else {
      sortObj = { travelDate: sortOrder === 'desc' ? -1 : 1 };
    }

    const exactTrips = await Trip.find(exactQuery)
      .populate('userId', 'name avatar rating verified')
      .sort(sortObj)
      .exec();

    let allTrips = [];
    
    // For country-to-country searches, separate exact city matches from broader country matches
    if (from && to && fromLocation.country && toLocation.country && 
        fromLocation.country !== fromLocation.city && toLocation.country !== toLocation.city) {
      
      // Build exact city-to-city query
      const exactCityQuery = {
        $or: [
          {
            ...baseQuery,
            fromCity: { $regex: fromLocation.city, $options: 'i' },
            toCity: { $regex: toLocation.city, $options: 'i' }
          },
          {
            ...baseQuery,
            fromCity: { $regex: toLocation.city, $options: 'i' },
            toCity: { $regex: fromLocation.city, $options: 'i' }
          }
        ]
      };
      
      // Add date filters to exact city query
      if (fromDate || toDate) {
        const dateFilter = {};
        if (fromDate) dateFilter.$gte = new Date(fromDate);
        if (toDate) dateFilter.$lte = new Date(toDate);
        
        exactCityQuery.$or[0].travelDate = dateFilter;
        exactCityQuery.$or[1].travelDate = dateFilter;
      }
      
      const exactCityTrips = await Trip.find(exactCityQuery)
        .populate('userId', 'name avatar rating verified')
        .sort(sortObj)
        .exec();
      
      // Add exact city matches
      allTrips = exactCityTrips.map(trip => ({ ...trip.toObject(), matchType: 'exact' }));
      
      // Get broader country matches (excluding exact city matches)
      const exactCityIds = exactCityTrips.map(trip => trip._id);
      const broaderCountryTrips = exactTrips.filter(trip => 
        !exactCityIds.some(id => id.toString() === trip._id.toString())
      );
      
      // Add broader country matches with "Near by" tag
      const broaderTripsWithTag = broaderCountryTrips.map(trip => ({ 
        ...trip.toObject(), 
        matchType: 'broader',
        nearToYou: true 
      }));
      
      allTrips = [...allTrips, ...broaderTripsWithTag];
      
    } else {
      // For non-country searches, use original logic
      allTrips = exactTrips.map(trip => ({ ...trip.toObject(), matchType: 'exact' }));
    }
    
    // If exact matches are less than 3 and we have both from and to locations, search for additional broader matches
    const threshold = 3;
    if (allTrips.filter(trip => trip.matchType === 'exact').length < threshold && from && to) {
      // First try country-based broader search if we have countries
      if (fromLocation.country && toLocation.country && 
          fromLocation.country !== fromLocation.city && 
          toLocation.country !== toLocation.city) {
      
      // Build broader search conditions (same as before)
      const broaderSearchConditions = [];
      
      // Same country origin to exact destination
      const sameCountryOriginQuery = { ...baseQuery };
      if (fromLocation.country) {
        sameCountryOriginQuery.fromCountry = createCountryRegex(fromLocation.country);
      }
      if (to) {
        if (isCountrySearch(to)) {
          sameCountryOriginQuery.toCountry = createCountryRegex(to);
        } else {
          sameCountryOriginQuery.toCity = { $regex: to, $options: 'i' };
        }
      }

      // Exact origin to same country destination
      const sameCountryDestinationQuery = { ...baseQuery };
      if (from) {
        if (isCountrySearch(from)) {
          sameCountryDestinationQuery.fromCountry = createCountryRegex(from);
        } else {
          sameCountryDestinationQuery.fromCity = { $regex: from, $options: 'i' };
        }
      }
      if (toLocation.country) {
        sameCountryDestinationQuery.toCountry = createCountryRegex(toLocation.country);
      }

      // Same country origin to same country destination
      const bothCountriesQuery = { ...baseQuery };
      if (fromLocation.country) {
        bothCountriesQuery.fromCountry = createCountryRegex(fromLocation.country);
      }
      if (toLocation.country) {
        bothCountriesQuery.toCountry = createCountryRegex(toLocation.country);
      }

      // Add date filters to broader queries
      if (fromDate || toDate) {
        const dateFilter = {};
        if (fromDate) dateFilter.$gte = new Date(fromDate);
        if (toDate) dateFilter.$lte = new Date(toDate);
        
        sameCountryOriginQuery.travelDate = dateFilter;
        sameCountryDestinationQuery.travelDate = dateFilter;
        bothCountriesQuery.travelDate = dateFilter;
      }

      // Exclude trips already found in exact and broader searches
      const existingTripIds = allTrips.map(trip => trip._id);
      const excludeExisting = { _id: { $nin: existingTripIds } };

      // Get additional broader matches
      const broaderQuery = {
        $and: [
          excludeExisting,
          {
            $or: [sameCountryOriginQuery, sameCountryDestinationQuery, bothCountriesQuery]
          }
        ]
      };

      const additionalBroaderTrips = await Trip.find(broaderQuery)
        .populate('userId', 'name avatar rating verified')
        .sort(sortObj)
        .limit(10) // Limit broader results
        .exec();

      // Add additional broader trips with "near to you" tag
      const additionalBroaderTripsWithTag = additionalBroaderTrips.map(trip => ({ 
        ...trip.toObject(), 
        matchType: 'broader',
        nearToYou: true 
      }));

      allTrips = [...allTrips, ...additionalBroaderTripsWithTag];
      } else {
        // Fallback: If no countries or countries are same as cities, 
        // show some trips as "Near by" when no exact matches found
        if (allTrips.filter(trip => trip.matchType === 'exact').length === 0) {
          const fallbackQuery = { ...baseQuery };
          
          // Add date filters if provided
          if (fromDate || toDate) {
            const dateFilter = {};
            if (fromDate) dateFilter.$gte = new Date(fromDate);
            if (toDate) dateFilter.$lte = new Date(toDate);
            fallbackQuery.travelDate = dateFilter;
          }

          // Exclude already found trips
          const existingTripIds = allTrips.map(trip => trip._id);
          if (existingTripIds.length > 0) {
            fallbackQuery._id = { $nin: existingTripIds };
          }

          const fallbackTrips = await Trip.find(fallbackQuery)
            .populate('userId', 'name avatar rating verified')
            .sort(sortObj)
            .limit(7) // Show up to 7 trips as "Near by"
            .exec();

          // Add fallback trips with "near to you" tag
          const fallbackTripsWithTag = fallbackTrips.map(trip => ({ 
            ...trip.toObject(), 
            matchType: 'broader',
            nearToYou: true 
          }));

          allTrips = [...allTrips, ...fallbackTripsWithTag];
        }
      }
    } // Close the outer if statement

    // Apply pagination to final results
    const total = allTrips.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTrips = allTrips.slice(startIndex, endIndex);

    // Debug logging
    console.log('Exact query:', JSON.stringify(exactQuery, null, 2));
    const exactCount = allTrips.filter(trip => trip.matchType === 'exact').length;
    const broaderCount = allTrips.filter(trip => trip.matchType === 'broader').length;
    console.log(`Found ${exactCount} exact trips, ${broaderCount} broader trips, ${total} total`);
    if (from && to) {
      console.log(`Bidirectional search: ${from} ↔ ${to}`);
    }

    res.json({
      trips: paginatedTrips,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      exactMatches: exactCount,
      broaderMatches: broaderCount
    });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trip by ID
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('userId', 'name avatar rating verified linkedinUrl instagramId bio');
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Increment view count
    trip.viewCount += 1;
    await trip.save();

    res.json(trip);
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new trip (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      fromCity,
      fromCountry,
      toCity,
      toCountry,
      travelDate,
      returnDate,
      serviceFee,
      currency,
      notes,
      itemsCanBring
    } = req.body;

    const trip = new Trip({
      userId: req.user.userId,
      fromCity,
      fromCountry,
      toCity,
      toCountry,
      travelDate,
      returnDate,
      serviceFee,
      currency: currency || 'INR',
      notes,
      itemsCanBring
    });

    await trip.save();
    
    const populatedTrip = await Trip.findById(trip._id)
      .populate('userId', 'name avatar rating verified');

    // Send trip post confirmation email
    try {
      const user = await User.findById(req.user.userId);
      if (user && user.email) {
        const tripDetails = {
          _id: trip._id,
          fromCity,
          fromCountry,
          toCity,
          toCountry,
          travelDate,
          serviceFee,
          currency,
          itemsCanBring
        };
        await emailService.sendTripPostConfirmationEmail(user.email, user.name, tripDetails);
        console.log('✅ Trip post confirmation email sent successfully');
      }
    } catch (emailError) {
      console.error('❌ Failed to send trip post confirmation email:', emailError);
      // Don't fail trip creation if email fails
    }

    res.status(201).json(populatedTrip);
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's trips (protected)
router.get('/user/my-trips', verifyToken, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name avatar rating verified');

    res.json(trips);
  } catch (error) {
    console.error('Get user trips error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update trip (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user owns the trip
    if (trip.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this trip' });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name avatar rating verified');

    res.json(updatedTrip);
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete trip (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user owns the trip
    if (trip.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this trip' });
    }

    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Manual cleanup endpoint (for testing/admin use)
router.post('/cleanup', manualCleanup);

export default router;
