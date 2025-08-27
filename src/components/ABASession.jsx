import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ABATrialCard from './ABATrialCard';
import TaskAnalysisCard from './TaskAnalysisCard';
import { sampleABATrials, TRIAL_TYPES } from '../utils/abaTrialData';
import { getRandomQuestions } from '../utils/abaModuleQuestions';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function ABASession({ onComplete, onClose, therapy, module, currentUser }) {
  const { theme, darkMode, toggleTheme } = useTheme();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState([]);
  const [sessionStartTime] = useState(new Date());
  const [totalPoints, setTotalPoints] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Build questions once when module/therapy changes
  useEffect(() => {
    const buildQuestions = () => {
      let built = [];
      if (module) {
        if (module.questions && module.questions.length > 0) {
          built = module.questions;
        } else if (module.category) {
          const difficulty = module.difficulty || 'beginner';
          try {
            const rawQuestions = getRandomQuestions(module.category, difficulty, 5);
            built = rawQuestions.map((q, index) => ({
              id: q.id,
              title: `${module.title || 'Skill Building'} - Question ${index + 1}`,
              category: q.category,
              type: TRIAL_TYPES.DISCRETE_TRIAL,
              difficulty: q.difficulty,
              description: `Practice ${q.category} skills`,
              instruction: q.question,
              prompt: `Think about the best answer for this ${q.category} question`,
              options: q.options.map((opt, optIndex) => ({
                id: String.fromCharCode(97 + optIndex),
                text: opt,
                correct: optIndex === q.correct
              })),
              reinforcement: {
                type: 'verbal',
                message: "Great job! You're learning well! 🎉",
                points: q.points || 5
              },
              targetBehavior: `Improve ${q.category} skills`,
              masteryTarget: 5
            }));
          } catch (error) {
            console.error('Error getting random questions:', error);
            built = [];
          }
        } else {
          built = [{
            id: module.id,
            title: module.title,
            category: 'general',
            type: TRIAL_TYPES.DISCRETE_TRIAL,
            difficulty: module.difficulty || 'beginner',
            description: module.description || 'Practice this skill',
            instruction: module.instruction || 'Complete this task',
            prompt: module.prompts?.[0] || 'Think about the best approach',
            options: [
              { id: 'a', text: 'Yes, I can do this', correct: true },
              { id: 'b', text: 'I need help', correct: false },
              { id: 'c', text: 'Maybe later', correct: false },
              { id: 'd', text: 'I want to try', correct: true }
            ],
            reinforcement: { type: 'verbal', message: 'Excellent work! Keep practicing! 🌟', points: 10 },
            targetBehavior: 'Skill development and practice',
            masteryTarget: 1
          }];
          if (module.instruction) {
            built = [{
              id: module.id,
              title: module.title,
              category: module.category || 'general',
              type: TRIAL_TYPES.DISCRETE_TRIAL,
              difficulty: module.difficulty || 'beginner',
              description: module.description || 'Practice this skill',
              instruction: module.instruction,
              prompt: module.prompts?.[0] || 'Think about the best approach',
              options: [
                { id: 'a', text: 'I understand and can do this', correct: true },
                { id: 'b', text: 'I need more practice', correct: false },
                { id: 'c', text: 'I want to learn more', correct: true },
                { id: 'd', text: 'This is challenging', correct: false }
              ],
              reinforcement: { type: 'verbal', message: 'Great job understanding the concept! 🌟', points: 10 },
              targetBehavior: 'Understanding and skill application',
              masteryTarget: 1
            }];
          }
        }
      } else if (therapy) {
        const therapyCategory = therapy.category || 'communication';
        try {
          const rawQuestions = getRandomQuestions(therapyCategory, 'beginner', 5);
          built = rawQuestions.map((q, index) => ({
            id: q.id,
            title: `${therapy.title} - Question ${index + 1}`,
            category: q.category,
            type: TRIAL_TYPES.DISCRETE_TRIAL,
            difficulty: q.difficulty,
            description: `Practice ${q.category} skills`,
            instruction: q.question,
            prompt: `Think about the best answer for this ${q.category} question`,
            options: q.options.map((opt, optIndex) => ({ id: String.fromCharCode(97 + optIndex), text: opt, correct: optIndex === q.correct })),
            reinforcement: { type: 'verbal', message: 'Excellent work! Keep it up! 🌟', points: q.points || 5 },
            targetBehavior: `Improve ${q.category} skills`,
            masteryTarget: 5
          }));
        } catch (error) {
          console.error('Error getting therapy questions:', error);
          built = [];
        }
      }

      if (built.length === 0) {
        try {
          built = sampleABATrials.slice(0, 5).map(trial => ({
            id: trial.id,
            title: trial.title,
            category: trial.category,
            type: TRIAL_TYPES.DISCRETE_TRIAL,
            difficulty: trial.difficulty,
            description: trial.description,
            instruction: trial.instruction,
            prompt: trial.prompt,
            options: trial.options,
            reinforcement: trial.reinforcement,
            targetBehavior: trial.targetBehavior,
            masteryTarget: trial.masteryTarget
          }));
        } catch (error) {
          console.error('Error with sample trials:', error);
          built = [{
            id: 'fallback_1',
            title: 'Welcome to ABA Therapy',
            category: 'general',
            type: TRIAL_TYPES.DISCRETE_TRIAL,
            difficulty: 'beginner',
            description: "Let's get started with a simple question",
            instruction: 'Are you ready to learn?',
            prompt: "Show me you're ready",
            options: [ { id: 'a', text: "Yes, I'm ready!", correct: true }, { id: 'b', text: 'Maybe later', correct: false } ],
            reinforcement: { type: 'verbal', message: "Great! Let's begin! 🎉", points: 5 },
            targetBehavior: 'Engagement and readiness',
            masteryTarget: 1
          }];
        }
      }

      setQuestions(built);
      setCurrentQuestionIndex(0);
      setSessionResults([]);
      setTotalPoints(0);
      setSessionCompleted(false);
    };

    buildQuestions();
  }, [module, therapy]);

  const currentTrial = questions[currentQuestionIndex];

  // Session timer (mm:ss) – display only, no navigation
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  useEffect(() => {
    if (sessionCompleted) return;
    const intervalId = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - sessionStartTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [sessionCompleted, sessionStartTime]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(i => i - 1);
  };
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(i => i + 1);
    else completeSession(sessionResults);
  };

  const handleTrialComplete = (result) => {
    const newResults = [...sessionResults, result];
    setSessionResults(newResults);
    if (result.correct || result.allStepsCompleted) {
      const trial = questions.find(t => t.id === result.trialId);
      setTotalPoints(prev => prev + (trial?.reinforcement?.points || 0));
    }
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(i => i + 1);
    else completeSession(newResults);
  };

  const handleSkip = () => {
    const skipResult = { trialId: currentTrial.id, skipped: true, responseTime: Date.now() };
    const newResults = [...sessionResults, skipResult];
    setSessionResults(newResults);
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(i => i + 1);
    else completeSession(newResults);
  };

  const completeSession = async (results) => {
    setSessionCompleted(true);
    const sessionData = {
      type: 'aba_session',
      userId: currentUser?.uid || 'anonymous',
      startTime: sessionStartTime,
      endTime: new Date(),
      durationMs: new Date().getTime() - sessionStartTime.getTime(),
      duration: new Date().getTime() - sessionStartTime.getTime(),
      totalTrials: questions.length,
      completedTrials: results.filter(r => !r.skipped).length,
      correctTrials: results.filter(r => r.correct || r.allStepsCompleted).length,
      skippedTrials: results.filter(r => r.skipped).length,
      totalPoints: totalPoints,
      pointsEarned: totalPoints,
      results: results,
      completedAt: new Date(),
      status: 'completed'
    };
    try {
      await addDoc(collection(db, 'sessionResults'), {
        ...sessionData,
        completedAt: serverTimestamp()
      });
    } catch (e) {
      console.error('Failed to save session result', e);
    }
    setTimeout(() => onComplete(sessionData), 3000);
  };

  if (sessionCompleted) {
    const stats = {
      completed: sessionResults.filter(r => !r.skipped).length,
      correct: sessionResults.filter(r => r.correct || r.allStepsCompleted).length,
      accuracy: questions.length > 0 ? Math.round((sessionResults.filter(r => r.correct || r.allStepsCompleted).length / sessionResults.filter(r => !r.skipped).length) * 100) : 0
    };
    
    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className={`modal-content ${theme.card}`}>
            <div className={`modal-header ${theme.cardHeader} text-center`}>
              <h5 className="modal-title w-100">
                🎉 ABA Session Complete! 🎉
              </h5>
            </div>
            
            <div className="modal-body text-center">
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className={`card ${theme.card}`}>
                    <div className="card-body">
                      <div className="display-6 text-primary">⭐</div>
                      <h6>Total Points</h6>
                      <div className="fs-4 fw-bold text-warning">{totalPoints}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className={`card ${theme.card}`}>
                    <div className="card-body">
                      <div className="display-6 text-success">✅</div>
                      <h6>Completed</h6>
                      <div className="fs-4 fw-bold">{stats.completed}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className={`card ${theme.card}`}>
                    <div className="card-body">
                      <div className="display-6 text-warning">📊</div>
                      <h6>Accuracy</h6>
                      <div className="fs-4 fw-bold">{stats.accuracy}%</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className={`card ${theme.card}`}>
                    <div className="card-body">
                      <div className="display-6 text-info">⏱️</div>
                      <h6>Time</h6>
                      <div className="fs-4 fw-bold">{formatTime(elapsedSeconds)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="alert alert-success">
                <h5>Excellent Work!</h5>
                <p>You've completed your ABA therapy session. Your progress has been saved!</p>
              </div>

              <div className="progress mb-3" style={{ height: '20px' }}>
                <div 
                  className="progress-bar bg-success" 
                  style={{ width: '100%' }}
                >
                  Session Complete!
                </div>
              </div>
            </div>

            <div className="modal-footer justify-content-center">
              <button 
                className={`btn ${theme.btnSuccess}`}
                onClick={onClose}
              >
                <i className="fas fa-check me-2"></i>
                Continue to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-fullscreen">
        <div className={`modal-content ${theme.card}`}>
          {/* Top Bar */}
          <div className={`modal-header ${theme.cardHeader} align-items-center`} style={{ position: 'sticky', top: 0, zIndex: 5 }}>
            <div className="d-flex align-items-center gap-2">
              <button type="button" className="btn btn-outline-light btn-sm" onClick={onClose}>
                <i className="fas fa-times"></i>
              </button>
              <h6 className="modal-title d-flex align-items-center gap-2 mb-0">
                <i className="fas fa-brain"></i>
                ABA Therapy Session
              </h6>
            </div>
            <div className="d-flex align-items-center gap-2">
              {currentUser && (
                <span className="badge bg-dark text-white px-2 py-1">
                  👤 {currentUser.displayName || currentUser.email}
                </span>
              )}
              <span className="badge bg-warning text-dark px-2 py-1">{totalPoints} pts</span>
              <span className="badge bg-secondary px-2 py-1">⏱ {formatTime(elapsedSeconds)}</span>
              <span className="badge bg-primary px-2 py-1">{currentQuestionIndex + 1} / {questions.length}</span>
              <div className="form-check form-switch m-0">
                <input className="form-check-input" type="checkbox" id="sessionThemeToggle" checked={darkMode} onChange={toggleTheme} />
                <label className="form-check-label ms-1 small" htmlFor="sessionThemeToggle">{darkMode ? '🌙' : '☀️'}</label>
              </div>
            </div>
          </div>

          <div className="modal-body">
            {/* Question number strip */}
            <div className="d-flex flex-wrap gap-2 mb-3 justify-content-center">
              {questions.map((q, i) => (
                <span key={q.id} className={`badge ${i === currentQuestionIndex ? 'bg-primary' : 'bg-light text-dark'} px-2 py-1`}>{i + 1}</span>
              ))}
            </div>

            {/* Progress */}
            <div className="mb-3">
              <div className="progress" style={{ height: '8px', borderRadius: '6px' }}>
                <div className="progress-bar bg-primary" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
              </div>
            </div>

            {/* Current Trial */}
            {currentTrial ? (
              currentTrial.type === TRIAL_TYPES.DISCRETE_TRIAL ? (
                <ABATrialCard
                  trial={currentTrial}
                  onTrialComplete={handleTrialComplete}
                  onSkip={handleSkip}
                  currentTrialNumber={currentQuestionIndex + 1}
                  totalTrials={questions.length}
                />
              ) : (
                <TaskAnalysisCard
                  trial={currentTrial}
                  onTaskComplete={handleTrialComplete}
                  onSkip={handleSkip}
                  currentTrialNumber={currentQuestionIndex + 1}
                  totalTrials={questions.length}
                />
              )
            ) : (
              <div className="text-center py-5">
                <div className="alert alert-warning small">
                  <h6>No Questions Available</h6>
                  <p className="mb-2">Unable to load questions for this session. Please try again or contact support.</p>
                  <button className="btn btn-primary btn-sm" onClick={onClose}>
                    <i className="fas fa-home me-1"></i>
                    Return to Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Navigation */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button className="btn btn-outline-secondary btn-sm px-3" onClick={handlePrev} disabled={currentQuestionIndex === 0}>
                <i className="fas fa-arrow-left me-1"></i>
                Prev
              </button>
              <small className="text-muted">Question {currentQuestionIndex + 1} of {questions.length}</small>
              <button className="btn btn-primary btn-sm px-3" onClick={handleNext}>
                {currentQuestionIndex === questions.length - 1 ? (
                  <>Finish <i className="fas fa-flag-checkered ms-1"></i></>
                ) : (
                  <>Next <i className="fas fa-arrow-right ms-1"></i></>
                )}
              </button>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            .modal-fullscreen .modal-content { min-height: 100vh; }
            .progress { background-color: #e9ecef; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1); }
            .progress-bar { transition: width 0.6s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .card { border: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 12px; }
            .card-header { border-radius: 12px 12px 0 0 !important; border-bottom: 1px solid rgba(0,0,0,0.1); }
            .btn { border-radius: 8px; font-weight: 500; transition: all 0.2s ease; }
            .badge { font-size: 0.75rem; }
            .modal-title, .card h4, .card h5 { font-size: 1rem; }
          `}} />
        </div>
      </div>
    </div>
  );
}

export default ABASession;
