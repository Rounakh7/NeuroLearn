import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

function TaskAnalysisCard({ trial, onTaskComplete, onSkip, currentTrialNumber, totalTrials }) {
  const { theme } = useTheme();
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);

  useEffect(() => {
    // Reset state when trial changes
    setCompletedSteps([]);
    setCurrentStep(0);
    setShowFeedback(false);
    setTaskCompleted(false);
  }, [trial.id]);

  const handleStepComplete = (stepIndex) => {
    const newCompletedSteps = [...completedSteps, stepIndex];
    setCompletedSteps(newCompletedSteps);
    
    if (stepIndex === currentStep) {
      setCurrentStep(currentStep + 1);
    }

    // Check if all steps are completed
    if (newCompletedSteps.length === trial.steps.length) {
      setTaskCompleted(true);
      setShowFeedback(true);
      
      // Auto-advance after showing feedback
      setTimeout(() => {
        onTaskComplete({
          trialId: trial.id,
          completedSteps: newCompletedSteps,
          allStepsCompleted: true,
          completionTime: Date.now()
        });
      }, 3000);
    }
  };

  const handleStepUndo = (stepIndex) => {
    setCompletedSteps(completedSteps.filter(step => step !== stepIndex));
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const getStepStatus = (stepIndex) => {
    if (completedSteps.includes(stepIndex)) return 'completed';
    if (stepIndex === currentStep) return 'current';
    if (stepIndex < currentStep) return 'available';
    return 'locked';
  };

  const getStepIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'current': return '👉';
      case 'available': return '⭕';
      case 'locked': return '🔒';
      default: return '⭕';
    }
  };

  const getStepButtonClass = (status) => {
    switch (status) {
      case 'completed': return 'btn-success';
      case 'current': return 'btn-primary';
      case 'available': return 'btn-outline-primary';
      case 'locked': return 'btn-outline-secondary';
      default: return 'btn-outline-secondary';
    }
  };

  // Add null checks to prevent errors
  if (!trial) return null;
  if (!trial.steps || !Array.isArray(trial.steps)) return null;

  const progressPercentage = (completedSteps.length / trial.steps.length) * 100;

  if (!trial) return null;

  return (
    <div className={`card ${theme.card} shadow-lg`} style={{ maxWidth: '700px', margin: '0 auto' }}>
      {/* Header */}
      <div className={`card-header ${theme.cardHeader} text-center`}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge bg-light text-dark">
            Task {currentTrialNumber} of {totalTrials}
          </span>
          <span className="fs-2">🏠</span>
          <span className="badge bg-info">
            Task Analysis
          </span>
        </div>
        <h5 className="mb-0">{trial.title || 'Task Analysis'}</h5>
        <small className="text-light">{trial.description || 'Complete the steps below'}</small>
      </div>

      <div className="card-body">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className={`small ${theme.text}`}>Progress</span>
            <span className={`small ${theme.text}`}>
              {completedSteps.length} of {trial.steps.length} steps
            </span>
          </div>
          <div className="progress" style={{ height: '12px' }}>
            <div 
              className="progress-bar bg-success" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Instruction */}
        <div className={`alert ${theme.alertInfo} mb-4`}>
          <h6 className="alert-heading">
            <i className="fas fa-list-ol me-2"></i>
            Task Instructions
          </h6>
          <p className="mb-0">{trial.instruction || 'Follow the steps to complete this task'}</p>
          <small className="text-muted">
            Complete each step in order. Click on a step when you finish it!
          </small>
        </div>

        {/* Steps List */}
        <div className="mb-4">
          <h6 className={`mb-3 ${theme.text}`}>
            <i className="fas fa-tasks me-2"></i>
            Steps to Complete:
          </h6>
          
          <div className="list-group">
            {trial.steps.map((step, index) => {
              const status = getStepStatus(index);
              const isClickable = status === 'current' || status === 'available' || status === 'completed';
              
              return (
                <div 
                  key={step.id || index}
                  className={`list-group-item d-flex align-items-center ${
                    status === 'current' ? 'list-group-item-primary' : 
                    status === 'completed' ? 'list-group-item-success' : ''
                  }`}
                >
                  <span className="me-3 fs-4">{getStepIcon(status)}</span>
                  
                  <div className="flex-grow-1">
                    <span className={`fw-bold me-2 ${theme.text}`}>
                      Step {index + 1}:
                    </span>
                    <span className={theme.text}>
                      {step.description || step}
                    </span>
                  </div>
                  
                  <div className="ms-3">
                    {status === 'completed' ? (
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => handleStepUndo(index)}
                        title="Undo this step"
                      >
                        <i className="fas fa-undo"></i>
                      </button>
                    ) : isClickable ? (
                      <button
                        className={`btn btn-sm ${getStepButtonClass(status)}`}
                        onClick={() => handleStepComplete(index)}
                        disabled={status === 'locked'}
                      >
                        {status === 'current' ? 'Complete' : 'Done'}
                      </button>
                    ) : (
                      <span className="badge bg-secondary">Locked</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Highlight */}
        {!taskCompleted && currentStep < trial.steps.length && (
          <div className="alert alert-warning">
            <h6 className="alert-heading">
              <i className="fas fa-arrow-right me-2"></i>
              Current Step
            </h6>
            <p className="mb-0 fw-bold">
              Step {currentStep + 1}: {trial.steps[currentStep]?.description || trial.steps[currentStep]}
            </p>
          </div>
        )}

        {/* Completion Feedback */}
        {showFeedback && taskCompleted && (
          <div className="alert alert-success text-center mb-4">
            <div className="fs-1 mb-2">🎉</div>
            <h5 className="alert-heading">Task Completed!</h5>
            <p className="mb-2 fs-5">{trial.reinforcement.message}</p>
            <div className="mt-3">
              <span className="badge bg-warning fs-6 me-2">
                +{trial.reinforcement.points} points
              </span>
              <span className="badge bg-success fs-6">
                All steps mastered!
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!showFeedback && (
          <div className="d-flex justify-content-between">
            <button 
              className={`btn ${theme.btnSecondary}`}
              onClick={() => {
                // Reset current task
                setCompletedSteps([]);
                setCurrentStep(0);
              }}
            >
              <i className="fas fa-redo me-2"></i>
              Start Over
            </button>
            
            <button 
              className={`btn ${theme.btnOutlineSecondary}`}
              onClick={onSkip}
            >
              <i className="fas fa-forward me-2"></i>
              Skip Task
            </button>
          </div>
        )}

        {/* Target Behavior Info */}
        <div className="mt-4 pt-3 border-top">
          <small className={theme.textMuted}>
            <strong>Target Behavior:</strong> {trial.targetBehavior}
          </small>
        </div>
      </div>
    </div>
  );
}

export default TaskAnalysisCard;
