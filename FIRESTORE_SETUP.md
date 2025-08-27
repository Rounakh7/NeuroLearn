# Firestore Setup Guide

## 🚨 Current Issue
The application is showing "Missing or insufficient permissions" errors because Firestore security rules are not configured properly. The therapy session functionality (Start Session/Book Session) will not work until this is fixed.

## ✅ Immediate Solution - Development Rules

**Follow these exact steps to fix the issue:**

### Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Sign in with your Google account
3. Select your project: `cognibridge-demo`

### Step 2: Navigate to Firestore Rules
1. In the left sidebar, click **"Firestore Database"**
2. Click on the **"Rules"** tab at the top
3. You should see the current rules editor

### Step 3: Replace the Rules
Replace ALL existing rules with these **DEVELOPMENT-ONLY** rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents for authenticated users (DEVELOPMENT ONLY)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 4: Publish the Rules
1. Click the **"Publish"** button
2. Confirm the changes when prompted
3. Wait for the rules to be deployed (usually takes a few seconds)

### Step 5: Test the Application
1. Go back to your application at `http://localhost:5176`
2. Try the "Start Session" or "Book Session" buttons
3. They should now work without permission errors!

## 🎯 What This Fixes
- ✅ "Start Session" button will work
- ✅ "Book Session" button will work  
- ✅ Session data will be saved to Firestore
- ✅ No more "Missing or insufficient permissions" errors

## 🔄 Current Fallback Behavior
Until you apply the Firestore rules, the app will:
- Save sessions locally in browser storage
- Show a message about configuring Firestore rules
- Still allow you to complete therapy sessions (data saved locally)

## Production Rules (Use Later)

For production, use more restrictive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Patients can read/write their own patient document
    match /patients/{patientId} {
      allow read, write: if request.auth != null && request.auth.uid == patientId;
    }
    
    // Parents can read/write their own parent document
    match /parents/{parentId} {
      allow read, write: if request.auth != null && request.auth.uid == parentId;
    }
    
    // Specialists can read/write their own specialist document
    match /specialists/{specialistId} {
      allow read, write: if request.auth != null && request.auth.uid == specialistId;
    }
    
    // Anyone can read therapies (public data)
    match /therapies/{therapyId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/specialists/$(request.auth.uid));
    }
    
    // Therapy sessions - patients and specialists can access
    match /therapy_sessions/{sessionId} {
      allow read, write: if request.auth != null && (
        resource.data.patientId == request.auth.uid ||
        resource.data.specialistId == request.auth.uid ||
        exists(/databases/$(database)/documents/parents/$(request.auth.uid))
      );
    }
  }
}
```

## Current App Status

The app will work with limited functionality even without Firestore access:
- ✅ Authentication works
- ✅ Role registration works (with fallback)
- ✅ Basic dashboards work
- ❌ Data persistence requires Firestore rules
- ❌ Therapy session booking requires Firestore rules

After setting up the rules, refresh the application to see full functionality.
