// Sample ABA Therapy Data for Testing and Development

export const sampleDiscreteTrials = [
  // Communication Skills
  {
    id: 'comm_001',
    title: 'Identify Colors',
    instruction: 'What color is this?',
    category: 'communication',
    difficulty: 'beginner',
    estimatedTime: 2,
    options: [
      { id: 1, text: 'Red', image: '/images/red-circle.png', correct: true, feedback: 'Great! This is red!' },
      { id: 2, text: 'Blue', image: '/images/blue-circle.png', correct: false, feedback: 'Try again! Look at the color carefully.' },
      { id: 3, text: 'Green', image: '/images/green-circle.png', correct: false, feedback: 'Not quite. What color do you see?' }
    ],
    prompts: ['Look at the color', 'What do you see?'],
    reinforcement: {
      points: 5,
      correctMessage: 'Excellent! You identified the color correctly!',
      incorrectMessage: 'Good try! Let\'s practice more colors.',
      encouragementMessage: 'You\'re learning colors so well!'
    },
    tags: ['colors', 'visual', 'basic'],
    createdAt: new Date('2024-01-15'),
    isActive: true
  },
  {
    id: 'comm_002',
    title: 'Name Body Parts',
    instruction: 'Point to your nose',
    category: 'communication',
    difficulty: 'beginner',
    estimatedTime: 3,
    options: [
      { id: 1, text: 'Nose', correct: true, feedback: 'Perfect! You found your nose!' },
      { id: 2, text: 'Eye', correct: false, feedback: 'That\'s your eye. Can you find your nose?' },
      { id: 3, text: 'Mouth', correct: false, feedback: 'That\'s your mouth. Where is your nose?' }
    ],
    prompts: ['Touch your face', 'Where do you smell?'],
    reinforcement: {
      points: 5,
      correctMessage: 'Amazing! You know your body parts!',
      incorrectMessage: 'Keep trying! You\'re learning!',
      encouragementMessage: 'Body parts are important to know!'
    },
    tags: ['body_parts', 'self_awareness', 'basic'],
    createdAt: new Date('2024-01-16'),
    isActive: true
  },
  {
    id: 'comm_003',
    title: 'Express Needs - Water',
    instruction: 'How do you ask for water?',
    category: 'communication',
    difficulty: 'intermediate',
    estimatedTime: 4,
    options: [
      { id: 1, text: 'I want water please', correct: true, feedback: 'Excellent communication!' },
      { id: 2, text: 'Water', correct: false, feedback: 'Good start! Can you ask more politely?' },
      { id: 3, text: 'Give me', correct: false, feedback: 'Try using "please" and being more specific.' }
    ],
    prompts: ['Use "please"', 'Be polite when asking'],
    reinforcement: {
      points: 8,
      correctMessage: 'Wonderful! That\'s how we ask nicely!',
      incorrectMessage: 'Good effort! Practice makes perfect!',
      encouragementMessage: 'Polite communication is so important!'
    },
    tags: ['requests', 'politeness', 'needs'],
    createdAt: new Date('2024-01-17'),
    isActive: true
  },

  // Social Skills
  {
    id: 'social_001',
    title: 'Greeting Others',
    instruction: 'What do you say when you meet someone?',
    category: 'social',
    difficulty: 'beginner',
    estimatedTime: 3,
    options: [
      { id: 1, text: 'Hello!', correct: true, feedback: 'Perfect greeting!' },
      { id: 2, text: 'Bye!', correct: false, feedback: 'That\'s for leaving. What about when you arrive?' },
      { id: 3, text: 'Nothing', correct: false, feedback: 'It\'s nice to greet people when we see them!' }
    ],
    prompts: ['What do friendly people say?', 'How do you start a conversation?'],
    reinforcement: {
      points: 6,
      correctMessage: 'Great! You know how to be friendly!',
      incorrectMessage: 'Keep practicing greetings!',
      encouragementMessage: 'Friendly greetings make people happy!'
    },
    tags: ['greetings', 'social_interaction', 'basic'],
    createdAt: new Date('2024-01-18'),
    isActive: true
  },
  {
    id: 'social_002',
    title: 'Sharing Toys',
    instruction: 'Your friend wants to play with your toy. What do you do?',
    category: 'social',
    difficulty: 'intermediate',
    estimatedTime: 5,
    options: [
      { id: 1, text: 'Share and take turns', correct: true, feedback: 'Excellent! Sharing is caring!' },
      { id: 2, text: 'Hide the toy', correct: false, feedback: 'That might hurt your friend\'s feelings.' },
      { id: 3, text: 'Say no and walk away', correct: false, feedback: 'Try thinking about how your friend feels.' }
    ],
    prompts: ['How would you feel?', 'What makes a good friend?'],
    reinforcement: {
      points: 10,
      correctMessage: 'You\'re such a good friend!',
      incorrectMessage: 'Friendship takes practice!',
      encouragementMessage: 'Sharing makes friendships stronger!'
    },
    tags: ['sharing', 'empathy', 'friendship'],
    createdAt: new Date('2024-01-19'),
    isActive: true
  },

  // Academic Skills
  {
    id: 'academic_001',
    title: 'Count to 5',
    instruction: 'Count these apples',
    category: 'academic',
    difficulty: 'beginner',
    estimatedTime: 4,
    options: [
      { id: 1, text: '5', correct: true, feedback: 'Perfect counting!' },
      { id: 2, text: '4', correct: false, feedback: 'Close! Count again carefully.' },
      { id: 3, text: '6', correct: false, feedback: 'Count each apple once.' }
    ],
    prompts: ['Point to each apple as you count', 'Start with 1'],
    reinforcement: {
      points: 7,
      correctMessage: 'Amazing counting skills!',
      incorrectMessage: 'Keep practicing counting!',
      encouragementMessage: 'Math is fun when you practice!'
    },
    tags: ['counting', 'numbers', 'math'],
    createdAt: new Date('2024-01-20'),
    isActive: true
  },
  {
    id: 'academic_002',
    title: 'Letter Recognition - A',
    instruction: 'Which letter is this: A',
    category: 'academic',
    difficulty: 'beginner',
    estimatedTime: 3,
    options: [
      { id: 1, text: 'A', correct: true, feedback: 'Excellent! You know the letter A!' },
      { id: 2, text: 'B', correct: false, feedback: 'That\'s B. Look at the shape again.' },
      { id: 3, text: 'C', correct: false, feedback: 'That\'s C. What letter has two lines meeting at the top?' }
    ],
    prompts: ['Look at the shape', 'What sound does it make?'],
    reinforcement: {
      points: 6,
      correctMessage: 'You\'re great at recognizing letters!',
      incorrectMessage: 'Letters take practice to learn!',
      encouragementMessage: 'Reading starts with knowing letters!'
    },
    tags: ['letters', 'alphabet', 'reading'],
    createdAt: new Date('2024-01-21'),
    isActive: true
  },

  // Daily Living Skills
  {
    id: 'daily_001',
    title: 'Hand Washing Steps',
    instruction: 'What comes first when washing hands?',
    category: 'daily_living',
    difficulty: 'beginner',
    estimatedTime: 3,
    options: [
      { id: 1, text: 'Turn on water', correct: true, feedback: 'Right! Water first!' },
      { id: 2, text: 'Use soap', correct: false, feedback: 'Soap comes after water.' },
      { id: 3, text: 'Dry hands', correct: false, feedback: 'Drying is the last step.' }
    ],
    prompts: ['What do you need to wet your hands?', 'Think about the order'],
    reinforcement: {
      points: 5,
      correctMessage: 'Great! You know the hand washing steps!',
      incorrectMessage: 'Hand washing takes practice!',
      encouragementMessage: 'Clean hands keep us healthy!'
    },
    tags: ['hygiene', 'self_care', 'health'],
    createdAt: new Date('2024-01-22'),
    isActive: true
  },

  // Motor Skills
  {
    id: 'motor_001',
    title: 'Clapping Hands',
    instruction: 'Show me how to clap your hands',
    category: 'motor',
    difficulty: 'beginner',
    estimatedTime: 2,
    options: [
      { id: 1, text: 'Clap hands together', correct: true, feedback: 'Perfect! You can clap!' },
      { id: 2, text: 'Wave hands', correct: false, feedback: 'That\'s waving. Can you clap?' },
      { id: 3, text: 'Point fingers', correct: false, feedback: 'That\'s pointing. Try clapping!' }
    ],
    prompts: ['Put your hands together', 'Make a sound with your hands'],
    reinforcement: {
      points: 5,
      correctMessage: 'Excellent clapping!',
      incorrectMessage: 'Keep practicing clapping!',
      encouragementMessage: 'Clapping is fun and shows happiness!'
    },
    tags: ['coordination', 'movement', 'basic'],
    createdAt: new Date('2024-01-23'),
    isActive: true
  },

  // Cognitive Skills
  {
    id: 'cognitive_001',
    title: 'Problem Solving - Hungry',
    instruction: 'What do you do when you\'re hungry?',
    category: 'cognitive',
    difficulty: 'beginner',
    estimatedTime: 3,
    options: [
      { id: 1, text: 'Eat food', correct: true, feedback: 'Great problem solving!' },
      { id: 2, text: 'Go to sleep', correct: false, feedback: 'Sleep won\'t help hunger. What do you need?' },
      { id: 3, text: 'Play games', correct: false, feedback: 'Games are fun but won\'t fill your tummy.' }
    ],
    prompts: ['What does your body need?', 'Think about what helps hunger'],
    reinforcement: {
      points: 6,
      correctMessage: 'Perfect! You solved the problem!',
      incorrectMessage: 'Think about what your body needs!',
      encouragementMessage: 'Problem solving is an important skill!'
    },
    tags: ['problem_solving', 'self_care', 'basic'],
    createdAt: new Date('2024-01-24'),
    isActive: true
  },

  // Emotional Skills
  {
    id: 'emotional_001',
    title: 'Expressing Happiness',
    instruction: 'What do you do when you feel happy?',
    category: 'emotional',
    difficulty: 'beginner',
    estimatedTime: 3,
    options: [
      { id: 1, text: 'Smile and share the feeling', correct: true, feedback: 'Wonderful! Happiness is meant to be shared!' },
      { id: 2, text: 'Hide it', correct: false, feedback: 'Happiness is good! Why hide it?' },
      { id: 3, text: 'Act sad', correct: false, feedback: 'That\'s confusing. Show how you really feel!' }
    ],
    prompts: ['How do you show happiness?', 'What do happy people do?'],
    reinforcement: {
      points: 6,
      correctMessage: 'Perfect! You know how to express happiness!',
      incorrectMessage: 'Happiness is a good emotion to show!',
      encouragementMessage: 'Sharing happiness makes others happy too!'
    },
    tags: ['emotions', 'expression', 'positive'],
    createdAt: new Date('2024-01-25'),
    isActive: true
  }
];

