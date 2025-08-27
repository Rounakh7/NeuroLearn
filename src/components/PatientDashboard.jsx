import React, { useState, useEffect } from "react";
import { useTherapySessions } from "../hooks/useTherapySessions";
import { useUserRole } from "../hooks/useUserRole";
import { useTheme } from "../contexts/ThemeContext";
import TherapyBookingModal from "./TherapyBookingModal";
import TherapySessionCard from "./TherapySessionCard";
import TherapySessionStarter from "./TherapySessionStarter";
import SessionProgress from "./SessionProgress";

function PatientDashboard({ currentUser, onBack, onSignOut, onStartTherapy }) {
  const { userRole } = useUserRole(currentUser);
  const { sessions, therapies, loading, createTherapySession, refreshSessions } = useTherapySessions(currentUser, userRole);
  const { theme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('therapies');
  const [selectedTherapy, setSelectedTherapy] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSessionStarter, setShowSessionStarter] = useState(false);
  const [startingTherapy, setStartingTherapy] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    diagnosis: "",
    emergencyContact: "",
    emergencyPhone: "",
    preferredCommunication: "verbal",
    sensoryPreferences: "",
    currentTherapies: "",
    goals: ""
  });

  const [isEditing, setIsEditing] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (currentUser && userRole) {
      refreshSessions();
    }
  }, [currentUser, userRole]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Here you would typically save to a database
    console.log("Saving patient data:", formData);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleBookTherapy = async (therapy) => {
    setSelectedTherapy(therapy);
    setShowBookingModal(true);
  };

  const handleBookSession = async (therapy) => {
    setSelectedTherapy(therapy);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async (sessionData) => {
    const result = await createTherapySession({
      ...sessionData,
      patientId: currentUser.uid,
      therapyId: selectedTherapy.id,
      therapyTitle: selectedTherapy.title,
      status: 'scheduled'
    });
    
    if (result.success) {
      setShowBookingModal(false);
      setSelectedTherapy(null);
      alert('Therapy session booked successfully!');
    } else {
      alert('Failed to book session. Please try again.');
    }
  };

  const handleStartSession = async (therapy) => {
    if (onStartTherapy) {
      onStartTherapy(therapy);
    } else {
      // Fallback to modal if no routing function provided
      setStartingTherapy(therapy);
      setShowSessionStarter(true);
    }
  };

  const handleCompleteSession = async (sessionData) => {
    try {
      const result = await createTherapySession({
        ...sessionData,
        patientId: currentUser.uid,
        status: 'completed'
      });
      
      if (result.success) {
        if (result.isLocal) {
          alert('Session completed successfully! Great work!\n\nNote: Session saved locally. Configure Firestore rules for cloud storage.');
        } else {
          alert('Session completed successfully! Great work!');
        }
        refreshSessions();
      } else {
        alert('Failed to save session. Please try again.');
      }
    } catch (error) {
      console.error('Error completing session:', error);
      alert('Error saving session data.');
    }
  };

  const getSessionStatusBadge = (status) => {
    const badges = {
      scheduled: 'bg-primary',
      completed: 'bg-success',
      cancelled: 'bg-danger',
      in_progress: 'bg-warning'
    };
    return badges[status] || 'bg-secondary';
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8f9fa' }}>
      <main className="container-fluid flex-grow-1 px-4 py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h1 className="mb-0 text-primary">Patient Dashboard</h1>
              <div className="text-muted">
                Welcome, {currentUser?.displayName || currentUser?.email}
              </div>
            </div>

            {saved && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <i className="fas fa-check-circle me-2"></i>
                Your information has been saved successfully!
              </div>
            )}

            {/* Tab Navigation */}
            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'therapies' ? 'active' : ''}`}
                  onClick={() => setActiveTab('therapies')}
                >
                  <i className="fas fa-brain me-2"></i>
                  Available Therapies
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'sessions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sessions')}
                >
                  <i className="fas fa-calendar me-2"></i>
                  My Sessions
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'progress' ? 'active' : ''}`}
                  onClick={() => setActiveTab('progress')}
                >
                  <i className="fas fa-chart-line me-2"></i>
                  Progress
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="fas fa-user me-2"></i>
                  Profile
                </button>
              </li>
            </ul>

            {/* Tab Content */}
            {activeTab === 'therapies' && (
              <div className="row">
                <div className="col-12">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h4 className="mb-0 text-primary">
                      <i className="fas fa-brain me-2"></i>
                      Available Therapy Programs
                    </h4>
                    <small className="text-muted">{therapies.length} programs available</small>
                  </div>
                  {loading ? (
                    <div className="text-center py-3">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {therapies.map(therapy => (
                        <div key={therapy.id} className="col-xl-3 col-lg-4 col-md-6 mb-3">
                          <div className="card h-100 shadow-sm therapy-card">
                            <div className="card-body p-3">
                              <div className="d-flex align-items-center mb-2">
                                <div className="therapy-icon me-2">
                                  <i className="fas fa-brain text-primary"></i>
                                </div>
                                <h6 className="card-title mb-0 text-truncate">{therapy.title}</h6>
                              </div>
                              <p className="card-text small text-muted mb-3" style={{fontSize: '0.85rem', lineHeight: '1.3'}}>
                                {therapy.description?.substring(0, 80)}...
                              </p>
                              <div className="d-flex gap-2">
                                <button 
                                  className="btn btn-primary btn-sm flex-fill"
                                  onClick={() => handleBookSession(therapy)}
                                  style={{fontSize: '0.8rem', padding: '0.4rem 0.8rem'}}
                                >
                                  <i className="fas fa-calendar-plus me-1"></i>
                                  Book
                                </button>
                                <button 
                                  className="btn btn-outline-success btn-sm flex-fill"
                                  onClick={() => handleStartSession(therapy)}
                                  style={{fontSize: '0.8rem', padding: '0.4rem 0.8rem'}}
                                >
                                  <i className="fas fa-play me-1"></i>
                                  Start
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="row">
                <div className="col-12">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h4 className="mb-0 text-primary">
                      <i className="fas fa-calendar me-2"></i>
                      My Therapy Sessions
                    </h4>
                    <small className="text-muted">{sessions.length} sessions</small>
                  </div>
                  {loading ? (
                    <div className="text-center py-3">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="alert alert-info py-2">
                      <i className="fas fa-info-circle me-2"></i>
                      <small>No sessions booked yet. Visit "Available Therapies" to get started!</small>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {sessions.map((session) => (
                        <div key={session.id} className="col-xl-3 col-lg-4 col-md-6 mb-3">
                          <div className="card h-100 shadow-sm session-card">
                            <div className="card-body p-3">
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <h6 className="card-title mb-0 text-truncate" style={{fontSize: '0.9rem'}}>
                                  {session.therapyTitle}
                                </h6>
                                <span className={`badge ${getSessionStatusBadge(session.status)} badge-sm`} style={{fontSize: '0.7rem'}}>
                                  {session.status.replace('_', ' ')}
                                </span>
                              </div>
                              <div className="mb-2">
                                <small className="text-muted d-block" style={{fontSize: '0.8rem'}}>
                                  <i className="fas fa-clock me-1"></i>
                                  {session.scheduledDate ? 
                                    new Date(session.scheduledDate.toDate()).toLocaleDateString() : 
                                    'Not scheduled'
                                  }
                                </small>
                                {session.scheduledDate && (
                                  <small className="text-muted d-block" style={{fontSize: '0.8rem'}}>
                                    <i className="fas fa-calendar me-1"></i>
                                    {new Date(session.scheduledDate.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </small>
                                )}
                              </div>
                              {session.status === 'scheduled' && (
                                <button className="btn btn-outline-danger btn-sm w-100" style={{fontSize: '0.8rem', padding: '0.4rem'}}>
                                  <i className="fas fa-times me-1"></i>
                                  Cancel Session
                                </button>
                              )}
                              {session.status === 'completed' && (
                                <div className="text-success text-center" style={{fontSize: '0.8rem'}}>
                                  <i className="fas fa-check-circle me-1"></i>
                                  Completed
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div className="row h-100">
                <div className="col-12 h-100">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h4 className={`mb-0 text-primary ${theme.text}`}>
                      <i className="fas fa-chart-line me-2"></i>
                      Your Therapy Progress
                    </h4>
                    <button 
                      className={`btn ${theme.btnPrimary} btn-sm`}
                      onClick={() => setActiveTab('therapies')}
                      style={{fontSize: '0.8rem', padding: '0.4rem 0.8rem'}}
                    >
                      <i className="fas fa-plus me-1"></i>
                      New Session
                    </button>
                  </div>
                  
                  {loading ? (
                    <div className="text-center py-3">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading progress...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-100" style={{ overflowY: 'auto' }}>
                      <SessionProgress sessions={sessions} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="row">
              <div className="col-12">
                <div className="card shadow-sm" style={{ borderRadius: '12px' }}>
                  <div className="card-header bg-primary text-white py-2" style={{ borderRadius: '12px 12px 0 0' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <h5 className="mb-0" style={{fontSize: '1rem'}}>
                        <i className="fas fa-user me-2"></i>
                        Personal Information
                      </h5>
                      <div className="d-flex gap-2">
                        {!isEditing ? (
                          <button 
                            className="btn btn-light btn-sm"
                            onClick={() => setIsEditing(true)}
                            style={{fontSize: '0.8rem', padding: '0.3rem 0.6rem'}}
                          >
                            <i className="fas fa-edit me-1"></i>
                            Edit
                          </button>
                        ) : (
                          <button 
                            className="btn btn-light btn-sm"
                            onClick={() => setIsEditing(false)}
                            style={{fontSize: '0.8rem', padding: '0.3rem 0.6rem'}}
                          >
                            <i className="fas fa-times me-1"></i>
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-3" style={{maxHeight: '70vh', overflowY: 'auto'}}>
                    <form onSubmit={handleSave}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{ borderRadius: '8px' }}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{ borderRadius: '8px' }}
                            required
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">Date of Birth</label>
                          <input
                            type="date"
                            className="form-control"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{ borderRadius: '8px' }}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">Diagnosis</label>
                          <input
                            type="text"
                            className="form-control"
                            name="diagnosis"
                            value={formData.diagnosis}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{ borderRadius: '8px' }}
                            placeholder="e.g., Autism Spectrum Disorder"
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">Emergency Contact</label>
                          <input
                            type="text"
                            className="form-control"
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{ borderRadius: '8px' }}
                            placeholder="Contact person name"
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">Emergency Phone</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="emergencyPhone"
                            value={formData.emergencyPhone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{ borderRadius: '8px' }}
                            placeholder="(555) 123-4567"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Preferred Communication Style</label>
                        <select
                          className="form-select"
                          name="preferredCommunication"
                          value={formData.preferredCommunication}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          style={{ borderRadius: '8px' }}
                        >
                          <option value="verbal">Verbal Communication</option>
                          <option value="visual">Visual Aids</option>
                          <option value="written">Written Instructions</option>
                          <option value="mixed">Mixed Approach</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Sensory Preferences & Sensitivities</label>
                        <textarea
                          className="form-control"
                          name="sensoryPreferences"
                          value={formData.sensoryPreferences}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          style={{ borderRadius: '8px' }}
                          rows="3"
                          placeholder="e.g., Sensitive to loud noises, prefers dim lighting..."
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Current Therapies</label>
                        <textarea
                          className="form-control"
                          name="currentTherapies"
                          value={formData.currentTherapies}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          style={{ borderRadius: '8px' }}
                          rows="3"
                          placeholder="e.g., Speech therapy, Occupational therapy..."
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-medium">Personal Goals</label>
                        <textarea
                          className="form-control"
                          name="goals"
                          value={formData.goals}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          style={{ borderRadius: '8px' }}
                          rows="3"
                          placeholder="What would you like to work on or achieve?"
                        />
                      </div>

                      <div className="d-flex gap-2">
                        {isEditing ? (
                          <button
                            type="submit"
                            className="btn btn-primary px-4"
                            style={{ borderRadius: '8px' }}
                          >
                            <i className="fas fa-save me-2"></i>
                            Save Information
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-outline-primary px-4"
                            onClick={() => setIsEditing(true)}
                            style={{ borderRadius: '8px' }}
                          >
                            <i className="fas fa-edit me-2"></i>
                            Edit Information
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card shadow-sm" style={{ borderRadius: '12px' }}>
                  <div className="card-header bg-info text-white" style={{ borderRadius: '12px 12px 0 0' }}>
                    <h6 className="mb-0">
                      <i className="fas fa-lightbulb me-2"></i>
                      Quick Tips
                    </h6>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="fas fa-check text-success me-2"></i>
                        Complete your profile for personalized experience
                      </li>
                      <li className="mb-2">
                        <i className="fas fa-check text-success me-2"></i>
                        Update sensory preferences for better sessions
                      </li>
                      <li className="mb-2">
                        <i className="fas fa-check text-success me-2"></i>
                        Set clear, achievable goals
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="card shadow-sm mt-3" style={{ borderRadius: '12px' }}>
                  <div className="card-header bg-success text-white" style={{ borderRadius: '12px 12px 0 0' }}>
                    <h6 className="mb-0">
                      <i className="fas fa-calendar me-2"></i>
                      Upcoming Sessions
                    </h6>
                  </div>
                  <div className="card-body">
                    <p className="text-muted">No upcoming sessions scheduled.</p>
                    <button className="btn btn-outline-success btn-sm" style={{ borderRadius: '6px' }}>
                      Schedule Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {showBookingModal && (
        <TherapyBookingModal
          therapy={selectedTherapy}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedTherapy(null);
          }}
          onConfirm={handleConfirmBooking}
        />
      )}

      {/* Session Starter Modal */}
      {showSessionStarter && startingTherapy && (
        <TherapySessionStarter
          therapy={startingTherapy}
          onClose={() => {
            setShowSessionStarter(false);
            setStartingTherapy(null);
          }}
          onComplete={handleCompleteSession}
        />
      )}

      {/* Custom CSS for Compact Layout */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .therapy-card {
          transition: all 0.2s ease;
          border: 1px solid var(--bs-border-color, #e9ecef);
          min-height: 180px;
          background: var(--bs-body-bg, #ffffff);
          color: var(--bs-body-color, #212529);
        }

        .therapy-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          border-color: #007bff;
        }

        .therapy-icon {
          width: 32px;
          height: 32px;
          background: var(--bs-primary-bg-subtle, rgba(0, 123, 255, 0.1));
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--bs-primary, #007bff);
        }

        .session-card {
          transition: all 0.2s ease;
          border: 1px solid var(--bs-border-color, #e9ecef);
          min-height: 160px;
          background: var(--bs-body-bg, #ffffff);
          color: var(--bs-body-color, #212529);
        }

        .session-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          border-color: #28a745;
        }

        .badge-sm {
          font-size: 0.7rem;
          padding: 0.25rem 0.5rem;
        }

        .nav-tabs .nav-link {
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
          border: none;
          color: var(--bs-secondary, #6c757d);
          transition: all 0.2s ease;
        }

        .nav-tabs .nav-link.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .nav-tabs .nav-link:hover:not(.active) {
          color: var(--bs-primary, #007bff);
          background: var(--bs-primary-bg-subtle, rgba(0, 123, 255, 0.05));
          border-radius: 8px;
        }

        .progress-container {
          background: var(--bs-light, rgba(248, 249, 250, 0.5));
          border-radius: 12px;
          padding: 1rem;
        }

        .card-header {
          border-bottom: 1px solid var(--bs-border-color, rgba(0, 0, 0, 0.1));
          background: var(--bs-card-cap-bg, transparent);
          color: var(--bs-card-cap-color, inherit);
        }

        .form-control {
          font-size: 0.9rem;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          border: 1px solid var(--bs-border-color, #ced4da);
          transition: all 0.2s ease;
          background: var(--bs-body-bg, #ffffff);
          color: var(--bs-body-color, #212529);
        }

        .form-control:focus {
          border-color: var(--bs-primary, #007bff);
          box-shadow: 0 0 0 2px var(--bs-primary-bg-subtle, rgba(0, 123, 255, 0.1));
        }

        .form-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--bs-body-color, #495057);
          margin-bottom: 0.4rem;
        }

        .btn-sm {
          font-size: 0.8rem;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
        }

        .alert {
          font-size: 0.9rem;
          border-radius: 10px;
          border: none;
          padding: 0.75rem 1rem;
        }

        /* Responsive adjustments */
        @media (max-width: 1199.98px) {
          .col-xl-3 {
            flex: 0 0 auto;
            width: 25%;
          }
        }

        @media (max-width: 991.98px) {
          .col-lg-4 {
            flex: 0 0 auto;
            width: 33.333333%;
          }
        }

        @media (max-width: 767.98px) {
          .col-md-6 {
            flex: 0 0 auto;
            width: 50%;
          }
          
          .therapy-card,
          .session-card {
            min-height: 140px;
          }
        }

        @media (max-width: 575.98px) {
          .col-md-6 {
            width: 100%;
          }
        }

        /* Light mode specific overrides */
        @media (prefers-color-scheme: light) {
          .therapy-card,
          .session-card {
            background: #ffffff;
            border-color: #e9ecef;
            color: #212529;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }

          .therapy-card:hover,
          .session-card:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-color: #007bff;
          }

          .therapy-icon {
            background: rgba(0, 123, 255, 0.1);
            color: #007bff;
          }

          .progress-container {
            background: rgba(248, 249, 250, 0.8);
          }

          .form-control {
            background: #ffffff;
            border-color: #ced4da;
            color: #212529;
          }

          .form-control:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
          }

          .form-label {
            color: #495057;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .therapy-card,
          .session-card {
            background: rgba(45, 55, 72, 0.95);
            border-color: #4a5568;
            color: #e2e8f0;
          }

          .therapy-card:hover,
          .session-card:hover {
            border-color: #63b3ed;
          }

          .therapy-icon {
            background: rgba(99, 179, 237, 0.2);
            color: #63b3ed;
          }

          .progress-container {
            background: rgba(45, 55, 72, 0.3);
          }

          .form-control {
            background: rgba(45, 55, 72, 0.8);
            border-color: #4a5568;
            color: #e2e8f0;
          }

          .form-control:focus {
            border-color: #63b3ed;
            box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.1);
          }

          .form-label {
            color: #e2e8f0;
          }
        }
        `
      }} />
    </div>
  );
}

export default PatientDashboard;
