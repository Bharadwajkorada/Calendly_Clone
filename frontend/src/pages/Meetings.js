import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, X, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMeetings();
  }, [activeTab]);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/meetings?type=${activeTab}`);
      setMeetings(response.data);
    } catch (err) {
      setError('Failed to fetch meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelMeeting = async (meetingId) => {
    if (!window.confirm('Are you sure you want to cancel this meeting?')) {
      return;
    }

    try {
      await axios.put(`/api/meetings/${meetingId}/cancel`);
      setSuccess('Meeting cancelled successfully');
      fetchMeetings();
    } catch (err) {
      setError('Failed to cancel meeting');
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'cancelled') {
      return <X size={16} style={{ color: 'var(--danger-color)' }} />;
    }
    return <CheckCircle size={16} style={{ color: 'var(--success-color)' }} />;
  };

  const getStatusColor = (status) => {
    return status === 'cancelled' ? 'var(--danger-color)' : 'var(--success-color)';
  };

  if (loading) {
    return <div className="loading">Loading meetings...</div>;
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Users size={24} />
          <h1>Meetings</h1>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <button
            className={`btn ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('upcoming')}
            style={{ borderRadius: 'var(--radius) var(--radius) 0 0', border: 'none' }}
          >
            Upcoming ({meetings.filter(m => m.status !== 'cancelled').length})
          </button>
          <button
            className={`btn ${activeTab === 'past' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('past')}
            style={{ borderRadius: 'var(--radius) var(--radius) 0 0', border: 'none' }}
          >
            Past ({meetings.filter(m => m.status === 'cancelled' || new Date(m.startTime) < new Date()).length})
          </button>
        </div>

        {meetings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ marginBottom: '16px' }}>
              {activeTab === 'upcoming' ? (
                <>
                  <Calendar size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto' }} />
                  <h3 style={{ marginTop: '16px', marginBottom: '8px' }}>No upcoming meetings</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Your scheduled meetings will appear here
                  </p>
                </>
              ) : (
                <>
                  <Clock size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto' }} />
                  <h3 style={{ marginTop: '16px', marginBottom: '8px' }}>No past meetings</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Your past and cancelled meetings will appear here
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {meetings.map((meeting) => (
              <div 
                key={meeting._id} 
                className="card" 
                style={{ 
                  padding: '20px',
                  opacity: meeting.status === 'cancelled' ? 0.6 : 1,
                  backgroundColor: meeting.status === 'cancelled' ? '#f8fafc' : 'var(--surface-color)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      {getStatusIcon(meeting.status)}
                      <h3 style={{ margin: 0 }}>{meeting.eventType.name}</h3>
                      <span 
                        style={{ 
                          fontSize: '12px', 
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          backgroundColor: meeting.status === 'cancelled' ? '#fef2f2' : '#f0fdf4',
                          color: getStatusColor(meeting.status),
                          fontWeight: '500'
                        }}
                      >
                        {meeting.status}
                      </span>
                    </div>
                    
                    <div style={{ display: 'grid', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={14} />
                        <span>{format(new Date(meeting.startTime), 'EEEE, MMMM d, yyyy')}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={14} />
                        <span>
                          {format(new Date(meeting.startTime), 'h:mm a')} - {format(new Date(meeting.endTime), 'h:mm a')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={14} />
                        <span>{meeting.inviteeName} ({meeting.inviteeEmail})</span>
                      </div>
                      {meeting.notes && (
                        <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: 'var(--radius)' }}>
                          <strong>Notes:</strong> {meeting.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {meeting.status === 'scheduled' && new Date(meeting.startTime) > new Date() && (
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleCancelMeeting(meeting._id)}
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Meetings;
