import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Youtube } from "lucide-react";

interface YoutubeDialogProps {
  videoUrl: string;
}

export function YoutubeDialog({ videoUrl }: YoutubeDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full text-red-600"
        onClick={() => setOpen(true)}
      >
        <Youtube className="h-6 w-6" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="aspect-video w-full">
            <iframe
              src={videoUrl}
              className="w-full h-full rounded-md"
              title="youtube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
