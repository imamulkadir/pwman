# pw-man

A secure password manager web app with client-side encryption, notes support, and installable PWA behavior.

## Overview

- **Google authentication** via Firebase
- **Master passphrase vault** for client-side encryption
- **Encrypted credentials** with add/edit/delete/copy/search
- **Notes module** with color-coded notes
- **Responsive UI** built with Next.js and Tailwind CSS
- **PWA installable** with offline-ready service worker in production
- **Zero-knowledge design**: only encrypted blobs are stored in Firestore

## Features

- Google Sign-In authentication
- Master passphrase vault creation and unlock
- Client-side AES-GCM encryption
- Password management with secure copy and visibility toggle
- Notes support with title, content, and color
- Search credentials and notes
- Responsive layout for mobile/tablet/desktop
- PWA support with manifest and service worker

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- Firebase Authentication
- Firestore
- Zustand for state management
- Web Crypto API for encryption
- next-pwa for Progressive Web App support

## Setup

### 1. Install dependencies

`ash
npm install
`

### 2. Configure Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Google** Sign-In under Authentication > Sign-in method
3. Create a Firestore database
4. Add localhost to Firebase Authentication **Authorized domains**
5. Create a local .env.local file with your Firebase config:

`nv
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
`

> Sensitive values in .env.local are ignored by Git.

### 3. Firestore security rules

Use the following rules in Firestore to restrict access to each user's own data:

`js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /vault/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
`

### 4. Run locally

`ash
npm run dev
`

Open http://localhost:3000 and sign in with Google.

> 
ext-pwa is disabled in development by default. PWA install behavior is available in production mode.

### 5. Production build

`ash
npm run build
npm start
`

## Deployment to Vercel

1. Push this repo to GitHub
2. Create a new project on Vercel
3. Connect the GitHub repository
4. Set the same Firebase environment variables in Vercel
5. Deploy

Vercel will automatically build the app using the included package.json and 
ext.config.js.

## PWA Notes

- public/manifest.webmanifest is included
- public/icons/ contains install icons
- 
ext-pwa is configured in 
ext.config.js
- Service worker is enabled in production builds only

## Security

- Master passphrase is never stored on the server
- Encryption happens entirely in the browser
- Firestore stores only encrypted vault data
- .env.local and db.txt are ignored by Git

## Repository Hygiene

The following files are excluded from version control:

- .env.local
- .env
- db.txt
- 
ode_modules/
- .next/

## GitHub Push

This repo is ready to be pushed to GitHub and connected to Vercel for deployment.

## License

MIT
