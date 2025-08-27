import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

function RewardModal({ 
  isOpen, 
  onClose, 
  reward, 
  pointsEarned = 0, 
  streakBonus = 0, 
  newBadges = [], 
  totalPoints = 0,
  motivationalMessage = null 
}) {
  const { theme } = useTheme();
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('entering');

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setAnimationPhase('entering');
      
      // Animation sequence
      const timer1 = setTimeout(() => setAnimationPhase('celebrating'), 500);
      const timer2 = setTimeout(() => setAnimationPhase('showing'), 1500);
      const timer3 = setTimeout(() => setShowConfetti(false), 3000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen]);

  const getMotivationalMessage = () => {
    if (motivationalMessage) return motivationalMessage;
    
    const messages = [
      "Outstanding work! 🌟",
      "You're making amazing progress! 🚀",
      "Keep up the fantastic effort! 💪",
      "You're a superstar! ⭐",
      "Incredible job today! 🎉",
      "You're getting stronger every day! 💎",
      "Amazing dedication! 🏆",
      "You're unstoppable! 🔥"
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getBadgeIcon = (badgeType) => {
    const badges = {
      first_trial: '🎯',
      accuracy_master: '🎯',
      streak_warrior: '🔥',
      daily_champion: '👑',
      week_warrior: '⚡',
      communication_expert: '💬',
      social_butterfly: '👥',
      academic_ace: '📚',
      daily_living_pro: '🏠',
      motor_master: '🤸',
      consistency_king: '📅',
      improvement_star: '📈',
      patience_pro: '🧘',
      focus_master: '🎯'
    };
    return badges[badgeType] || '🏅';
  };

  const getBadgeTitle = (badgeType) => {
    const titles = {
      first_trial: 'First Steps',
      accuracy_master: 'Accuracy Master',
      streak_warrior: 'Streak Warrior',
      daily_champion: 'Daily Champion',
      week_warrior: 'Week Warrior',
      communication_expert: 'Communication Expert',
      social_butterfly: 'Social Butterfly',
      academic_ace: 'Academic Ace',
      daily_living_pro: 'Daily Living Pro',
      motor_master: 'Motor Master',
      consistency_king: 'Consistency King',
      improvement_star: 'Improvement Star',
      patience_pro: 'Patience Pro',
      focus_master: 'Focus Master'
    };
    return titles[badgeType] || 'Achievement Unlocked';
  };

  const getBadgeDescription = (badgeType) => {
    const descriptions = {
      first_trial: 'Completed your first trial!',
      accuracy_master: 'Achieved 90%+ accuracy in a session',
      streak_warrior: 'Completed 5 sessions in a row',
      daily_champion: 'Completed daily goals',
      week_warrior: 'Completed weekly goals',
      communication_expert: 'Mastered communication skills',
      social_butterfly: 'Excelled in social interactions',
      academic_ace: 'Outstanding academic performance',
      daily_living_pro: 'Mastered daily living skills',
      motor_master: 'Excellent motor skill development',
      consistency_king: 'Consistent daily practice',
      improvement_star: 'Showed significant improvement',
      patience_pro: 'Demonstrated great patience',
      focus_master: 'Maintained excellent focus'
    };
    return descriptions[badgeType] || 'Great achievement!';
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className={`modal-content border-0 shadow-lg ${animationPhase === 'entering' ? 'animate__animated animate__zoomIn' : ''}`}>
          
          {/* Confetti Effect */}
          {showConfetti && (
            <div className="position-absolute w-100 h-100" style={{ zIndex: 1000, pointerEvents: 'none' }}>
              <div className="confetti-container">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="confetti-piece"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)]
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="modal-header border-0 text-center pb-0">
            <div className="w-100">
              <div className="display-1 mb-2">🎉</div>
              <h2 className="modal-title text-primary fw-bold">
                {getMotivationalMessage()}
              </h2>
            </div>
          </div>

          <div className="modal-body text-center px-4">
            
            {/* Points Earned */}
            {pointsEarned > 0 && (
              <div className={`mb-4 ${animationPhase === 'celebrating' ? 'animate__animated animate__bounceIn' : ''}`}>
                <div className="card bg-gradient-primary text-white">
                  <div className="card-body py-3">
                    <div className="d-flex align-items-center justify-content-center">
                      <span className="display-4 me-3">⭐</span>
                      <div>
                        <h3 className="mb-0">+{pointsEarned} Points!</h3>
                        {streakBonus > 0 && (
                          <small className="opacity-75">
                            +{streakBonus} streak bonus
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* New Badges */}
            {newBadges.length > 0 && (
              <div className={`mb-4 ${animationPhase === 'showing' ? 'animate__animated animate__fadeInUp' : ''}`}>
                <h4 className="text-success mb-3">🏆 New Achievements!</h4>
                <div className="row justify-content-center">
                  {newBadges.map((badge, index) => (
                    <div key={index} className="col-md-6 col-lg-4 mb-3">
                      <div className="card h-100 border-success">
                        <div className="card-body text-center">
                          <div className="display-4 mb-2">
                            {getBadgeIcon(badge.type)}
                          </div>
                          <h6 className="card-title text-success">
                            {getBadgeTitle(badge.type)}
                          </h6>
                          <p className="card-text small text-muted">
                            {getBadgeDescription(badge.type)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Points Display */}
            <div className="mb-4">
              <div className="card bg-light">
                <div className="card-body py-2">
                  <div className="d-flex align-items-center justify-content-center">
                    <span className="me-2">💎</span>
                    <span className="fw-bold">Total Points: {totalPoints}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reward-specific content */}
            {reward && (
              <div className="mb-4">
                <div className="card border-warning">
                  <div className="card-body">
                    <div className="display-3 mb-2">{reward.icon || '🎁'}</div>
                    <h5 className="text-warning">{reward.title}</h5>
                    <p className="text-muted">{reward.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Encouraging message */}
            <div className="alert alert-info border-0">
              <div className="d-flex align-items-center">
                <span className="me-2" style={{ fontSize: '1.5rem' }}>💪</span>
                <div>
                  <strong>Keep it up!</strong> Every trial makes you stronger and smarter!
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-0 justify-content-center">
            <button
              type="button"
              className="btn btn-primary btn-lg px-5"
              onClick={onClose}
            >
              Continue Learning! 🚀
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .confetti-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: confetti-fall 3s linear infinite;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .animate__animated {
          animation-duration: 0.8s;
        }
        
        .animate__zoomIn {
          animation-name: zoomIn;
        }
        
        .animate__bounceIn {
          animation-name: bounceIn;
        }
        
        .animate__fadeInUp {
          animation-name: fadeInUp;
        }
        
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale3d(0.3, 0.3, 0.3);
          }
          50% {
            opacity: 1;
          }
        }
        
        @keyframes bounceIn {
          from, 20%, 40%, 60%, 80%, to {
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
          }
          0% {
            opacity: 0;
            transform: scale3d(0.3, 0.3, 0.3);
          }
          20% {
            transform: scale3d(1.1, 1.1, 1.1);
          }
          40% {
            transform: scale3d(0.9, 0.9, 0.9);
          }
          60% {
            opacity: 1;
            transform: scale3d(1.03, 1.03, 1.03);
          }
          80% {
            transform: scale3d(0.97, 0.97, 0.97);
          }
          to {
            opacity: 1;
            transform: scale3d(1, 1, 1);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 100%, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        `
      }} />
    </div>
  );
}

export default RewardModal;
