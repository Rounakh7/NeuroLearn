import { useState, useEffect } from 'react';
import { initializeAppData } from '../utils/initializeTherapyData';

export const useDataInitialization = (currentUser) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initializationError, setInitializationError] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      if (!currentUser || isInitialized || isInitializing) {
        return;
      }

      setIsInitializing(true);
      setInitializationError(null);

      try {
        console.log('🚀 Starting data initialization for user:', currentUser.email);
        const success = await initializeAppData(currentUser);
        
        if (success) {
          setIsInitialized(true);
          console.log('✅ Data initialization completed successfully');
        } else {
          setInitializationError('Data initialization failed. Check Firestore permissions.');
          console.log('⚠️ Data initialization failed');
        }
      } catch (error) {
        console.error('Error during data initialization:', error);
        setInitializationError(error.message);
      } finally {
        setIsInitializing(false);
      }
    };

    // Only initialize once when user is authenticated
    if (currentUser && !isInitialized && !isInitializing) {
      // Add a small delay to ensure Firebase is fully ready
      const timer = setTimeout(initializeData, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentUser, isInitialized, isInitializing]);

  return {
    isInitialized,
    isInitializing,
    initializationError,
    // Manual retry function
    retryInitialization: async () => {
      if (currentUser) {
        setIsInitialized(false);
        setIsInitializing(false);
        setInitializationError(null);
      }
    }
  };
};
