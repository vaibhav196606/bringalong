import mongoose from 'mongoose';

const tripNotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  fromCity: {
    type: String,
    required: true
  },
  fromCountry: {
    type: String,
    required: true
  },
  toCity: {
    type: String,
    required: true
  },
  toCountry: {
    type: String,
    required: true
  },
  maxDate: {
    type: Date,
    default: null // Optional - if null, any date is acceptable
  },
  notified: {
    type: Boolean,
    default: false // Track if user has been notified
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient route searches
tripNotificationSchema.index({ 
  fromCity: 1, 
  fromCountry: 1, 
  toCity: 1, 
  toCountry: 1,
  notified: 1 
});

// Index for cleanup (remove old notifications)
tripNotificationSchema.index({ createdAt: 1 });

export default mongoose.model('TripNotification', tripNotificationSchema);
