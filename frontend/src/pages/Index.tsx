import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ProcessingControls } from "@/components/ProcessingControls";
import { DetectionResults } from "@/components/DetectionResults";
import { VideoResults } from "@/components/VideoResults";
import { processImage, processVideoTracking, downloadVideo } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Car } from "lucide-react";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [trackingResults, setTrackingResults] = useState<any>(null);
  const [detections, setDetections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setTrackingResults(null);
    setProcessedImage(null);
    setDetections([]);
  };

  const handleImageProcess = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      const result = await processImage(selectedFile);
      if (result.success) {
        setProcessedImage(`data:image/jpeg;base64,${result.processed_image}`);
        setDetections(result.detections);
        setTrackingResults(null);
        toast({
          title: "Succès",
          description: `${result.detections.length} véhicule(s) détecté(s)`,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec du traitement de l'image",
        variant: "destructive",
      });
      console.error("Error processing image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoTracking = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      const result = await processVideoTracking(selectedFile);
      if (result.success) {
        setTrackingResults(result);
        setProcessedImage(`data:image/jpeg;base64,${result.preview_image}`);
        setDetections([]);
        toast({
          title: "Succès",
          description: `${result.total_vehicles} véhicule(s) compté(s)`,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec du traitement de la vidéo",
        variant: "destructive",
      });
      console.error("Error processing video:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVideo = async () => {
    if (trackingResults?.processed_video) {
      try {
        await downloadVideo(trackingResults.processed_video);
        toast({
          title: "Succès",
          description: "Vidéo téléchargée avec succès",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Échec du téléchargement de la vidéo",
          variant: "destructive",
        });
        console.error("Error downloading video:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow-primary">
              <Car className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient">
                YOLO11 Autonomous Driving
              </h1>
              <p className="text-muted-foreground">
                Système de Détection & Suivi de Véhicules
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
          />
          
          <ProcessingControls
            onProcessImage={handleImageProcess}
            onTrackVideo={handleVideoTracking}
            disabled={!selectedFile}
            loading={loading}
          />
        </div>

        {/* Results Section */}
        {trackingResults && processedImage && (
          <VideoResults
            previewImage={processedImage}
            totalVehicles={trackingResults.total_vehicles}
            counts={trackingResults.final_counts}
            onDownload={handleDownloadVideo}
          />
        )}

        {processedImage && !trackingResults && detections.length > 0 && (
          <DetectionResults
            detections={detections}
            processedImage={processedImage}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-xl mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground text-sm">
          <p>Propulsé par YOLO11 - Deep Learning pour la Conduite Autonome</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
