import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, RotateCcw } from "lucide-react";
import { Dimension } from "@/lib/conversions";

export interface ConversionRecord {
  id: string;
  dimension: Dimension;
  si: { value: string; unit: string; unitKey: string };
  us: { value: string; unit: string; unitKey: string };
  seximal: { value: string; unit: string; unitKey: string };
  activeSystem: 'si' | 'us' | 'seximal';
  timestamp: Date;
}

interface ConversionHistoryProps {
  history: ConversionRecord[];
  onReload: (record: ConversionRecord) => void;
  onClear: () => void;
}

export function ConversionHistory({ history, onReload, onClear }: ConversionHistoryProps) {
  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  const getDimensionDisplayName = (dimension: Dimension) => {
    const names: Record<Dimension, string> = {
      length: "Length",
      mass: "Mass", 
      area: "Area",
      volume: "Volume",
      temperature: "Temperature",
      pressure: "Pressure",
      time: "Time",
      speed: "Speed",
      acceleration: "Acceleration",
      force: "Force",
      energy: "Energy",
      frequency: "Frequency",
      power: "Power"
    };
    return names[dimension];
  };

  if (history.length === 0) {
    return (
      <Card className="shadow-lg border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            Recent Conversions
          </h3>
        </div>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No conversions yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start converting to see your history here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          Recent Conversions
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground h-11 min-h-[44px]"
          data-testid="button-clear-history"
        >
          Clear All
        </Button>
      </div>
      <CardContent className="p-6">
        <div className="space-y-3">
          {history.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
              data-testid={`history-item-${record.id}`}
            >
              <div className="flex-1">
                <div className="font-medium text-foreground">
                  {record.si.value} {record.si.unit} = {record.us.value} {record.us.unit} = {record.seximal.value}₆ {record.seximal.unit}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getDimensionDisplayName(record.dimension)} • {formatTimeAgo(record.timestamp)}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReload(record)}
                className="p-2 hover:bg-background rounded-lg transition-colors h-11 min-h-[44px]"
                data-testid={`button-reload-${record.id}`}
              >
                <RotateCcw className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
