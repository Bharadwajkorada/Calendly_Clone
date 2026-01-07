import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventTypes from './pages/EventTypes';
import Availability from './pages/Availability';
import Meetings from './pages/Meetings';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<EventTypes />} />
          <Route path="/event-types" element={<EventTypes />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/book/:slug" element={<BookingPage />} />
          <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
