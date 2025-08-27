import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function SessionProgress({ sessions }) {
  const { theme } = useTheme();

  // Calculate session statistics
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(session => session.status === 'completed').length;
  const scheduledSessions = sessions.filter(session => session.status === 'scheduled').length;
  const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  // Calculate total therapy time
  const totalTherapyTime = sessions
    .filter(session => session.status === 'completed')
    .reduce((total, session) => total + (session.duration || 0), 0);

  // Get therapy type breakdown
  const therapyTypes = sessions.reduce((acc, session) => {
    const type = session.therapyTitle || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Recent sessions (last 5)
  const recentSessions = sessions
    .sort((a, b) => new Date(b.createdAt || b.scheduledDate) - new Date(a.createdAt || a.scheduledDate))
    .slice(0, 5);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return 'bg-success';
      case 'scheduled': return 'bg-primary';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getProgressColor = (rate) => {
    if (rate >= 80) return 'bg-success';
    if (rate >= 60) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div className="row">
      {/* Progress Overview Cards */}
      <div className="col-md-3 mb-3">
        <div className={`card h-100 ${theme.card}`}>
          <div className="card-body text-center">
            <div className="display-6 fw-bold text-primary mb-2">{totalSessions}</div>
            <h6 className={`card-title ${theme.text}`}>Total Sessions</h6>
            <small className={theme.textMuted}>All time</small>
          </div>
        </div>
      </div>

      <div className="col-md-3 mb-3">
        <div className={`card h-100 ${theme.card}`}>
          <div className="card-body text-center">
            <div className="display-6 fw-bold text-success mb-2">{completedSessions}</div>
            <h6 className={`card-title ${theme.text}`}>Completed</h6>
            <small className={theme.textMuted}>Sessions finished</small>
          </div>
        </div>
      </div>

      <div className="col-md-3 mb-3">
        <div className={`card h-100 ${theme.card}`}>
          <div className="card-body text-center">
            <div className="display-6 fw-bold text-info mb-2">{scheduledSessions}</div>
            <h6 className={`card-title ${theme.text}`}>Scheduled</h6>
            <small className={theme.textMuted}>Upcoming sessions</small>
          </div>
        </div>
      </div>

      <div className="col-md-3 mb-3">
        <div className={`card h-100 ${theme.card}`}>
          <div className="card-body text-center">
            <div className="display-6 fw-bold text-warning mb-2">{totalTherapyTime}</div>
            <h6 className={`card-title ${theme.text}`}>Minutes</h6>
            <small className={theme.textMuted}>Total therapy time</small>
          </div>
        </div>
      </div>

      {/* Completion Rate Progress Bar */}
      <div className="col-12 mb-4">
        <div className={`card ${theme.card}`}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className={`card-title mb-0 ${theme.text}`}>
                <i className="fas fa-chart-line me-2"></i>
                Completion Progress
              </h5>
              <span className={`badge ${getProgressColor(completionRate)} fs-6`}>
                {completionRate}%
              </span>
            </div>
            <div className="progress mb-2" style={{ height: '12px' }}>
              <div 
                className={`progress-bar ${getProgressColor(completionRate).replace('bg-', 'progress-bar-')}`}
                style={{ width: `${completionRate}%` }}
                role="progressbar"
              ></div>
            </div>
            <small className={theme.textMuted}>
              {completedSessions} of {totalSessions} sessions completed
            </small>
          </div>
        </div>
      </div>

      {/* Therapy Types Breakdown */}
      {Object.keys(therapyTypes).length > 0 && (
        <div className="col-md-6 mb-4">
          <div className={`card ${theme.card}`}>
            <div className="card-body">
              <h5 className={`card-title ${theme.text}`}>
                <i className="fas fa-brain me-2"></i>
                Therapy Types
              </h5>
              <div className="list-group list-group-flush">
                {Object.entries(therapyTypes).map(([type, count]) => (
                  <div key={type} className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 px-0">
                    <span className={theme.text}>{type}</span>
                    <span className="badge bg-primary rounded-pill">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      <div className="col-md-6 mb-4">
        <div className={`card ${theme.card}`}>
          <div className="card-body">
            <h5 className={`card-title ${theme.text}`}>
              <i className="fas fa-history me-2"></i>
              Recent Sessions
            </h5>
            {recentSessions.length === 0 ? (
              <p className={theme.textMuted}>No sessions yet</p>
            ) : (
              <div className="list-group list-group-flush">
                {recentSessions.map((session, index) => (
                  <div key={session.id || index} className="list-group-item bg-transparent border-0 px-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className={`mb-1 ${theme.text}`}>
                          {session.therapyTitle || 'Therapy Session'}
                        </h6>
                        <small className={theme.textMuted}>
                          {session.createdAt ? 
                            new Date(session.createdAt).toLocaleDateString() : 
                            session.scheduledDate ? 
                            new Date(session.scheduledDate).toLocaleDateString() : 
                            'Date unknown'
                          }
                        </small>
                      </div>
                      <div className="text-end">
                        <span className={`badge ${getStatusBadge(session.status)} mb-1`}>
                          {session.status || 'unknown'}
                        </span>
                        {session.duration && (
                          <div>
                            <small className={theme.textMuted}>{session.duration} min</small>
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
      </div>

      {/* Achievement Badges */}
      <div className="col-12">
        <div className={`card ${theme.card}`}>
          <div className="card-body">
            <h5 className={`card-title ${theme.text}`}>
              <i className="fas fa-trophy me-2"></i>
              Achievements
            </h5>
            <div className="d-flex flex-wrap gap-2">
              {completedSessions >= 1 && (
                <span className="badge bg-success fs-6">
                  <i className="fas fa-star me-1"></i>
                  First Session Complete
                </span>
              )}
              {completedSessions >= 5 && (
                <span className="badge bg-info fs-6">
                  <i className="fas fa-medal me-1"></i>
                  5 Sessions Milestone
                </span>
              )}
              {completedSessions >= 10 && (
                <span className="badge bg-warning fs-6">
                  <i className="fas fa-crown me-1"></i>
                  10 Sessions Champion
                </span>
              )}
              {completionRate >= 80 && totalSessions >= 5 && (
                <span className="badge bg-primary fs-6">
                  <i className="fas fa-chart-line me-1"></i>
                  High Achiever
                </span>
              )}
              {totalTherapyTime >= 60 && (
                <span className="badge bg-secondary fs-6">
                  <i className="fas fa-clock me-1"></i>
                  1 Hour+ Therapy Time
                </span>
              )}
              {completedSessions === 0 && scheduledSessions === 0 && (
                <span className="badge bg-light text-dark fs-6">
                  <i className="fas fa-seedling me-1"></i>
                  Ready to Start Your Journey
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionProgress;
