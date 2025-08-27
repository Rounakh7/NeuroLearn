import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

function TherapySessionStarter({ therapy, onClose, onComplete }) {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [sessionStartTime] = useState(new Date());
  const [sessionNotes, setSessionNotes] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);

  // Sample therapy steps based on therapy type
  const getTherapySteps = (therapy) => {
    const baseSteps = [
      {
        title: 'Welcome & Preparation',
        description: 'Get comfortable and prepare for the session',
        duration: 2,
        instructions: 'Find a quiet space and gather any materials you might need.'
      },
      {
        title: 'Warm-up Activity',
        description: 'Light exercises to prepare for the main session',
        duration: 5,
        instructions: 'Follow the warm-up exercises to get ready.'
      }
    ];

    switch (therapy.category) {
      case 'behavioral_therapy':
        return [
          ...baseSteps,
          {
            title: 'Behavior Practice',
            description: 'Practice target behaviors with positive reinforcement',
            duration: 15,
            instructions: 'Focus on the specific behaviors we want to improve.'
          },
          {
            title: 'Social Interaction',
            description: 'Practice social skills and communication',
            duration: 10,
            instructions: 'Work on eye contact, turn-taking, and communication.'
          }
        ];
      case 'speech_therapy':
        return [
          ...baseSteps,
          {
            title: 'Articulation Practice',
            description: 'Practice clear speech and pronunciation',
            duration: 15,
            instructions: 'Focus on clear pronunciation and speech patterns.'
          },
          {
            title: 'Language Activities',
            description: 'Vocabulary and language comprehension exercises',
            duration: 10,
            instructions: 'Work on vocabulary building and understanding.'
          }
        ];
      case 'occupational_therapy':
        return [
          ...baseSteps,
          {
            title: 'Fine Motor Skills',
            description: 'Hand coordination and dexterity exercises',
            duration: 15,
            instructions: 'Practice activities that improve hand-eye coordination.'
          },
          {
            title: 'Daily Living Skills',
            description: 'Practice everyday activities and self-care',
            duration: 10,
            instructions: 'Work on independence in daily activities.'
          }
        ];
      default:
        return [
          ...baseSteps,
          {
            title: 'Main Activity',
            description: 'Core therapeutic exercises',
            duration: 20,
            instructions: 'Focus on the main therapeutic goals.'
          }
        ];
    }
  };

  const steps = getTherapySteps(therapy);
  const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionProgress(prev => {
        const newProgress = prev + (100 / (totalDuration * 60)); // Update every second
        return Math.min(newProgress, 100);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [totalDuration]);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCompleteSession();
    }
  };

  const handleCompleteSession = async () => {
    setIsCompleting(true);
    const sessionData = {
      therapyId: therapy.id,
      therapyTitle: therapy.title,
      startTime: sessionStartTime,
      endTime: new Date(),
      duration: Math.round((new Date() - sessionStartTime) / 1000 / 60), // minutes
      progress: Math.round(sessionProgress),
      notes: sessionNotes,
      status: 'completed',
      steps: steps.map((step, index) => ({
        ...step,
        completed: index <= currentStep
      }))
    };

    try {
      await onComplete(sessionData);
      onClose();
    } catch (error) {
      console.error('Error completing session:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  if (!therapy) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className={`modal-content ${theme.card}`}>
          <div className={`modal-header ${theme.cardHeader}`}>
            <h5 className="modal-title d-flex align-items-center">
              <span className="me-2" style={{ fontSize: '1.5rem' }}>🧠</span>
              {therapy.title} - Session in Progress
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className={`small ${theme.text}`}>Session Progress</span>
                <span className={`small ${theme.textMuted}`}>
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div 
                  className="progress-bar bg-success" 
                  style={{ width: `${(currentStep + 1) / steps.length * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Current Step */}
            <div className={`card ${theme.card} mb-4`}>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div 
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                    style={{ width: '40px', height: '40px' }}
                  >
                    {currentStep + 1}
                  </div>
                  <div>
                    <h6 className={`mb-1 ${theme.text}`}>{steps[currentStep].title}</h6>
                    <p className={`mb-0 small ${theme.textMuted}`}>
                      Duration: {steps[currentStep].duration} minutes
                    </p>
                  </div>
                </div>
                
                <p className={`${theme.text} mb-3`}>{steps[currentStep].description}</p>
                
                <div className={`alert ${theme.alertInfo}`}>
                  <i className="fas fa-lightbulb me-2"></i>
                  <strong>Instructions:</strong> {steps[currentStep].instructions}
                </div>
              </div>
            </div>

            {/* Session Notes */}
            <div className="mb-4">
              <label className={`form-label ${theme.formLabel}`}>Session Notes (Optional)</label>
              <textarea
                className={`${theme.formControl}`}
                rows="3"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Add any notes about this session..."
              ></textarea>
            </div>

            {/* Time Display */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className={`card ${theme.card} text-center`}>
                  <div className="card-body py-3">
                    <h6 className={`card-title ${theme.text}`}>Session Time</h6>
                    <p className={`card-text ${theme.textMuted}`}>
                      {Math.round((new Date() - sessionStartTime) / 1000 / 60)} minutes
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className={`card ${theme.card} text-center`}>
                  <div className="card-body py-3">
                    <h6 className={`card-title ${theme.text}`}>Target Duration</h6>
                    <p className={`card-text ${theme.textMuted}`}>
                      {therapy.duration} minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className={`btn ${theme.btnSecondary}`}
              onClick={onClose}
            >
              Pause Session
            </button>
            
            <button 
              type="button" 
              className={`btn ${currentStep === steps.length - 1 ? theme.btnSuccess : theme.btnPrimary}`}
              onClick={handleNextStep}
              disabled={isCompleting}
            >
              {isCompleting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Completing...
                </>
              ) : currentStep === steps.length - 1 ? (
                <>
                  <i className="fas fa-check me-2"></i>
                  Complete Session
                </>
              ) : (
                <>
                  <i className="fas fa-arrow-right me-2"></i>
                  Next Step
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TherapySessionStarter;
