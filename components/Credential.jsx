import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "./ui/Dialog";
import {
  Copy,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Key,
  User,
  Globe,
} from "lucide-react";
import { PasswordInput } from "./ui/PasswordInput";

export function CredentialCard({ credential, onEdit, onDelete, onCopy }) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(credential.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="card-apple overflow-hidden hover:shadow-lg transition-all duration-200">
      <CardContent className="p-5">
        <div className="space-y-4">
          {credential.label && (
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-500" />
              <h3 className="font-semibold text-gray-900">
                {credential.label}
              </h3>
            </div>
          )}
          {credential.url && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-600 truncate">{credential.url}</p>
            </div>
          )}

          <div className="bg-gray-50/50 rounded-xl p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User className="w-3 h-3 text-gray-500" />
                <p className="text-xs text-gray-600 font-medium">Username</p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-gray-900 truncate">
                  {credential.username}
                </p>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={async () => {
                    await navigator.clipboard.writeText(credential.username);
                    onCopy?.("Username copied");
                  }}
                  className="h-8 w-8 hover:bg-blue-50"
                  title="Copy username"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Key className="w-3 h-3 text-gray-500" />
                <p className="text-xs text-gray-600 font-medium">Password</p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-gray-900 font-mono">
                  {showPassword ? credential.password : "••••••••"}
                </p>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    className="h-8 w-8 hover:bg-blue-50"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCopyPassword}
                    className="h-8 w-8 hover:bg-blue-50"
                    title={copied ? "Copied!" : "Copy password"}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(credential)}
              className="btn-apple-outline"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(credential.id)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AddCredentialDialog({
  open,
  onOpenChange,
  onAdd,
  editingCredential,
  onEdit,
}) {
  const [formData, setFormData] = useState(
    editingCredential || {
      label: "",
      url: "",
      username: "",
      password: "",
    },
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingCredential) {
      setFormData(
        editingCredential || {
          label: "",
          url: "",
          username: "",
          password: "",
        },
      );
    } else if (!open) {
      setFormData({ label: "", url: "", username: "", password: "" });
    }
  }, [editingCredential, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.username || !formData.password) {
        throw new Error("Username and password are required");
      }

      if (editingCredential) {
        await onEdit(editingCredential.id, formData);
      } else {
        await onAdd(formData);
      }

      setFormData({ label: "", url: "", username: "", password: "" });
      onOpenChange(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>
            {editingCredential ? "Edit Credential" : "Add Credential"}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="label">Label (optional)</Label>
              <Input
                id="label"
                placeholder="e.g., Gmail, GitHub"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="url">URL/Website (optional)</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="username">Username/Email *</Label>
              <Input
                id="username"
                placeholder="your username or email"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <PasswordInput
                id="password"
                placeholder="your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
