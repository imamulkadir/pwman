# Security & Privacy

This document details the security measures and privacy practices of the Password Manager application.

## End-to-End Encryption

All sensitive data is encrypted on your device before it ever leaves your browser. This means:

- Your passwords are encrypted
- Your notes are encrypted
- The encryption happens in your browser using the Web Crypto API
- The encrypted data is sent to Firebase servers
- Only your device can decrypt the data using your master passphrase

## Encryption Algorithms

### Key Derivation

- **Algorithm**: PBKDF2 with SHA-256
- **Iterations**: 100,000
- **Salt**: Random 16-byte salt generated for each vault
- **Output**: 256-bit encryption key

### Data Encryption

- **Algorithm**: AES-GCM (Advanced Encryption Standard - Galois/Counter Mode)
- **Key Size**: 256-bit
- **IV (Initialization Vector)**: Random 12-byte IV for each encryption operation
- **Authentication**: GCM provides authenticated encryption (AEAD)

## What's Encrypted

✅ Encrypted in the vault:

- All passwords
- All notes content
- Combined as single encrypted JSON blob

⚠️ Encrypted by Firebase:

- Network traffic (HTTPS)
- Data at rest (Firebase's own encryption)

## What's NOT Encrypted

These are stored in plaintext on Firebase (metadata only):

- Your email address
- Your display name
- Credential labels (e.g., "Gmail")
- Credential URLs (e.g., "gmail.com")
- Note titles
- Note colors
- Creation/update timestamps

**Rationale**: Allowing you to search and organize credentials without needing to decrypt everything.

## Master Passphrase

Your master passphrase is:

- ✅ Never sent to our servers
- ✅ Never stored anywhere
- ✅ Only used locally to derive your encryption key
- ✅ Required every time you unlock your vault
- ✅ Not recoverable if forgotten (we cannot reset it)

You should:

- Create a strong passphrase (20+ characters, mix of uppercase, lowercase, numbers, symbols)
- Remember it securely
- Never share it with anyone
- Use a unique passphrase you don't use elsewhere

## Zero-Knowledge Architecture

We practice "zero-knowledge" architecture:

1. **Your device generates the encryption key** from your passphrase
2. **Your device encrypts all data** before upload
3. **Servers only see encrypted blobs** and metadata
4. **Servers cannot decrypt your data** even if they wanted to
5. **Decryption happens only on your device** after you provide your passphrase

Our servers:

- Never see your passphrase
- Never see unencrypted passwords
- Never see unencrypted notes
- Cannot access your data without the encryption key
- Cannot derive the encryption key from stored data

## Authentication

- **Method**: Google OAuth 2.0
- **Provider**: Google (trusted third-party)
- **Flow**: Uses Firebase Authentication
- **Session**: Token-based, stored in browser

Your Google account is used only for:

- Authentication/login
- Identifying your Firestore documents
- Displaying your profile info

Your passwords and notes are completely separate from your Google account.

## Data Storage

### On Your Device

During an active session, decrypted data is stored in:

- **Zustand store** (in-memory state management)
- **Browser memory** (for React components)

Stored data is cleared when:

- You sign out
- You close the browser
- Session ends

### On Firebase Servers

Stored encrypted data:

- **Firestore**: Encrypted vault (salt, ciphertext, IVs)
- **Metadata**: Email, names, timestamps, labels
- **Access Control**: Only your authenticated user can read/write

### Local Storage

The app does NOT use:

- ❌ localStorage (could leak encrypted data)
- ❌ sessionStorage
- ❌ IndexedDB (for sensitive data)
- ❌ Cookies (for sensitive data)

## Network Security

- **Transport**: All traffic uses HTTPS (TLS 1.2+)
- **No HTTP**: The app redirects HTTP to HTTPS
- **Content Security Policy**: Headers prevent XSS/injection attacks
- **CORS**: Only verified origins allowed

## Code Security

- **No eval()**: Never dynamically execute code
- **Input Validation**: All user inputs validated
- **Output Encoding**: Prevents XSS attacks
- **Dependency Scanning**: Regular security audits
- **No Hardcoded Secrets**: All sensitive config from environment

## Browser Security

The app is safe to use on:

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Private/incognito mode
- ✅ Public computers (data is encrypted)
- ✅ Mobile browsers

But remember:

- 🚨 Don't use on computers you don't trust
- 🚨 Don't share your passphrase
- 🚨 Don't leave your browser open with vault unlocked
- 🚨 Don't use weak passphrases

## Threat Model

We protect against:

### ✅ Protected Against

1. **Firebase getting hacked**
   - Attackers get encrypted data
   - Cannot decrypt without your passphrase
   - Cannot brute-force due to PBKDF2 iterations

2. **Network eavesdropping**
   - HTTPS encrypts all traffic
   - No plaintext passwords transmitted

3. **Malicious server**
   - Zero-knowledge design
   - Server cannot decrypt data

4. **Browser history/cache**
   - Data encrypted before storing
   - No plaintext in history

### ⚠️ Not Protected Against

1. **Keyloggers on your computer**
   - If your computer has malware, passphrase can be logged
   - Solution: Keep your computer clean

2. **Weak passphrase**
   - Short and simple passphrases can be brute-forced
   - Solution: Use strong passphrase

3. **Browser Extensions**
   - Malicious extensions can access your data
   - Solution: Only install trusted extensions

4. **Compromised Device**
   - If attacker has physical access, they might catch passphrase
   - Solution: Use strong passphrase, don't store it anywhere

5. **Google Account Compromise**
   - Attacker gains access to your profile
   - Cannot see passwords (still encrypted)
   - Solution: Enable 2FA on Google account

## Privacy Policy

This application:

- ❌ Does NOT collect analytics
- ❌ Does NOT track users
- ❌ Does NOT sell data
- ❌ Does NOT show ads
- ❌ Does NOT use third-party trackers
- ❌ Does NOT share data with anyone

Data stored:

- Only in Firebase (your private project)
- Only associated with your Google account
- Only you can delete

## Security Improvements

Planned for future versions:

- [ ] Master passphrase change
- [ ] Account recovery codes
- [ ] Two-factor authentication
- [ ] Offline mode
- [ ] biometric unlock (fingerprint/face)
- [ ] Password strength meter
- [ ] Breach notification alerts
- [ ] Export encrypted backup
- [ ] Import from other password managers

## Reporting Security Issues

If you discover a security vulnerability:

1. ❌ Do NOT post it publicly
2. ✅ Contact the maintainer privately
3. ✅ Include detailed information
4. ✅ Allow time for the issue to be fixed

## Compliance

- Uses industry-standard security practices
- Implements NIST recommendations for encryption
- Follows OWASP guidelines
- Regular security audits recommended

## Additional Resources

- NIST Encryption Guidelines: https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf
- Web Crypto API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
- OWASP Top 10: https://owasp.org/Top10/

---

**Last Updated**: 2024

For security questions or concerns, please reach out to the maintainer.
