import type React from "react";
import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/http/client";

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarUpdate: (avatarUrl: string) => void;
  currentAvatar: string;
}

export function AvatarModal({
  isOpen,
  onClose,
  onAvatarUpdate,
  currentAvatar,
}: AvatarModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["update"],
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api
        .patch("/auth/update-profile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res.data);
      return response.data;
    },
    onSuccess: (data) => {
      onAvatarUpdate(data?.url);
      setPreviewUrl(null);
      setSelectedFile(null);
      onClose();
      queryClient.invalidateQueries({ queryKey: ["self"] });
      queryClient.invalidateQueries({ queryKey: ["update"] });
    },
    onError: (error: any) => {
      console.error("Failed to update avatar", error);
    },
  });

  const handleSave = () => {
    if (selectedFile) {
      mutate(selectedFile);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-[#282828] p-6 text-white">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-700">
              <img
                src={previewUrl || currentAvatar}
                alt="Avatar preview"
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="mb-6">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 rounded-md bg-gray-700 px-3 py-2 text-sm hover:bg-gray-600 transition-colors"
          >
            <Camera className="h-4 w-4" />
            <span>Upload Photo</span>
          </button>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleCancel}
            className="flex-1 rounded-md bg-gray-700 py-2 text-center font-medium hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedFile || isPending}
            className="flex-1 rounded-md bg-green-600 py-2 text-center font-medium hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
