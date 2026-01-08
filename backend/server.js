const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Initialize Prisma (PostgreSQL)
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Test PostgreSQL connection
(async () => {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL via Prisma');
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
})();

// Make prisma accessible in routes
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Routes (UNCHANGED)
app.use('/api/event-types', require('./routes/eventTypes'));
app.use('/api/availability', require('./routes/availability'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/meetings', require('./routes/meetings'));

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Calendly Clone API Server is running!' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('PostgreSQL disconnected');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
