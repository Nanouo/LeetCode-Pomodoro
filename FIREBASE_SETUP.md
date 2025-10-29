# Firebase Setup Guide

## Prerequisites
- Google account
- Firebase CLI (optional, but recommended)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `leetcode-pomodoro` (or your preferred name)
4. Disable Google Analytics (not needed for MVP)
5. Click "Create project"

## Step 2: Add Web App to Firebase Project

1. In Firebase Console, click the **Web icon** (</>) to add a web app
2. Register app with nickname: `LeetCode Pomodoro Web`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase configuration object

## Step 3: Update Firebase Configuration

Replace the placeholder values in `src/utils/firebase.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 4: Enable Firestore Database

1. In Firebase Console, go to **Build** > **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to your users)
5. Click "Enable"

### Firestore Security Rules (Test Mode)

For development, use these rules (they allow read/write for everyone):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Warning:** These rules are insecure. Before deploying to production, update to:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /problems/{problemId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Step 5: Enable Firebase Storage

1. In Firebase Console, go to **Build** > **Storage**
2. Click "Get started"
3. Choose **Start in test mode**
4. Click "Next" and "Done"

### Storage Security Rules (Test Mode)

For development:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Warning:** Update before production to restrict access to authenticated users.

## Step 6: Enable Anonymous Authentication

1. In Firebase Console, go to **Build** > **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Enable **Anonymous** authentication
5. Click "Save"

## Step 7: Test Your Setup

Run your app and check the browser console:

```bash
npm run dev
```

You should see no Firebase errors. If you see authentication warnings, make sure anonymous auth is enabled.

## Optional: Install Firebase CLI

For advanced features like deploying to Firebase Hosting:

```bash
npm install -g firebase-tools
firebase login
firebase init
```

## Environment Variables (Optional)

For production, you may want to use environment variables:

Create `.env.local`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Then update `src/utils/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```

## Troubleshooting

### "Firebase App not initialized"
- Make sure you've replaced the placeholder values in `firebase.ts`

### "Permission denied" errors
- Check that Firestore and Storage security rules are in test mode
- Make sure anonymous authentication is enabled

### "Quota exceeded"
- Firebase free tier limits:
  - Firestore: 50K reads/day, 20K writes/day
  - Storage: 5GB storage, 1GB/day downloads
  - Should be plenty for MVP!

## Next Steps

Once Firebase is configured:
1. Test creating a problem in Firestore
2. Test uploading a video to Storage
3. Implement the timer and notes components
4. Start building the UI!

---

**Need help?** Check the [Firebase Documentation](https://firebase.google.com/docs) or Firebase Console for guides.
