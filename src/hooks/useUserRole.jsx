import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export function useUserRole(user) {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserRole = useCallback(async () => {
    if (!user) {
      setUserRole(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserRole(userData.role);
      } else {
        const role = await checkExistingRole(user.email);
        setUserRole(role);
      }
    } catch (err) {
      console.error('Error fetching user role:', err);
      setError(err.message);

      if (err.message.includes('Missing or insufficient permissions')) {
        console.log('Firestore permissions not configured. User will need to register a role.');
        setUserRole(null);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  const checkExistingRole = async (email) => {
    try {
      const collections = ['patients', 'parents', 'specialists'];

      for (const collectionName of collections) {
        const q = query(collection(db, collectionName), where('email', '==', email));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          // Return collection name minus the 's' as role
          return collectionName.slice(0, -1);
        }
      }

      return null;
    } catch (error) {
      console.error('Error checking existing role:', error);
      return null;
    }
  };

  const registerUserRole = async (role, additionalData = {}) => {
    if (!user || !user.uid) {
      const errMsg = 'User must be authenticated to register role.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }

    try {
      setLoading(true);
      setError(null);

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        role,
        createdAt: new Date(),
        ...additionalData
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      await setDoc(doc(db, `${role}s`, user.uid), userData);

      setUserRole(role);
      return { success: true };
    } catch (err) {
      console.error('Error registering user role:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates) => {
    if (!user || !user.uid) {
      const errMsg = 'User must be authenticated to update profile.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }

    try {
      setError(null);
      
      const userRef = doc(db, 'users', user.uid);
      const roleRef = doc(db, `${userRole}s`, user.uid);
      
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };

      await setDoc(userRef, updateData, { merge: true });
      await setDoc(roleRef, updateData, { merge: true });

      return { success: true };
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    userRole,
    loading,
    error,
    registerUserRole,
    updateUserProfile,
    refetchRole: fetchUserRole
  };
}
