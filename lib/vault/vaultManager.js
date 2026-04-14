import {
  deriveKeyFromPassphrase,
  base64ToSalt,
  encryptData,
  decryptData,
  generateSalt,
  saltToBase64,
} from "../crypto/encryption";
import { getVaultData, saveVaultData } from "../firebase/firestore";

// Initialize vault for first time
export async function initializeVault(uid, passphrase) {
  try {
    const salt = generateSalt();
    const key = await deriveKeyFromPassphrase(passphrase, salt);

    const credentials = [];
    const notes = [];

    const encryptedCredentials = await encryptData(credentials, key);
    const encryptedNotes = await encryptData(notes, key);

    const vaultData = {
      salt: saltToBase64(salt),
      credentialsCiphertext: encryptedCredentials.ciphertext,
      credentialsIv: encryptedCredentials.iv,
      notesCiphertext: encryptedNotes.ciphertext,
      notesIv: encryptedNotes.iv,
      encryptionVersion: 1,
    };

    await saveVaultData(uid, vaultData);
    return true;
  } catch (error) {
    console.error("Error initializing vault:", error.message);
    throw error;
  }
}

// Unlock vault and return decrypted data
export async function unlockVault(uid, passphrase) {
  try {
    const vaultData = await getVaultData(uid);

    if (!vaultData) {
      throw new Error("Vault not found");
    }

    const salt = base64ToSalt(vaultData.salt);
    const key = await deriveKeyFromPassphrase(passphrase, salt);

    const credentials = await decryptData(
      {
        iv: vaultData.credentialsIv,
        ciphertext: vaultData.credentialsCiphertext,
      },
      key,
    );

    const notes = await decryptData(
      {
        iv: vaultData.notesIv,
        ciphertext: vaultData.notesCiphertext,
      },
      key,
    );

    return {
      credentials,
      notes,
      key, // Store in memory for this session only
    };
  } catch (error) {
    console.error("Error unlocking vault:", error.message);
    throw error;
  }
}

// Re-encrypt and save credentials
export async function saveCredentials(uid, credentials, key) {
  try {
    const vaultData = await getVaultData(uid);
    const encryptedCredentials = await encryptData(credentials, key);

    await saveVaultData(uid, {
      credentialsCiphertext: encryptedCredentials.ciphertext,
      credentialsIv: encryptedCredentials.iv,
    });
  } catch (error) {
    console.error("Error saving credentials:", error.message);
    throw error;
  }
}

// Re-encrypt and save notes
export async function saveNotes(uid, notes, key) {
  try {
    const encryptedNotes = await encryptData(notes, key);

    await saveVaultData(uid, {
      notesCiphertext: encryptedNotes.ciphertext,
      notesIv: encryptedNotes.iv,
    });
  } catch (error) {
    console.error("Error saving notes:", error.message);
    throw error;
  }
}
