// Comprehensive data models for ABA therapy platform

// User Profile Data Model
export const createUserProfile = (userData) => ({
  uid: userData.uid,
  email: userData.email,
  displayName: userData.displayName || '',
  role: userData.role, // 'patient', 'parent', 'specialist'
  createdAt: new Date(),
  updatedAt: new Date(),
  
  // Patient-specific data
  patientInfo: userData.role === 'patient' ? {
    dateOfBirth: null,
    diagnosis: [],
    skillLevel: 'beginner', // 'beginner', 'intermediate', 'advanced'
    preferences: {
      favoriteCategories: [],
      reinforcementPreferences: [],
      sessionDuration: 15, // minutes
      difficultyPreference: 'adaptive'
    },
    goals: [],
    parentIds: [], // Array of parent user IDs
    specialistIds: [] // Array of specialist user IDs
  } : null,

  // Parent-specific data
  parentInfo: userData.role === 'parent' ? {
    childrenIds: [], // Array of patient user IDs
    specialistIds: [] // Array of specialist user IDs
  } : null,

  // Specialist-specific data
  specialistInfo: userData.role === 'specialist' ? {
    credentials: [],
    specializations: [],
    patientIds: [], // Array of patient user IDs
    parentIds: [] // Array of parent user IDs
  } : null,

  // Progress tracking
  progressStats: {
    totalSessions: 0,
    totalTrials: 0,
    correctTrials: 0,
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    badges: [],
    achievements: [],
    skillProgress: {} // Category-wise progress
  },

  // Settings
  settings: {
    notifications: true,
    soundEffects: true,
    visualEffects: true,
    theme: 'light',
    language: 'en'
  }
});

// Session Result Data Model
export const createSessionResult = (sessionData) => ({
  id: sessionData.id || null,
  userId: sessionData.userId,
  sessionType: sessionData.sessionType, // 'discrete_trial', 'task_analysis', 'mixed'
  moduleId: sessionData.moduleId || null,
  startTime: sessionData.startTime || new Date(),
  endTime: sessionData.endTime || new Date(),
  duration: sessionData.duration || 0, // milliseconds
  
  // Trial results
  results: sessionData.results || [], // Array of trial results
  
  // Session statistics
  statistics: {
    totalTrials: sessionData.results?.length || 0,
    correctTrials: sessionData.results?.filter(r => r.correct || r.allStepsCompleted).length || 0,
    accuracyRate: 0, // Calculated
    averageResponseTime: 0, // Calculated
    promptsUsed: sessionData.results?.filter(r => r.promptUsed).length || 0,
    skippedTrials: sessionData.results?.filter(r => r.skipped).length || 0
  },

  // Points and rewards
  pointsEarned: sessionData.pointsEarned || 0,
  streakBonus: sessionData.streakBonus || 0,
  newBadges: sessionData.newBadges || [],
  achievements: sessionData.achievements || [],

  // Session metadata
  completedAt: new Date(),
  deviceInfo: {
    userAgent: navigator.userAgent,
    screenResolution: `${screen.width}x${screen.height}`,
    timestamp: new Date().toISOString()
  },

  // Notes and observations
  notes: sessionData.notes || '',
  behaviorNotes: sessionData.behaviorNotes || '',
  
  // Quality metrics
  qualityMetrics: {
    engagement: sessionData.engagement || 'high', // 'low', 'medium', 'high'
    frustrationLevel: sessionData.frustrationLevel || 'none', // 'none', 'low', 'medium', 'high'
    motivationLevel: sessionData.motivationLevel || 'high', // 'low', 'medium', 'high'
    attentionLevel: sessionData.attentionLevel || 'high' // 'low', 'medium', 'high'
  }
});

// Trial Result Data Model
export const createTrialResult = (trialData) => ({
  trialId: trialData.trialId,
  trialType: trialData.trialType, // 'discrete_trial', 'task_analysis'
  category: trialData.category || 'general',
  difficulty: trialData.difficulty || 'beginner',
  
  // Response data
  selectedOptionId: trialData.selectedOptionId || null,
  correct: trialData.correct || false,
  responseTime: trialData.responseTime || 0,
  promptUsed: trialData.promptUsed || false,
  skipped: trialData.skipped || false,
  
  // Task analysis specific
  completedSteps: trialData.completedSteps || [],
  allStepsCompleted: trialData.allStepsCompleted || false,
  completionTime: trialData.completionTime || 0,
  
  // Behavioral observations
  attentionLevel: trialData.attentionLevel || 'high',
  engagementLevel: trialData.engagementLevel || 'high',
  frustrationSigns: trialData.frustrationSigns || false,
  
  // Timestamp
  timestamp: new Date(),
  
  // Additional metadata
  metadata: trialData.metadata || {}
});

