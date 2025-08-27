import React, { useState } from 'react';
import { useUserRole } from '../hooks/useUserRole';

function RoleRegistration({ user, onRoleRegistered }) {
  const { registerUserRole, loading, error } = useUserRole(user);
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    specialization: '', // for specialists
    patientEmail: '', // for parents to link to patient (not used here currently)
    dateOfBirth: '', // for patients
    emergencyContact: '' // for patients
  });
  const [step, setStep] = useState(1);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const additionalData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
    };

    // Add role-specific data
    if (selectedRole === 'specialist') {
      additionalData.specialization = formData.specialization;
      additionalData.patients = []; // Initialize empty patients array
    } else if (selectedRole === 'patient') {
      additionalData.dateOfBirth = formData.dateOfBirth;
      additionalData.emergencyContact = formData.emergencyContact;
      additionalData.therapySessions = [];
    } else if (selectedRole === 'parent') {
      additionalData.linkedPatients = [];
    }

    const result = await registerUserRole(selectedRole, additionalData);

    if (result.success) {
      onRoleRegistered(selectedRole);
    }
  };

  const roleDescriptions = {
    patient: {
      title: 'Patient',
      description: 'Access therapy sessions, track your progress, and learn about autism management techniques.',
      icon: '🧑‍⚕️'
    },
    parent: {
      title: 'Parent/Guardian',
      description: "Monitor your child's therapy progress, access resources, and communicate with specialists.",
      icon: '👨‍👩‍👧‍👦'
    },
    specialist: {
      title: 'Specialist/Therapist',
      description: 'Manage patients, create therapy sessions, and track treatment progress.',
      icon: '👩‍⚕️'
    }
  };

  if (step === 1) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: '#f8f9fa' }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-lg border-0">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">Welcome to CogniBridge!</h2>
                    <p className="text-muted">Please select your role to get started</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="row g-3">
                    {Object.entries(roleDescriptions).map(([role, info]) => (
                      <div key={role} className="col-12">
                        <button
                          className="btn btn-outline-primary w-100 p-4 text-start"
                          onClick={() => handleRoleSelect(role)}
                          disabled={loading}
                        >
                          <div className="d-flex align-items-center">
                            <div className="me-3" style={{ fontSize: '2rem' }}>
                              {info.icon}
                            </div>
                            <div>
                              <h5 className="mb-1">{info.title}</h5>
                              <p className="mb-0 text-muted small">{info.description}</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Show form for profile completion
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: '#f8f9fa' }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h3 className="fw-bold text-primary">
                    {roleDescriptions[selectedRole].icon} Complete Your {roleDescriptions[selectedRole].title} Profile
                  </h3>
                  <p className="text-muted">Please provide some additional information</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="firstName" className="form-label">
                        First Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="lastName" className="form-label">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="phone" className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    {selectedRole === 'specialist' && (
                      <div className="col-12">
                        <label htmlFor="specialization" className="form-label">
                          Specialization *
                        </label>
                        <select
                          className="form-select"
                          id="specialization"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select your specialization</option>
                          <option value="behavioral_therapy">Behavioral Therapy</option>
                          <option value="speech_therapy">Speech Therapy</option>
                          <option value="occupational_therapy">Occupational Therapy</option>
                          <option value="developmental_therapy">Developmental Therapy</option>
                          <option value="psychology">Psychology</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    )}

                    {selectedRole === 'patient' && (
                      <>
                        <div className="col-12">
                          <label htmlFor="dateOfBirth" className="form-label">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-12">
                          <label htmlFor="emergencyContact" className="form-label">
                            Emergency Contact
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="emergencyContact"
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleInputChange}
                            placeholder="Name and phone number"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="d-flex gap-3 mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setStep(1)}
                      disabled={loading}
                    >
                      Back
                    </button>
                    <button type="submit" className="btn btn-primary flex-fill" disabled={loading}>
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Creating Profile...
                        </>
                      ) : (
                        'Complete Registration'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleRegistration;
