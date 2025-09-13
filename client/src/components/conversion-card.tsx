import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SystemType, Unit, Dimension } from "@/lib/conversions";
import { decimalToSeximal, seximalToDecimal, isValidSeximal } from "@/lib/seximal";
import { Globe, Flag, Calculator } from "lucide-react";

interface ConversionCardProps {
  system: SystemType;
  dimension: Dimension;
  units: Unit[];
  selectedUnit: string;
  value: string;
  onUnitChange: (unit: string) => void;
  onValueChange: (value: string) => void;
  isActive: boolean;
}

const systemConfig = {
  si: {
    title: "SI Metric",
    subtitle: "International System",
    icon: Globe,
    headerClass: "bg-primary text-primary-foreground",
    testId: "si"
  },
  us: {
    title: "US Customary",
    subtitle: "Imperial System", 
    icon: Flag,
    headerClass: "bg-secondary text-secondary-foreground",
    testId: "us-customary"
  },
  seximal: {
    title: "Seximal (Base-6)",
    subtitle: "Alternative System",
    icon: Calculator,
    headerClass: "bg-accent text-accent-foreground",
    testId: "seximal"
  }
};

export function ConversionCard({
  system,
  dimension,
  units,
  selectedUnit,
  value,
  onUnitChange,
  onValueChange,
  isActive
}: ConversionCardProps) {
  const [inputValue, setInputValue] = useState(value);
  const config = systemConfig[system];
  const Icon = config.icon;

  const handleValueChange = (newValue: string) => {
    if (system === "seximal") {
      // Validate seximal input (digits 0-5 only)
      if (newValue === "" || isValidSeximal(newValue)) {
        setInputValue(newValue);
        onValueChange(newValue);
      }
    } else {
      setInputValue(newValue);
      onValueChange(newValue);
    }
  };

  const getConversionInfo = () => {
    const selectedUnitObj = units.find(u => u.key === selectedUnit);
    if (!selectedUnitObj) return "";

    if (system === "seximal") {
      const numericValue = value ? parseFloat(value) : 0;
      try {
        const seximalDisplay = decimalToSeximal(numericValue);
        return `${seximalDisplay}₆ = ${numericValue.toFixed(4)}₁₀ ${selectedUnitObj.symbol}`;
      } catch {
        return "Use digits 0-5 only";
      }
    } else {
      return `1 ${selectedUnitObj.symbol} base conversion`;
    }
  };

  return (
    <Card 
      className={`shadow-lg border border-border overflow-hidden ${
        isActive ? "ring-2 ring-ring" : ""
      }`}
      data-testid={`card-${config.testId}`}
    >
      <div className={`px-6 py-4 ${config.headerClass}`}>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {config.title}
        </h2>
        <p className="text-sm opacity-80">{config.subtitle}</p>
      </div>
      <CardContent className="p-6 space-y-4">
        {/* Unit Selector */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">Unit</Label>
          <Select value={selectedUnit} onValueChange={onUnitChange}>
            <SelectTrigger 
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground font-medium"
              data-testid={`select-unit-${config.testId}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem 
                  key={unit.key} 
                  value={unit.key}
                  data-testid={`option-${unit.key}`}
                >
                  {unit.name} ({unit.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Value Input */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">
            {system === "seximal" ? "Value (Base-6)" : "Value"}
          </Label>
          <Input
            type={system === "seximal" ? "text" : "number"}
            className="w-full p-4 border border-border rounded-lg bg-background text-foreground text-2xl font-bold text-center focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="0"
            value={inputValue}
            onChange={(e) => handleValueChange(e.target.value)}
            pattern={system === "seximal" ? "[0-5]*\\.?[0-5]*" : undefined}
            data-testid={`input-value-${config.testId}`}
          />
        </div>

        {/* Conversion Info */}
        <div className="bg-muted rounded-lg p-3">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {system === "seximal" ? "Base-6 Guide" : "Precision"}
          </div>
          <div className="text-sm font-medium" data-testid={`info-${config.testId}`}>
            {getConversionInfo()}
          </div>
        </div>

        {/* Seximal-specific decimal equivalent */}
        {system === "seximal" && value && (
          <div className="bg-accent/10 rounded-lg p-3">
            <div className="text-xs text-accent uppercase tracking-wide mb-1">Decimal Value</div>
            <div className="text-sm font-medium text-accent" data-testid="seximal-decimal">
              {(() => {
                try {
                  const decimal = seximalToDecimal(value);
                  return `${value}₆ = ${decimal.toFixed(4)}₁₀`;
                } catch {
                  return "Invalid base-6 number";
                }
              })()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
