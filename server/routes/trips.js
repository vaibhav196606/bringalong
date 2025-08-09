import express from 'express';
import jwt from 'jsonwebtoken';
import Trip from '../models/Trip.js';
import User from '../models/User.js';
import TripNotification from '../models/TripNotification.js';
import { isCountrySearch, createCountryRegex } from '../utils/countryUtils.js';
import { manualCleanup } from '../utils/cleanup.js';
import emailService from '../utils/emailService.js';

const router = express.Router();

// Function to check and notify users about new trips
async function checkAndNotifyUsers(newTrip, travelerName) {
  try {
    console.log(`🔍 Checking notifications for new trip: ${newTrip.fromCity}, ${newTrip.fromCountry} → ${newTrip.toCity}, ${newTrip.toCountry}`);
    
    // Build flexible matching query
    const matchQuery = {
      notified: false,
      $or: [
        { maxDate: null }, // No date restriction
        { maxDate: { $gte: new Date(newTrip.travelDate) } } // Date matches criteria
      ],
      $and: [
        {
          $or: [
            // Exact city match
            { fromCity: newTrip.fromCity },
            // Case-insensitive city match
            { fromCity: { $regex: new RegExp('^' + newTrip.fromCity + '$', 'i') } },
            // Handle legacy format: "City, Country" stored as city
            { fromCity: `${newTrip.fromCity}, ${newTrip.fromCountry}` },
            { fromCity: { $regex: new RegExp('^' + newTrip.fromCity + ',\\s*' + newTrip.fromCountry + '$', 'i') } }
          ]
        },
        {
          $or: [
            // Exact city match  
            { toCity: newTrip.toCity },
            // Case-insensitive city match
            { toCity: { $regex: new RegExp('^' + newTrip.toCity + '$', 'i') } },
            // Handle legacy format: "City, Country" stored as city
            { toCity: `${newTrip.toCity}, ${newTrip.toCountry}` },
            { toCity: { $regex: new RegExp('^' + newTrip.toCity + ',\\s*' + newTrip.toCountry + '$', 'i') } }
          ]
        },
        {
          $or: [
            // Exact country match
            { fromCountry: newTrip.fromCountry },
            // Auto-detected fallback (ignore country match)
            { fromCountry: 'Auto-detected' },
            // Case-insensitive country match
            { fromCountry: { $regex: new RegExp('^' + newTrip.fromCountry + '$', 'i') } }
          ]
        },
        {
          $or: [
            // Exact country match
            { toCountry: newTrip.toCountry },
            // Auto-detected fallback (ignore country match)
            { toCountry: 'Auto-detected' },
            // Case-insensitive country match
            { toCountry: { $regex: new RegExp('^' + newTrip.toCountry + '$', 'i') } }
          ]
        }
      ]
    };

    // Find matching notifications
    const matchingNotifications = await TripNotification.find(matchQuery).populate('userId', 'name email');

    console.log(`📧 Found ${matchingNotifications.length} matching notifications for ${newTrip.fromCity} → ${newTrip.toCity}`);

    // Send notifications and mark as notified
    for (const notification of matchingNotifications) {
      try {
        await emailService.sendTripNotificationEmail(
          notification.email,
          notification.userId.name,
          newTrip,
          travelerName
        );

        // Mark as notified
        notification.notified = true;
        await notification.save();

        console.log(`✅ Notification sent to ${notification.email} for trip ${newTrip._id}`);
      } catch (emailError) {
        console.error(`❌ Failed to send notification to ${notification.email}:`, emailError);
      }
    }
  } catch (error) {
    console.error('❌ Error in notification system:', error);
  }
}

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

