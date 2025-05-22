import { useState } from "react";
import { PlusCircle } from "lucide-react";
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
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface CreatePlaylistButtonProps {
  isAdmin: boolean;
}

const PlaylistSchema = z.object({
  name: z
    .string()
    .max(50, "Title atleast 50 characters")
    .min(2, "Title atleast 50 characters"),
  description: z
    .string()
    .min(2, "description atleast 2 characters long")
    .max(200, "description atleast 2 characters long"),
});

type PlaylistFormValues = z.infer<typeof PlaylistSchema>;

const playlist = async (playlistData: PlaylistData) => {
  const { data } = await createPlaylist(playlistData);
  return data;
};
export function CreatePlaylistButton({ isAdmin }: CreatePlaylistButtonProps) {
  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PlaylistFormValues>({
    resolver: zodResolver(PlaylistSchema),
  });

  const { mutate } = useMutation({
    mutationKey: ["playlist"],
    mutationFn: playlist,
    onSuccess: () => {
      setOpen(false);
    },
  });

  const onSubmit = (data: PlaylistFormValues) => {
    mutate(data);
    console.log("Form Data:", data);
  };

  if (!isAdmin) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2 ">
          <PlusCircle className="h-4 w-4" />
          Create Playlist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
          <DialogDescription>
            Create a new problem playlist for users to practice with.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Title
              </Label>
              <Input
                id="name"
                {...register("name")}
                className="col-span-3"
                placeholder="Algorithm Fundamentals"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                className="col-span-3"
                placeholder="A collection of fundamental algorithm problems..."
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
