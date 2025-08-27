import React, { useState } from 'react';

function TherapyBookingModal({ therapy, onClose, onConfirm }) {
  const [bookingData, setBookingData] = useState({
    scheduledDate: '',
    scheduledTime: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Combine date and time into a single Date object
    const scheduledDateTime = new Date(`${bookingData.scheduledDate}T${bookingData.scheduledTime}`);
    
    onConfirm({
      ...bookingData,
      scheduledDate: scheduledDateTime
    });
  };

  if (!therapy) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Book Therapy Session</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-4">
              <h6 className="text-primary">{therapy.title}</h6>
              <p className="text-muted small">{therapy.description}</p>
              <div className="d-flex gap-2 mb-3">
                <span className="badge bg-secondary">{therapy.duration} minutes</span>
                <span className="badge bg-info">{therapy.difficulty}</span>
                <span className="badge bg-success">{therapy.category.replace('_', ' ')}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="scheduledDate" className="form-label">Preferred Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    id="scheduledDate"
                    name="scheduledDate"
                    value={bookingData.scheduledDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="scheduledTime" className="form-label">Preferred Time *</label>
                  <input
                    type="time"
                    className="form-control"
                    id="scheduledTime"
                    name="scheduledTime"
                    value={bookingData.scheduledTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="notes" className="form-label">Additional Notes</label>
                <textarea
                  className="form-control"
                  id="notes"
                  name="notes"
                  rows="3"
                  value={bookingData.notes}
                  onChange={handleInputChange}
                  placeholder="Any specific requirements or preferences..."
                ></textarea>
              </div>

              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Note:</strong> This is a booking request. A specialist will confirm your appointment and contact you with final details.
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Book Session
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TherapyBookingModal;