export const sampleTaskAnalysis = [
  // Daily Living - Brushing Teeth
  {
    id: 'task_001',
    title: 'Brushing Teeth',
    description: 'Learn the complete process of brushing teeth for good oral hygiene',
    category: 'daily_living',
    difficulty: 'beginner',
    estimatedTime: 8,
    steps: [
      {
        id: 1,
        instruction: 'Get your toothbrush and toothpaste',
        prompt: 'Find your toothbrush in the bathroom',
        visualAid: 'Picture of toothbrush and toothpaste',
        completed: false
      },
      {
        id: 2,
        instruction: 'Put a small amount of toothpaste on the brush',
        prompt: 'Just a pea-sized amount is enough',
        visualAid: 'Picture showing correct amount of toothpaste',
        completed: false
      },
      {
        id: 3,
        instruction: 'Turn on the water',
        prompt: 'Use the faucet handle to start the water',
        visualAid: 'Picture of turning on faucet',
        completed: false
      },
      {
        id: 4,
        instruction: 'Wet the toothbrush',
        prompt: 'Hold the brush under the water briefly',
        visualAid: 'Picture of wetting toothbrush',
        completed: false
      },
      {
        id: 5,
        instruction: 'Brush your teeth in circles',
        prompt: 'Gentle circular motions on all teeth',
        visualAid: 'Picture showing circular brushing motion',
        completed: false
      },
      {
        id: 6,
        instruction: 'Spit out the toothpaste',
        prompt: 'Don\'t swallow the toothpaste',
        visualAid: 'Picture of spitting into sink',
        completed: false
      },
      {
        id: 7,
        instruction: 'Rinse your mouth with water',
        prompt: 'Swish water around and spit it out',
        visualAid: 'Picture of rinsing mouth',
        completed: false
      },
      {
        id: 8,
        instruction: 'Clean and put away your toothbrush',
        prompt: 'Rinse the brush and put it in its place',
        visualAid: 'Picture of clean toothbrush in holder',
        completed: false
      }
    ],
    reinforcement: {
      points: 15,
      message: 'Fantastic! You completed the whole tooth brushing routine!',
      celebration: 'confetti'
    },
    prerequisites: [],
    tags: ['hygiene', 'self_care', 'routine', 'oral_health'],
    createdAt: new Date('2024-01-15'),
    isActive: true
  },

  // Daily Living - Making a Sandwich
  {
    id: 'task_002',
    title: 'Making a Peanut Butter Sandwich',
    description: 'Learn to make a simple peanut butter sandwich independently',
    category: 'daily_living',
    difficulty: 'intermediate',
    estimatedTime: 12,
    steps: [
      {
        id: 1,
        instruction: 'Gather all ingredients: bread, peanut butter, jelly',
        prompt: 'Get everything you need first',
        visualAid: 'Picture of ingredients laid out',
        completed: false
      },
      {
        id: 2,
        instruction: 'Get a knife and a plate',
        prompt: 'You\'ll need these tools to make the sandwich',
        visualAid: 'Picture of knife and plate',
        completed: false
      },
      {
        id: 3,
        instruction: 'Take out two slices of bread',
        prompt: 'Place them side by side on the plate',
        visualAid: 'Picture of two bread slices on plate',
        completed: false
      },
      {
        id: 4,
        instruction: 'Open the peanut butter jar',
        prompt: 'Twist the lid counter-clockwise',
        visualAid: 'Picture of opening jar',
        completed: false
      },
      {
        id: 5,
        instruction: 'Spread peanut butter on one slice',
        prompt: 'Use the knife to spread it evenly',
        visualAid: 'Picture of spreading peanut butter',
        completed: false
      },
      {
        id: 6,
        instruction: 'Clean the knife',
        prompt: 'Wipe it clean before using for jelly',
        visualAid: 'Picture of cleaning knife',
        completed: false
      },
      {
        id: 7,
        instruction: 'Open the jelly jar and spread on other slice',
        prompt: 'Spread jelly evenly on the second slice',
        visualAid: 'Picture of spreading jelly',
        completed: false
      },
      {
        id: 8,
        instruction: 'Put the slices together',
        prompt: 'Peanut butter and jelly sides should touch',
        visualAid: 'Picture of completed sandwich',
        completed: false
      },
      {
        id: 9,
        instruction: 'Clean up your workspace',
        prompt: 'Put ingredients away and clean the knife',
        visualAid: 'Picture of clean workspace',
        completed: false
      }
    ],
    reinforcement: {
      points: 20,
      message: 'Excellent! You made a delicious sandwich all by yourself!',
      celebration: 'stars'
    },
    prerequisites: ['task_001'],
    tags: ['cooking', 'independence', 'food_prep', 'life_skills'],
    createdAt: new Date('2024-01-16'),
    isActive: true
  },

  // Social Skills - Greeting a Friend
  {
    id: 'task_003',
    title: 'Greeting a Friend Properly',
    description: 'Learn the social steps for greeting a friend appropriately',
    category: 'social',
    difficulty: 'beginner',
    estimatedTime: 5,
    steps: [
      {
        id: 1,
        instruction: 'Make eye contact with your friend',
        prompt: 'Look at their face when you see them',
        visualAid: 'Picture showing eye contact',
        completed: false
      },
      {
        id: 2,
        instruction: 'Smile',
        prompt: 'A friendly smile shows you\'re happy to see them',
        visualAid: 'Picture of a friendly smile',
        completed: false
      },
      {
        id: 3,
        instruction: 'Say hello or hi',
        prompt: 'Use a friendly voice to greet them',
        visualAid: 'Picture of children saying hello',
        completed: false
      },
      {
        id: 4,
        instruction: 'Ask how they are doing',
        prompt: 'Say "How are you?" or "How\'s your day?"',
        visualAid: 'Picture of children talking',
        completed: false
      },
      {
        id: 5,
        instruction: 'Listen to their response',
        prompt: 'Pay attention to what they say',
        visualAid: 'Picture of active listening',
        completed: false
      },
      {
        id: 6,
        instruction: 'Respond appropriately',
        prompt: 'Say something nice or ask a follow-up question',
        visualAid: 'Picture of friendly conversation',
        completed: false
      }
    ],
    reinforcement: {
      points: 12,
      message: 'Wonderful! You know how to be a great friend!',
      celebration: 'balloons'
    },
    prerequisites: [],
    tags: ['social_interaction', 'friendship', 'communication', 'manners'],
    createdAt: new Date('2024-01-17'),
    isActive: true
  },

  // Academic - Writing Your Name
  {
    id: 'task_004',
    title: 'Writing Your Name',
    description: 'Learn to write your first name step by step',
    category: 'academic',
    difficulty: 'intermediate',
    estimatedTime: 10,
    steps: [
      {
        id: 1,
        instruction: 'Get paper and a pencil',
        prompt: 'Make sure you have a good writing surface',
        visualAid: 'Picture of paper and pencil',
        completed: false
      },
      {
        id: 2,
        instruction: 'Hold the pencil correctly',
        prompt: 'Use your thumb and finger to grip, rest on middle finger',
        visualAid: 'Picture of correct pencil grip',
        completed: false
      },
      {
        id: 3,
        instruction: 'Start with the first letter of your name',
        prompt: 'Think about the shape of the first letter',
        visualAid: 'Picture showing letter formation',
        completed: false
      },
      {
        id: 4,
        instruction: 'Write each letter slowly and carefully',
        prompt: 'Take your time to make neat letters',
        visualAid: 'Picture of careful letter writing',
        completed: false
      },
      {
        id: 5,
        instruction: 'Leave small spaces between letters',
        prompt: 'Don\'t squish the letters together',
        visualAid: 'Picture showing proper letter spacing',
        completed: false
      },
      {
        id: 6,
        instruction: 'Check your work',
        prompt: 'Look at each letter to make sure it\'s correct',
        visualAid: 'Picture of checking written work',
        completed: false
      }
    ],
    reinforcement: {
      points: 18,
      message: 'Amazing! You can write your name beautifully!',
      celebration: 'fireworks'
    },
    prerequisites: [],
    tags: ['writing', 'letters', 'fine_motor', 'literacy'],
    createdAt: new Date('2024-01-18'),
    isActive: true
  },

  // Motor Skills - Tying Shoes
  {
    id: 'task_005',
    title: 'Tying Your Shoes',
    description: 'Master the complex skill of tying shoelaces',
    category: 'motor',
    difficulty: 'advanced',
    estimatedTime: 15,
    steps: [
      {
        id: 1,
        instruction: 'Sit down and place foot on your knee',
        prompt: 'Get in a comfortable position to reach your shoe',
        visualAid: 'Picture of proper sitting position',
        completed: false
      },
      {
        id: 2,
        instruction: 'Cross the laces to make an X',
        prompt: 'Right lace over left lace',
        visualAid: 'Picture showing crossed laces',
        completed: false
      },
      {
        id: 3,
        instruction: 'Pull the top lace under and through',
        prompt: 'Make the first part of the knot',
        visualAid: 'Picture of first knot step',
        completed: false
      },
      {
        id: 4,
        instruction: 'Pull both laces tight',
        prompt: 'Make sure the first knot is secure',
        visualAid: 'Picture of tightening knot',
        completed: false
      },
      {
        id: 5,
        instruction: 'Make a loop with one lace (bunny ear)',
        prompt: 'Hold the loop with your fingers',
        visualAid: 'Picture of making first loop',
        completed: false
      },
      {
        id: 6,
        instruction: 'Wrap the other lace around the loop',
        prompt: 'Go around the bunny ear',
        visualAid: 'Picture of wrapping around loop',
        completed: false
      },
      {
        id: 7,
        instruction: 'Push the lace through the hole to make second loop',
        prompt: 'Make the second bunny ear',
        visualAid: 'Picture of making second loop',
        completed: false
      },
      {
        id: 8,
        instruction: 'Pull both loops tight',
        prompt: 'Make sure your bow is secure',
        visualAid: 'Picture of finished tied shoe',
        completed: false
      }
    ],
    reinforcement: {
      points: 25,
      message: 'Incredible! You mastered shoe tying - that\'s a big accomplishment!',
      celebration: 'confetti'
    },
    prerequisites: [],
    tags: ['fine_motor', 'independence', 'self_care', 'coordination'],
    createdAt: new Date('2024-01-19'),
    isActive: true
  }
];

