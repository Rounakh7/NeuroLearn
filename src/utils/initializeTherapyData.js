import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Sample therapy data for autism treatment
const therapyData = [
  {
    id: 'behavioral-therapy-1',
    title: 'Applied Behavior Analysis (ABA)',
    description: 'Evidence-based therapy focusing on improving specific behaviors and skills through positive reinforcement.',
    category: 'behavioral_therapy',
    duration: 60, // minutes
    difficulty: 'beginner',
    objectives: [
      'Improve communication skills',
      'Reduce challenging behaviors',
      'Increase social interaction',
      'Develop daily living skills'
    ],
    activities: [
      'Discrete Trial Training',
      'Natural Environment Teaching',
      'Pivotal Response Training',
      'Social Skills Training'
    ],
    resources: [
      'Visual schedules',
      'Communication cards',
      'Reinforcement charts',
      'Activity worksheets'
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
    ],
    activities: [
      'Articulation exercises',
      'Language games',
      'Picture exchange systems',
      'Social communication practice'
    ],
    resources: [
      'Picture cards',
      'Communication devices',
      'Speech apps',
      'Language workbooks'
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
    ],
    activities: [
      'Sensory integration activities',
      'Fine motor skill exercises',
      'Daily living practice',
      'Adaptive equipment training'
    ],
    resources: [
      'Sensory tools',
      'Fine motor activities',
      'Adaptive equipment',
      'Self-care guides'
    ]
  },
  {
    id: 'social-skills-1',
    title: 'Social Skills Training',
    description: 'Group and individual sessions to improve social interaction and relationship building.',
    category: 'social_therapy',
    duration: 60,
    difficulty: 'intermediate',
    objectives: [
      'Improve peer interactions',
      'Develop friendship skills',
      'Enhance emotional regulation',
      'Practice social scenarios'
    ],
    activities: [
      'Role-playing exercises',
      'Group discussions',
      'Social stories',
      'Peer interaction games'
    ],
    resources: [
      'Social story books',
      'Emotion cards',
      'Scenario scripts',
      'Group activity guides'
    ]
  },
  {
    id: 'cognitive-therapy-1',
    title: 'Cognitive Behavioral Therapy',
    description: 'Therapy to help manage emotions, thoughts, and behaviors through structured interventions.',
    category: 'cognitive_therapy',
    duration: 45,
    difficulty: 'advanced',
    objectives: [
      'Improve emotional regulation',
      'Develop coping strategies',
      'Enhance problem-solving skills',
      'Reduce anxiety and stress'
    ],
    activities: [
      'Mindfulness exercises',
      'Cognitive restructuring',
      'Behavioral experiments',
      'Relaxation techniques'
    ],
    resources: [
      'Mindfulness apps',
      'Thought worksheets',
      'Coping strategy cards',
      'Relaxation guides'
    ]
  }
];

// Initialize therapy data in Firestore
export const initializeTherapyData = async (currentUser = null) => {
  // Only initialize if user is authenticated
  if (!currentUser) {
    console.log('⏳ Waiting for user authentication before initializing therapy data...');
    return false;
  }

  try {
    console.log('Initializing therapy data for authenticated user...');
    
    // Check if data already exists
    const therapyCollection = collection(db, 'therapyData');
    const existingData = await getDocs(therapyCollection);
    
    if (existingData.empty) {
      console.log('No existing therapy data found. Creating initial data...');
      
      // Add each therapy item to Firestore
      for (const therapy of therapyData) {
        const docRef = doc(db, 'therapyData', therapy.id);
        await setDoc(docRef, {
          ...therapy,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: currentUser.uid
        });
        console.log(`Added therapy: ${therapy.title}`);
      }
      
      console.log('✅ Therapy data initialized successfully!');
      return true;
    } else {
      console.log('✅ Therapy data already exists. Skipping initialization.');
      return true;
    }
  } catch (error) {
    console.error('Error initializing therapy data:', error);
    
    if (error.code === 'permission-denied') {
      console.log('🚨 Firestore permission denied. Please configure security rules:');
      console.log('1. Go to Firebase Console → Firestore Database → Rules');
      console.log('2. Update rules to allow authenticated users to read/write');
      console.log('3. See FIRESTORE_SETUP.md for detailed instructions');
    }
    
    console.log('App will continue with limited functionality until Firestore rules are configured.');
    return false;
  }
};

// Initialize sample ABA data
export const initializeSampleABAData = async (currentUser) => {
  if (!currentUser) return false;

  try {
    console.log('Initializing sample ABA data...');
    
    // Import sample data
    const { sampleDiscreteTrials, sampleTaskAnalysis } = await import('./sampleABAData');
    
    // Check if ABA trials exist
    const trialsCollection = collection(db, 'abaTrials');
    const existingTrials = await getDocs(trialsCollection);
    
    if (existingTrials.empty) {
      console.log('Adding sample discrete trials...');
      for (const trial of sampleDiscreteTrials) {
        const docRef = doc(db, 'abaTrials', trial.id);
        await setDoc(docRef, {
          ...trial,
          createdBy: currentUser.uid,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      console.log(`✅ Added ${sampleDiscreteTrials.length} discrete trials`);
    }
    
    // Check if task analysis exists
    const tasksCollection = collection(db, 'taskAnalysis');
    const existingTasks = await getDocs(tasksCollection);
    
    if (existingTasks.empty) {
      console.log('Adding sample task analysis...');
      for (const task of sampleTaskAnalysis) {
        const docRef = doc(db, 'taskAnalysis', task.id);
        await setDoc(docRef, {
          ...task,
          createdBy: currentUser.uid,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      console.log(`✅ Added ${sampleTaskAnalysis.length} task analysis modules`);
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing sample ABA data:', error);
    return false;
  }
};

// Initialize the app data when user is authenticated
export const initializeAppData = async (currentUser) => {
  if (!currentUser) {
    console.log('⏳ User not authenticated. Skipping data initialization.');
    return false;
  }

  console.log('🚀 Initializing app data for authenticated user...');
  
  const therapyDataSuccess = await initializeTherapyData(currentUser);
  const abaDataSuccess = await initializeSampleABAData(currentUser);
  
  if (therapyDataSuccess && abaDataSuccess) {
    console.log('✅ All app data initialized successfully!');
    return true;
  } else {
    console.log('⚠️ Some data initialization failed. Check Firestore permissions.');
    return false;
  }
};

// Don't auto-initialize on import - let components call this when user is authenticated
export default { initializeTherapyData, initializeSampleABAData, initializeAppData };
