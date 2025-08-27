import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

// Fallback therapy data when Firestore is not accessible or permission denied
const getFallbackTherapies = () => [
  {
    id: 'behavioral-therapy-1',
    title: 'Applied Behavior Analysis (ABA)',
    description: 'Evidence-based therapy focusing on improving specific behaviors and skills through positive reinforcement.',
    category: 'behavioral_therapy',
    duration: 60,
    difficulty: 'beginner',
    objectives: [
      'Improve communication skills',
      'Reduce challenging behaviors',
      'Increase social interaction',
      'Develop daily living skills'
    ]
  },
  {
    id: 'speech-therapy-1',
    title: 'Speech and Language Therapy',
    description: 'Focused intervention to improve communication, language comprehension, and speech clarity.',
    category: 'speech_therapy',
    duration: 45,
    difficulty: 'beginner',
    objectives: [
      'Improve verbal communication',
      'Enhance language comprehension',
      'Develop non-verbal communication',
      'Increase vocabulary'
    ]
  },
  {
    id: 'occupational-therapy-1',
    title: 'Occupational Therapy',
    description: 'Therapy to develop fine motor skills, sensory processing, and daily living activities.',
    category: 'occupational_therapy',
    duration: 50,
    difficulty: 'intermediate',
    objectives: [
      'Improve fine motor skills',
      'Enhance sensory processing',
      'Develop self-care skills',
      'Increase independence'
    ]
  }
];