// Badge/Achievement Data Model
export const createBadge = (badgeData) => ({
  id: badgeData.id,
  type: badgeData.type,
  title: badgeData.title,
  description: badgeData.description,
  icon: badgeData.icon,
  category: badgeData.category,
  criteria: badgeData.criteria, // Object describing how to earn this badge
  points: badgeData.points || 0,
  rarity: badgeData.rarity || 'common', // 'common', 'rare', 'epic', 'legendary'
  earnedAt: badgeData.earnedAt || new Date(),
  earnedBy: badgeData.earnedBy || [] // Array of user IDs who earned this badge
});

// Skill Progress Data Model
export const createSkillProgress = (skillData) => ({
  userId: skillData.userId,
  category: skillData.category,
  skillName: skillData.skillName,
  currentLevel: skillData.currentLevel || 'beginner',
  
  // Progress metrics
  totalAttempts: skillData.totalAttempts || 0,
  successfulAttempts: skillData.successfulAttempts || 0,
  accuracyRate: 0, // Calculated
  
  // Mastery tracking
  masteryLevel: skillData.masteryLevel || 0, // 0-100
  masteryThreshold: skillData.masteryThreshold || 80, // Percentage needed for mastery
  isMastered: false, // Calculated
  
  // Timeline
  firstAttempt: skillData.firstAttempt || new Date(),
  lastAttempt: skillData.lastAttempt || new Date(),
  masteredAt: skillData.masteredAt || null,
  
  // Goals and targets
  targetAccuracy: skillData.targetAccuracy || 80,
  targetConsistency: skillData.targetConsistency || 5, // Number of consecutive successful sessions
  currentConsistency: skillData.currentConsistency || 0,
  
  // Progress history
  progressHistory: skillData.progressHistory || [], // Array of {date, accuracy, attempts}
  
  // Notes
  notes: skillData.notes || '',
  strategies: skillData.strategies || [] // Effective teaching strategies
});

// Task Analysis Data Model
export const createTaskAnalysis = (taskData) => ({
  id: taskData.id || null,
  title: taskData.title,
  description: taskData.description || '',
  category: taskData.category,
  difficulty: taskData.difficulty,
  estimatedTime: taskData.estimatedTime || 10,
  
  // Steps
  steps: taskData.steps.map((step, index) => ({
    id: step.id || index + 1,
    order: index + 1,
    instruction: step.instruction,
    prompt: step.prompt || '',
    visualAid: step.visualAid || '',
    completed: false,
    timeToComplete: null,
    notes: ''
  })),
  
  // Reinforcement
  reinforcement: {
    points: taskData.reinforcement?.points || 10,
    message: taskData.reinforcement?.message || 'Great job!',
    celebration: taskData.reinforcement?.celebration || 'confetti',
    additionalRewards: taskData.reinforcement?.additionalRewards || []
  },
  
  // Prerequisites and relationships
  prerequisites: taskData.prerequisites || [],
  followUpTasks: taskData.followUpTasks || [],
  relatedSkills: taskData.relatedSkills || [],
  
  // Metadata
  createdBy: taskData.createdBy,
  createdAt: taskData.createdAt || new Date(),
  updatedAt: taskData.updatedAt || new Date(),
  tags: taskData.tags || [],
  isActive: taskData.isActive !== false,
  
  // Usage statistics
  usageStats: {
    timesUsed: 0,
    averageCompletionTime: 0,
    averageAccuracy: 0,
    userFeedback: []
  }
});

