# pw-man

A zero-knowledge password manager built with Next.js. All encryption and decryption happens in your browser — the server never sees your plaintext data.

---

## How it works

1. Sign in with Google
2. Create a vault by setting a master passphrase
3. Your passphrase is run through **PBKDF2** (100,000 iterations, SHA-256) to derive an **AES-GCM 256-bit** key — entirely in the browser via the Web Crypto API
4. Credentials and notes are encrypted client-side before being stored in Firestore
5. The encryption key lives only in memory for the duration of your session and is never sent to any server

---

## Features

- Google Sign-In via Firebase Authentication
- Master passphrase vault with client-side key derivation (PBKDF2 + AES-GCM)
- Password management — add, edit, delete, search, copy username/password
- Site favicon auto-detection on credential cards
- Secure notes with color labels
- Full-text search across credentials and notes
- Toast notifications for all actions
- Installable PWA with service worker (production only)
- Dark UI

---

## Tech Stack

| Layer      | Technology                            |
| ---------- | ------------------------------------- |
| Framework  | Next.js 14 (App Router)               |
| UI         | React 18, Tailwind CSS, Lucide icons  |
| Auth       | Firebase Authentication (Google)      |
| Database   | Firestore (encrypted blobs only)      |
| State      | Zustand                               |
| Encryption | Web Crypto API — PBKDF2 + AES-GCM 256 |
| PWA        | next-pwa + Workbox service worker     |

---

## Project structure

```
app/
  page.jsx              # Sign-in page
  vault/page.jsx        # Main vault dashboard
  layout.jsx            # Root layout + PWA meta tags
components/
  Credential.jsx        # Credential card + add/edit dialog
  Note.jsx              # Note card + add/edit dialog
  VaultSetup.jsx        # Create vault / unlock vault screens
  Settings.jsx          # Settings dialog
  Layout.jsx            # Header, LoadingScreen, EmptyState, ErrorState
  ui/                   # Button, Card, Dialog, Input, Tabs, Toast, Label, PasswordInput
hooks/
  useVault.js           # useAuth, useVault, useAddCredential, useEditCredential, ...
lib/
  crypto/encryption.js  # PBKDF2 key derivation, AES-GCM encrypt/decrypt
  vault/vaultManager.js # initializeVault, unlockVault, saveCredentials, saveNotes
  firebase/
    config.js           # Firebase app init
    auth.js             # watchAuthState, signOut
    firestore.js        # getVaultData, saveVaultData, getUserDocument
store/
  vault.js              # Zustand stores — useAuthStore, useVaultStore
public/
  sw.js                 # Compiled Workbox service worker
  manifest.webmanifest  # PWA manifest
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a project
2. Enable **Google** sign-in under **Authentication → Sign-in method**
3. Create a **Firestore** database (start in production mode)
4. Add `localhost` to **Authentication → Settings → Authorized domains**

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Fill in the values from **Firebase → Project settings → Your apps → SDK setup and configuration**.

### 4. Set Firestore security rules

In the Firebase console under **Firestore → Rules**, apply these rules so each user can only access their own data:

```js
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
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> The PWA service worker is disabled in development mode. To test PWA install behavior, run a production build.

### 6. Production build

```bash
npm run build
npm start
```

Deployments to Vercel work out of the box — just add the environment variables in the Vercel project settings.

---

## Security notes

- The master passphrase is **never stored or transmitted** — it exists only in memory for key derivation
- Firestore stores only `{ salt, iv, ciphertext }` — nothing readable without the passphrase
- A wrong passphrase causes AES-GCM decryption to throw, so there is no silent data corruption
- The encryption key is held in Zustand store memory only for the active session and cleared on sign-out
- `.env.local` is git-ignored by default

---

## Author

Built by [Imamul Kadir](https://github.com/imamulkadir)
