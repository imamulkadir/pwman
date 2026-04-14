Build a modern React password manager web app with a built-in notes feature, using Firebase only. Do not use Google Drive.

Stack:
- Next.js (App Router)
- React with JSX
- Tailwind CSS
- shadcn/ui
- Firebase Authentication
- Firestore
- Firebase Storage only if needed
- Web Crypto API
- Vercel
- Only free libraries/tools

Core requirements:
1. Users must sign in with Google.
2. After login, users must create or unlock a vault using a separate master passphrase.
3. All passwords and notes must be encrypted client-side before saving to Firebase.
4. The master passphrase must never leave the browser.
5. Firestore must never store plaintext passwords, plaintext notes, raw keys, or the master passphrase.
6. Decryption must happen only in the browser after the correct passphrase is provided.
7. The app must be secure, minimal, modern, responsive, and UX-focused.

Features:
- Google Sign-In
- First-time vault setup
- Unlock vault with passphrase
- Password manager:
  - add credential
  - edit credential
  - delete credential
  - reveal/hide password
  - copy username/password
  - search credentials
- Notes module similar to Google Keep:
  - create note
  - edit note
  - update note
  - delete note
- Dashboard with separate sections for Credentials and Notes
- Settings page
- Loading, empty, and error states

Security rules:
- Use Web Crypto API
- Use PBKDF2 + SHA-256 to derive a key from the master passphrase
- Use AES-GCM for encryption
- Use random salt
- Use random IV for every encryption operation
- Store only encrypted blobs and safe metadata in Firebase
- Never decrypt on the server
- Never store secrets in logs, localStorage, Firestore, or Vercel env vars

Firebase usage:
- Read Firebase credentials from a local file named db.txt
- Configure Firebase from db.txt
- Use Firebase Auth for Google login
- Use Firestore for encrypted vault storage and metadata

Recommended Firestore structure:
- users/{uid}
  - email
  - displayName
  - createdAt
  - updatedAt
  - encryptionVersion
- users/{uid}/vault/main
  - salt
  - credentialsCiphertext
  - credentialsIv
  - notesCiphertext
  - notesIv
  - updatedAt

Implementation approach:
- Keep credentials and notes as encrypted JSON blobs
- Decrypt them only after the vault is unlocked
- Re-encrypt and save after every create, edit, update, or delete action
- Keep unlocked data only in client memory during the active session

UI requirements:
- Minimal and modern
- Good typography
- Proper spacing and visual hierarchy
- Accessible colors and contrast
- Clean cards and modals
- Responsive layout for desktop and mobile
- Separate tabs or sections for Passwords and Notes

Project structure:
- app/
- components/
- lib/firebase/
- lib/crypto/
- lib/vault/
- hooks/
- store/
- styles/

Required files:
- vercel.json
- .env.example
- README.md

vercel.json:
{
  "framework": "nextjs",
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev"
}

Rules for coding:
- Use JSX only, not TypeScript
- Keep code modular and production-ready
- Use only free libraries
- Avoid unnecessary dependencies
- Do not add paid services or SDKs
- Do not use mock encryption or weak custom crypto

Deliverables:
1. Full project structure
2. Complete codebase
3. Firebase integration using db.txt
4. Auth flow
5. Client-side encryption/decryption
6. Password manager module
7. Notes module
8. Clean modern UI
9. Setup and deployment instructions
10. Brief security notes

Instruction for Claude:
Build this as a secure, production-style MVP with Firebase-only storage, client-side encryption, Google login, password manager features, and a Google Keep-style notes section with create, edit, update, and delete support. Read Firebase config from db.txt. Keep the implementation clean, minimal, scalable, and deployment-friendly for Vercel.