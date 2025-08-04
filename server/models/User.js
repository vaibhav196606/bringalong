import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  linkedinUrl: {
    type: String,
    required: function() { return this.role === 'traveler'; }
  },
  instagramId: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  bio: {
    type: String,
    maxlength: 500
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['traveler', 'requester', 'both'],
    default: 'both'
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