export const therapies = [
  {
    id: 'aba-1',
    title: 'Communication Skills',
    description: 'Improve verbal and non-verbal communication through structured activities and play-based learning.',
    category: 'communication',
    duration: 45,
    difficulty: 'beginner',
    questions: [
      "What sound does a dog make?",
      "Point to the picture of a cat",
      "What do you say when you want a cookie?",
      "Show me 'happy'",
      "What is your name?"
    ]
  },
  {
    id: 'aba-2',
    title: 'Social Interaction',
    description: 'Develop social skills including turn-taking, sharing, and understanding social cues.',
    category: 'social',
    duration: 60,
    difficulty: 'intermediate',
    questions: [
      "How do you ask to join a game?",
      "What should you do if someone is crying?",
      "How do you introduce yourself?",
      "What is a good way to make friends?",
      "How do you share toys?"
    ]
  },
  {
    id: 'aba-3',
    title: 'Behavior Management',
    description: 'Learn strategies to manage challenging behaviors and develop self-regulation skills.',
    category: 'emotional',
    duration: 30,
    difficulty: 'intermediate',
    questions: [
      "What can you do when you feel angry?",
      "Take 3 deep breaths",
      "Count to 10",
      "What is a calm-down strategy?",
      "Show me how you ask for a break"
    ]
  },
  {
    id: 'aba-4',
    title: 'Academic Foundations',
    description: 'Build essential academic skills including counting, letter recognition, and basic problem-solving.',
    category: 'academic',
    duration: 40,
    difficulty: 'beginner',
    questions: [
      "Count these apples: 🍎🍎🍎",
      "Which letter is this: A",
      "What color is the sky?",
      "Which shape has 3 sides?",
      "What comes after 5?"
    ]
  },
  {
    id: 'aba-5',
    title: 'Daily Living Skills',
    description: 'Master essential life skills for independence and self-care.',
    category: 'daily_living',
    duration: 50,
    difficulty: 'beginner',
    questions: [
      "What comes first when washing hands?",
      "What do you do before eating?",
      "What do you do after using the bathroom?",
      "What do you do when you wake up?",
      "What do you do before going to bed?"
    ]
  },
  {
    id: 'aba-6',
    title: 'Motor Development',
    description: 'Enhance gross and fine motor skills through fun physical activities.',
    category: 'motor',
    duration: 35,
    difficulty: 'beginner',
    questions: [
      "Show me how to clap your hands",
      "How do you jump?",
      "Show me how to point",
      "How do you balance on one foot?",
      "Show me how to throw a ball"
    ]
  }
];