export function useTherapySessions(user, userRole) {
  const [sessions, setSessions] = useState([]);
  const [therapies, setTherapies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !userRole) {
      setSessions([]);
      setTherapies([]);
      setLoading(false);
      return;
    }

    fetchTherapies();
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userRole]);

  const fetchTherapies = async () => {
    try {
      const therapiesSnapshot = await getDocs(collection(db, 'therapies'));
      const therapiesData = therapiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTherapies(therapiesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching therapies:', err);
      setError(err.message);

      if (err.message.includes('Missing or insufficient permissions')) {
        console.log('Using fallback therapy data due to Firestore permissions.');
        setTherapies(getFallbackTherapies());
      }
    }
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      let sessionsQuery;

      switch (userRole) {
        case 'patient':
          sessionsQuery = query(
            collection(db, 'therapy_sessions'),
            where('patientId', '==', user.uid)
          );
          break;
        case 'specialist':
          sessionsQuery = query(
            collection(db, 'therapy_sessions'),
            where('specialistId', '==', user.uid)
          );
          break;
        case 'parent':
          // Parents can view sessions of their linked patients
          const parentDoc = await getDoc(doc(db, 'parents', user.uid));
          if (parentDoc.exists() && parentDoc.data().linkedPatients?.length > 0) {
            const patientIds = parentDoc.data().linkedPatients;
            
            // Firestore limits 'in' queries to max 10 elements, handle accordingly
            const chunkSize = 10;
            let sessionsData = [];

            for (let i = 0; i < patientIds.length; i += chunkSize) {
              const chunk = patientIds.slice(i, i + chunkSize);
              const chunkQuery = query(
                collection(db, 'therapy_sessions'),
                where('patientId', 'in', chunk)
              );
              const chunkSnapshot = await getDocs(chunkQuery);
              sessionsData = sessionsData.concat(chunkSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
            // Sort by createdAt in JavaScript to avoid index requirement
            sessionsData.sort((a, b) => {
              const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
              const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
              return dateB - dateA; // desc order
            });
            setSessions(sessionsData);
            setLoading(false);
            return;
          } else {
            setSessions([]);
            setLoading(false);
            return;
          }
        default:
          setSessions([]);
          setLoading(false);
          return;
      }

      const sessionsSnapshot = await getDocs(sessionsQuery);
      const sessionsData = sessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by createdAt in JavaScript to avoid index requirement
      sessionsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
        return dateB - dateA; // desc order
      });
      
      setSessions(sessionsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError(err.message);
      
      // Fallback: Load local sessions if Firestore fails
      try {
        const localSessions = JSON.parse(localStorage.getItem('localTherapySessions') || '[]');
        const userLocalSessions = localSessions.filter(session => 
          session.patientId === currentUser?.uid
        );
        setSessions(userLocalSessions);
        console.log('Loaded local fallback sessions:', userLocalSessions.length);
      } catch (localErr) {
        console.error('Error loading local sessions:', localErr);
        setSessions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const createTherapySession = async (sessionData) => {
    try {
      const newSession = {
        ...sessionData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: sessionData.status || 'scheduled'
      };

      const docRef = await addDoc(collection(db, 'therapy_sessions'), newSession);
      
      // Refresh sessions
      await fetchSessions();

      setError(null);
      return { success: true, sessionId: docRef.id };
    } catch (err) {
      console.error('Error creating therapy session:', err);
      setError(err.message);

      // Fallback: Store session locally for now if Firestore fails
      if (err.message.includes('Missing or insufficient permissions')) {
        console.log('Firestore permissions error - using local fallback');
        
        // Create a local session object
        const localSession = {
          ...newSession,
          id: `local_${Date.now()}`,
          isLocal: true
        };

        // Store in localStorage as fallback
        const existingSessions = JSON.parse(localStorage.getItem('localTherapySessions') || '[]');
        existingSessions.push(localSession);
        localStorage.setItem('localTherapySessions', JSON.stringify(existingSessions));

        // Update local sessions state
        setSessions(prev => [...prev, localSession]);

        // Show success message instead of error
        return { 
          success: true, 
          sessionId: localSession.id,
          isLocal: true,
          message: 'Session saved locally. Configure Firestore rules for cloud storage.'
        };
      }

      return { success: false, error: err.message };
    }
  };

  const updateTherapySession = async (sessionId, updates) => {
    try {
      const sessionRef = doc(db, 'therapy_sessions', sessionId);
      await updateDoc(sessionRef, {
        ...updates,
        updatedAt: new Date()
      });

      // Refresh sessions
      await fetchSessions();

      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error updating therapy session:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const deleteTherapySession = async (sessionId) => {
    try {
      await deleteDoc(doc(db, 'therapy_sessions', sessionId));
      
      // Refresh sessions
      await fetchSessions();

      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error deleting therapy session:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const getPatientProgress = async (patientId) => {
    try {
      const sessionsQuery = query(
        collection(db, 'therapy_sessions'),
        where('patientId', '==', patientId),
        where('status', '==', 'completed'),
        orderBy('createdAt', 'asc')
      );
      
      const snapshot = await getDocs(sessionsQuery);
      const completedSessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return completedSessions;
    } catch (err) {
      console.error('Error fetching patient progress:', err);
      return [];
    }
  };

  const linkPatientToParent = async (patientEmail) => {
    try {
      // Find patient by email
      const patientsQuery = query(
        collection(db, 'patients'),
        where('email', '==', patientEmail)
      );
      const patientsSnapshot = await getDocs(patientsQuery);
      
      if (patientsSnapshot.empty) {
        return { success: false, error: 'Patient not found with this email' };
      }

      const patientDoc = patientsSnapshot.docs[0];
      const patientId = patientDoc.id;

      // Update parent document to include linked patient
      const parentRef = doc(db, 'parents', user.uid);
      const parentDoc = await getDoc(parentRef);
      
      let linkedPatients = [];
      if (parentDoc.exists() && parentDoc.data().linkedPatients) {
        linkedPatients = parentDoc.data().linkedPatients;
      }

      if (!linkedPatients.includes(patientId)) {
        linkedPatients.push(patientId);
        await updateDoc(parentRef, { linkedPatients });
      }

      // Refresh sessions to include new patient's sessions
      await fetchSessions();

      setError(null);
      return { success: true, patientId };
    } catch (err) {
      console.error('Error linking patient to parent:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    sessions,
    therapies,
    loading,
    error,
    createTherapySession,
    updateTherapySession,
    deleteTherapySession,
    getPatientProgress,
    linkPatientToParent,
    refreshSessions: fetchSessions,
    refreshTherapies: fetchTherapies
  };
}
