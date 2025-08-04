import mongoose from 'mongoose';
import Trip from '../models/Trip.js';
import Request from '../models/Request.js';

/**
 * Clean up expired trips from the database
 * Deletes trips where travel date or return date has passed by 30 days
 */
export const cleanupExpiredTrips = async () => {
  try {
    console.log('🧹 Starting cleanup of expired trips...');
    
    // Calculate the cutoff date (30 days ago)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Find trips that are expired based on travel date or return date
    const expiredTrips = await Trip.find({
      $or: [
        // Case 1: Travel date has passed by 30 days
        { 
          travelDate: { $lt: thirtyDaysAgo },
          $or: [
            { returnDate: { $exists: false } },
            { returnDate: null }
          ]
        },
        // Case 2: Return date exists and has passed by 30 days
        { 
          returnDate: { $lt: thirtyDaysAgo }
        }
      ]
    });

    if (expiredTrips.length === 0) {
      console.log('✅ No expired trips found to clean up');
      return { deleted: 0, errors: [] };
    }

    console.log(`📊 Found ${expiredTrips.length} expired trips to delete`);
    
    const deletedTrips = [];
    const errors = [];
    
    // Delete each expired trip and its associated requests
    for (const trip of expiredTrips) {
      try {
        // Delete all requests associated with this trip
        const deletedRequests = await Request.deleteMany({ tripId: trip._id });
        
        // Delete the trip itself
        await Trip.findByIdAndDelete(trip._id);
        
        deletedTrips.push({
          tripId: trip._id,
          route: `${trip.fromCity}, ${trip.fromCountry} → ${trip.toCity}, ${trip.toCountry}`,
          travelDate: trip.travelDate,
          returnDate: trip.returnDate,
          deletedRequests: deletedRequests.deletedCount
        });
        
        console.log(`🗑️  Deleted trip: ${trip.fromCity} → ${trip.toCity} (${deletedRequests.deletedCount} requests)`);
        
      } catch (error) {
        console.error(`❌ Error deleting trip ${trip._id}:`, error.message);
        errors.push({
          tripId: trip._id,
          error: error.message
        });
      }
    }
    
    console.log(`✅ Cleanup completed: ${deletedTrips.length} trips deleted, ${errors.length} errors`);
    
    return {
      deleted: deletedTrips.length,
      errors: errors,
      deletedTrips: deletedTrips
    };
    
  } catch (error) {
    console.error('❌ Error during trip cleanup:', error.message);
    throw error;
  }
};

/**
 * Schedule cleanup to run at regular intervals
 * @param {number} intervalHours - Hours between cleanup runs (default: 24)
 */
export const scheduleCleanup = (intervalHours = 24) => {
  const intervalMs = intervalHours * 60 * 60 * 1000; // Convert hours to milliseconds
  
  console.log(`⏰ Scheduling trip cleanup to run every ${intervalHours} hours`);
  
  // Run immediately on startup
  cleanupExpiredTrips().catch(error => {
    console.error('Initial cleanup failed:', error.message);
  });
  
  // Schedule recurring cleanup
  setInterval(async () => {
    try {
      await cleanupExpiredTrips();
    } catch (error) {
      console.error('Scheduled cleanup failed:', error.message);
    }
  }, intervalMs);
};

/**
 * Manual cleanup endpoint for testing/admin use
 */
export const manualCleanup = async (req, res) => {
  try {
    const result = await cleanupExpiredTrips();
    
    res.json({
      success: true,
      message: 'Cleanup completed successfully',
      ...result
    });
    
  } catch (error) {
    console.error('Manual cleanup failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Cleanup failed',
      error: error.message
    });
  }
};
