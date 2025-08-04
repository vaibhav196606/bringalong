import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemDescription: {
    type: String,
    required: true,
    trim: true
  },
  estimatedSize: {
    type: String,
    trim: true
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  maxBudget: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryLocation: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-transit', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  travelerNotes: {
    type: String,
    maxlength: 500
  },
  estimatedCost: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
requestSchema.index({ tripId: 1, status: 1 });
requestSchema.index({ requesterId: 1, status: 1 });

export default mongoose.model('Request', requestSchema);
