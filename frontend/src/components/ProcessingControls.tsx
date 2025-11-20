import { Button } from "@/components/ui/button";
import { Scan, Activity, Loader2 } from "lucide-react";

interface ProcessingControlsProps {
  onProcessImage: () => void;
  onTrackVideo: () => void;
  disabled: boolean;
  loading: boolean;
}

export const ProcessingControls = ({
  onProcessImage,
  onTrackVideo,
  disabled,
  loading,
}: ProcessingControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <Button
        onClick={onProcessImage}
        disabled={disabled || loading}
        className="flex-1 bg-gradient-primary hover:opacity-90 transition-all duration-300 h-14 text-base font-semibold shadow-glow-primary disabled:opacity-50 disabled:shadow-none"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Traitement...
          </>
        ) : (
          <>
            <Scan className="mr-2 h-5 w-5" />
            Détecter les Véhicules
          </>
        )}
      </Button>

      <Button
        onClick={onTrackVideo}
        disabled={disabled || loading}
        className="flex-1 bg-gradient-accent hover:opacity-90 transition-all duration-300 h-14 text-base font-semibold shadow-glow-accent disabled:opacity-50 disabled:shadow-none"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Suivi en cours...
          </>
        ) : (
          <>
            <Activity className="mr-2 h-5 w-5" />
            Suivre & Compter
          </>
        )}
      </Button>
    </div>
  );
};
