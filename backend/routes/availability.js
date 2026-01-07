const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');

// Get current availability
router.get('/', async (req, res) => {
  try {
    let availability = await Availability.findOne().sort({ createdAt: -1 });
    
    if (!availability) {
      // Create default availability if none exists
      availability = new Availability({
        timezone: 'UTC',
        weeklySchedule: [
          { day: 1, isEnabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] }, // Monday
          { day: 2, isEnabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] }, // Tuesday
          { day: 3, isEnabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] }, // Wednesday
          { day: 4, isEnabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] }, // Thursday
          { day: 5, isEnabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] }, // Friday
          { day: 6, isEnabled: false, timeSlots: [] }, // Saturday
          { day: 0, isEnabled: false, timeSlots: [] }  // Sunday
        ]
      });
      await availability.save();
    }
    
    res.json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update availability
router.put('/:id', async (req, res) => {
  try {
    const { timezone, weeklySchedule, bufferTimeBefore, bufferTimeAfter } = req.body;
    
    const availability = await Availability.findByIdAndUpdate(
      req.params.id,
      { timezone, weeklySchedule, bufferTimeBefore, bufferTimeAfter },
      { new: true, runValidators: true }
    );

    if (!availability) {
      return res.status(404).json({ error: 'Availability not found' });
    }

    res.json(availability);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create new availability
router.post('/', async (req, res) => {
  try {
    const { timezone, weeklySchedule, bufferTimeBefore, bufferTimeAfter } = req.body;
    
    const availability = new Availability({
      timezone,
      weeklySchedule,
      bufferTimeBefore,
      bufferTimeAfter
    });

    const savedAvailability = await availability.save();
    res.status(201).json(savedAvailability);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
