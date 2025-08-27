import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

function ABATrialCard({ trial, onTrialComplete, onSkip, currentTrialNumber, totalTrials }) {
  const { theme } = useTheme();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Reset state when trial changes
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setShowPrompt(false);
  }, [trial.id]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    const correct = option.correct;
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const handleContinue = () => {
    if (!selectedOption) return;
    onTrialComplete({
      trialId: trial.id,
      selectedOptionId: selectedOption.id,
      correct: selectedOption.correct,
      responseTime: Date.now(),
      promptUsed: showPrompt
    });
  };

  const handlePromptRequest = () => {
    setShowPrompt(true);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'communication': return '💬';
      case 'social': return '👥';
      case 'academic': return '📚';
      case 'daily_living': return '🏠';
      case 'motor': return '🤸';
      default: return '🧠';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'secondary';
    }
  };

  if (!trial) return null;

  return (
    <div className={`card ${theme.card} shadow-lg`} style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div className={`card-header ${theme.cardHeader} text-center`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="badge bg-light text-dark fs-6">
            Question {currentTrialNumber} of {totalTrials}
          </span>
          <span className="fs-1">{getCategoryIcon(trial.category)}</span>
          <span className={`badge bg-${getDifficultyColor(trial.difficulty)} fs-6`}>
            {trial.difficulty}
          </span>
        </div>
        <h4 className="mb-2 fw-bold">{trial.title}</h4>
        <small className="text-light opacity-75">{trial.description}</small>
      </div>

      <div className="card-body p-4">
        {/* Progress Bar */}
        <div className="progress mb-4" style={{ height: '10px', borderRadius: '5px' }}>
          <div 
            className="progress-bar bg-primary" 
            style={{ width: `${(currentTrialNumber / totalTrials) * 100}%` }}
          ></div>
        </div>

        {/* Main Question - Enhanced Display */}
        <div className={`alert ${theme.alertInfo} mb-4 p-4`} style={{ 
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          border: '2px solid #2196f3',
          borderRadius: '15px'
        }}>
          <div className="text-center">
            <div className="fs-1 mb-3">❓</div>
            <h5 className="alert-heading mb-3">
              <i className="fas fa-question-circle me-2 text-primary"></i>
              Your Question
            </h5>
            <div className="fs-3 fw-bold text-primary mb-2">
              {trial.instruction}
            </div>
            {trial.prompt && (
              <small className="text-muted d-block mt-2">
                <i className="fas fa-lightbulb me-1"></i>
                {trial.prompt}
              </small>
            )}
          </div>
        </div>

        {/* Prompt (if requested) */}
        {showPrompt && (
          <div className="alert alert-warning mb-4 p-3" style={{ borderRadius: '12px' }}>
            <h6 className="alert-heading">
              <i className="fas fa-lightbulb me-2"></i>
              Helpful Hint
            </h6>
            <p className="mb-0 fs-5">{trial.prompt}</p>
          </div>
        )}

        {/* Answer Options - Enhanced Layout */}
        {!showFeedback && (
          <div className="mb-4">
            <h6 className="mb-3 text-center">
              <i className="fas fa-list-ul me-2"></i>
              Choose Your Answer
            </h6>
            <div className="row g-3">
              {trial.options.map((option, index) => (
                <div key={option.id} className="col-md-6">
                  <button
                    className={`btn ${selectedOption?.id === option.id ? 'btn-primary' : 'btn-outline-primary'} w-100 p-4 text-start position-relative`}
                    onClick={() => handleOptionSelect(option)}
                    style={{ 
                      minHeight: '80px',
                      borderRadius: '12px',
                      fontSize: '1.1rem',
                      fontWeight: '500',
                      border: selectedOption?.id === option.id ? '3px solid #007bff' : '2px solid #dee2e6',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <span className="badge bg-secondary me-3 fs-6" style={{ 
                        width: '35px', 
                        height: '35px', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="fs-5">{option.text}</span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback - Enhanced Display */}
        {showFeedback && (
          <div className={`alert ${isCorrect ? 'alert-success' : 'alert-danger'} mb-4 text-center p-4`} style={{ borderRadius: '15px' }}>
            <div className="fs-1 mb-3">
              {isCorrect ? '🎉' : '💪'}
            </div>
            <h4 className="alert-heading mb-3">
              {isCorrect ? 'Excellent Work!' : 'Good Try!'}
            </h4>
            <p className="mb-3 fs-5">
              {isCorrect ? trial.reinforcement?.message || 'You got it right!' : 'Let\'s practice this more!'}
            </p>
            {isCorrect && trial.reinforcement?.points && (
              <div className="mt-3">
                <span className="badge bg-warning fs-5 me-3 p-2">
                  +{trial.reinforcement.points} points
                </span>
                <span className="badge bg-info fs-5 p-2">
                  Great job!
                </span>
              </div>
            )}
            <div className="mt-4 d-flex justify-content-center">
              <button className="btn btn-primary btn-lg px-4" onClick={handleContinue} disabled={!selectedOption}>
                Continue
                <i className="fas fa-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons - Enhanced Layout */}
        {!showFeedback && (
          <div className="d-flex justify-content-between align-items-center">
            <button 
              className="btn btn-secondary btn-lg px-4"
              onClick={handlePromptRequest}
              disabled={showPrompt}
              style={{ borderRadius: '10px' }}
            >
              <i className="fas fa-lightbulb me-2"></i>
              {showPrompt ? 'Hint Shown' : 'Need a Hint?'}
            </button>
            
            <button 
              className="btn btn-outline-secondary btn-lg px-4"
              onClick={onSkip}
              style={{ borderRadius: '10px' }}
            >
              <i className="fas fa-forward me-2"></i>
              Skip Question
            </button>
          </div>
        )}

        {/* Target Behavior Info */}
        <div className="mt-4 pt-3 border-top">
          <div className="d-flex align-items-center">
            <i className="fas fa-bullseye me-2 text-primary"></i>
            <small className={theme.textMuted}>
              <strong>Learning Goal:</strong> {trial.targetBehavior || 'Improve skills in this area'}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ABATrialCard;
