import React, { useState, useEffect } from 'react';
import { Clock, Save } from 'lucide-react';
import axios from 'axios';

const Availability = () => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const daysOfWeek = [
    { name: 'Sunday', value: 0 },
    { name: 'Monday', value: 1 },
    { name: 'Tuesday', value: 2 },
    { name: 'Wednesday', value: 3 },
    { name: 'Thursday', value: 4 },
    { name: 'Friday', value: 5 },
    { name: 'Saturday', value: 6 }
  ];

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Kolkata'
  ];

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await axios.get('/api/availability');
      setAvailability(response.data);
    } catch (err) {
      setError('Failed to fetch availability settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!availability) return;
    
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await axios.put(`/api/availability/${availability._id}`, availability);
      setSuccess('Availability settings saved successfully');
    } catch (err) {
      setError('Failed to save availability settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDayToggle = (dayIndex) => {
    if (!availability) return;
    const updatedSchedule = [...availability.weeklySchedule];
    updatedSchedule[dayIndex].isEnabled = !updatedSchedule[dayIndex].isEnabled;
    setAvailability({ ...availability, weeklySchedule: updatedSchedule });
  };

  const handleTimeSlotChange = (dayIndex, slotIndex, field, value) => {
    if (!availability) return;
    const updatedSchedule = [...availability.weeklySchedule];
    updatedSchedule[dayIndex].timeSlots[slotIndex][field] = value;
    setAvailability({ ...availability, weeklySchedule: updatedSchedule });
  };

  const addTimeSlot = (dayIndex) => {
    if (!availability) return;
    const updatedSchedule = [...availability.weeklySchedule];
    updatedSchedule[dayIndex].timeSlots.push({ start: '09:00', end: '17:00' });
    setAvailability({ ...availability, weeklySchedule: updatedSchedule });
  };

  const removeTimeSlot = (dayIndex, slotIndex) => {
    if (!availability) return;
    const updatedSchedule = [...availability.weeklySchedule];
    updatedSchedule[dayIndex].timeSlots.splice(slotIndex, 1);
    setAvailability({ ...availability, weeklySchedule: updatedSchedule });
  };

  if (loading) {
    return <div className="loading">Loading availability settings...</div>;
  }

  if (!availability) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Unable to Load Availability</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>
            {error || 'Please check your backend connection and try again.'}
          </p>
          <button 
            className="btn btn-primary"
            onClick={fetchAvailability}
            style={{ marginTop: '24px' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock size={24} />
          <h1>Availability</h1>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '24px' }}>General Settings</h2>
        
        <div className="form-group">
          <label className="form-label">Timezone</label>
          <select
            className="form-input"
            value={availability.timezone}
            onChange={(e) => setAvailability({ ...availability, timezone: e.target.value })}
            style={{ maxWidth: '300px' }}
          >
            {timezones.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Buffer Time Before (minutes)</label>
            <input
              type="number"
              className="form-input"
              value={availability.bufferTimeBefore}
              onChange={(e) => setAvailability({ ...availability, bufferTimeBefore: parseInt(e.target.value) || 0 })}
              min="0"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Buffer Time After (minutes)</label>
            <input
              type="number"
              className="form-input"
              value={availability.bufferTimeAfter}
              onChange={(e) => setAvailability({ ...availability, bufferTimeAfter: parseInt(e.target.value) || 0 })}
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <h2 style={{ marginBottom: '24px' }}>Weekly Schedule</h2>
        
        <div style={{ display: 'grid', gap: '24px' }}>
          {availability.weeklySchedule.map((day, dayIndex) => (
            <div key={day.day} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    checked={day.isEnabled}
                    onChange={() => handleDayToggle(dayIndex)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <h3 style={{ margin: 0 }}>{daysOfWeek[day.day].name}</h3>
                </div>
                {day.isEnabled && (
                  <button 
                    className="btn btn-outline"
                    onClick={() => addTimeSlot(dayIndex)}
                    style={{ padding: '6px 12px', fontSize: '14px' }}
                  >
                    Add Time Slot
                  </button>
                )}
              </div>

              {day.isEnabled && (
                <div style={{ marginLeft: '36px' }}>
                  {day.timeSlots.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      No time slots configured
                    </p>
                  ) : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {day.timeSlots.map((slot, slotIndex) => (
                        <div key={slotIndex} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input
                            type="time"
                            className="form-input"
                            value={slot.start}
                            onChange={(e) => handleTimeSlotChange(dayIndex, slotIndex, 'start', e.target.value)}
                            style={{ maxWidth: '120px' }}
                          />
                          <span style={{ color: 'var(--text-secondary)' }}>to</span>
                          <input
                            type="time"
                            className="form-input"
                            value={slot.end}
                            onChange={(e) => handleTimeSlotChange(dayIndex, slotIndex, 'end', e.target.value)}
                            style={{ maxWidth: '120px' }}
                          />
                          {day.timeSlots.length > 1 && (
                            <button 
                              className="btn btn-danger"
                              onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                              style={{ padding: '6px 12px', fontSize: '14px' }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Availability;
