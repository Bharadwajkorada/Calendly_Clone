const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  timezone: {
    type: String,
    required: true,
    default: 'UTC'
  },
  weeklySchedule: [{
    day: {
      type: Number,
      required: true,
      min: 0,
      max: 6 // 0 = Sunday, 6 = Saturday
    },
    isEnabled: {
      type: Boolean,
      default: true
    },
    timeSlots: [{
      start: {
        type: String,
        required: true,
        match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
      },
      end: {
        type: String,
        required: true,
        match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
      }
    }]
  }],
  bufferTimeBefore: {
    type: Number,
    default: 0,
    min: 0
  },
  bufferTimeAfter: {
    type: Number,
    default: 0,
    min: 0
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

availabilitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Availability', availabilitySchema);
