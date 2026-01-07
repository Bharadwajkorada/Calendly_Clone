# Calendly Clone - Scheduling Application

A full-stack scheduling application that replicates Calendly's functionality and design. Built with React.js for the frontend and Node.js/Express for the backend with MongoDB Atlas database.

## Features

### Core Features
- **Event Types Management**: Create, edit, and delete different types of events with custom durations and URLs
- **Availability Settings**: Configure weekly schedules, time slots, and timezone settings
- **Public Booking Page**: Beautiful calendar interface for users to book appointments
- **Meetings Management**: View upcoming and past meetings with cancellation options
- **Booking Confirmation**: Professional confirmation page with calendar integration

### Technical Features
- Responsive design that works on desktop, tablet, and mobile
- Real-time availability checking to prevent double bookings
- Clean, modern UI inspired by Calendly's design patterns
- RESTful API architecture
- MongoDB database with proper schema design

## Tech Stack

### Frontend
- **React.js** 18.2.0
- **React Router** for navigation
- **React Calendar** for date selection
- **Lucide React** for icons
- **Axios** for API calls
- **Date-fns** for date manipulation

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **CORS** for cross-origin requests
- **dotenv** for environment variables

## Project Structure

```
ASG/
├── backend/
│   ├── models/           # Database models
│   │   ├── EventType.js
│   │   ├── Availability.js
│   │   └── Booking.js
│   ├── routes/           # API routes
│   │   ├── eventTypes.js
│   │   ├── availability.js
│   │   ├── bookings.js
│   │   └── meetings.js
│   ├── server.js         # Main server file
│   ├── seed.js          # Database seed script
│   ├── package.json
│   └── .env.example     # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   │   └── Navbar.js
│   │   ├── pages/        # Page components
│   │   │   ├── EventTypes.js
│   │   │   ├── Availability.js
│   │   │   ├── Meetings.js
│   │   │   ├── BookingPage.js
│   │   │   └── ConfirmationPage.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (for cloud database)

### 1. Clone and Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Edit .env file with your MongoDB Atlas connection string
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/calendly-clone
```

### 2. Setup Database

```bash
# Run the seed script to populate initial data
node seed.js
```

### 3. Start Backend Server

```bash
# Start the backend server
npm run dev

# Server will run on http://localhost:5000
```

### 4. Setup Frontend

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the frontend development server
npm start

# Frontend will run on http://localhost:3000
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
NODE_ENV=development
```

## API Endpoints

### Event Types
- `GET /api/event-types` - Get all event types
- `GET /api/event-types/:slug` - Get event type by slug
- `POST /api/event-types` - Create new event type
- `PUT /api/event-types/:id` - Update event type
- `DELETE /api/event-types/:id` - Delete event type (soft delete)

### Availability
- `GET /api/availability` - Get current availability settings
- `POST /api/availability` - Create new availability settings
- `PUT /api/availability/:id` - Update availability settings

### Bookings
- `GET /api/bookings/available-slots?date=YYYY-MM-DD&eventTypeId=ID` - Get available time slots
- `POST /api/bookings` - Create new booking

### Meetings
- `GET /api/meetings?type=upcoming|past` - Get meetings
- `GET /api/meetings/:id` - Get single meeting
- `PUT /api/meetings/:id/cancel` - Cancel meeting

## Usage

### Admin Side (No Authentication Required)
1. **Event Types**: Navigate to `/event-types` to create and manage different types of meetings
2. **Availability**: Go to `/availability` to set your working hours and timezone
3. **Meetings**: View all your scheduled meetings at `/meetings`

### Public Booking
1. Each event type has a unique booking URL: `/book/:slug`
2. Users can select dates from a calendar interface
3. Available time slots are displayed based on your availability
4. Users fill out a simple form to complete the booking
5. Confirmation page with calendar integration

## Sample Data

The seed script creates:
- 4 sample event types (15min, 30min, 60min, 90min meetings)
- Default availability (Monday-Friday, 9 AM - 5 PM, EST timezone)

## Deployment

### Backend (Render/Railway)
1. Deploy the backend to a service like Render or Railway
2. Set the MONGODB_URI environment variable
3. Ensure CORS is properly configured for your frontend domain

### Frontend (Vercel/Netlify)
1. Deploy the React app to Vercel or Netlify
2. Update the API base URL in your frontend if needed
3. The build process will handle production optimization

## Key Features Implemented

### UI/UX Design
- Clean, modern interface inspired by Calendly
- Responsive design for all screen sizes
- Smooth transitions and hover effects
- Professional color scheme and typography
- Intuitive navigation and user flow

### Database Schema
- **EventType**: Stores meeting types with duration, slug, and metadata
- **Availability**: Manages weekly schedules and timezone settings
- **Booking**: Tracks all scheduled meetings with status and details

### Security & Validation
- Input validation on both frontend and backend
- Prevention of double bookings
- Proper error handling and user feedback
- CORS configuration for API security

## Future Enhancements

These features were not implemented but could be added:
- Email notifications for booking confirmations
- User authentication system
- Multiple availability schedules
- Rescheduling functionality
- Custom invitee questions
- Buffer time settings
- Date-specific availability overrides

## License

This project is for educational purposes. Please ensure you have the right to use any deployed version commercially.
