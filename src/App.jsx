import React, { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { useUserRole } from "./hooks/useUserRole";
import { useDataInitialization } from "./hooks/useDataInitialization";
import { useTheme } from "./contexts/ThemeContext";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import PasswordSetupModal from "./components/PasswordSetupModal";
import RoleRegistration from "./components/RoleRegistration";
import PatientDashboard from "./components/PatientDashboard";
import ParentDashboard from "./components/ParentDashboard";
import SpecialistDashboard from "./components/SpecialistDashboard";
import ABADashboard from "./components/ABADashboard";
import Navbar from "./components/Navbar";

function App() {
  const { currentUser, loading: authLoading, needsPasswordSetup, signOut } = useAuth();
  const { userRole, loading: roleLoading, refetchRole } = useUserRole(currentUser);
  const { isInitialized, isInitializing, initializationError } = useDataInitialization(currentUser);
  const { theme } = useTheme();
  
  // Navigation state
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTherapy, setSelectedTherapy] = useState(null);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const handleRoleRegistered = (role) => {
    // Refetch role after registration
    refetchRole();
  };

  // Navigation handlers
  const handleStartTherapy = (therapy) => {
    setSelectedTherapy(therapy);
    setCurrentView('aba-dashboard');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTherapy(null);
  };

  // Show loading spinner while authentication or role is loading
  if (authLoading || (currentUser && roleLoading)) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {needsPasswordSetup && <PasswordSetupModal />}
      
      {currentUser ? (
        <>
          <Navbar 
            onSignInClick={handleSignOut} 
            showSignOut={true}
            currentUser={currentUser}
          />
          {userRole === null ? (
            // User is authenticated but has no role assigned - show role registration
            <RoleRegistration user={currentUser} onRoleRegistered={handleRoleRegistered} />
          ) : (
            // User has a role - show appropriate dashboard
            <>
              {userRole === 'patient' && (
                <>
                  {currentView === 'dashboard' && (
                    <PatientDashboard 
                      currentUser={currentUser} 
                      onSignOut={handleSignOut}
                      onStartTherapy={handleStartTherapy}
                    />
                  )}
                  {currentView === 'aba-dashboard' && (
                    <ABADashboard 
                      currentUser={currentUser} 
                      onSignOut={handleSignOut}
                      onBack={handleBackToDashboard}
                      therapy={selectedTherapy}
                    />
                  )}
                </>
              )}
              {userRole === 'parent' && (
                <ParentDashboard 
                  currentUser={currentUser} 
                  onSignOut={handleSignOut}
                />
              )}
              {userRole === 'specialist' && (
                <SpecialistDashboard 
                  currentUser={currentUser} 
                  onSignOut={handleSignOut}
                />
              )}
            </>
          )}
        </>
      ) : (
        <>
          <Navbar onSignInClick={() => {}} />
          <LoginForm />
        </>
      )}
    </div>
  );
}

export default App;
