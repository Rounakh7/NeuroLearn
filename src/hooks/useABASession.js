import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export function useABASession(user) {
  const [isABASessionActive, setIsABASessionActive] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const startSession = () => {
    setIsABASessionActive(true);
    setSessionData({
      startTime: new Date(),
      completedTrials: [],
      status: 'in_progress',
      totalPoints: 0
    });
  };

  const endSession = () => {
    setIsABASessionActive(false);
    setSessionData(null);
  };

  const saveSession = async (sessionResults) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Calculate session summary
      const completedTrials = sessionResults.filter(r => !r.skipped);
      const correctTrials = sessionResults.filter(r => r.correct || r.allStepsCompleted);
      const totalPoints = correctTrials.reduce((sum, trial) => {
        return sum + (trial.points || 0);
      }, 0);

      const sessionData = {
        userId: user.uid,
        type: 'aba_therapy',
        startTime: sessionResults[0]?.timestamp || serverTimestamp(),
        endTime: serverTimestamp(),
        duration: sessionResults.length > 0 ? 
          (new Date() - new Date(sessionResults[0]?.timestamp)) / 1000 : 0, // in seconds
        totalTrials: sessionResults.length,
        completedTrials: completedTrials.length,
        correctTrials: correctTrials.length,
        accuracy: completedTrials.length > 0 ? 
          Math.round((correctTrials.length / completedTrials.length) * 100) : 0,
        totalPoints: totalPoints,
        results: sessionResults,
        status: 'completed',
        createdAt: serverTimestamp()
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'therapy_sessions'), sessionData);
      
      // Also save to local storage as fallback
      const localSessions = JSON.parse(localStorage.getItem('localTherapySessions') || '[]');
      localSessions.push({
        ...sessionData,
        id: docRef.id,
        local: true
      });
      localStorage.setItem('localTherapySessions', JSON.stringify(localSessions));

      return { id: docRef.id, ...sessionData };
    } catch (err) {
      console.error('Error saving ABA session:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isABASessionActive,
    sessionData,
    isLoading,
    error,
    startSession,
    endSession,
    saveSession
  };
}
