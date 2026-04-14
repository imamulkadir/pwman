import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clear: () => set({ user: null, loading: false, error: null }),
}));

export const useVaultStore = create((set) => ({
  isUnlocked: false,
  credentials: [],
  notes: [],
  encryptionKey: null,
  loading: false,
  error: null,

  setUnlocked: (isUnlocked) => set({ isUnlocked }),
  setCredentials: (credentials) => set({ credentials }),
  setNotes: (notes) => set({ notes }),
  setEncryptionKey: (encryptionKey) => set({ encryptionKey }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addCredential: (credential) =>
    set((state) => ({
      credentials: [...state.credentials, credential],
    })),

  updateCredential: (id, credential) =>
    set((state) => ({
      credentials: state.credentials.map((c) => (c.id === id ? credential : c)),
    })),

  deleteCredential: (id) =>
    set((state) => ({
      credentials: state.credentials.filter((c) => c.id !== id),
    })),

  addNote: (note) =>
    set((state) => ({
      notes: [...state.notes, note],
    })),

  updateNote: (id, note) =>
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? note : n)),
    })),

  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    })),

  clear: () =>
    set({
      isUnlocked: false,
      credentials: [],
      notes: [],
      encryptionKey: null,
      loading: false,
      error: null,
    }),
}));
