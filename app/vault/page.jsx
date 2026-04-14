"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useAuth,
  useVault,
  useAddCredential,
  useEditCredential,
  useDeleteCredential,
  useAddNote,
  useEditNote,
  useDeleteNote,
} from "@/hooks/useVault";
import { useAuthStore, useVaultStore } from "@/store/vault";
import { signOut } from "@/lib/firebase/auth";
import { unlockVault, initializeVault } from "@/lib/vault/vaultManager";
import { Key, FileText, Plus, Search } from "lucide-react";

import { getVaultData } from "@/lib/firebase/firestore";
import { VaultSetup, VaultUnlock } from "@/components/VaultSetup";
import {
  Header,
  LoadingScreen,
  ErrorState,
  EmptyState,
} from "@/components/Layout";
import { SettingsDialog } from "@/components/Settings";
import { CredentialCard, AddCredentialDialog } from "@/components/Credential";
import { NoteCard, AddNoteDialog } from "@/components/Note";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ToastContainer } from "@/components/ui/Toast";

export default function VaultPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useAuth();
  const {
    isUnlocked,
    credentials,
    notes,
    setUnlocked,
    setCredentials,
    setNotes,
    setEncryptionKey,
    setLoading: setVaultLoading,
    setError: setVaultError,
    loading: vaultLoading,
    error: vaultError,
  } = useVault();

  const { clear: clearAuth } = useAuthStore();
  const { clear: clearVault } = useVaultStore();

  const addCredential = useAddCredential();
  const editCredential = useEditCredential();
  const deleteCredential = useDeleteCredential();
  const addNote = useAddNote();
  const editNote = useEditNote();
  const deleteNote = useDeleteNote();

  const [vaultExists, setVaultExists] = useState(null);
  const [showAddCredential, setShowAddCredential] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [editingCredential, setEditingCredential] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("passwords");
  const [showSettings, setShowSettings] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Function to add a toast
  const addToast = (message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  // Function to remove a toast
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Check vault when user changes
  const checkVault = useCallback(async () => {
    try {
      const vaultData = await getVaultData(user.uid);
      setVaultExists(!!vaultData);
    } catch (error) {
      console.error("Error checking vault:", error);
      setVaultError("Failed to check vault status");
      setVaultExists(false); // Assume no vault if can&apos;t check
    }
  }, [user, setVaultError]);

  useEffect(() => {
    if (user) {
      checkVault();
    } else if (!userLoading) {
      // If not loading and no user, redirect to login
      router.push("/");
    }
  }, [user, userLoading, router, checkVault]);

  const handleCreateVault = async (passphrase) => {
    setVaultLoading(true);
    try {
      await initializeVault(user.uid, passphrase);
      setVaultExists(true);
      addToast("Vault created successfully!");
    } catch (error) {
      setVaultError(error.message);
    } finally {
      setVaultLoading(false);
    }
  };

  const handleUnlockVault = async (passphrase) => {
    setVaultLoading(true);
    try {
      const data = await unlockVault(user.uid, passphrase);
      setCredentials(data.credentials);
      setNotes(data.notes);
      setEncryptionKey(data.key);
      setUnlocked(true);
      addToast("Vault unlocked!");
    } catch (error) {
      setVaultError(error.message);
    } finally {
      setVaultLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      clearAuth();
      clearVault();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleAddCredential = async (data) => {
    try {
      await addCredential(data);
      setEditingCredential(null);
      setShowAddCredential(false);
      addToast("Credential saved!");
    } catch (error) {
      console.error("Error adding credential:", error);
      throw error;
    }
  };

  const handleEditCredential = async (id, data) => {
    try {
      await editCredential(id, data);
      setEditingCredential(null);
      setShowAddCredential(false);
      addToast("Credential updated!");
    } catch (error) {
      console.error("Error editing credential:", error);
      throw error;
    }
  };

  const handleDeleteCredential = async (id) => {
    if (window.confirm("Are you sure you want to delete this credential?")) {
      try {
        await deleteCredential(id);
        addToast("Credential deleted!");
      } catch (error) {
        console.error("Error deleting credential:", error);
      }
    }
  };

  const handleAddNote = async (data) => {
    try {
      await addNote(data);
      setEditingNote(null);
      setShowAddNote(false);
      addToast("Note saved!");
    } catch (error) {
      console.error("Error adding note:", error);
      throw error;
    }
  };

  const handleEditNote = async (id, data) => {
    try {
      await editNote(id, data);
      setEditingNote(null);
      setShowAddNote(false);
      addToast("Note updated!");
    } catch (error) {
      console.error("Error editing note:", error);
      throw error;
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(id);
        addToast("Note deleted!");
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const filteredCredentials = credentials.filter(
    (cred) =>
      cred.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.url.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Loading states
  if (userLoading || vaultExists === null) {
    return <LoadingScreen />;
  }

  // Vault setup
  if (vaultExists === false) {
    return (
      <VaultSetup
        onCreateVault={handleCreateVault}
        loading={vaultLoading}
        error={vaultError}
      />
    );
  }

  // Vault locked
  if (!isUnlocked) {
    return (
      <VaultUnlock
        onUnlockVault={handleUnlockVault}
        loading={vaultLoading}
        error={vaultError}
      />
    );
  }

  // Vault unlocked - Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header
        user={user}
        onSignOut={handleSignOut}
        onSettings={() => setShowSettings(true)}
      />

      {vaultError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <ErrorState
            title="Error"
            description={vaultError}
            onRetry={() => setVaultError(null)}
          />
        </div>
      )}

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          defaultValue="passwords"
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
              <TabsTrigger
                value="passwords"
                className="flex items-center gap-2"
              >
                <Key className="w-4 h-4" />
                Passwords ({credentials.length})
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notes ({notes.length})
              </TabsTrigger>
            </TabsList>

            <Button
              onClick={() => {
                if (activeTab === "passwords") {
                  setEditingCredential(null);
                  setShowAddCredential(true);
                } else {
                  setEditingNote(null);
                  setShowAddNote(true);
                }
              }}
              className="btn-apple w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add {activeTab === "passwords" ? "Credential" : "Note"}
            </Button>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-apple pl-12"
              />
            </div>
          </div>

          {/* Passwords Tab */}
          <TabsContent value="passwords">
            {filteredCredentials.length === 0 ? (
              <EmptyState
                title={searchQuery ? "No results" : "No passwords yet"}
                description={
                  searchQuery
                    ? "Try adjusting your search"
                    : "Add your first password to get started"
                }
                action={() => setShowAddCredential(true)}
                actionLabel="Add Password"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCredentials.map((cred) => (
                  <CredentialCard
                    key={cred.id}
                    credential={cred}
                    onEdit={(c) => {
                      setEditingCredential(c);
                      setShowAddCredential(true);
                    }}
                    onDelete={handleDeleteCredential}
                    onCopy={(msg) => addToast(msg)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes">
            {filteredNotes.length === 0 ? (
              <EmptyState
                title={searchQuery ? "No results" : "No notes yet"}
                description={
                  searchQuery
                    ? "Try adjusting your search"
                    : "Create your first note to get started"
                }
                action={() => setShowAddNote(true)}
                actionLabel="Add Note"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={(n) => {
                      setEditingNote(n);
                      setShowAddNote(true);
                    }}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <AddCredentialDialog
        open={showAddCredential}
        onOpenChange={setShowAddCredential}
        onAdd={handleAddCredential}
        onEdit={handleEditCredential}
        editingCredential={editingCredential}
      />

      <AddNoteDialog
        open={showAddNote}
        onOpenChange={setShowAddNote}
        onAdd={handleAddNote}
        onEdit={handleEditNote}
        editingNote={editingNote}
      />

      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        user={user}
        onSignOut={handleSignOut}
      />
    </div>
  );
}
