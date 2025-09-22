import { useState, useEffect, useRef } from "react";
import { DimensionTabs } from "@/components/dimension-tabs";
import { ConversionCard } from "@/components/conversion-card";
import { ConversionHistory, ConversionRecord } from "@/components/conversion-history";
import { SeximalReference } from "@/components/seximal-reference";
import { Button } from "@/components/ui/button";
import { Copy, Share, Trash2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dimension, 
  SystemType, 
  unitDefinitions, 
  convertBetweenUnits,
  formatNumber 
} from "@/lib/conversions";
import { seximalToDecimal, decimalToSeximal, isValidSeximal } from "@/lib/seximal";

interface ConversionState {
  dimension: Dimension;
  selectedUnits: Record<SystemType, string>;
  values: Record<SystemType, string>;
  activeSystem: SystemType | null;
}

export default function Converter() {
  const { toast } = useToast();
  const [state, setState] = useState<ConversionState>({
    dimension: "length",
    selectedUnits: {
      si: "m",
      us: "ft", 
      seximal: "tumbo"
    },
    values: {
      si: "",
      us: "",
      seximal: ""
    },
    activeSystem: null
  });

  const [history, setHistory] = useState<ConversionRecord[]>([]);
  const isReloadingFromHistory = useRef(false);

  // Load initial units for each dimension
  useEffect(() => {
    // Skip clearing during history reload to prevent nullifying the reload
    if (isReloadingFromHistory.current) {
      isReloadingFromHistory.current = false;
      return;
    }

    const siUnits = unitDefinitions[state.dimension].si;
    const usUnits = unitDefinitions[state.dimension].us;
    const seximalUnits = unitDefinitions[state.dimension].seximal;

    // Define default units for each system and dimension
    const getDefaultUnit = (system: SystemType, dimension: Dimension): string => {
      if (system === "si") {
        // Base SI units (no prefix)
        const baseUnits: Record<Dimension, string> = {
          length: "m",
          mass: "kg", 
          area: "m²",
          volume: "L",
          temperature: "°C",
          pressure: "Pa",
          time: "s",
          speed: "m/s",
          acceleration: "m/s²",
          force: "N",
          energy: "J",
          frequency: "Hz",
          power: "W"
        };
        return baseUnits[dimension] || siUnits[0]?.key || "";
      } else if (system === "seximal") {
        // Base seximal units (no prefix)
        const baseUnits: Record<Dimension, string> = {
          length: "tumbo",
          mass: "mazo",
          area: "surfao", 
          volume: "voluo",
          temperature: "grado",
          pressure: "premuo",
          time: "tujo",
          speed: "pido",
          acceleration: "gravito",
          force: "forso",
          energy: "nergo",
          frequency: "freko",
          power: "paŭo"
        };
        return baseUnits[dimension] || seximalUnits[0]?.key || "";
      } else if (system === "us") {
        // Common US Customary units similar to base SI
        const commonUnits: Record<Dimension, string> = {
          length: "in",
          mass: "oz",
          area: "in²",
          volume: "fl oz", 
          temperature: "°F",
          pressure: "psi",
          time: "s",
          speed: "mph",
          acceleration: "ft/s²",
          force: "lbf",
          energy: "BTU",
          frequency: "Hz",
          power: "hp"
        };
        return commonUnits[dimension] || usUnits[0]?.key || "";
      }
      return "";
    };

    setState(prev => ({
      ...prev,
      selectedUnits: {
        si: getDefaultUnit("si", state.dimension),
        us: getDefaultUnit("us", state.dimension),
        seximal: getDefaultUnit("seximal", state.dimension)
      },
      values: {
        si: "",
        us: "",
        seximal: ""
      },
      activeSystem: null
    }));
  }, [state.dimension]);

  const handleDimensionChange = (dimension: Dimension) => {
    setState(prev => ({ ...prev, dimension }));
  };

  const handleUnitChange = (system: SystemType, unit: string) => {
    const newSelectedUnits = {
      ...state.selectedUnits,
      [system]: unit
    };
    
    setState(prev => ({
      ...prev,
      selectedUnits: newSelectedUnits
    }));

    // Trigger reconversion if there's an active value
    // Pass the new selectedUnits to avoid stale state issues
    if (state.activeSystem && state.values[state.activeSystem]) {
      performConversion(state.activeSystem, state.values[state.activeSystem], newSelectedUnits);
    }
  };

  const performConversion = (sourceSystem: SystemType, sourceValue: string, customSelectedUnits?: Record<SystemType, string>) => {
    if (!sourceValue || sourceValue === "") {
      setState(prev => ({
        ...prev,
        values: { si: "", us: "", seximal: "" },
        activeSystem: sourceSystem
      }));
      return;
    }

    // Use custom units if provided, otherwise use current state
    const currentSelectedUnits = customSelectedUnits || state.selectedUnits;
    const units = unitDefinitions[state.dimension];
    const sourceUnit = units[sourceSystem].find(u => u.key === currentSelectedUnits[sourceSystem]);
    
    if (!sourceUnit) return;

    let numericSourceValue: number;

    // Handle seximal input
    if (sourceSystem === "seximal") {
      if (!isValidSeximal(sourceValue)) return;
      try {
        numericSourceValue = seximalToDecimal(sourceValue);
      } catch {
        return;
      }
    } else {
      numericSourceValue = parseFloat(sourceValue);
      if (isNaN(numericSourceValue)) return;
    }

    const newValues: Record<SystemType, string> = { si: "", us: "", seximal: "" };

    // Convert to other systems
    (["si", "us", "seximal"] as SystemType[]).forEach(targetSystem => {
      if (targetSystem === sourceSystem) {
        newValues[targetSystem] = sourceValue;
        return;
      }

      const targetUnit = units[targetSystem].find(u => u.key === currentSelectedUnits[targetSystem]);
      if (!targetUnit) return;

      const convertedValue = convertBetweenUnits(
        numericSourceValue,
        sourceUnit,
        targetUnit,
        state.dimension
      );

      if (targetSystem === "seximal") {
        newValues[targetSystem] = decimalToSeximal(convertedValue);
      } else {
        newValues[targetSystem] = formatNumber(convertedValue);
      }
    });

    setState(prev => ({
      ...prev,
      values: newValues,
      activeSystem: sourceSystem
    }));

    // Add to history - use custom units if provided
    addToHistory(newValues, customSelectedUnits, sourceSystem);
  };

  const addToHistory = (values: Record<SystemType, string>, customSelectedUnits?: Record<SystemType, string>, activeSystem?: SystemType) => {
    const units = unitDefinitions[state.dimension];
    const currentSelectedUnits = customSelectedUnits || state.selectedUnits;
    const record: ConversionRecord = {
      id: Date.now().toString(),
      dimension: state.dimension,
      si: {
        value: values.si,
        unit: units.si.find(u => u.key === currentSelectedUnits.si)?.symbol || "",
        unitKey: currentSelectedUnits.si
      },
      us: {
        value: values.us,
        unit: units.us.find(u => u.key === currentSelectedUnits.us)?.symbol || "",
        unitKey: currentSelectedUnits.us
      },
      seximal: {
        value: values.seximal,
        unit: units.seximal.find(u => u.key === currentSelectedUnits.seximal)?.symbol || "",
        unitKey: currentSelectedUnits.seximal
      },
      activeSystem: activeSystem || state.activeSystem || "si",
      timestamp: new Date()
    };

    setHistory(prev => [record, ...prev.slice(0, 9)]); // Keep last 10 records
  };

  const handleValueChange = (system: SystemType, value: string) => {
    performConversion(system, value);
  };

  const handleHistoryReload = (record: ConversionRecord) => {
    // Set flag to prevent dimension useEffect from clearing values
    isReloadingFromHistory.current = true;
    
    setState(prev => ({
      ...prev,
      dimension: record.dimension,
      selectedUnits: {
        si: record.si.unitKey,
        us: record.us.unitKey,
        seximal: record.seximal.unitKey
      },
      values: {
        si: record.si.value,
        us: record.us.value,
        seximal: record.seximal.value
      },
      activeSystem: record.activeSystem
    }));

    toast({
      title: "Conversion Reloaded",
      description: "The conversion has been restored from history.",
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "All conversion history has been cleared.",
    });
  };

  const handleCopyResults = async () => {
    const units = unitDefinitions[state.dimension];
    const siUnit = units.si.find(u => u.key === state.selectedUnits.si)?.symbol || "";
    const usUnit = units.us.find(u => u.key === state.selectedUnits.us)?.symbol || "";
    const seximalUnit = units.seximal.find(u => u.key === state.selectedUnits.seximal)?.symbol || "";

    const text = `${state.values.si} ${siUnit} = ${state.values.us} ${usUnit} = ${state.values.seximal}₆ ${seximalUnit}`;
    
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to Clipboard",
        description: "Conversion results have been copied.",
      });
    } catch {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    const units = unitDefinitions[state.dimension];
    const siUnit = units.si.find(u => u.key === state.selectedUnits.si)?.symbol || "";
    const usUnit = units.us.find(u => u.key === state.selectedUnits.us)?.symbol || "";
    const seximalUnit = units.seximal.find(u => u.key === state.selectedUnits.seximal)?.symbol || "";

    const text = `Universal Converter: ${state.values.si} ${siUnit} = ${state.values.us} ${usUnit} = ${state.values.seximal}₆ ${seximalUnit}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // Fallback to clipboard
        handleCopyResults();
      }
    } else {
      handleCopyResults();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-foreground">Universal Converter</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="default"
                className="h-11 min-h-[44px] w-11 min-w-[44px] rounded-lg hover:bg-muted transition-colors touch-manipulation"
                data-testid="button-settings"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-6">
        {/* Dimension Tabs */}
        <div className="mb-4 sm:mb-6">
          <DimensionTabs
            activeDimension={state.dimension}
            onDimensionChange={handleDimensionChange}
          />
        </div>

        {/* Conversion Interface */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {(["si", "us", "seximal"] as SystemType[]).map((system) => (
            <ConversionCard
              key={system}
              system={system}
              dimension={state.dimension}
              units={unitDefinitions[state.dimension][system]}
              selectedUnit={state.selectedUnits[system]}
              value={state.values[system]}
              onUnitChange={(unit) => handleUnitChange(system, unit)}
              onValueChange={(value) => handleValueChange(system, value)}
              isActive={state.activeSystem === system}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mb-4 sm:mb-8">
          <Button
            onClick={handleCopyResults}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 h-9 sm:h-11 min-h-[36px] sm:min-h-[44px] bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium touch-manipulation text-sm"
            disabled={!state.values.si && !state.values.us && !state.values.seximal}
            data-testid="button-copy-results"
          >
            <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Copy Results</span>
            <span className="sm:hidden">Copy</span>
          </Button>
          <Button
            onClick={handleShare}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 h-9 sm:h-11 min-h-[36px] sm:min-h-[44px] bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium touch-manipulation text-sm"
            disabled={!state.values.si && !state.values.us && !state.values.seximal}
            data-testid="button-share"
          >
            <Share className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Share Conversion</span>
            <span className="sm:hidden">Share</span>
          </Button>
          <Button
            onClick={handleClearHistory}
            variant="outline"
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 h-9 sm:h-11 min-h-[36px] sm:min-h-[44px] rounded-lg transition-colors font-medium touch-manipulation text-sm"
            disabled={history.length === 0}
            data-testid="button-clear-all"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Clear History</span>
            <span className="sm:hidden">Clear</span>
          </Button>
        </div>

        {/* Conversion History - Hidden on mobile to save space */}
        <div className="mb-8 hidden sm:block">
          <ConversionHistory
            history={history}
            onReload={handleHistoryReload}
            onClear={handleClearHistory}
          />
        </div>

        {/* Seximal Reference - Hidden on mobile to save space */}
        <div className="hidden sm:block">
          <SeximalReference />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Universal Converter supports SI Metric, US Customary, and Seximal measurement systems
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              Precision calculations • Real-time conversion • Mobile optimized
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
