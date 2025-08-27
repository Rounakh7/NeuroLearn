import React, { useState, useEffect } from "react";
import { useTherapySessions } from "../hooks/useTherapySessions";
import { useUserRole } from "../hooks/useUserRole";
import Navbar from "./Navbar";

function ParentDashboard({ currentUser, onBack, onSignOut }) {
  const { userRole } = useUserRole(currentUser);
  const { sessions, linkPatientToParent, loading } = useTherapySessions(currentUser, userRole);
  
  const [activeTab, setActiveTab] = useState('patients');
  const [patientEmail, setPatientEmail] = useState('');
  const [linkingPatient, setLinkingPatient] = useState(false);
  const [linkedPatients, setLinkedPatients] = useState([]);
  
  const [formData, setFormData] = useState({
    parentName: "",
    relationship: "mother",
    childName: "",
    childAge: "",
    childDiagnosis: "",
    concerns: "",
    supportNeeds: "",
    homeEnvironment: "",
    schoolInfo: "",
    therapyHistory: "",
    goals: ""
  });

  const [isEditing, setIsEditing] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Saving parent data:", formData);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLinkPatient = async (e) => {
    e.preventDefault();
    if (!patientEmail.trim()) return;
    
    setLinkingPatient(true);
    const result = await linkPatientToParent(patientEmail.trim());
    
    if (result.success) {
      alert(`Successfully linked patient: ${patientEmail}`);
      setPatientEmail('');
      // Refresh linked patients list
      // This would typically fetch from Firestore
    } else {
      alert(`Failed to link patient: ${result.error}`);
    }
    
    setLinkingPatient(false);
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
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <Navbar 
        onSignInClick={onSignOut} 
        showSignOut={true}
        currentUser={currentUser}
      />
      
      <main className="container py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h1 className="mb-0 text-primary">Parent/Guardian Dashboard</h1>
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

            <div className="row">
              <div className="col-lg-8">
                <div className="card shadow-sm" style={{ borderRadius: '12px' }}>
                  <div className="card-header text-white" style={{ backgroundColor: '#7b1fa2', borderRadius: '12px 12px 0 0' }}>
                    <h5 className="mb-0">
                      <i className="fas fa-heart me-2"></i>
                      Family Information
                    </h5>
                  </div>
                  <div className="card-body p-4">
                    <form onSubmit={handleSave}>
                      <h6 className="text-primary mb-3">Parent/Guardian Details</h6>
                      <div className="row">
                        <div className="col-md-8 mb-3">
                          <label className="form-label fw-medium">Your Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="parentName"
                            value={formData.parentName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{ borderRadius: '8px' }}
                            required
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-medium">Relationship</label>
                          <select
                            className="form-select"
                            name="relationship"
                            value={formData.relationship}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{ borderRadius: '8px' }}
                          >
                            <option value="mother">Mother</option>
                            <option value="father">Father</option>
                            <option value="guardian">Guardian</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <hr className="my-4" />
                      <h6 className="text-primary mb-3">Child Information</h6>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">Child's Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="childName"
                            value={formData.childName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{ borderRadius: '8px' }}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">Child's Age</label>
                          <input
                            type="number"
                            className="form-control"
                            name="childAge"
                            value={formData.childAge}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{ borderRadius: '8px' }}
                            min="1"
                            max="25"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Diagnosis/Condition</label>
                        <input
                          type="text"
                          className="form-control"
                          name="childDiagnosis"
                          value={formData.childDiagnosis}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          style={{ borderRadius: '8px' }}
                          placeholder="e.g., Autism Spectrum Disorder, ADHD..."
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Current Concerns</label>
                        <textarea
                          className="form-control"
                          name="concerns"
                          value={formData.concerns}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          style={{ borderRadius: '8px' }}
                          rows="3"
                          placeholder="What challenges is your child currently facing?"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Support Needs</label>
                        <textarea
                          className="form-control"
                          name="supportNeeds"
                          value={formData.supportNeeds}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          style={{ borderRadius: '8px' }}
                          rows="3"
                          placeholder="What kind of support are you looking for?"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Home Environment</label>
                        <textarea
                          className="form-control"
                          name="homeEnvironment"
                          value={formData.homeEnvironment}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          style={{ borderRadius: '8px' }}
                          rows="2"
                          placeholder="Describe your home setup and family dynamics..."
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">School/Educational Information</label>
                        <textarea
                          className="form-control"
                          name="schoolInfo"
                          value={formData.schoolInfo}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          style={{ borderRadius: '8px' }}
                          rows="2"
                          placeholder="School name, special programs, IEP details..."
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-medium">Goals for Your Child</label>
                        <textarea
                          className="form-control"
                          name="goals"
                          value={formData.goals}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          style={{ borderRadius: '8px' }}
                          rows="3"
                          placeholder="What do you hope to achieve through this platform?"
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
                  <div className="card-header bg-warning text-dark" style={{ borderRadius: '12px 12px 0 0' }}>
                    <h6 className="mb-0">
                      <i className="fas fa-info-circle me-2"></i>
                      Parent Resources
                    </h6>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="fas fa-book text-primary me-2"></i>
                        <a href="#" className="text-decoration-none">Parent Guide</a>
                      </li>
                      <li className="mb-2">
                        <i className="fas fa-users text-success me-2"></i>
                        <a href="#" className="text-decoration-none">Support Groups</a>
                      </li>
                      <li className="mb-2">
                        <i className="fas fa-phone text-info me-2"></i>
                        <a href="#" className="text-decoration-none">Emergency Contacts</a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="card shadow-sm mt-3" style={{ borderRadius: '12px' }}>
                  <div className="card-header bg-secondary text-white" style={{ borderRadius: '12px 12px 0 0' }}>
                    <h6 className="mb-0">
                      <i className="fas fa-chart-line me-2"></i>
                      Child's Progress
                    </h6>
                  </div>
                  <div className="card-body">
                    <p className="text-muted">Complete your child's profile to view progress tracking.</p>
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

export default ParentDashboard;
