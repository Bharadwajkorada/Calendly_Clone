const mongoose = require('mongoose');
const EventType = require('./models/EventType');
const Availability = require('./models/Availability');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/calendly-clone');
    console.log('Connected to MongoDB');

    // Clear existing data
    await EventType.deleteMany({});
    await Availability.deleteMany({});
    console.log('Cleared existing data');

    // Create sample event types
    const eventTypes = [
      {
        name: '30 Minute Meeting',
        duration: 30,
        slug: '30min',
        description: 'A quick 30-minute meeting to discuss your project or ideas',
        color: '#0066ff'
      },
      {
        name: '60 Minute Consultation',
        duration: 60,
        slug: '60min',
        description: 'In-depth consultation to discuss your requirements in detail',
        color: '#10b981'
      },
      {
        name: '15 Minute Quick Chat',
        duration: 15,
        slug: '15min',
        description: 'A brief 15-minute call for quick questions or introductions',
        color: '#f59e0b'
      },
      {
        name: 'Project Kickoff',
        duration: 90,
        slug: 'project-kickoff',
        description: 'Comprehensive project kickoff meeting to align on goals and timeline',
        color: '#8b5cf6'
      }
    ];

    const createdEventTypes = await EventType.insertMany(eventTypes);
    console.log('Created event types:', createdEventTypes.length);

    // Create default availability
    const availability = new Availability({
      timezone: 'America/New_York',
      weeklySchedule: [
        { day: 1, isEnabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] }, // Monday
        { day: 2, isEnabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] }, // Tuesday
        { day: 3, isEnabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] }, // Wednesday
        { day: 4, isEnabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] }, // Thursday
        { day: 5, isEnabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] }, // Friday
        { day: 6, isEnabled: false, timeSlots: [] }, // Saturday
        { day: 0, isEnabled: false, timeSlots: [] }  // Sunday
      ],
      bufferTimeBefore: 0,
      bufferTimeAfter: 0
    });

    await availability.save();
    console.log('Created default availability');

    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
