// ABA Trial Data Structure and Sample Trials

export const ABA_SKILL_CATEGORIES = {
  COMMUNICATION: 'communication',
  SOCIAL: 'social',
  ACADEMIC: 'academic',
  DAILY_LIVING: 'daily_living',
  MOTOR: 'motor'
};

export const TRIAL_TYPES = {
  DISCRETE_TRIAL: 'discrete_trial',
  TASK_ANALYSIS: 'task_analysis',
  NATURAL_ENVIRONMENT: 'natural_environment'
};

export const REINFORCEMENT_TYPES = {
  VERBAL: 'verbal',
  TANGIBLE: 'tangible',
  ACTIVITY: 'activity',
  SOCIAL: 'social'
};

// Sample ABA Trials for Discrete Trial Training
export const sampleABATrials = [
  // Communication Skills
  {
    id: 'comm_001',
    title: 'Requesting Items',
    category: ABA_SKILL_CATEGORIES.COMMUNICATION,
    type: TRIAL_TYPES.DISCRETE_TRIAL,
    difficulty: 'beginner',
    description: 'Learning to request preferred items using words or gestures',
    instruction: 'What do you say when you want something?',
    prompt: 'Show me how you ask for a cookie',
    options: [
      { id: 'a', text: 'Cookie please', correct: true },
      { id: 'b', text: 'Give me', correct: false },
      { id: 'c', text: 'I want', correct: false },
      { id: 'd', text: 'Can I have a cookie please?', correct: true }
    ],
    reinforcement: {
      type: REINFORCEMENT_TYPES.VERBAL,
      message: 'Excellent! You asked so nicely! 🍪',
      points: 10
    },
    targetBehavior: 'Appropriate requesting using polite language',
    masteryTarget: 8, // out of 10 trials
    prerequisites: []
  },
  {
    id: 'comm_002',
    title: 'Greeting Others',
    category: ABA_SKILL_CATEGORIES.COMMUNICATION,
    type: TRIAL_TYPES.DISCRETE_TRIAL,
    difficulty: 'beginner',
    description: 'Learning appropriate greetings for different times of day',
    instruction: 'How do you greet someone in the morning?',
    prompt: 'When you see your teacher in the morning, what do you say?',
    options: [
      { id: 'a', text: 'Good morning!', correct: true },
      { id: 'b', text: 'Hello', correct: true },
      { id: 'c', text: 'Goodbye', correct: false },
      { id: 'd', text: 'Good night', correct: false }
    ],
    reinforcement: {
      type: REINFORCEMENT_TYPES.SOCIAL,
      message: 'Great greeting! That makes people feel happy! 😊',
      points: 10
    },
    targetBehavior: 'Appropriate social greetings',
    masteryTarget: 9,
    prerequisites: []
  },

  // Social Skills
  {
    id: 'social_001',
    title: 'Taking Turns',
    category: ABA_SKILL_CATEGORIES.SOCIAL,
    type: TRIAL_TYPES.DISCRETE_TRIAL,
    difficulty: 'intermediate',
    description: 'Learning to wait and take turns during activities',
    instruction: 'Your friend is playing with a toy you want. What should you do?',
    prompt: 'Show me how you wait for your turn',
    options: [
      { id: 'a', text: 'Take the toy away', correct: false },
      { id: 'b', text: 'Wait patiently and ask for a turn', correct: true },
      { id: 'c', text: 'Cry until I get it', correct: false },
      { id: 'd', text: 'Ask nicely: "Can I have a turn please?"', correct: true }
    ],
    reinforcement: {
      type: REINFORCEMENT_TYPES.ACTIVITY,
      message: 'Perfect! Waiting for turns makes playing fun for everyone! 🎮',
      points: 15
    },
    targetBehavior: 'Appropriate turn-taking behavior',
    masteryTarget: 8,
    prerequisites: ['comm_001']
  },

  // Academic Skills
  {
    id: 'academic_001',
    title: 'Identifying Colors',
    category: ABA_SKILL_CATEGORIES.ACADEMIC,
    type: TRIAL_TYPES.DISCRETE_TRIAL,
    difficulty: 'beginner',
    description: 'Learning to identify and name basic colors',
    instruction: 'What color is this?',
    prompt: 'Look at this red apple. What color is it?',
    options: [
      { id: 'a', text: 'Red', correct: true },
      { id: 'b', text: 'Blue', correct: false },
      { id: 'c', text: 'Green', correct: false },
      { id: 'd', text: 'Yellow', correct: false }
    ],
    reinforcement: {
      type: REINFORCEMENT_TYPES.VERBAL,
      message: 'Yes! That\'s red! You\'re so smart! 🍎',
      points: 10
    },
    targetBehavior: 'Color identification and naming',
    masteryTarget: 9,
    prerequisites: []
  },

  // Daily Living Skills
  {
    id: 'daily_001',
    title: 'Hand Washing Steps',
    category: ABA_SKILL_CATEGORIES.DAILY_LIVING,
    type: TRIAL_TYPES.TASK_ANALYSIS,
    difficulty: 'intermediate',
    description: 'Learning the complete sequence for proper hand washing',
    instruction: 'Show me how to wash your hands properly',
    steps: [
      { id: 1, description: 'Turn on the water', completed: false },
      { id: 2, description: 'Wet your hands', completed: false },
      { id: 3, description: 'Apply soap', completed: false },
      { id: 4, description: 'Rub hands together for 20 seconds', completed: false },
      { id: 5, description: 'Rinse hands thoroughly', completed: false },
      { id: 6, description: 'Dry hands with clean towel', completed: false },
      { id: 7, description: 'Turn off the water', completed: false }
    ],
    reinforcement: {
      type: REINFORCEMENT_TYPES.TANGIBLE,
      message: 'Excellent! Your hands are clean and healthy! 🧼✨',
      points: 25
    },
    targetBehavior: 'Independent hand washing sequence',
    masteryTarget: 7, // all steps completed correctly
    prerequisites: []
  }
];

