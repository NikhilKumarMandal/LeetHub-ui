import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPlaylist } from "@/http/api";
import type { PlaylistData } from "@/Types";
import { useMutation } from "@tanstack/react-query";

interface CreatePlaylistButtonProps {
  isAdmin: boolean;
}

export function CreatePlaylistButton({ isAdmin }: CreatePlaylistButtonProps) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState<string[]>([""]);

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    summary?: string;
  }>({});

  const { mutate } = useMutation({
    mutationKey: ["playlist"],
    mutationFn: async (playlistData: PlaylistData) => {
      const { data } = await createPlaylist(playlistData);
      return data;
    },
    onSuccess: () => {
      setOpen(false);
      clearForm();
    },
  });

  function clearForm() {
    setName("");
    setDescription("");
    setSummary([""]);
    setErrors({});
  }

  function validate() {
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = "Title is required";
    else if (name.trim().length < 2)
      newErrors.name = "Title must be at least 2 characters";

    if (!description.trim()) newErrors.description = "Description is required";
    else if (description.trim().length < 2)
      newErrors.description = "Description must be at least 2 characters";

    if (summary.length === 0) {
      newErrors.summary = "At least one summary is required";
    } else {
      for (let i = 0; i < summary.length; i++) {
        if (!summary[i].trim()) {
          newErrors.summary = `Summary #${i + 1} is required`;
          break;
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const formData = new FormData();

    formData.append("name", name.trim());
    formData.append("description", description.trim());

    summary.forEach((s, i) => formData.append(`summary[${i}]`, s.trim()));

    mutate(formData as any);
  }

  function updateSummary(index: number, value: string) {
    const copy = [...summary];
    copy[index] = value;
    setSummary(copy);
  }

  function addSummary() {
    setSummary([...summary, ""]);
  }

  function removeSummary(index: number) {
    if (summary.length === 1) return;
    setSummary(summary.filter((_, i) => i !== index));
  }

  if (!isAdmin) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Playlist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
          <DialogDescription>
            Create a new problem playlist for users to practice with.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="py-4 grid gap-4">
          {/* Title */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter problem title"
              className="col-span-3"
            />
            {errors.name && (
              <p className="col-span-4 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what this playlist is about..."
              className="col-span-3"
            />
            {errors.description && (
              <p className="col-span-4 text-sm text-red-500">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Summary</Label>
            {summary.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateSummary(index, e.target.value)}
                  placeholder={`Summary #${index + 1}`}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeSummary(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {errors.summary && (
              <p className="text-sm text-red-500">{errors.summary}</p>
            )}
            <Button type="button" onClick={addSummary}>
              Add Summary
            </Button>
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
