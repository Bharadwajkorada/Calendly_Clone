import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import { format, addDays, isSameDay, isToday } from 'date-fns';
import { ArrowLeft, Calendar as CalendarIcon, Clock, User, Mail, MessageSquare } from 'lucide-react';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';



// ✅ 1. ADD BACKEND BASE URL
const API_BASE_URL = "https://calendly-clone-backend-rabv.onrender.com";

const BookingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [eventType, setEventType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    inviteeName: '',
    inviteeEmail: '',
    notes: ''
  });

  useEffect(() => {
    fetchEventType();
  }, [slug]);

  useEffect(() => {
    if (selectedDate && eventType) {
      fetchAvailableSlots();
    }
  }, [selectedDate, eventType]);

  const fetchEventType = async () => {
    try {
      // const response = await axios.get(`/api/event-types/${slug}`);
      // ✅ 2. FIX EVENT TYPE FETCH
       const response = await axios.get(
        `${API_BASE_URL}/api/event-types/${slug}`
      );
      setEventType(response.data);
    } catch (err) {
      setError('Event type not found');
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true);
    setError('');
    
    try {
      // const response = await axios.get('/api/bookings/available-slots', {
      //   params: {
      //     date: format(selectedDate, 'yyyy-MM-dd'),
      //     eventTypeId: eventType._id
      //   }
      // });
      // ✅ 3. FIX AVAILABLE SLOTS FETCH
      const response = await axios.get(
        `${API_BASE_URL}/api/bookings/available-slots`,
        {
          params: {
            date: format(selectedDate, 'yyyy-MM-dd'),
            eventTypeId: eventType._id
          }
        }
      );
      setAvailableSlots(response.data.availableSlots);
    } catch (err) {
      setError('Failed to load available time slots');
    } finally {
      setLoadingSlots(false);
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    if (date < new Date().setHours(0, 0, 0, 0)) {
      return;
    }
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep(1);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBooking(true);
    setError('');

    try {
      // const response = await axios.post('/api/bookings', {
      //   eventTypeId: eventType._id,
      //   inviteeName: formData.inviteeName,
      //   inviteeEmail: formData.inviteeEmail,
      //   startTime: selectedSlot.startTime,
      //   notes: formData.notes
      // });
      // ✅ 4. FIX CREATE BOOKING API
      const response = await axios.post(
        `${API_BASE_URL}/api/bookings`,
        {
          eventTypeId: eventType._id,
          inviteeName: formData.inviteeName,
          inviteeEmail: formData.inviteeEmail,
          startTime: selectedSlot.startTime,
          notes: formData.notes
        }
      );

      navigate(`/confirmation/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setBooking(false);
    }
  };

  const tileDisabled = ({ date, view }) => {
    if (view !== 'month') return false;
    return date < new Date().setHours(0, 0, 0, 0);
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;
    if (isSameDay(date, selectedDate)) return 'selected';
    if (isToday(date)) return 'today';
    return null;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!eventType) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Event Type Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>
          The event type you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background-color)' }}>
      <div className="container" style={{ padding: '40px 20px' }}>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/')}
          style={{ marginBottom: '32px' }}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Left Column - Event Info */}
          <div>
            <div className="card" style={{ padding: '32px' }}>
              <h1 style={{ marginBottom: '16px' }}>{eventType.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Clock size={16} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  {eventType.duration} minutes
                </span>
              </div>
              {eventType.description && (
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {eventType.description}
                </p>
              )}
            </div>

            {selectedDate && (
              <div className="card" style={{ padding: '24px', marginTop: '24px' }}>
                <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CalendarIcon size={18} />
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h3>
                
                {loadingSlots ? (
                  <div className="loading">Loading available times...</div>
                ) : availableSlots.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>
                    No available time slots for this date
                  </p>
                ) : (
                  <div className="time-slots-grid">
                    {availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        className={`time-slot ${selectedSlot?.startTime === slot.startTime ? 'selected' : ''}`}
                        onClick={() => handleSlotSelect(slot)}
                      >
                        {format(new Date(slot.startTime), 'h:mm a')}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Calendar and Form */}
          <div>
            <div className="calendar-container">
              <h3 style={{ marginBottom: '24px' }}>Select a Date</h3>
              <Calendar
                onChange={handleDateSelect}
                value={selectedDate}
                tileDisabled={tileDisabled}
                tileClassName={tileClassName}
                minDate={new Date()}
                maxDate={addDays(new Date(), 90)}
              />
            </div>

            {step === 2 && selectedSlot && (
              <div className="card" style={{ padding: '24px', marginTop: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>Enter Your Details</h3>
                
                {error && <div className="error">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">
                      <User size={14} style={{ display: 'inline', marginRight: '6px' }} />
                      Name *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.inviteeName}
                      onChange={(e) => setFormData({ ...formData, inviteeName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Mail size={14} style={{ display: 'inline', marginRight: '6px' }} />
                      Email *
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.inviteeEmail}
                      onChange={(e) => setFormData({ ...formData, inviteeEmail: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <MessageSquare size={14} style={{ display: 'inline', marginRight: '6px' }} />
                      Notes (optional)
                    </label>
                    <textarea
                      className="form-input form-textarea"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any additional information for the meeting"
                    />
                  </div>

                  <div style={{ 
                    padding: '16px', 
                    backgroundColor: '#f8fafc', 
                    borderRadius: 'var(--radius)',
                    marginBottom: '20px'
                  }}>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <div><strong>Date:</strong> {format(selectedDate, 'EEEE, MMMM d, yyyy')}</div>
                      <div><strong>Time:</strong> {format(new Date(selectedSlot.startTime), 'h:mm a')}</div>
                      <div><strong>Duration:</strong> {eventType.duration} minutes</div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={booking}
                    style={{ width: '100%' }}
                  >
                    {booking ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .react-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
        }
        
        .react-calendar__tile {
          border-radius: var(--radius);
        }
        
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #f0f7ff;
        }
        
        .react-calendar__tile.selected {
          background-color: var(--primary-color);
          color: white;
        }
        
        .react-calendar__tile.today {
          background-color: #f0f7ff;
          color: var(--primary-color);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default BookingPage;
