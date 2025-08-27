import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import ABATrialCard from './ABATrialCard';
import TaskAnalysisCard from './TaskAnalysisCard';
import RewardModal from './RewardModal';
import { ABASessionManager } from '../utils/abaSessionManager';

function EnhancedABASession({ module, onComplete, onClose }) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [sessionManager] = useState(() => new ABASessionManager(currentUser?.uid));
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardData, setRewardData] = useState(null);
  const [sessionProgress, setSessionProgress] = useState({
    totalTrials: 0,
    completedTrials: 0,
    correctTrials: 0,
    currentStreak: 0,
    pointsEarned: 0
  });

  // Initialize session data based on module type
  const [sessionData, setSessionData] = useState(() => {
    if (module.moduleType === 'task_analysis') {
      return {
        trials: [module], // Task analysis is a single "trial"
        type: 'task_analysis'
      };
    } else {
      // For discrete trials, we might have multiple trials in the module
      return {
        trials: module.trials || [module],
        type: 'discrete_trial'
      };
    }
  });

  const currentTrial = sessionData.trials[currentTrialIndex];

  useEffect(() => {
    startSession();
    return () => {
      // Cleanup if component unmounts
      if (sessionManager.currentSession && !sessionStarted) {
        handleSessionClose();
      }
    };
  }, []);

  const startSession = async () => {
    try {
      await sessionManager.startSession(module, sessionData.type);
      setSessionStarted(true);
      setSessionProgress(prev => ({
        ...prev,
        totalTrials: sessionData.trials.length
      }));
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Error starting session. Please try again.');
      onClose();
    }
  };

  const handleTrialComplete = async (result) => {
    try {
      // Record the trial result
      sessionManager.recordTrialResult({
        ...result,
        trialType: sessionData.type,
        category: currentTrial.category,
        difficulty: currentTrial.difficulty
      });

      // Update progress
      const newProgress = {
        ...sessionProgress,
        completedTrials: sessionProgress.completedTrials + 1,
        correctTrials: sessionProgress.correctTrials + (result.correct || result.allStepsCompleted ? 1 : 0),
        pointsEarned: sessionProgress.pointsEarned + (result.correct || result.allStepsCompleted ? 5 : 0)
      };
      setSessionProgress(newProgress);

      // Move to next trial or complete session
      if (currentTrialIndex < sessionData.trials.length - 1) {
        setCurrentTrialIndex(currentTrialIndex + 1);
      } else {
        await completeSession();
      }
    } catch (error) {
      console.error('Error handling trial completion:', error);
    }
  };

  const handleSkip = async () => {
    try {
      // Record skipped trial
      sessionManager.recordTrialResult({
        trialId: currentTrial.id,
        skipped: true,
        trialType: sessionData.type,
        category: currentTrial.category,
        difficulty: currentTrial.difficulty,
        responseTime: Date.now()
      });

      // Update progress
      setSessionProgress(prev => ({
        ...prev,
        completedTrials: prev.completedTrials + 1
      }));

      // Move to next trial or complete session
      if (currentTrialIndex < sessionData.trials.length - 1) {
        setCurrentTrialIndex(currentTrialIndex + 1);
      } else {
        await completeSession();
      }
    } catch (error) {
      console.error('Error handling skip:', error);
    }
  };

  const completeSession = async () => {
    try {
      const sessionResult = await sessionManager.completeSession({
        qualityMetrics: {
          engagement: 'high',
          frustrationLevel: 'none',
          motivationLevel: 'high',
          attentionLevel: 'high'
        }
      });

      // Show reward modal if there are rewards
      if (sessionResult.pointsEarned > 0 || sessionResult.newBadges?.length > 0) {
        setRewardData({
          pointsEarned: sessionResult.pointsEarned,
          streakBonus: sessionResult.streakBonus,
          newBadges: sessionResult.newBadges,
          totalPoints: sessionProgress.pointsEarned + sessionResult.pointsEarned,
          motivationalMessage: getSessionCompletionMessage(sessionResult.statistics)
        });
        setShowRewardModal(true);
      } else {
        // No rewards, just complete
        onComplete(sessionResult);
      }
    } catch (error) {
      console.error('Error completing session:', error);
      alert('Error saving session results. Please try again.');
    }
  };

  const handleSessionClose = () => {
    if (window.confirm('Are you sure you want to exit this session? Your progress will be lost.')) {
      onClose();
    }
  };

  const handleRewardModalClose = () => {
    setShowRewardModal(false);
    onComplete(sessionManager.currentSession);
  };

  const getSessionCompletionMessage = (statistics) => {
    if (statistics.accuracyRate >= 90) {
      return "Outstanding performance! You're mastering these skills! 🌟";
    } else if (statistics.accuracyRate >= 75) {
      return "Great job! You're making excellent progress! 💪";
    } else if (statistics.accuracyRate >= 50) {
      return "Good effort! Keep practicing and you'll get even better! 👍";
    } else {
      return "Every attempt is a step forward! You're learning and growing! 🌱";
    }
  };

  const getProgressPercentage = () => {
    return sessionProgress.totalTrials > 0 
      ? Math.round((sessionProgress.completedTrials / sessionProgress.totalTrials) * 100)
      : 0;
  };

  const getAccuracyPercentage = () => {
    return sessionProgress.completedTrials > 0
      ? Math.round((sessionProgress.correctTrials / sessionProgress.completedTrials) * 100)
      : 0;
  };

  if (!sessionStarted) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Starting session...</span>
          </div>
          <p>Preparing your learning session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-aba-session">
      {/* Reward Modal */}
      {showRewardModal && rewardData && (
        <RewardModal
          isOpen={showRewardModal}
          onClose={handleRewardModalClose}
          pointsEarned={rewardData.pointsEarned}
          streakBonus={rewardData.streakBonus}
          newBadges={rewardData.newBadges}
          totalPoints={rewardData.totalPoints}
          motivationalMessage={rewardData.motivationalMessage}
        />
      )}

      {/* Session Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-1">{module.title}</h4>
                  <p className="mb-0 opacity-75">
                    {sessionData.type === 'task_analysis' ? 'Task Analysis' : 'Discrete Trial Training'}
                  </p>
                </div>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={handleSessionClose}
                >
                  Exit Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold">Session Progress</span>
                <span className="text-muted">
                  {sessionProgress.completedTrials} / {sessionProgress.totalTrials}
                </span>
              </div>
              <div className="progress mb-3" style={{ height: '10px' }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              
              <div className="row text-center">
                <div className="col-3">
                  <div className="h5 text-primary mb-0">{getProgressPercentage()}%</div>
                  <small className="text-muted">Complete</small>
                </div>
                <div className="col-3">
                  <div className="h5 text-success mb-0">{getAccuracyPercentage()}%</div>
                  <small className="text-muted">Accuracy</small>
                </div>
                <div className="col-3">
                  <div className="h5 text-warning mb-0">{sessionProgress.pointsEarned}</div>
                  <small className="text-muted">Points</small>
                </div>
                <div className="col-3">
                  <div className="h5 text-info mb-0">{sessionProgress.correctTrials}</div>
                  <small className="text-muted">Correct</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Trial */}
      <div className="row">
        <div className="col-12">
          {currentTrial && (
            <>
              {sessionData.type === 'task_analysis' ? (
                <TaskAnalysisCard
                  trial={currentTrial}
                  onTaskComplete={handleTrialComplete}
                  onSkip={handleSkip}
                  currentTrialNumber={currentTrialIndex + 1}
                  totalTrials={sessionData.trials.length}
                />
              ) : (
                <ABATrialCard
                  trial={currentTrial}
                  onTrialComplete={handleTrialComplete}
                  onSkip={handleSkip}
                  currentTrialNumber={currentTrialIndex + 1}
                  totalTrials={sessionData.trials.length}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Session Info */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body py-2">
              <div className="d-flex justify-content-between align-items-center text-muted small">
                <span>
                  Category: {currentTrial?.category?.replace('_', ' ') || 'General'}
                </span>
                <span>
                  Difficulty: {currentTrial?.difficulty || 'Beginner'}
                </span>
                <span>
                  Session Time: {Math.floor((Date.now() - sessionManager.sessionStartTime?.getTime()) / 60000)} min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .enhanced-aba-session {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .progress {
          border-radius: 10px;
        }
        
        .progress-bar {
          border-radius: 10px;
          transition: width 0.5s ease;
        }
        
        .card {
          border-radius: 15px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .bg-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        }
        `
      }} />
    </div>
  );
}

export default EnhancedABASession;
