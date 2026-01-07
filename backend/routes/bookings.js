const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const EventType = require('../models/EventType');
const Availability = require('../models/Availability');

// Get available time slots for a specific date and event type
router.get('/available-slots', async (req, res) => {
  try {
    const { date, eventTypeId } = req.query;
    
    if (!date || !eventTypeId) {
      return res.status(400).json({ error: 'Date and eventTypeId are required' });
    }

    const eventType = await EventType.findById(eventTypeId);
    if (!eventType) {
      return res.status(404).json({ error: 'Event type not found' });
    }

    const availability = await Availability.findOne().sort({ createdAt: -1 });
    if (!availability) {
      return res.status(404).json({ error: 'Availability not found' });
    }

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    
    // Get the weekly schedule for the selected day
    const daySchedule = availability.weeklySchedule.find(schedule => schedule.day === dayOfWeek);
    
    if (!daySchedule || !daySchedule.isEnabled) {
      return res.json({ availableSlots: [] });
    }

    // Get existing bookings for the date
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.find({
      startTime: { $gte: startOfDay, $lt: endOfDay },
      status: 'scheduled'
    });

    // Generate available time slots
    const availableSlots = [];
    
    for (const timeSlot of daySchedule.timeSlots) {
      const [startHour, startMin] = timeSlot.start.split(':').map(Number);
      const [endHour, endMin] = timeSlot.end.split(':').map(Number);
      
      let currentTime = new Date(selectedDate);
      currentTime.setHours(startHour, startMin, 0, 0);
      
      const slotEndTime = new Date(selectedDate);
      slotEndTime.setHours(endHour, endMin, 0, 0);

      while (currentTime.getTime() + eventType.duration * 60000 <= slotEndTime.getTime()) {
        const slotEnd = new Date(currentTime.getTime() + eventType.duration * 60000);
        
        // Check if this slot conflicts with existing bookings
        const hasConflict = existingBookings.some(booking => {
          return (currentTime < booking.endTime && slotEnd > booking.startTime);
        });

        if (!hasConflict) {
          availableSlots.push({
            startTime: new Date(currentTime),
            endTime: new Date(slotEnd)
          });
        }

        // Move to next slot (30-minute intervals)
        currentTime = new Date(currentTime.getTime() + 30 * 60000);
      }
    }

    res.json({ availableSlots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const { eventTypeId, inviteeName, inviteeEmail, startTime, notes } = req.body;

    if (!eventTypeId || !inviteeName || !inviteeEmail || !startTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const eventType = await EventType.findById(eventTypeId);
    if (!eventType) {
      return res.status(404).json({ error: 'Event type not found' });
    }

    const bookingStartTime = new Date(startTime);
    const bookingEndTime = new Date(bookingStartTime.getTime() + eventType.duration * 60000);

    // Check for double booking
    const conflictingBooking = await Booking.findOne({
      startTime: { $lt: bookingEndTime },
      endTime: { $gt: bookingStartTime },
      status: 'scheduled'
    });

    if (conflictingBooking) {
      return res.status(400).json({ error: 'Time slot is already booked' });
    }

    const booking = new Booking({
      eventType: eventTypeId,
      inviteeName,
      inviteeEmail,
      startTime: bookingStartTime,
      endTime: bookingEndTime,
      notes
    });

    const savedBooking = await booking.save();
    await savedBooking.populate('eventType');

    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
