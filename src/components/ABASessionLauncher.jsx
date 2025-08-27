import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ABASession from './ABASession';

function ABASessionLauncher({ onSessionComplete }) {
  const { theme } = useTheme();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionType, setSessionType] = useState('discrete');
  const [skillCategory, setSkillCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  const handleStartSession = () => {
    setIsSessionActive(true);
  };

  const handleSessionComplete = (sessionData) => {
    setIsSessionActive(false);
    if (onSessionComplete) {
      onSessionComplete(sessionData);
    }
  };

  if (isSessionActive) {
    return (
      <div className="mt-4">
        <ABASession onComplete={handleSessionComplete} />
      </div>
    );
  }

  return (
    <div className={`card ${theme.card} shadow-sm mb-4`}>
      <div className={`card-header ${theme.cardHeader}`}>
        <h5 className="mb-0">Start New ABA Session</h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Session Type</label>
            <select 
              className={`form-select ${theme.input}`}
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
            >
              <option value="discrete">Discrete Trial Training</option>
              <option value="task">Task Analysis</option>
              <option value="mixed">Mixed Session</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Skill Category</label>
            <select 
              className={`form-select ${theme.input}`}
              value={skillCategory}
              onChange={(e) => setSkillCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="communication">Communication</option>
              <option value="social">Social Skills</option>
              <option value="academic">Academic</option>
              <option value="daily_living">Daily Living</option>
              <option value="motor">Motor Skills</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Difficulty Level</label>
            <select 
              className={`form-select ${theme.input}`}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="col-12 mt-3">
            <button 
              className="btn btn-primary"
              onClick={handleStartSession}
            >
              <i className="fas fa-play me-2"></i> Start Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ABASessionLauncher;
