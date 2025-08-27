import React, { useState } from 'react';
import { useUserRole } from '../hooks/useUserRole';
import SkillModuleManager from './SkillModuleManager';
import ABASession from './ABASession';
import ProgressTracker from './ProgressTracker';
import ErrorBoundary from './ErrorBoundary';

function ABADashboard({ currentUser, onBack, onSignOut, therapy }) {
  const { userRole } = useUserRole();
  const [selectedModule, setSelectedModule] = useState(null);
  const [showSession, setShowSession] = useState(false);

  const handleModuleSelect = async (module) => {
    try {
      // Start the selected module
      console.log('Starting module:', module);
      
      // Set the selected module and show the session
      setSelectedModule(module);
      setShowSession(true);
      
    } catch (error) {
      console.error('Error starting module:', error);
      alert('Error starting module. Please try again.');
    }
  };

  const handleSessionComplete = (sessionResult) => {
    // Hide the session and return to module selection
    setShowSession(false);
    setSelectedModule(null);
    
    // Show completion message
    if (sessionResult && sessionResult.totalPoints > 0) {
      alert(`Great job! You earned ${sessionResult.totalPoints} points!`);
    }
  };

  const handleSessionClose = () => {
    // Hide the session and return to module selection
    setShowSession(false);
    setSelectedModule(null);
  };

  // Show ABASession if a module is selected
  if (showSession && selectedModule) {
    return (
      <ABASession
        module={selectedModule}
        therapy={therapy}
        currentUser={currentUser}
        onComplete={handleSessionComplete}
        onClose={handleSessionClose}
      />
    );
  }

  return (
    <div className="aba-dashboard-container">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-6 mb-2">
                <i className="fas fa-brain me-3"></i>
                ABA Therapy Dashboard
              </h1>
              <p className="lead mb-0">
                Welcome back, {currentUser?.displayName || currentUser?.email || 'User'}!
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex gap-2 justify-content-md-end">
                <button 
                  className="btn btn-outline-light"
                  onClick={onBack}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Main Menu
                </button>
                {/* <button 
                  className="btn btn-outline-light"
                  onClick={onSignOut}
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Sign Out
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className="container-fluid flex-grow-1 pb-4"
        style={{
          overflowY: 'auto',
          minHeight: 'calc(100vh - 300px)',
          width: '100%',
          padding: '0 1rem'
        }}
      >
        <div className="row g-4">
          {/* Progress Section */}
          <div className="col-12">
            <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <h5 className="mb-4 fw-bold">
                  <i className="fas fa-chart-line me-2 text-primary"></i>
                  Your Learning Progress
                </h5>
                <ErrorBoundary fallback={<div className="alert alert-danger">Error loading progress data</div>}>
                  <ProgressTracker userId={currentUser?.uid} />
                </ErrorBoundary>
              </div>
            </div>
          </div>

          {/* Learning Modules Section */}
          <div className="col-12">
            <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <h5 className="mb-4 fw-bold">
                  <i className="fas fa-graduation-cap me-2 text-primary"></i>
                  Learning Modules
                </h5>
                <ErrorBoundary fallback={<div className="alert alert-danger">Error loading modules. Please refresh the page.</div>}>
                  <SkillModuleManager
                    onModuleSelect={handleModuleSelect}
                    userRole={userRole}
                  />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS for better UI */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .aba-dashboard-container {
          min-height: 100vh;
          width: 100%;
          background: var(--bs-body-bg);
          display: flex;
          flex-direction: column;
        }
        
        .container-fluid.flex-grow-1 {
          flex: 1;
          width: 100%;
          max-width: 100%;
          padding-left: 1rem;
          padding-right: 1rem;
        }
        
        .w-100 {
          width: 100% !important;
        }
        
        .h-100 {
          height: 100% !important;
        }
        
        .skill-module-manager {
          width: 100%;
          height: 100%;
        }
        `
      }} />
    </div>
  );
}

export default ABADashboard;
