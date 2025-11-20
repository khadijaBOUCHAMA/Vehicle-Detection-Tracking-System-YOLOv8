import { Upload, FileVideo, Image } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export const FileUpload = ({ onFileSelect, selectedFile }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, [selectedFile]);

  const isVideo = selectedFile?.type.startsWith("video/");
  const isImage = selectedFile?.type.startsWith("image/");

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-xl p-12 transition-all duration-300",
        isDragging
          ? "border-primary bg-primary/10 scale-105"
          : "border-border hover:border-primary/50 bg-card/50",
        selectedFile && "border-success"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        id="file-upload"
      />
      
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        {selectedFile ? (
          <>
            {preview && (
              <div className="w-full max-w-md animate-slide-up">
                {isImage ? (
                  <img 
                    src={preview} 
                    alt={selectedFile.name}
                    className="w-full h-auto rounded-lg border border-border shadow-lg"
                  />
                ) : isVideo ? (
                  <video 
                    src={preview}
                    controls
                    className="w-full h-auto rounded-lg border border-border shadow-lg"
                  />
                ) : null}
              </div>
            )}
            <div className="space-y-2 animate-slide-up">
              <p className="text-lg font-semibold text-foreground">
                {selectedFile.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </>
        ) : (
          <>
            <Upload className="w-16 h-16 text-primary animate-pulse-glow" />
            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground">
                Déposez votre fichier ici
              </p>
              <p className="text-sm text-muted-foreground">
                ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-muted-foreground/70">
                Images et vidéos acceptées
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