// Task Analysis Templates
export const taskAnalysisTemplates = [
  {
    id: 'brushing_teeth',
    title: 'Brushing Teeth',
    category: ABA_SKILL_CATEGORIES.DAILY_LIVING,
    steps: [
      'Get toothbrush and toothpaste',
      'Turn on water',
      'Wet toothbrush',
      'Apply small amount of toothpaste',
      'Brush front teeth in circular motions',
      'Brush back teeth in circular motions',
      'Brush tongue gently',
      'Spit out toothpaste',
      'Rinse mouth with water',
      'Rinse toothbrush',
      'Put toothbrush away'
    ]
  },
  {
    id: 'making_sandwich',
    title: 'Making a Sandwich',
    category: ABA_SKILL_CATEGORIES.DAILY_LIVING,
    steps: [
      'Gather ingredients (bread, filling, spreads)',
      'Wash hands',
      'Get plate and knife',
      'Place two slices of bread on plate',
      'Open containers/packages',
      'Spread condiments on bread',
      'Add main filling (meat, cheese, etc.)',
      'Add vegetables if desired',
      'Place second slice of bread on top',
      'Cut sandwich if needed',
      'Clean up workspace'
    ]
  }
];

// Reinforcement messages by category
export const reinforcementMessages = {
  [REINFORCEMENT_TYPES.VERBAL]: [
    'Excellent work!',
    'You did it perfectly!',
    'Amazing job!',
    'You\'re getting so good at this!',
    'Fantastic!',
    'Way to go!',
    'You should be proud!',
    'Outstanding!'
  ],
  [REINFORCEMENT_TYPES.SOCIAL]: [
    'Everyone is so proud of you!',
    'You make others happy when you do that!',
    'Your family will be excited to hear about this!',
    'You\'re being such a good friend!',
    'That was very thoughtful!',
    'You\'re showing great kindness!'
  ],
  [REINFORCEMENT_TYPES.ACTIVITY]: [
    'You earned extra playtime!',
    'You can choose the next activity!',
    'Time for a fun break!',
    'You\'ve earned a special activity!',
    'Pick your favorite game to play!'
  ],
  [REINFORCEMENT_TYPES.TANGIBLE]: [
    'You earned a sticker! ⭐',
    'You get a special badge! 🏆',
    'You earned bonus points! 💎',
    'You unlocked a new reward! 🎁',
    'You get a gold star! ⭐'
  ]
};

// Progress tracking utilities
export const calculateMastery = (correctTrials, totalTrials, masteryTarget) => {
  if (totalTrials === 0) return 0;
  return (correctTrials / totalTrials) * 100;
};

export const isSkillMastered = (correctTrials, totalTrials, masteryTarget) => {
  return correctTrials >= masteryTarget && totalTrials >= masteryTarget;
};

export const getNextTrial = (completedTrials, availableTrials) => {
  // Simple progression: return first unmastered trial
  return availableTrials.find(trial => 
    !isSkillMastered(
      completedTrials.filter(ct => ct.trialId === trial.id && ct.correct).length,
      completedTrials.filter(ct => ct.trialId === trial.id).length,
      trial.masteryTarget
    )
  );
};

export default {
  sampleABATrials,
  taskAnalysisTemplates,
  reinforcementMessages,
  ABA_SKILL_CATEGORIES,
  TRIAL_TYPES,
  REINFORCEMENT_TYPES,
  calculateMastery,
  isSkillMastered,
  getNextTrial
};
