// Derive encryption key from passphrase using PBKDF2
export async function deriveKeyFromPassphrase(passphrase, salt) {
  const encoder = new TextEncoder();
  const passphraseBuffer = encoder.encode(passphrase);

  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    passphraseBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  const derivedKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );

  return derivedKey;
}

// Generate random salt
export function generateSalt() {
  return window.crypto.getRandomValues(new Uint8Array(16));
}

// Generate random IV
export function generateIV() {
  return window.crypto.getRandomValues(new Uint8Array(12));
}

// Encrypt data using AES-GCM
export async function encryptData(data, key) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(JSON.stringify(data));
  const iv = generateIV();

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    dataBuffer,
  );

  return {
    iv: bufferToBase64(iv),
    ciphertext: bufferToBase64(ciphertext),
  };
}

// Decrypt data using AES-GCM
export async function decryptData(encryptedData, key) {
  try {
    const iv = base64ToBuffer(encryptedData.iv);
    const ciphertextBuffer = base64ToBuffer(encryptedData.ciphertext);

    const plaintext = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      ciphertextBuffer,
    );

    const decoder = new TextDecoder();
    const jsonString = decoder.decode(plaintext);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Decryption error:", error.message);
    throw new Error(
      "Failed to decrypt data. Invalid passphrase or corrupted data.",
    );
  }
}

// Convert ArrayBuffer to Base64
function bufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 to ArrayBuffer
function base64ToBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Export salt to Base64 for storage
export function saltToBase64(salt) {
  return bufferToBase64(salt);
}

// Convert Base64 to salt
export function base64ToSalt(base64) {
  return new Uint8Array(base64ToBuffer(base64));
}
