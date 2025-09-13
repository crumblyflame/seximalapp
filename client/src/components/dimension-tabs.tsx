import { Button } from "@/components/ui/button";
import { Dimension } from "@/lib/conversions";

interface DimensionTabsProps {
  activeDimension: Dimension;
  onDimensionChange: (dimension: Dimension) => void;
}

const dimensions: { key: Dimension; label: string }[] = [
  { key: "length", label: "Length" },
  { key: "mass", label: "Mass" },
  { key: "area", label: "Area" },
  { key: "volume", label: "Volume" },
  { key: "temperature", label: "Temp" },
  { key: "pressure", label: "Pressure" },
  { key: "time", label: "Time" },
  { key: "speed", label: "Speed" },
  { key: "acceleration", label: "Accel" },
  { key: "force", label: "Force" },
  { key: "energy", label: "Energy" },
  { key: "frequency", label: "Freq" },
  { key: "power", label: "Power" },
];

export function DimensionTabs({ activeDimension, onDimensionChange }: DimensionTabsProps) {
  return (
    <div className="mb-6">
      <div className="bg-card rounded-lg p-2 shadow-sm border border-border">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-13 gap-1">
          {dimensions.map((dimension) => (
            <Button
              key={dimension.key}
              data-testid={`tab-${dimension.key}`}
              variant={activeDimension === dimension.key ? "default" : "ghost"}
              size="sm"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeDimension === dimension.key
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              }`}
              onClick={() => onDimensionChange(dimension.key)}
            >
              {dimension.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
