import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Detection {
  class_name: string;
  confidence: number;
  bbox: number[];
  tracker_id?: number;
}

interface DetectionResultsProps {
  detections: Detection[];
  processedImage: string;
}

export const DetectionResults = ({
  detections,
  processedImage,
}: DetectionResultsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
      <Card className="bg-card/80 backdrop-blur-sm border-border overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl">Image Traitée</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <img
            src={processedImage}
            alt="Processed"
            className="w-full h-auto object-contain"
          />
        </CardContent>
      </Card>

      {detections.length > 0 && (
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="text-xl flex items-center justify-between">
              Détections
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {detections.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Classe</TableHead>
                    <TableHead>Confiance</TableHead>
                    <TableHead>ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detections.map((det, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium capitalize">
                        {det.class_name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={det.confidence > 0.8 ? "default" : "secondary"}
                          className={
                            det.confidence > 0.8
                              ? "bg-success text-success-foreground"
                              : ""
                          }
                        >
                          {(det.confidence * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {det.tracker_id || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
