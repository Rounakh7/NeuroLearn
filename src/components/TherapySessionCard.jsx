import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

function TherapySessionCard({ therapy, onBookSession, onStartSession, userRole = 'patient' }) {
  const { theme } = useTheme();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartSession = async () => {
    setIsStarting(true);
    try {
      await onStartSession(therapy);
    } catch (error) {
      console.error('Error starting session:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const getDifficultyBadgeClass = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success';
      case 'intermediate': return 'bg-warning';
      case 'advanced': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'behavioral_therapy': return '🧠';
      case 'speech_therapy': return '🗣️';
      case 'occupational_therapy': return '🤲';
      case 'social_therapy': return '👥';
      case 'cognitive_therapy': return '💭';
      default: return '🏥';
    }
  };

  return (
    <div className={`card h-100 shadow-sm ${theme.card}`}>
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <span className="me-2" style={{ fontSize: '1.5rem' }}>
              {getCategoryIcon(therapy.category)}
            </span>
            <h5 className={`card-title mb-0 ${theme.text}`}>{therapy.title}</h5>
          </div>
        </div>
        
        <p className={`card-text ${theme.textMuted} small flex-grow-1`}>
          {therapy.description}
        </p>
        
        <div className="mb-3">
          <span className="badge bg-secondary me-2">
            ⏱️ {therapy.duration} min
          </span>
          <span className={`badge ${getDifficultyBadgeClass(therapy.difficulty)}`}>
            {therapy.difficulty}
          </span>
        </div>

        {therapy.objectives && therapy.objectives.length > 0 && (
          <div className="mb-3">
            <strong className={`small ${theme.text}`}>Key Objectives:</strong>
            <ul className={`small mt-1 mb-0 ${theme.textMuted}`}>
              {therapy.objectives.slice(0, 2).map((obj, index) => (
                <li key={index}>{obj}</li>
              ))}
              {therapy.objectives.length > 2 && (
                <li className="text-muted">+ {therapy.objectives.length - 2} more...</li>
              )}
            </ul>
          </div>
        )}

        <div className="mt-auto">
          <div className="d-grid gap-2">
            {/* Start Session Button - Primary action for immediate therapy */}
            <button 
              className={`btn ${theme.btnSuccess} d-flex align-items-center justify-content-center`}
              onClick={handleStartSession}
              disabled={isStarting}
            >
              {isStarting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Starting...
                </>
              ) : (
                <>
                  <i className="fas fa-play me-2"></i>
                  Start Session Now
                </>
              )}
            </button>

            {/* Book Session Button - Schedule for later */}
            <button 
              className={`btn ${theme.btnPrimary} d-flex align-items-center justify-content-center`}
              onClick={() => onBookSession(therapy)}
            >
              <i className="fas fa-calendar-plus me-2"></i>
              Book for Later
            </button>
          </div>

          {/* Additional info for specialists/parents */}
          {(userRole === 'specialist' || userRole === 'parent') && (
            <div className={`mt-2 small ${theme.textMuted}`}>
              <i className="fas fa-info-circle me-1"></i>
              {userRole === 'specialist' 
                ? 'You can conduct this session with patients'
                : 'Available for your linked patients'
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TherapySessionCard;
