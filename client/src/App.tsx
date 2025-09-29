import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainNavigation } from "@/components/main-navigation";
import Converter from "@/pages/converter";
import Clock from "@/pages/clock";
import Calendar from "@/pages/calendar";

function App() {
  const [activeTab, setActiveTab] = useState<"units" | "clock" | "calendar">("units");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {/* Header removed */}

          {/* Main Navigation */}
          <MainNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Content */}
          {activeTab === "units" ? <Converter /> : activeTab === "clock" ? <Clock /> : <Calendar />}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
