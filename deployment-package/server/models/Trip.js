import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fromCity: {
    type: String,
    required: true,
    trim: true
  },
  fromCountry: {
    type: String,
    required: true,
    trim: true
  },
  toCity: {
    type: String,
    required: true,
    trim: true
  },
  toCountry: {
    type: String,
    required: true,
    trim: true
  },
  travelDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  serviceFee: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'INR'
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  itemsCanBring: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  viewCount: {
    type: Number,
    default: 0
  },
  requestCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient searching
tripSchema.index({ fromCity: 1, toCity: 1, travelDate: 1 });
tripSchema.index({ status: 1, travelDate: 1 });

export default mongoose.model('Trip', tripSchema);
