import React, { useState, useEffect } from "react";
import { useTherapySessions } from "../hooks/useTherapySessions";
import { useUserRole } from "../hooks/useUserRole";
import { useTheme } from "../contexts/ThemeContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import TherapySessionCard from "./TherapySessionCard";
import Navbar from "./Navbar";

function SpecialistDashboard({ currentUser, onBack, onSignOut }) {
  const { userRole } = useUserRole(currentUser);
  const { sessions, therapies, loading, createTherapySession } = useTherapySessions(currentUser, userRole);
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState('overview');
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "Dr.",
    specialization: "",
    licenseNumber: "",
    yearsExperience: "",
    institution: "",
    contactPhone: "",
    expertise: "",
    approachMethod: "",
    availableHours: "",
    certifications: ""
  });

  const [isEditing, setIsEditing] = useState(true);
  const [saved, setSaved] = useState(false);

  // Fetch patients under this specialist's care
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsQuery = query(
          collection(db, 'therapySessions'),
          where('specialistId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(patientsQuery);
        
        const patientMap = new Map();
        querySnapshot.forEach((doc) => {
          const session = doc.data();
          if (session.patientId && !patientMap.has(session.patientId)) {
            patientMap.set(session.patientId, {
              id: session.patientId,
              email: session.patientEmail || 'Unknown',
              totalSessions: 0,
              completedSessions: 0,
              lastSession: null
            });
          }
        });

        // Count sessions for each patient
        querySnapshot.forEach((doc) => {
          const session = doc.data();
          if (session.patientId && patientMap.has(session.patientId)) {
            const patient = patientMap.get(session.patientId);
            patient.totalSessions++;
            if (session.status === 'completed') {
              patient.completedSessions++;
            }
            if (!patient.lastSession || new Date(session.scheduledDate?.toDate?.() || session.scheduledDate) > new Date(patient.lastSession)) {
              patient.lastSession = session.scheduledDate?.toDate?.() || session.scheduledDate;
            }
          }
        });

        setPatients(Array.from(patientMap.values()));
      } catch (error) {
        console.error('Error fetching patients:', error);
        // Fallback to empty array if Firestore access fails
        setPatients([]);
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchPatients();
  }, [currentUser.uid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Saving specialist data:", formData);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <Navbar 
        onSignInClick={onSignOut} 
        showSignOut={true}
        currentUser={currentUser}
      />
      
      <main className="container py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex align-items-center mb-4">
              <button 
                className="btn btn-outline-secondary me-3"
                onClick={onBack}
                style={{ borderRadius: '8px' }}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Roles
              </button>
              <h2 className="mb-0" style={{ color: '#2c6fbb' }}>Specialist Dashboard</h2>
            </div>

            {saved && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <i className="fas fa-check-circle me-2"></i>
                Your professional profile has been saved successfully!
              </div>
            )}

            <div className="row">
              <div className="col-lg-8">
                <div className="card shadow-sm" style={{ borderRadius: '12px' }}>
                  <div className="card-header text-white" style={{ backgroundColor: '#388e3c', borderRadius: '12px 12px 0 0' }}>
                    <h5 className="mb-0">
                      <i className="fas fa-user-md me-2"></i>
                      Professional Profile
                    </h5>
                  </div>
                  <div className="card-body p-4">
                    <form onSubmit={handleSave}>
                      <h6 className="text-success mb-3">Personal Information</h6>
                      <div className="row">
                        <div className="col-md-2 mb-3">
                          <label className="form-label fw-medium">Title</label>
                          <select
                            className="form-select"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{ borderRadius: '8px' }}
                          >
                            <option value="Dr.">Dr.</option>
                            <option value="Mr.">Mr.</option>
                            <option value="Ms.">Ms.</option>
                            <option value="Mrs.">Mrs.</option>
                          </select>
                        </div>
                        <div className="col-md-5 mb-3">
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
                        <div className="col-md-5 mb-3">
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
                          <label className="form-label fw-medium">Specialization</label>
                          <input
                            type="text"
                            className="form-control"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{ borderRadius: '8px' }}
                            placeholder="e.g., Autism Specialist, Speech Therapist"
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">License Number</label>
                          <input
                            type="text"
                            className="form-control"
                            name="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{ borderRadius: '8px' }}
                            required
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">Years of Experience</label>
                          <input
                            type="number"
                            className="form-control"
                            name="yearsExperience"
                            value={formData.yearsExperience}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{ borderRadius: '8px' }}
                            min="0"
                            max="50"
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">Institution/Clinic</label>
                          <input
                            type="text"
                            className="form-control"
                            name="institution"
                            value={formData.institution}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{ borderRadius: '8px' }}
                            placeholder="Hospital, clinic, or practice name"
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Contact Phone</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          style={{ borderRadius: '8px' }}
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Areas of Expertise</label>
                        <textarea
                          className="form-control"
                          name="expertise"
                          value={formData.expertise}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          style={{ borderRadius: '8px' }}
                          rows="3"
                          placeholder="e.g., ABA therapy, sensory integration, communication disorders..."
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Treatment Approach</label>
                        <textarea
                          className="form-control"
                          name="approachMethod"
                          value={formData.approachMethod}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          style={{ borderRadius: '8px' }}
                          rows="3"
                          placeholder="Describe your therapeutic approach and methodology..."
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-medium">Available Hours</label>
                        <input
                          type="text"
                          className="form-control"
                          name="availableHours"
                          value={formData.availableHours}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          style={{ borderRadius: '8px' }}
                          placeholder="e.g., Mon-Fri 9AM-5PM"
                        />
                      </div>

                      <div className="d-flex gap-2">
                        {isEditing ? (
                          <button
                            type="submit"
                            className="btn btn-success px-4"
                            style={{ borderRadius: '8px' }}
                          >
                            <i className="fas fa-save me-2"></i>
                            Save Profile
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-outline-success px-4"
                            onClick={() => setIsEditing(true)}
                            style={{ borderRadius: '8px' }}
                          >
                            <i className="fas fa-edit me-2"></i>
                            Edit Profile
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
                      <i className="fas fa-calendar-alt me-2"></i>
                      Today's Schedule
                    </h6>
                  </div>
                  <div className="card-body">
                    <p className="text-muted">No appointments scheduled for today.</p>
                    <button className="btn btn-outline-info btn-sm" style={{ borderRadius: '6px' }}>
                      View Calendar
                    </button>
                  </div>
                </div>

                <div className="card shadow-sm mt-3" style={{ borderRadius: '12px' }}>
                  <div className="card-header bg-primary text-white" style={{ borderRadius: '12px 12px 0 0' }}>
                    <h6 className="mb-0">
                      <i className="fas fa-users me-2"></i>
                      Patient Overview
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row text-center">
                      <div className="col-6">
                        <h4 className="text-primary mb-0">0</h4>
                        <small className="text-muted">Active Patients</small>
                      </div>
                      <div className="col-6">
                        <h4 className="text-success mb-0">0</h4>
                        <small className="text-muted">This Week</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SpecialistDashboard;