// Sample user profiles for testing
export const sampleUserProfiles = [
  {
    uid: 'patient_001',
    email: 'patient1@example.com',
    displayName: 'Alex Johnson',
    role: 'patient',
    patientInfo: {
      dateOfBirth: new Date('2015-03-15'),
      diagnosis: ['Autism Spectrum Disorder'],
      skillLevel: 'beginner',
      preferences: {
        favoriteCategories: ['communication', 'social'],
        reinforcementPreferences: ['visual', 'auditory'],
        sessionDuration: 15,
        difficultyPreference: 'adaptive'
      },
      goals: [
        'Improve communication skills',
        'Develop social interaction abilities',
        'Master daily living tasks'
      ],
      parentIds: ['parent_001'],
      specialistIds: ['specialist_001']
    },
    progressStats: {
      totalSessions: 25,
      totalTrials: 150,
      correctTrials: 120,
      totalPoints: 650,
      currentStreak: 5,
      longestStreak: 8,
      badges: [
        {
          type: 'first_trial',
          title: 'First Steps',
          earnedAt: new Date('2024-01-15')
        },
        {
          type: 'streak_warrior',
          title: 'Streak Warrior',
          earnedAt: new Date('2024-01-20')
        }
      ],
      skillProgress: {
        communication: { totalTrials: 60, correctTrials: 50, accuracyRate: 83 },
        social: { totalTrials: 40, correctTrials: 32, accuracyRate: 80 },
        daily_living: { totalTrials: 30, correctTrials: 25, accuracyRate: 83 },
        academic: { totalTrials: 20, correctTrials: 13, accuracyRate: 65 }
      }
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25')
  }
];

// Sample session results for testing
export const sampleSessionResults = [
  {
    id: 'session_001',
    userId: 'patient_001',
    sessionType: 'discrete_trial',
    moduleId: 'comm_001',
    moduleTitle: 'Identify Colors',
    startTime: new Date('2024-01-25T10:00:00'),
    endTime: new Date('2024-01-25T10:15:00'),
    duration: 900000, // 15 minutes in milliseconds
    results: [
      {
        trialId: 'comm_001',
        trialType: 'discrete_trial',
        category: 'communication',
        difficulty: 'beginner',
        selectedOptionId: 1,
        correct: true,
        responseTime: 3000,
        promptUsed: false,
        skipped: false,
        timestamp: new Date('2024-01-25T10:05:00')
      }
    ],
    statistics: {
      totalTrials: 1,
      correctTrials: 1,
      accuracyRate: 100,
      averageResponseTime: 3000,
      promptsUsed: 0,
      skippedTrials: 0
    },
    pointsEarned: 5,
    streakBonus: 2,
    newBadges: [],
    completedAt: new Date('2024-01-25T10:15:00')
  }
];

export default {
  sampleDiscreteTrials,
  sampleTaskAnalysis,
  therapies,
  sampleUserProfiles,
  sampleSessionResults
};
