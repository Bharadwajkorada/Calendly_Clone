const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  eventType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventType',
    required: true
  },
  inviteeName: {
    type: String,
    required: true,
    trim: true
  },
  inviteeEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'cancelled'],
    default: 'scheduled'
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index to prevent double bookings
bookingSchema.index({ startTime: 1, endTime: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
