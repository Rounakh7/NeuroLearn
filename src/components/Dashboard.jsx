import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Navbar from "./Navbar";
import PatientDashboard from "./PatientDashboard";
import ParentDashboard from "./ParentDashboard";
import SpecialistDashboard from "./SpecialistDashboard";

function Dashboard() {
  const { currentUser, signOut } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
  };

  // If a role is selected, show the specific dashboard
  if (selectedRole) {
    const dashboardProps = {
      currentUser,
      onBack: handleBackToRoles,
      onSignOut: handleSignOut
    };

    switch (selectedRole) {
      case 'patient':
        return <PatientDashboard {...dashboardProps} />;
      case 'parent':
        return <ParentDashboard {...dashboardProps} />;
      case 'specialist':
        return <SpecialistDashboard {...dashboardProps} />;
      default:
        return null;
    }
  }

  // Main role selection dashboard
  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <Navbar 
        onSignInClick={handleSignOut} 
        showSignOut={true}
        currentUser={currentUser}
      />
      
      <main className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold mb-3" style={{ color: '#2c6fbb' }}>
            Welcome to NeuroLearn
          </h1>
          <p className="lead text-muted">
            Choose your role to access your personalized dashboard
          </p>
        </div>

        <div className="row justify-content-center g-4">
          {/* Patient Card */}
          <div className="col-md-4">
            <div 
              className="card h-100 shadow-sm border-0 role-card"
              style={{ 
                borderRadius: '15px',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onClick={() => handleRoleSelect('patient')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}
            >
              <div className="card-body text-center p-4">
                <div 
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '50%',
                    color: '#1976d2'
                  }}
                >
                  <i className="fas fa-user fa-2x"></i>
                </div>
                <h4 className="card-title mb-3" style={{ color: '#2c6fbb' }}>Patient</h4>
                <p className="card-text text-muted">
                  Access your personal therapy sessions, progress tracking, and learning activities
                </p>
                <button className="btn btn-primary btn-lg mt-3" style={{ borderRadius: '8px' }}>
                  Enter Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* Parent Card */}
          <div className="col-md-4">
            <div 
              className="card h-100 shadow-sm border-0 role-card"
              style={{ 
                borderRadius: '15px',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onClick={() => handleRoleSelect('parent')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}
            >
              <div className="card-body text-center p-4">
                <div 
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#f3e5f5',
                    borderRadius: '50%',
                    color: '#7b1fa2'
                  }}
                >
                  <i className="fas fa-heart fa-2x"></i>
                </div>
                <h4 className="card-title mb-3" style={{ color: '#2c6fbb' }}>Parent</h4>
                <p className="card-text text-muted">
                  Monitor your child's progress, manage appointments, and access family resources
                </p>
                <button className="btn btn-primary btn-lg mt-3" style={{ borderRadius: '8px' }}>
                  Enter Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* Specialist Card */}
          <div className="col-md-4">
            <div 
              className="card h-100 shadow-sm border-0 role-card"
              style={{ 
                borderRadius: '15px',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onClick={() => handleRoleSelect('specialist')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}
            >
              <div className="card-body text-center p-4">
                <div 
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#e8f5e8',
                    borderRadius: '50%',
                    color: '#388e3c'
                  }}
                >
                  <i className="fas fa-user-md fa-2x"></i>
                </div>
                <h4 className="card-title mb-3" style={{ color: '#2c6fbb' }}>Specialist</h4>
                <p className="card-text text-muted">
                  Manage patient cases, create treatment plans, and track therapy outcomes
                </p>
                <button className="btn btn-primary btn-lg mt-3" style={{ borderRadius: '8px' }}>
                  Enter Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
