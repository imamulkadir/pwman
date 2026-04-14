import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";

// Get user document
export async function getUserDocument(uid) {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error getting user document:", error.message);
    throw error;
  }
}

// Create user document
export async function createUserDocument(uid, userData) {
  try {
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error creating user document:", error.message);
    throw error;
  }
}

// Update user document
export async function updateUserDocument(uid, userData) {
  try {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
      ...userData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating user document:", error.message);
    throw error;
  }
}

// Get vault data
export async function getVaultData(uid) {
  try {
    const docRef = doc(db, "users", uid, "vault", "main");
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error getting vault data:", error.message);
    throw error;
  }
}

// Create or update vault data
export async function saveVaultData(uid, vaultData) {
  try {
    const docRef = doc(db, "users", uid, "vault", "main");
    await setDoc(
      docRef,
      {
        ...vaultData,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Error saving vault data:", error.message);
    throw error;
  }
}
