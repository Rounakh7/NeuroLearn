import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
// Format date to 'MMM d, yyyy' format
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

// Format time to 'h:mm a' format
const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  let hours = d.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes} ${ampm}`;
};

function ProgressTracker({ userId, timeRange = '90d', scheduledSessionsCount = 0 }) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalSessions: 0,
    completedSessions: 0,
    scheduledSessions: 0,
    totalMinutes: 0,
    recentSessions: [],
    lastSessionDate: null
  });

  useEffect(() => {
    if (!userId) return;
    fetchProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, timeRange]);

  const fetchProgress = async () => {
    try {
      setLoading(true);

      // Get all sessions for the user, ordered by completion date
      const sessionsQuery = query(
        collection(db, 'sessionResults'),
        where('userId', '==', userId),
        orderBy('completedAt', 'desc'),
        limit(100) // Get up to 100 most recent sessions
      );

      const snap = await getDocs(sessionsQuery);
      const sessionsRaw = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Normalize timestamps and durations
      const normalizeDate = (val) => (val?.toDate ? val.toDate() : val);
      const getDurationMs = (s) => {
        if (typeof s.durationMs === 'number') return s.durationMs;
        if (typeof s.duration === 'number') return s.duration;
        const start = normalizeDate(s.startTime)?.getTime?.() || 0;
        const end = normalizeDate(s.endTime)?.getTime?.() || 0;
        return end > start ? end - start : 0;
      };

      // Process all sessions
      const sessions = sessionsRaw.map(s => ({
        ...s,
        completedAt: normalizeDate(s.completedAt) || normalizeDate(s.endTime) || new Date(0),
        durationMs: getDurationMs(s)
      }));

      // Get last 10 sessions for the recent sessions list
      const recentSessions = sessions.slice(0, 10).map(s => ({
        id: s.id,
        moduleTitle: s.moduleTitle || 'Session',
        when: s.completedAt,
        minutes: Math.max(1, Math.round((s.durationMs || 0) / 60000)),
      }));

      // Calculate totals
      const completedSessions = sessions.filter(s => s.status === 'completed').length;
      const totalMinutes = Math.round(
        sessions.reduce((sum, s) => sum + (s.status === 'completed' ? s.durationMs || 0 : 0), 0) / 60000
      );

      setSummary({
        totalSessions: sessions.length,
        completedSessions,
        scheduledSessions: scheduledSessionsCount,
        totalMinutes,
        recentSessions,
        lastSessionDate: sessions[0]?.completedAt || null
      });
    } catch (e) {
      console.error('Error fetching progress data:', e);
      setSummary({ 
        totalSessions: 0, 
        completedSessions: 0, 
        scheduledSessions: scheduledSessionsCount, 
        totalMinutes: 0, 
        recentSessions: [],
        lastSessionDate: null
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading progress...</span>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading progress...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-100 h-100">
      {/* Session Statistics */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className={`card ${theme.card} text-center shadow-sm border-0 h-100`} style={{ borderRadius: '16px' }}>
            <div className="card-body p-3 d-flex flex-column">
              <div className="mb-2" style={{ fontSize: '2rem' }}>📊</div>
              <div className="small text-muted">Total Sessions</div>
              <div className="h3 mb-0">{summary.totalSessions}</div>
              {summary.lastSessionDate && (
                <div className="mt-auto small text-muted">
                  Last: {formatDate(summary.lastSessionDate)}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-3 col-6">
          <div className={`card ${theme.card} text-center shadow-sm border-0 h-100`} style={{ borderRadius: '16px' }}>
            <div className="card-body p-3">
              <div className="mb-2" style={{ fontSize: '2rem' }}>✅</div>
              <div className="small text-muted">Completed</div>
              <div className="h3 mb-0">{summary.completedSessions}</div>
              {summary.totalSessions > 0 && (
                <div className="small text-muted">
                  {Math.round((summary.completedSessions / summary.totalSessions) * 100)}% success
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-3 col-6">
          <div className={`card ${theme.card} text-center shadow-sm border-0 h-100`} style={{ borderRadius: '16px' }}>
            <div className="card-body p-3">
              <div className="mb-2" style={{ fontSize: '2rem' }}>⏱️</div>
              <div className="small text-muted">Total Learning Time</div>
              <div className="h3 mb-0">
                {Math.floor(summary.totalMinutes / 60)}h {summary.totalMinutes % 60}m
              </div>
              {summary.totalSessions > 0 && (
                <div className="small text-muted">
                  ~{Math.round(summary.totalMinutes / summary.totalSessions)}m/session
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-3 col-6">
          <div className={`card ${theme.card} text-center shadow-sm border-0 h-100`} style={{ borderRadius: '16px' }}>
            <div className="card-body p-3">
              <div className="mb-2" style={{ fontSize: '2rem' }}>📅</div>
              <div className="small text-muted">Scheduled</div>
              <div className="h3 mb-0">{summary.scheduledSessions}</div>
              <div className="small text-muted">Upcoming sessions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>
        <div className="card-header bg-transparent border-0 p-3">
          <h6 className="mb-0 fw-bold">
            <i className="fas fa-clock-rotate-left me-2 text-primary"></i>
            Recent Learning Sessions
          </h6>
        </div>
        <div className="card-body p-0">
          {summary.recentSessions.length > 0 ? (
            <div className="list-group list-group-flush">
              {summary.recentSessions.map((session, index) => (
                <div 
                  key={session.id || index} 
                  className="list-group-item d-flex justify-content-between align-items-center border-0 py-3"
                >
                  <div className="d-flex align-items-center">
                    <div className="me-3 text-muted" style={{ width: '40px' }}>
                      <div className="text-center" style={{ fontSize: '0.9rem' }}>
                        {new Date(session.when).toLocaleString('default', { month: 'short' })}
                      </div>
                      <div className="text-center fw-bold" style={{ fontSize: '1.2rem' }}>
                        {new Date(session.when).getDate()}
                      </div>
                    </div>
                    <div>
                      <div className="fw-semibold" style={{ lineHeight: 1.2 }}>
                        {session.moduleTitle}
                      </div>
                      <small className="text-muted">
                        {formatTime(session.when)}
                      </small>
                    </div>
                  </div>
                  <span className="badge bg-primary rounded-pill px-3 py-2">
                    {session.minutes} min
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="mb-2" style={{ fontSize: '2.5rem', opacity: 0.3 }}>📅</div>
              <p className="text-muted mb-0">No recent sessions found</p>
              <p className="small text-muted">Complete a session to see your progress here</p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .list-group-item {
          transition: background-color 0.2s ease;
        }
        .list-group-item:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }
        .card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
}

export default ProgressTracker;