// Discrete Trial Data Model
export const createDiscreteTrial = (trialData) => ({
  id: trialData.id || null,
  title: trialData.title,
  instruction: trialData.instruction,
  category: trialData.category,
  difficulty: trialData.difficulty,
  
  // Trial options
  options: trialData.options.map((option, index) => ({
    id: option.id || index + 1,
    text: option.text,
    image: option.image || null,
    audio: option.audio || null,
    correct: option.correct || false,
    feedback: option.feedback || ''
  })),
  
  // Prompts and hints
  prompts: trialData.prompts || [],
  hints: trialData.hints || [],
  
  // Reinforcement
  reinforcement: {
    points: trialData.reinforcement?.points || 5,
    correctMessage: trialData.reinforcement?.correctMessage || 'Correct!',
    incorrectMessage: trialData.reinforcement?.incorrectMessage || 'Try again!',
    encouragementMessage: trialData.reinforcement?.encouragementMessage || 'Keep going!'
  },
  
  // Metadata
  createdBy: trialData.createdBy,
  createdAt: trialData.createdAt || new Date(),
  updatedAt: trialData.updatedAt || new Date(),
  tags: trialData.tags || [],
  isActive: trialData.isActive !== false,
  
  // Usage statistics
  usageStats: {
    timesUsed: 0,
    averageResponseTime: 0,
    accuracyRate: 0,
    userFeedback: []
  }
});

// Reward System Configuration
export const rewardSystemConfig = {
  pointValues: {
    correctTrial: 5,
    completedTask: 10,
    perfectSession: 20,
    streakBonus: 2, // per consecutive session
    improvementBonus: 5,
    consistencyBonus: 10
  },
  
  badges: {
    first_trial: { points: 10, rarity: 'common' },
    accuracy_master: { points: 50, rarity: 'rare' },
    streak_warrior: { points: 30, rarity: 'rare' },
    daily_champion: { points: 25, rarity: 'common' },
    week_warrior: { points: 100, rarity: 'epic' },
    communication_expert: { points: 75, rarity: 'rare' },
    social_butterfly: { points: 75, rarity: 'rare' },
    academic_ace: { points: 75, rarity: 'rare' },
    daily_living_pro: { points: 75, rarity: 'rare' },
    motor_master: { points: 75, rarity: 'rare' },
    consistency_king: { points: 200, rarity: 'legendary' },
    improvement_star: { points: 50, rarity: 'rare' },
    patience_pro: { points: 40, rarity: 'common' },
    focus_master: { points: 60, rarity: 'rare' }
  },
  
  streakThresholds: [3, 5, 7, 10, 14, 21, 30], // Days
  accuracyThresholds: [70, 80, 90, 95], // Percentages
  consistencyThresholds: [5, 10, 15, 20] // Consecutive sessions
};

// Helper functions for data processing
export const calculateAccuracy = (correct, total) => {
  return total > 0 ? Math.round((correct / total) * 100) : 0;
};

export const calculateAverageResponseTime = (responseTimes) => {
  if (responseTimes.length === 0) return 0;
  const sum = responseTimes.reduce((acc, time) => acc + time, 0);
  return Math.round(sum / responseTimes.length);
};

export const determineSkillLevel = (accuracyRate, totalTrials) => {
  if (totalTrials < 10) return 'beginner';
  if (accuracyRate >= 90 && totalTrials >= 50) return 'advanced';
  if (accuracyRate >= 75 && totalTrials >= 25) return 'intermediate';
  return 'beginner';
};

export const checkBadgeEligibility = (userStats, badgeType) => {
  const criteria = {
    first_trial: () => userStats.totalTrials >= 1,
    accuracy_master: () => userStats.accuracyRate >= 90 && userStats.totalTrials >= 20,
    streak_warrior: () => userStats.currentStreak >= 5,
    daily_champion: () => userStats.sessionsToday >= 3,
    week_warrior: () => userStats.sessionsThisWeek >= 15,
    communication_expert: () => userStats.skillProgress.communication?.accuracyRate >= 85,
    social_butterfly: () => userStats.skillProgress.social?.accuracyRate >= 85,
    academic_ace: () => userStats.skillProgress.academic?.accuracyRate >= 85,
    daily_living_pro: () => userStats.skillProgress.daily_living?.accuracyRate >= 85,
    motor_master: () => userStats.skillProgress.motor?.accuracyRate >= 85,
    consistency_king: () => userStats.currentStreak >= 30,
    improvement_star: () => userStats.improvementRate >= 20,
    patience_pro: () => userStats.averageSessionTime >= 20,
    focus_master: () => userStats.attentionScore >= 90
  };
  
  return criteria[badgeType] ? criteria[badgeType]() : false;
};

export default {
  createUserProfile,
  createSessionResult,
  createTrialResult,
  createBadge,
  createSkillProgress,
  createTaskAnalysis,
  createDiscreteTrial,
  rewardSystemConfig,
  calculateAccuracy,
  calculateAverageResponseTime,
  determineSkillLevel,
  checkBadgeEligibility
};
