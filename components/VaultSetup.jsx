import { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/Card";
import { PasswordInput } from "./ui/PasswordInput";
import { AlertCircle, Lock } from "lucide-react";

export function VaultSetup({ onCreateVault, loading, error }) {
  const [passphrase, setPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!passphrase) {
      setLocalError("Passphrase is required");
      return;
    }

    if (passphrase !== confirmPassphrase) {
      setLocalError("Passphrases do not match");
      return;
    }

    if (passphrase.length < 8) {
      setLocalError("Passphrase must be at least 8 characters long");
      return;
    }

    try {
      await onCreateVault(passphrase);
    } catch (err) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Create Your Vault</CardTitle>
          <CardDescription>
            Set a master passphrase to secure your passwords and notes
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(error || localError) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded flex gap-2 text-sm text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error || localError}</span>
              </div>
            )}

            <div>
              <Label htmlFor="passphrase">Master Passphrase</Label>
              <PasswordInput
                id="passphrase"
                placeholder="Create a strong passphrase"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                required
              />
              <p className="text-xs text-gray-600 mt-1">
                • At least 8 characters
                <br />• Remember this - it cannot be recovered
                <br />• Never share your passphrase with anyone
              </p>
            </div>

            <div>
              <Label htmlFor="confirm">Confirm Passphrase</Label>
              <PasswordInput
                id="confirm"
                placeholder="Confirm your passphrase"
                value={confirmPassphrase}
                onChange={(e) => setConfirmPassphrase(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Vault..." : "Create Vault"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-900 font-medium mb-2">
              Security Notice:
            </p>
            <p className="text-xs text-blue-800">
              Your passphrase is used to encrypt all your data locally. We never
              store your passphrase. If you forget it, your vault cannot be
              recovered.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function VaultUnlock({
  onUnlockVault,
  loading,
  error,
  retryAttempt = 0,
}) {
  const [passphrase, setPassphrase] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!passphrase) {
      setLocalError("Passphrase is required");
      return;
    }

    try {
      await onUnlockVault(passphrase);
    } catch (err) {
      setLocalError(err.message);
      setPassphrase("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Unlock Your Vault</CardTitle>
          <CardDescription>
            Enter your master passphrase to access your passwords and notes
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(error || localError) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded flex gap-2 text-sm text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error || localError}</span>
              </div>
            )}

            <div>
              <Label htmlFor="passphrase">Master Passphrase</Label>
              <PasswordInput
                id="passphrase"
                placeholder="Enter your passphrase"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                required
                autoFocus
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !passphrase}
            >
              {loading ? "Unlocking..." : "Unlock"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-900 font-medium mb-1">Tip:</p>
            <p className="text-xs text-amber-800">
              Your vault is encrypted with your passphrase. Decryption happens
              only on your device.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
