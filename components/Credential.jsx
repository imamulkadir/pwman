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

function CredentialIcon({ url }) {
  const [imgError, setImgError] = useState(false);

  if (!url || imgError) {
    return <Key className="w-5 h-5 text-blue-400" />;
  }

  try {
    const domain = new URL(
      url.startsWith("http") ? url : `https://${url}`
    ).hostname;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
        alt=""
        className="w-5 h-5 rounded-sm"
        onError={() => setImgError(true)}
      />
    );
  } catch {
    return <Key className="w-5 h-5 text-blue-400" />;
  }
}

export function CredentialCard({ credential, onEdit, onDelete, onCopy }) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(credential.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="card-apple overflow-hidden group transition-all duration-200">
      <CardContent className="p-4">
        {/* Header: icon + label/url + hover actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 bg-blue-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
              <CredentialIcon url={credential.url} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-100 truncate text-sm leading-tight">
                {credential.label || credential.username}
              </h3>
              {credential.url && (
                <a
                  href={credential.url.startsWith("http") ? credential.url : `https://${credential.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-gray-500 hover:text-blue-400 truncate mt-0.5 block transition-colors"
                >
                  {credential.url}
                </a>
              )}
            </div>
          </div>

          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0 ml-2">
            <button
              onClick={() => onEdit(credential)}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
              title="Edit"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(credential.id)}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Credential rows */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 bg-gray-800/40 rounded-lg px-3 py-2">
            <User className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            <p className="text-xs text-gray-300 truncate flex-1">{credential.username}</p>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(credential.username);
                onCopy?.("Username copied");
              }}
              className="h-6 w-6 rounded-md flex items-center justify-center text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors flex-shrink-0"
              title="Copy username"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-2 bg-gray-800/40 rounded-lg px-3 py-2">
            <Key className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            <p className="text-xs text-gray-300 font-mono flex-1 truncate">
              {showPassword ? credential.password : "••••••••"}
            </p>
            <div className="flex gap-0.5 flex-shrink-0">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="h-6 w-6 rounded-md flex items-center justify-center text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
              <button
                onClick={handleCopyPassword}
                className={`h-6 w-6 rounded-md flex items-center justify-center transition-colors ${copied ? "text-green-400" : "text-gray-500 hover:text-blue-400 hover:bg-blue-500/10"}`}
                title={copied ? "Copied!" : "Copy password"}
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {credential.note && (
          <p className="mt-2.5 text-xs text-gray-500 leading-relaxed border-t border-gray-700/50 pt-2.5 line-clamp-2">
            {credential.note}
          </p>
        )}
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
      note: "",
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
              <div className="p-3 bg-red-900/30 border border-red-700/50 rounded text-sm text-red-400">
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

            <div>
              <Label htmlFor="note">Note (optional)</Label>
              <textarea
                id="note"
                placeholder="Any extra info about this credential..."
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                rows={3}
                className="input-apple w-full px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent resize-none"
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
