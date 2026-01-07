import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Link as LinkIcon } from 'lucide-react';
import axios from 'axios';

const EventTypes = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    duration: 30,
    slug: '',
    description: '',
    color: '#0066ff'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    try {
      const response = await axios.get('/api/event-types');
      setEventTypes(response.data);
    } catch (err) {
      setError('Failed to fetch event types');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingEvent) {
        await axios.put(`/api/event-types/${editingEvent._id}`, formData);
        setSuccess('Event type updated successfully');
      } else {
        await axios.post('/api/event-types', formData);
        setSuccess('Event type created successfully');
      }
      
      setFormData({ name: '', duration: 30, slug: '', description: '', color: '#0066ff' });
      setShowForm(false);
      setEditingEvent(null);
      fetchEventTypes();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save event type');
    }
  };

  const handleEdit = (eventType) => {
    setEditingEvent(eventType);
    setFormData({
      name: eventType.name,
      duration: eventType.duration,
      slug: eventType.slug,
      description: eventType.description,
      color: eventType.color
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event type?')) {
      return;
    }

    try {
      await axios.delete(`/api/event-types/${id}`);
      setSuccess('Event type deleted successfully');
      fetchEventTypes();
    } catch (err) {
      setError('Failed to delete event type');
    }
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  if (loading) {
    return <div className="loading">Loading event types...</div>;
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1>Event Types</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingEvent(null);
            setFormData({ name: '', duration: 30, slug: '', description: '', color: '#0066ff' });
          }}
        >
          <Plus size={16} />
          New Event Type
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {showForm && (
        <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ marginBottom: '24px' }}>
            {editingEvent ? 'Edit Event Type' : 'Create Event Type'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Event Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (!editingEvent) {
                    setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                  }
                }}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">URL Slug</label>
              <input
                type="text"
                className="form-input"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duration (minutes)</label>
              <select
                className="form-input"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>120 minutes</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description of your event"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Color</label>
              <input
                type="color"
                className="form-input"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                style={{ height: '40px', width: '100px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary">
                {editingEvent ? 'Update' : 'Create'} Event Type
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingEvent(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: '16px' }}>
        {eventTypes.map((eventType) => (
          <div key={eventType._id} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div 
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      backgroundColor: eventType.color 
                    }} 
                  />
                  <h3 style={{ margin: 0 }}>{eventType.name}</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', margin: '4px 0' }}>
                  {eventType.duration} minutes
                </p>
                {eventType.description && (
                  <p style={{ margin: '8px 0' }}>{eventType.description}</p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                  <LinkIcon size={14} style={{ color: 'var(--text-secondary)' }} />
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    /book/{eventType.slug}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-outline"
                  onClick={() => handleEdit(eventType)}
                  style={{ padding: '8px 12px' }}
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDelete(eventType._id)}
                  style={{ padding: '8px 12px' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {eventTypes.length === 0 && !showForm && (
        <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '16px' }}>No event types yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Create your first event type to start accepting bookings
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            <Plus size={16} />
            Create Event Type
          </button>
        </div>
      )}
    </div>
  );
};

export default EventTypes;
