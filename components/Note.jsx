import { useEffect, useState } from "react";
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
import { Edit3, Trash2, Copy, FileText, Palette } from "lucide-react";

const NOTE_COLORS = [
  "#FFFBEA", // Yellow
  "#FFE4E1", // Pink
  "#E0F7FF", // Blue
  "#E8F5E9", // Green
  "#F3E5F5", // Purple
  "#FFFDE7", // Lime
];

export function NoteCard({ note, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `${note.title}\n\n${note.content}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      className="card-apple overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
      style={{ backgroundColor: note.color }}
    >
      <CardContent className="p-5 h-full flex flex-col">
        <div className="flex-1 mb-4">
          {note.title && (
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {note.title}
              </h3>
            </div>
          )}
          <p className="text-sm text-gray-700 line-clamp-4 whitespace-pre-wrap">
            {note.content}
          </p>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(note)}
            className="flex-1 btn-apple-outline"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className="h-9 w-9 hover:bg-white/50"
            title={copied ? "Copied!" : "Copy"}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(note.id)}
            className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
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
    if (editingNote) {
      setFormData(
        editingNote || {
          title: "",
          content: "",
          color: "#FFFBEA",
        },
      );
    } else if (!open) {
      setFormData({ title: "", content: "", color: "#FFFBEA" });
    }
  }, [editingNote, open]);

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
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
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
                className="input-apple w-full px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-gray-600" />
                <Label>Color</Label>
              </div>
              <div className="flex gap-2 flex-wrap">
                {NOTE_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      formData.color === color
                        ? "border-gray-800 scale-110 shadow-md"
                        : "border-gray-300 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
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
