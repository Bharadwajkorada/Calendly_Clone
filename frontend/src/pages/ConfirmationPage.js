import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, User, Mail, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';

const ConfirmationPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await axios.get(`/api/meetings/${bookingId}`);
      setBooking(response.data);
    } catch (err) {
      setError('Booking not found');
    } finally {
      setLoading(false);
    }
  };

  const addToCalendar = () => {
    const startTime = new Date(booking.startTime);
    const endTime = new Date(booking.endTime);
    
    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(booking.eventType.name)}&dates=${formatDate(startTime)}/${formatDate(endTime)}&details=${encodeURIComponent(`Meeting with ${booking.inviteeName}`)}&location=`;
    
    window.open(calendarUrl, '_blank');
  };

  if (loading) {
    return <div className="loading">Loading booking details...</div>;
  }

  if (error || !booking) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Booking Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>
          The booking you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '24px' }}>
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background-color)' }}>
      <div className="container" style={{ padding: '40px 20px' }}>
        <Link 
          to="/"
          className="btn btn-secondary"
          style={{ marginBottom: '32px' }}
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                backgroundColor: '#f0fdf4', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <CheckCircle size={32} style={{ color: 'var(--success-color)' }} />
              </div>
              <h1 style={{ marginBottom: '8px' }}>Booking Confirmed!</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
                Your meeting has been successfully scheduled
              </p>
            </div>

            <div style={{ 
              backgroundColor: '#f8fafc', 
              padding: '24px', 
              borderRadius: 'var(--radius)', 
              textAlign: 'left',
              marginBottom: '32px'
            }}>
              <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>Meeting Details</h3>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Calendar size={18} style={{ color: 'var(--text-secondary)' }} />
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Date</div>
                    <div style={{ fontWeight: '500' }}>
                      {format(new Date(booking.startTime), 'EEEE, MMMM d, yyyy')}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Clock size={18} style={{ color: 'var(--text-secondary)' }} />
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Time</div>
                    <div style={{ fontWeight: '500' }}>
                      {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <User size={18} style={{ color: 'var(--text-secondary)' }} />
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Event Type</div>
                    <div style={{ fontWeight: '500' }}>{booking.eventType.name}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Mail size={18} style={{ color: 'var(--text-secondary)' }} />
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Participant</div>
                    <div style={{ fontWeight: '500' }}>{booking.inviteeName}</div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{booking.inviteeEmail}</div>
                  </div>
                </div>

                {booking.notes && (
                  <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'white', borderRadius: 'var(--radius)' }}>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Notes</div>
                    <div>{booking.notes}</div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                className="btn btn-primary"
                onClick={addToCalendar}
              >
                Add to Calendar
              </button>
              <Link to="/" className="btn btn-secondary">
                Schedule Another Meeting
              </Link>
            </div>

            <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#fef3c7', borderRadius: 'var(--radius)' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
                <strong>Important:</strong> A confirmation email has been sent to {booking.inviteeEmail}. 
                Please keep this email for your records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
