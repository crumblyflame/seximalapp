import { Button } from "@/components/ui/button";

interface MainNavigationProps {
  activeTab: "units" | "clock" | "calendar" | "timer";
  onTabChange: (tab: "units" | "clock" | "calendar" | "timer") => void;
}

export function MainNavigation({ activeTab, onTabChange }: MainNavigationProps) {
  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-14">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={activeTab === "units" ? "default" : "ghost"}
              size="sm"
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "units"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => onTabChange("units")}
            >
              Units
            </Button>
            <Button
              variant={activeTab === "clock" ? "default" : "ghost"}
              size="sm"
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "clock"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => onTabChange("clock")}
            >
              Clock
            </Button>
            <Button
              variant={activeTab === "calendar" ? "default" : "ghost"}
              size="sm"
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "calendar"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => onTabChange("calendar")}
            >
              Calendar
            </Button>
            <Button
              variant={activeTab === "timer" ? "default" : "ghost"}
              size="sm"
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "timer"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => onTabChange("timer")}
            >
              Timer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
