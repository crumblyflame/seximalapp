import { Button } from "@/components/ui/button";
import { Dimension } from "@/lib/conversions";
import { useEffect, useRef } from "react";

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
  const radiogroupRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let newIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        newIndex = (currentIndex + 1) % dimensions.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        newIndex = currentIndex === 0 ? dimensions.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = dimensions.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onDimensionChange(dimensions[currentIndex].key);
        return;
      default:
        return;
    }
    
    const newDimension = dimensions[newIndex];
    onDimensionChange(newDimension.key);
    
    // Focus the new radio button
    setTimeout(() => {
      const newRadio = radiogroupRef.current?.querySelector(`[data-testid="tab-${newDimension.key}"]`) as HTMLButtonElement;
      newRadio?.focus();
    }, 0);
  };

  return (
    <div className="mb-6">
      <div className="bg-card rounded-lg p-2 shadow-sm border border-border">
        <div 
          ref={radiogroupRef}
          className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-1 overflow-x-auto"
          role="radiogroup"
          aria-label="Select measurement dimension"
        >
          {dimensions.map((dimension, index) => {
            const isActive = activeDimension === dimension.key;
            return (
              <Button
                key={dimension.key}
                data-testid={`tab-${dimension.key}`}
                variant={isActive ? "default" : "ghost"}
                size="default"
                role="radio"
                aria-checked={isActive}
                tabIndex={isActive ? 0 : -1}
                className={`h-11 min-h-[44px] px-3 py-2 text-sm font-medium rounded-md transition-colors touch-manipulation whitespace-nowrap flex-shrink-0 sm:flex-shrink ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground"
                }`}
                onClick={() => onDimensionChange(dimension.key)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                {dimension.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
