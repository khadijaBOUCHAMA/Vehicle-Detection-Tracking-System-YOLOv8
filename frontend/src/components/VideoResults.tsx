import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { VehicleStats } from "./VehicleStats";

interface VideoResultsProps {
  previewImage: string;
  totalVehicles: number;
  counts: Record<string, number>;
  onDownload: () => void;
}

export const VideoResults = ({
  previewImage,
  totalVehicles,
  counts,
  onDownload,
}: VideoResultsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gradient">Résultats du Suivi</h2>
        <Button
          onClick={onDownload}
          className="bg-success hover:bg-success/90 text-success-foreground shadow-glow-accent"
        >
          <Download className="mr-2 h-4 w-4" />
          Télécharger la Vidéo
        </Button>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border overflow-hidden animate-slide-up">
        <CardHeader>
          <CardTitle className="text-xl">Aperçu de la Vidéo Traitée</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <img
            src={previewImage}
            alt="Video preview"
            className="w-full h-auto object-contain"
          />
        </CardContent>
      </Card>

      <VehicleStats counts={counts} totalVehicles={totalVehicles} />
    </div>
  );
};
