import { useEffect, useState } from "react";
import { useAuthStore, useVaultStore } from "../store/vault";
import { watchAuthState, getCurrentUser, signOut } from "../lib/firebase/auth";
import { getUserDocument, createUserDocument } from "../lib/firebase/firestore";

export function useAuth() {
  const { user, loading, error, setUser, setLoading, setError, clear } =
    useAuthStore();

  useEffect(() => {
    const unsubscribe = watchAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Check if user document exists
          let userDoc = await getUserDocument(firebaseUser.uid);

          if (!userDoc) {
            // Create user document on first login
            await createUserDocument(firebaseUser.uid, {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
            });
          }

          setUser(firebaseUser);
        } catch (err) {
          console.error("Auth error:", err);
          setError(err.message);
        }
      } else {
        clear();
      }
    });

    return () => unsubscribe();
  }, [setUser, setError, clear]);

  return { user, loading, error };
}

export function useIsVaultInitialized() {
  const [initialized, setInitialized] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    async function checkVault() {
      if (!user) {
        setInitialized(false);
        return;
      }

      try {
        const userDoc = await getUserDocument(user.uid);
        setInitialized(!!userDoc?.createdAt);
      } catch (error) {
        console.error("Error checking vault:", error);
        setInitialized(false);
      }
    }

    checkVault();
  }, [user]);

  return initialized;
}

export function useVault() {
  return useVaultStore();
}

export function useAddCredential() {
  const { credentials, encryptionKey, addCredential, updateCredential } =
    useVaultStore();
  const { user } = useAuthStore();

  return async (credentialData) => {
    if (!user || !encryptionKey) {
      throw new Error("User or encryption key not available");
    }

    const credential = {
      id: Date.now().toString(),
      username: credentialData.username,
      password: credentialData.password,
      url: credentialData.url || "",
      label: credentialData.label || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...credentials, credential];
    addCredential(credential);

    // Save to Firebase
    const { saveCredentials } = await import("../lib/vault/vaultManager");
    await saveCredentials(user.uid, updated, encryptionKey);

    return credential;
  };
}

export function useEditCredential() {
  const { credentials, encryptionKey, updateCredential } = useVaultStore();
  const { user } = useAuthStore();

  return async (id, credentialData) => {
    if (!user || !encryptionKey) {
      throw new Error("User or encryption key not available");
    }

    const credential = {
      id,
      ...credentialData,
      updatedAt: new Date().toISOString(),
    };

    updateCredential(id, credential);

    const updated = credentials.map((c) => (c.id === id ? credential : c));

    // Save to Firebase
    const { saveCredentials } = await import("../lib/vault/vaultManager");
    await saveCredentials(user.uid, updated, encryptionKey);

    return credential;
  };
}

export function useDeleteCredential() {
  const { credentials, encryptionKey, deleteCredential } = useVaultStore();
  const { user } = useAuthStore();

  return async (id) => {
    if (!user || !encryptionKey) {
      throw new Error("User or encryption key not available");
    }

    deleteCredential(id);

    const updated = credentials.filter((c) => c.id !== id);

    // Save to Firebase
    const { saveCredentials } = await import("../lib/vault/vaultManager");
    await saveCredentials(user.uid, updated, encryptionKey);
  };
}

export function useAddNote() {
  const { notes, encryptionKey, addNote } = useVaultStore();
  const { user } = useAuthStore();

  return async (noteData) => {
    if (!user || !encryptionKey) {
      throw new Error("User or encryption key not available");
    }

    const note = {
      id: Date.now().toString(),
      title: noteData.title,
      content: noteData.content,
      color: noteData.color || "#FFFBEA",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addNote(note);

    const updated = [...notes, note];

    // Save to Firebase
    const { saveNotes } = await import("../lib/vault/vaultManager");
    await saveNotes(user.uid, updated, encryptionKey);

    return note;
  };
}

export function useEditNote() {
  const { notes, encryptionKey, updateNote } = useVaultStore();
  const { user } = useAuthStore();

  return async (id, noteData) => {
    if (!user || !encryptionKey) {
      throw new Error("User or encryption key not available");
    }

    const note = {
      id,
      ...noteData,
      updatedAt: new Date().toISOString(),
    };

    updateNote(id, note);

    const updated = notes.map((n) => (n.id === id ? note : n));

    // Save to Firebase
    const { saveNotes } = await import("../lib/vault/vaultManager");
    await saveNotes(user.uid, updated, encryptionKey);

    return note;
  };
}

export function useDeleteNote() {
  const { notes, encryptionKey, deleteNote } = useVaultStore();
  const { user } = useAuthStore();

  return async (id) => {
    if (!user || !encryptionKey) {
      throw new Error("User or encryption key not available");
    }

    deleteNote(id);

    const updated = notes.filter((n) => n.id !== id);

    // Save to Firebase
    const { saveNotes } = await import("../lib/vault/vaultManager");
    await saveNotes(user.uid, updated, encryptionKey);
  };
}
