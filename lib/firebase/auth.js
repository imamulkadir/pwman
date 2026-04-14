import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./config";

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

// Google Sign-In
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In error:", error.message);
    throw error;
  }
}

// Sign Out
export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Sign Out error:", error.message);
    throw error;
  }
}

// Subscribe to auth state
export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser;
}
