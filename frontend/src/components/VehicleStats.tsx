import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Truck, Bus, Bike } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleStatsProps {
  counts: Record<string, number>;
  totalVehicles: number;
}

const vehicleIcons: Record<string, any> = {
  car: Car,
  truck: Truck,
  bus: Bus,
  motorcycle: Bike,
  bicycle: Bike,
};

export const VehicleStats = ({ counts, totalVehicles }: VehicleStatsProps) => {
  return (
    <div className="space-y-6 animate-slide-up">
      <Card className="bg-gradient-primary border-0 shadow-glow-primary">
        <CardHeader>
          <CardTitle className="text-2xl text-primary-foreground">
            Total de Véhicules Détectés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-6xl font-bold text-primary-foreground">{totalVehicles}</p>
        </CardContent>
      </Card>

      {totalVehicles > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(counts).map(([vehicle, count], index) => {
            const Icon = vehicleIcons[vehicle.toLowerCase()] || Car;
            return (
              <Card
                key={vehicle}
                className={cn(
                  "bg-card/80 backdrop-blur-sm border-border hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-glow-primary",
                  "animate-slide-up"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg capitalize flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    {vehicle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-gradient">{count}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-card/50 border-muted">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground italic">
              Aucun véhicule détecté traversant la ligne
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
