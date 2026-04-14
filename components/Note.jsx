import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Card, CardContent } from "./ui/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "./ui/Dialog";
import { Edit3, Trash2, Copy, FileText } from "lucide-react";


export function NoteCard({ note, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!showActions) return;
    const handleOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setShowActions(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [showActions]);

  const handleCopy = (e) => {
    e.stopPropagation();
    const text = `${note.title}\n\n${note.content}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardClick = () => {
    if (window.matchMedia("(hover: none)").matches) {
      setShowActions((prev) => !prev);
    }
  };

  const actionsVisible = `flex gap-0.5 transition-opacity duration-150 flex-shrink-0 ml-2 ${
    showActions ? "opacity-100" : "opacity-0 group-hover:opacity-100"
  }`;

  return (
    <Card
      ref={cardRef}
      className="card-apple overflow-hidden group transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        {/* Header: icon + title + hover actions */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <FileText className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            <h3 className="font-semibold text-gray-100 text-sm truncate">
              {note.title || "Untitled"}
            </h3>
          </div>

          <div className={actionsVisible}>
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(note); }}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
              title="Edit"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCopy}
              className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors ${
                copied ? "text-green-400" : "text-gray-500 hover:text-blue-400 hover:bg-blue-500/10"
              }`}
              title={copied ? "Copied!" : "Copy"}
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-400 line-clamp-4 whitespace-pre-wrap">
          {note.content}
        </p>
      </CardContent>
    </Card>
  );
}

export function AddNoteDialog({
  open,
  onOpenChange,
  onAdd,
  editingNote,
  onEdit,
}) {
  const [formData, setFormData] = useState(
    editingNote || {
      title: "",
      content: "",
      color: "#FFFBEA",
    },
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    if (editingNote) {
      setFormData({ title: "", content: "", color: "#FFFBEA", ...editingNote });
    } else {
      setFormData({ title: "", content: "", color: "#FFFBEA" });
    }
  }, [open, editingNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.title && !formData.content) {
        throw new Error("Title or content is required");
      }

      if (editingNote) {
        await onEdit(editingNote.id, formData);
      } else {
        await onAdd(formData);
      }

      setFormData({ title: "", content: "", color: "#FFFBEA" });
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
          <DialogTitle>{editingNote ? "Edit Note" : "Add Note"}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700/50 rounded text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="title">Title (optional)</Label>
              <Input
                id="title"
                placeholder="Note title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <textarea
                id="content"
                placeholder="Take a note..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
                rows={6}
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
