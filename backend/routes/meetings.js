const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Get all meetings (upcoming and past)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const now = new Date();
    
    let query = {};
    
    if (type === 'upcoming') {
      query.startTime = { $gte: now };
    } else if (type === 'past') {
      query.startTime = { $lt: now };
    }
    
    const meetings = await Booking.find(query)
      .populate('eventType')
      .sort({ startTime: type === 'past' ? -1 : 1 });
    
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel a meeting
router.put('/:id/cancel', async (req, res) => {
  try {
    const meeting = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    ).populate('eventType');

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.json(meeting);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get single meeting by ID
router.get('/:id', async (req, res) => {
  try {
    const meeting = await Booking.findById(req.params.id).populate('eventType');
    
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
