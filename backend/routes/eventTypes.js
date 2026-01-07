const express = require('express');
const router = express.Router();
const EventType = require('../models/EventType');

// Get all event types
router.get('/', async (req, res) => {
  try {
    const eventTypes = await EventType.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(eventTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single event type by slug
router.get('/:slug', async (req, res) => {
  try {
    const eventType = await EventType.findOne({ slug: req.params.slug, isActive: true });
    if (!eventType) {
      return res.status(404).json({ error: 'Event type not found' });
    }
    res.json(eventType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new event type
router.post('/', async (req, res) => {
  try {
    const { name, duration, slug, description, color } = req.body;
    
    // Check if slug already exists
    const existingEventType = await EventType.findOne({ slug });
    if (existingEventType) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    const eventType = new EventType({
      name,
      duration,
      slug,
      description,
      color
    });

    const savedEventType = await eventType.save();
    res.status(201).json(savedEventType);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update event type
router.put('/:id', async (req, res) => {
  try {
    const { name, duration, slug, description, color, isActive } = req.body;
    
    // Check if slug is being changed and if new slug already exists
    if (slug) {
      const existingEventType = await EventType.findOne({ 
        slug, 
        _id: { $ne: req.params.id } 
      });
      if (existingEventType) {
        return res.status(400).json({ error: 'Slug already exists' });
      }
    }

    const eventType = await EventType.findByIdAndUpdate(
      req.params.id,
      { name, duration, slug, description, color, isActive },
      { new: true, runValidators: true }
    );

    if (!eventType) {
      return res.status(404).json({ error: 'Event type not found' });
    }

    res.json(eventType);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete event type (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const eventType = await EventType.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!eventType) {
      return res.status(404).json({ error: 'Event type not found' });
    }

    res.json({ message: 'Event type deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
