import { Button } from "./ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "./ui/Dialog";
import { LogOut, Lock, ShieldAlert } from "lucide-react";

export function SettingsDialog({
  open,
  onOpenChange,
  user,
  onSignOut,
  onChangePassphrase,
}) {
  const handleLogout = async () => {
    await onSignOut();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="space-y-6">
            {/* Account Section */}
            <div className="border-b border-gray-700 pb-6">
              <h3 className="font-semibold text-gray-100 mb-4">Account</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-mono text-sm text-gray-100">
                    {user?.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-sm text-gray-100">{user?.displayName}</p>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="border-b border-gray-700 pb-6">
              <h3 className="font-semibold text-gray-100 mb-4">Security</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded flex gap-3">
                  <ShieldAlert className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">Master Passphrase</p>
                    <p className="text-xs">
                      Your passphrase is used to encrypt all data locally.
                      It&apos;s never stored on our servers.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled
                  title="Change passphrase feature coming soon"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Passphrase (Coming Soon)
                </Button>
              </div>
            </div>

            {/* Danger Zone */}
            <div>
              <h3 className="font-semibold text-red-500 mb-4">
                Danger Zone
              </h3>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