// Test endpoint to check exact trip data
router.get('/check-trip/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).exec();
    if (!trip) {
      return res.json({ error: 'Trip not found' });
    }
    
    console.log(`🔍 Trip ${req.params.id}:`);
    console.log(`  fromCity: "${trip.fromCity}"`);
    console.log(`  fromCountry: "${trip.fromCountry}"`);
    console.log(`  toCity: "${trip.toCity}"`);
    console.log(`  toCountry: "${trip.toCountry}"`);
    
    // Test regex matches - create new regex patterns each time
    const indiaRegex = createCountryRegex('India');
    const usaRegex = createCountryRegex('United States');
    const russiaRegex = /(russia|russian federation)/i;
    
    console.log(`  India regex pattern: "${indiaRegex.source}"`);
    console.log(`  USA regex pattern: "${usaRegex.source}"`);
    console.log(`  Russia regex pattern: "${russiaRegex.source}"`);
    
    console.log(`  India regex matches fromCountry: ${indiaRegex.test(trip.fromCountry)}`);
    console.log(`  India regex matches toCountry: ${indiaRegex.test(trip.toCountry)}`);
    console.log(`  USA regex matches fromCountry: ${usaRegex.test(trip.fromCountry)}`);
    console.log(`  USA regex matches toCountry: ${usaRegex.test(trip.toCountry)}`);
    console.log(`  Russia regex matches fromCountry: ${russiaRegex.test(trip.fromCountry)}`);
    console.log(`  Russia regex matches toCountry: ${russiaRegex.test(trip.toCountry)}`);
    
    return res.json({
      _id: trip._id,
      fromCity: trip.fromCity,
      fromCountry: trip.fromCountry,
      toCity: trip.toCity,
      toCountry: trip.toCountry,
      regexPatterns: {
        india: indiaRegex.source,
        usa: usaRegex.source,
        russia: russiaRegex.source
      },
      regexTests: {
        fromCountry_matches_india: indiaRegex.test(trip.fromCountry),
        toCountry_matches_india: indiaRegex.test(trip.toCountry),
        fromCountry_matches_usa: usaRegex.test(trip.fromCountry),
        toCountry_matches_usa: usaRegex.test(trip.toCountry),
        fromCountry_matches_russia: russiaRegex.test(trip.fromCountry),
        toCountry_matches_russia: russiaRegex.test(trip.toCountry)
      }
    });
  } catch (error) {
    console.error('Check trip error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint to debug the specific search issue
router.get('/debug-search', async (req, res) => {
  try {
    const { from, to } = req.query;
    console.log(`🐛 DEBUG SEARCH: ${from} → ${to}`);
    
    if (from && to && isCountrySearch(from) && isCountrySearch(to)) {
      const fromCountryRegex = createCountryRegex(from);
      const toCountryRegex = createCountryRegex(to);
      
      console.log(`🔍 From regex: "${fromCountryRegex.source}"`);
      console.log(`🔍 To regex: "${toCountryRegex.source}"`);
      
      const query = {
        status: 'active',
        $or: [
          {
            fromCountry: { $regex: fromCountryRegex.source, $options: 'i' },
            toCountry: { $regex: toCountryRegex.source, $options: 'i' }
          },
          {
            fromCountry: { $regex: toCountryRegex.source, $options: 'i' },
            toCountry: { $regex: fromCountryRegex.source, $options: 'i' }
          }
        ]
      };
      
      console.log(`🔍 MongoDB Query:`, JSON.stringify(query, null, 2));
      
      const trips = await Trip.find(query).exec();
      
      console.log(`🔍 Found ${trips.length} trips:`);
      trips.forEach(trip => {
        console.log(`  - ID: ${trip._id}`);
        console.log(`    Route: ${trip.fromCity}, ${trip.fromCountry} → ${trip.toCity}, ${trip.toCountry}`);
        console.log(`    From regex "${fromCountryRegex.source}" matches "${trip.fromCountry}": ${fromCountryRegex.test(trip.fromCountry)}`);
        console.log(`    To regex "${toCountryRegex.source}" matches "${trip.toCountry}": ${toCountryRegex.test(trip.toCountry)}`);
        console.log(`    Reverse - From regex "${toCountryRegex.source}" matches "${trip.fromCountry}": ${toCountryRegex.test(trip.fromCountry)}`);
        console.log(`    Reverse - To regex "${fromCountryRegex.source}" matches "${trip.toCountry}": ${fromCountryRegex.test(trip.toCountry)}`);
      });
      
      return res.json({ 
        query, 
        trips: trips.map(t => ({
          _id: t._id,
          route: `${t.fromCity}, ${t.fromCountry} → ${t.toCity}, ${t.toCountry}`
        }))
      });
    }
    
    res.json({ error: 'Not a country-to-country search' });
  } catch (error) {
    console.error('Debug search error:', error);
    res.status(500).json({ error: error.message });
  }
});

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

    // Get current date for filtering expired trips
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to start of day

    const baseQuery = { 
      status,
      // Filter out expired trips: either travelDate is in future, or returnDate is in future for return trips
      $or: [
        { travelDate: { $gte: currentDate } },
        { 
          returnDate: { $exists: true, $gte: currentDate }
        }
      ]
    };

    // Build search conditions for exact matches first
    const exactSearchConditions = [];

    // Original direction exact search
    const exactOriginalDirection = { ...baseQuery };
    const exactReverseDirection = { ...baseQuery };

    // Handle 'from' parameter for exact search
    if (from) {
      if (isCountrySearch(from)) {
        const countryRegex = createCountryRegex(from);
        const pattern = countryRegex.source;
        exactOriginalDirection.fromCountry = { $regex: pattern, $options: 'i' };
        exactReverseDirection.toCountry = { $regex: pattern, $options: 'i' };
      } else {
        exactOriginalDirection.fromCity = { $regex: from, $options: 'i' };
        exactReverseDirection.toCity = { $regex: from, $options: 'i' };
      }
    }

    // Handle 'to' parameter for exact search
    if (to) {
      if (isCountrySearch(to)) {
        const countryRegex = createCountryRegex(to);
        const pattern = countryRegex.source;
        exactOriginalDirection.toCountry = { $regex: pattern, $options: 'i' };
        exactReverseDirection.fromCountry = { $regex: pattern, $options: 'i' };
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
    
    // Determine search type: country-to-country vs city-to-city
    // Use parsed locations to determine search type correctly
    const isCountryToCountrySearch = from && to && 
      fromLocation.city === fromLocation.country && 
      toLocation.city === toLocation.country &&
      isCountrySearch(fromLocation.country) && isCountrySearch(toLocation.country);
    
    const isCityToCitySearch = from && to && 
      fromLocation.city !== fromLocation.country && 
      toLocation.city !== toLocation.country;
    
    if (isCountryToCountrySearch) {
      // COUNTRY-TO-COUNTRY SEARCH: Only show exact trips between those countries
      console.log(`🌍 Country-to-country search: ${from} → ${to}`);
      
      // Debug: Check what the regex patterns are
      const fromCountryRegex = createCountryRegex(from);
      const toCountryRegex = createCountryRegex(to);
      console.log(`🔍 From country regex: ${fromCountryRegex.source}`);
      console.log(`🔍 To country regex: ${toCountryRegex.source}`);
      
      console.log(`🔍 Query will be:`, JSON.stringify({
        ...baseQuery,
        $or: [
          {
            fromCountry: { $regex: fromCountryRegex.source, $options: 'i' },
            toCountry: { $regex: toCountryRegex.source, $options: 'i' }
          },
          {
            fromCountry: { $regex: toCountryRegex.source, $options: 'i' },
            toCountry: { $regex: fromCountryRegex.source, $options: 'i' }
          }
        ]
      }, null, 2));
      
      // Build more strict country-to-country query
      const countryToCountryQuery = {
        ...baseQuery,
        $or: [
          {
            // Original direction: from country → to country
            fromCountry: { $regex: fromCountryRegex.source, $options: 'i' },
            toCountry: { $regex: toCountryRegex.source, $options: 'i' }
          },
          {
            // Reverse direction: to country → from country
            fromCountry: { $regex: toCountryRegex.source, $options: 'i' },
            toCountry: { $regex: fromCountryRegex.source, $options: 'i' }
          }
        ]
      };
      
      // Add date filters
      if (fromDate || toDate) {
        const dateFilter = {};
        if (fromDate) dateFilter.$gte = new Date(fromDate);
        if (toDate) dateFilter.$lte = new Date(toDate);
        
        countryToCountryQuery.$or[0].travelDate = dateFilter;
        countryToCountryQuery.$or[1].travelDate = dateFilter;
      }
      
      const countryTrips = await Trip.find(countryToCountryQuery)
        .populate('userId', 'name avatar rating verified')
        .sort(sortObj)
        .exec();
      
      // Debug: Log what trips were found
      console.log(`🔍 Country query found ${countryTrips.length} trips:`);
      countryTrips.forEach(trip => {
        console.log(`  - ${trip.fromCity}, ${trip.fromCountry} → ${trip.toCity}, ${trip.toCountry}`);
      });
      
      // Only include trips that match the exact countries (not the broader exactTrips)
      allTrips = countryTrips.map(trip => ({ ...trip.toObject(), matchType: 'exact' }));
      
    } else if (isCityToCitySearch) {
      // CITY-TO-CITY SEARCH: Show exact city matches first, then nearby (same countries)
      console.log(`🏙️ City-to-city search: ${from} → ${to}`);
      
      // Parse cities from the location strings
      const fromCity = fromLocation.city;
      const toCity = toLocation.city;
      
      console.log(`🏙️ Parsed cities: ${fromCity} → ${toCity}`);
      
      // Get exact city-to-city matches
      const exactCityQuery = {
        $or: [
          {
            ...baseQuery,
            fromCity: { $regex: fromCity, $options: 'i' },
            toCity: { $regex: toCity, $options: 'i' }
          },
          {
            ...baseQuery,
            fromCity: { $regex: toCity, $options: 'i' },
            toCity: { $regex: fromCity, $options: 'i' }
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
      
      // If we have few exact matches, add nearby trips (same countries)
      if (allTrips.length < 3) {
        // Try to detect countries from city names (this is basic, could be enhanced)
        const fromCountryGuess = fromLocation.country || 'Unknown';
        const toCountryGuess = toLocation.country || 'Unknown';
        
        // Find trips within the same countries but different cities
        const nearbyQuery = {
          ...baseQuery,
          $or: [
            {
              // Same origin country, same destination country, but different cities
              fromCountry: { $regex: fromCountryGuess, $options: 'i' },
              toCountry: { $regex: toCountryGuess, $options: 'i' },
              $and: [
                { fromCity: { $not: { $regex: from, $options: 'i' } } },
                { toCity: { $not: { $regex: to, $options: 'i' } } }
              ]
            },
            {
              // Reverse direction
              fromCountry: { $regex: toCountryGuess, $options: 'i' },
              toCountry: { $regex: fromCountryGuess, $options: 'i' },
              $and: [
                { fromCity: { $not: { $regex: to, $options: 'i' } } },
                { toCity: { $not: { $regex: from, $options: 'i' } } }
              ]
            }
          ]
        };
        
        // Add date filters
        if (fromDate || toDate) {
          const dateFilter = {};
          if (fromDate) dateFilter.$gte = new Date(fromDate);
          if (toDate) dateFilter.$lte = new Date(toDate);
          
          nearbyQuery.$or[0].travelDate = dateFilter;
          nearbyQuery.$or[1].travelDate = dateFilter;
        }
        
        // Exclude already found exact trips
        const exactTripIds = allTrips.map(trip => trip._id);
        if (exactTripIds.length > 0) {
          nearbyQuery._id = { $nin: exactTripIds };
        }
        
        const nearbyTrips = await Trip.find(nearbyQuery)
          .populate('userId', 'name avatar rating verified')
          .sort(sortObj)
          .limit(10)
          .exec();
        
        // Add nearby trips with "nearby" tag
        const nearbyTripsWithTag = nearbyTrips.map(trip => ({ 
          ...trip.toObject(), 
          matchType: 'broader',
          nearToYou: true 
        }));
        
        allTrips = [...allTrips, ...nearbyTripsWithTag];
      }
      
    } else {
      // MIXED OR SINGLE LOCATION SEARCH: Use original logic
      allTrips = exactTrips.map(trip => ({ ...trip.toObject(), matchType: 'exact' }));
    }
    // Apply pagination to final results
    const total = allTrips.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTrips = allTrips.slice(startIndex, endIndex);

    // Debug logging
    console.log('Search type:', isCountryToCountrySearch ? 'Country-to-Country' : isCityToCitySearch ? 'City-to-City' : 'Mixed/Single');
    const exactCount = allTrips.filter(trip => trip.matchType === 'exact').length;
    const broaderCount = allTrips.filter(trip => trip.matchType === 'broader').length;
    console.log(`Found ${exactCount} exact trips, ${broaderCount} nearby trips, ${total} total`);
    if (from && to) {
      console.log(`Search: ${from} ↔ ${to}`);
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

        // Check for matching notifications and send emails
        await checkAndNotifyUsers(populatedTrip, user.name);
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
export { checkAndNotifyUsers };
