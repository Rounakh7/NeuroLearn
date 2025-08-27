// ABA Session Management and Backend Integration Utilities

import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  increment,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  createSessionResult, 
  createTrialResult, 
  createBadge,
  rewardSystemConfig,
  checkBadgeEligibility,
  calculateAccuracy
} from './abaDataModels';

// Session Management Class
export class ABASessionManager {
  constructor(userId) {
    this.userId = userId;
    this.currentSession = null;
    this.sessionStartTime = null;
    this.trialResults = [];
  }

  // Start a new ABA session
  async startSession(moduleData, sessionType = 'discrete_trial') {
    try {
      this.sessionStartTime = new Date();
      this.trialResults = [];
      
      this.currentSession = {
        userId: this.userId,
        moduleId: moduleData.id,
        moduleTitle: moduleData.title,
        sessionType: sessionType,
        startTime: this.sessionStartTime,
        moduleData: moduleData
      };

      console.log('Session started:', this.currentSession);
      return this.currentSession;
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  }

  // Record a trial result
  recordTrialResult(trialData) {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    const trialResult = createTrialResult({
      ...trialData,
      sessionId: this.currentSession.id,
      userId: this.userId
    });

    this.trialResults.push(trialResult);
    return trialResult;
  }

  // Complete the current session and save to database
  async completeSession(additionalData = {}) {
    if (!this.currentSession) {
      throw new Error('No active session to complete');
    }

    try {
      const endTime = new Date();
      const duration = endTime.getTime() - this.sessionStartTime.getTime();

      // Calculate session statistics
      const statistics = this.calculateSessionStatistics();
      
      // Calculate points and rewards
      const rewardData = await this.calculateRewards(statistics);

      // Create session result
      const sessionResult = createSessionResult({
        ...this.currentSession,
        endTime: endTime,
        duration: duration,
        results: this.trialResults,
        statistics: statistics,
        pointsEarned: rewardData.pointsEarned,
        streakBonus: rewardData.streakBonus,
        newBadges: rewardData.newBadges,
        ...additionalData
      });

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'sessionResults'), {
        ...sessionResult,
        completedAt: serverTimestamp()
      });

      sessionResult.id = docRef.id;

      // Update user progress
      await this.updateUserProgress(sessionResult);

      // Reset session
      this.currentSession = null;
      this.trialResults = [];

      return sessionResult;
    } catch (error) {
      console.error('Error completing session:', error);
      throw error;
    }
  }

  // Calculate session statistics
  calculateSessionStatistics() {
    const totalTrials = this.trialResults.length;
    const correctTrials = this.trialResults.filter(r => r.correct || r.allStepsCompleted).length;
    const promptsUsed = this.trialResults.filter(r => r.promptUsed).length;
    const skippedTrials = this.trialResults.filter(r => r.skipped).length;
    
    const responseTimes = this.trialResults
      .filter(r => r.responseTime && !r.skipped)
      .map(r => r.responseTime);
    
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0;

    return {
      totalTrials,
      correctTrials,
      accuracyRate: calculateAccuracy(correctTrials, totalTrials),
      averageResponseTime: Math.round(averageResponseTime),
      promptsUsed,
      skippedTrials
    };
  }

  // Calculate rewards and badges
  async calculateRewards(statistics) {
    try {
      // Base points calculation
      let pointsEarned = 0;
      
      // Points for correct trials
      pointsEarned += statistics.correctTrials * rewardSystemConfig.pointValues.correctTrial;
      
      // Perfect session bonus
      if (statistics.accuracyRate === 100 && statistics.totalTrials >= 5) {
        pointsEarned += rewardSystemConfig.pointValues.perfectSession;
      }

      // Get current user stats for badge checking
      const userStats = await this.getUserStats();
      
      // Calculate streak bonus
      const streakBonus = this.calculateStreakBonus(userStats);
      pointsEarned += streakBonus;

      // Check for new badges
      const newBadges = await this.checkForNewBadges(userStats, statistics);

      return {
        pointsEarned,
        streakBonus,
        newBadges
      };
    } catch (error) {
      console.error('Error calculating rewards:', error);
      return { pointsEarned: 0, streakBonus: 0, newBadges: [] };
    }
  }

  // Calculate streak bonus
  calculateStreakBonus(userStats) {
    const currentStreak = userStats.currentStreak || 0;
    return currentStreak * rewardSystemConfig.pointValues.streakBonus;
  }

  // Check for new badges earned
  async checkForNewBadges(userStats, sessionStats) {
    const newBadges = [];
    const existingBadges = userStats.badges || [];
    const existingBadgeTypes = existingBadges.map(b => b.type);

    // Update stats with current session
    const updatedStats = {
      ...userStats,
      totalTrials: (userStats.totalTrials || 0) + sessionStats.totalTrials,
      correctTrials: (userStats.correctTrials || 0) + sessionStats.correctTrials,
      totalSessions: (userStats.totalSessions || 0) + 1,
      accuracyRate: calculateAccuracy(
        (userStats.correctTrials || 0) + sessionStats.correctTrials,
        (userStats.totalTrials || 0) + sessionStats.totalTrials
      )
    };

    // Check each badge type
    Object.keys(rewardSystemConfig.badges).forEach(badgeType => {
      if (!existingBadgeTypes.includes(badgeType)) {
        if (checkBadgeEligibility(updatedStats, badgeType)) {
          newBadges.push(createBadge({
            id: `${badgeType}_${Date.now()}`,
            type: badgeType,
            title: this.getBadgeTitle(badgeType),
            description: this.getBadgeDescription(badgeType),
            icon: this.getBadgeIcon(badgeType),
            category: this.getBadgeCategory(badgeType),
            criteria: this.getBadgeCriteria(badgeType),
            points: rewardSystemConfig.badges[badgeType].points,
            rarity: rewardSystemConfig.badges[badgeType].rarity,
            earnedAt: new Date(),
            earnedBy: [this.userId]
          }));
        }
      }
    });

    return newBadges;
  }

  // Get current user statistics
  async getUserStats() {
    try {
      const userProfileQuery = query(
        collection(db, 'userProfiles'),
        where('uid', '==', this.userId),
        limit(1)
      );

      const snapshot = await getDocs(userProfileQuery);
      if (snapshot.empty) {
        return { totalTrials: 0, correctTrials: 0, totalSessions: 0, badges: [] };
      }

      const userProfile = snapshot.docs[0].data();
      return userProfile.progressStats || { totalTrials: 0, correctTrials: 0, totalSessions: 0, badges: [] };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return { totalTrials: 0, correctTrials: 0, totalSessions: 0, badges: [] };
    }
  }

  // Update user progress in database
  async updateUserProgress(sessionResult) {
    try {
      // Find user profile
      const userProfileQuery = query(
        collection(db, 'userProfiles'),
        where('uid', '==', this.userId),
        limit(1)
      );

      const snapshot = await getDocs(userProfileQuery);
      
      if (!snapshot.empty) {
        const userProfileDoc = snapshot.docs[0];
        const currentStats = userProfileDoc.data().progressStats || {};

        // Calculate updated streak
        const newStreak = await this.calculateUpdatedStreak();

        // Update progress stats
        const updatedStats = {
          totalSessions: increment(1),
          totalTrials: increment(sessionResult.statistics.totalTrials),
          correctTrials: increment(sessionResult.statistics.correctTrials),
          totalPoints: increment(sessionResult.pointsEarned + (sessionResult.streakBonus || 0)),
          currentStreak: newStreak,
          longestStreak: Math.max(currentStats.longestStreak || 0, newStreak),
          badges: arrayUnion(...sessionResult.newBadges),
          lastSessionDate: serverTimestamp()
        };

        // Update skill-specific progress
        const skillCategory = sessionResult.moduleData?.category || 'general';
        if (skillCategory !== 'general') {
          updatedStats[`skillProgress.${skillCategory}`] = {
            totalTrials: increment(sessionResult.statistics.totalTrials),
            correctTrials: increment(sessionResult.statistics.correctTrials),
            accuracyRate: calculateAccuracy(
              (currentStats.skillProgress?.[skillCategory]?.correctTrials || 0) + sessionResult.statistics.correctTrials,
              (currentStats.skillProgress?.[skillCategory]?.totalTrials || 0) + sessionResult.statistics.totalTrials
            ),
            lastUpdated: serverTimestamp()
          };
        }

        await updateDoc(doc(db, 'userProfiles', userProfileDoc.id), {
          progressStats: updatedStats,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  }

  // Calculate updated streak
  async calculateUpdatedStreak() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Check if user had a session yesterday
      const yesterdayQuery = query(
        collection(db, 'sessionResults'),
        where('userId', '==', this.userId),
        where('completedAt', '>=', yesterday),
        where('completedAt', '<', today)
      );

      const yesterdaySnapshot = await getDocs(yesterdayQuery);
      const userStats = await this.getUserStats();
      const currentStreak = userStats.currentStreak || 0;

      // If had session yesterday, increment streak, otherwise reset to 1
      return yesterdaySnapshot.empty ? 1 : currentStreak + 1;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 1;
    }
  }

  // Badge helper methods
  getBadgeTitle(badgeType) {
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
  }

  getBadgeDescription(badgeType) {
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
  }

  getBadgeIcon(badgeType) {
    const icons = {
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
    return icons[badgeType] || '🏅';
  }

  getBadgeCategory(badgeType) {
    if (['communication_expert', 'social_butterfly', 'academic_ace', 'daily_living_pro', 'motor_master'].includes(badgeType)) {
      return 'skill_mastery';
    }
    if (['streak_warrior', 'daily_champion', 'week_warrior', 'consistency_king'].includes(badgeType)) {
      return 'consistency';
    }
    if (['accuracy_master', 'improvement_star', 'focus_master'].includes(badgeType)) {
      return 'performance';
    }
    return 'general';
  }

  getBadgeCriteria(badgeType) {
    const criteria = {
      first_trial: { totalTrials: 1 },
      accuracy_master: { accuracyRate: 90, minTrials: 20 },
      streak_warrior: { currentStreak: 5 },
      daily_champion: { sessionsToday: 3 },
      week_warrior: { sessionsThisWeek: 15 },
      communication_expert: { skillAccuracy: { communication: 85 } },
      social_butterfly: { skillAccuracy: { social: 85 } },
      academic_ace: { skillAccuracy: { academic: 85 } },
      daily_living_pro: { skillAccuracy: { daily_living: 85 } },
      motor_master: { skillAccuracy: { motor: 85 } },
      consistency_king: { currentStreak: 30 },
      improvement_star: { improvementRate: 20 },
      patience_pro: { averageSessionTime: 20 },
      focus_master: { attentionScore: 90 }
    };
    return criteria[badgeType] || {};
  }
}

// Utility functions for ABA data management
export const abaDataUtils = {
  // Fetch user's session history
  async fetchSessionHistory(userId, limit = 10) {
    try {
      const sessionsQuery = query(
        collection(db, 'sessionResults'),
        where('userId', '==', userId),
        orderBy('completedAt', 'desc'),
        limit(limit)
      );

      const snapshot = await getDocs(sessionsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        completedAt: doc.data().completedAt?.toDate()
      }));
    } catch (error) {
      console.error('Error fetching session history:', error);
      return [];
    }
  },

  // Fetch available modules
  async fetchAvailableModules(category = null, difficulty = null) {
    try {
      let trialsQuery = collection(db, 'abaTrials');
      let tasksQuery = collection(db, 'taskAnalysis');

      if (category) {
        trialsQuery = query(trialsQuery, where('category', '==', category));
        tasksQuery = query(tasksQuery, where('category', '==', category));
      }

      if (difficulty) {
        trialsQuery = query(trialsQuery, where('difficulty', '==', difficulty));
        tasksQuery = query(tasksQuery, where('difficulty', '==', difficulty));
      }

      const [trialsSnapshot, tasksSnapshot] = await Promise.all([
        getDocs(trialsQuery),
        getDocs(tasksQuery)
      ]);

      const trials = trialsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        moduleType: 'discrete_trial'
      }));

      const tasks = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        moduleType: 'task_analysis'
      }));

      return [...trials, ...tasks];
    } catch (error) {
      console.error('Error fetching modules:', error);
      return [];
    }
  },

  // Get user progress summary
  async getUserProgressSummary(userId) {
    try {
      const userProfileQuery = query(
        collection(db, 'userProfiles'),
        where('uid', '==', userId),
        limit(1)
      );

      const snapshot = await getDocs(userProfileQuery);
      if (snapshot.empty) {
        return null;
      }

      const userProfile = snapshot.docs[0].data();
      return userProfile.progressStats || null;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  },

  // Create or update user profile
  async createOrUpdateUserProfile(userData) {
    try {
      const userProfileQuery = query(
        collection(db, 'userProfiles'),
        where('uid', '==', userData.uid),
        limit(1)
      );

      const snapshot = await getDocs(userProfileQuery);
      
      if (snapshot.empty) {
        // Create new profile
        await addDoc(collection(db, 'userProfiles'), {
          ...userData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        // Update existing profile
        const docRef = snapshot.docs[0].ref;
        await updateDoc(docRef, {
          ...userData,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      throw error;
    }
  }
};

export default ABASessionManager;
