import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainNavigation } from "@/components/main-navigation";
import Converter from "@/pages/converter";
import Clock from "@/pages/clock";

function App() {
  const [activeTab, setActiveTab] = useState<"units" | "clock">("units");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="bg-card border-b border-border sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <h1 className="text-xl font-semibold text-foreground">Universal Converter</h1>
              </div>
            </div>
          </header>

          {/* Main Navigation */}
          <MainNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Content */}
          {activeTab === "units" ? <Converter /> : <Clock />}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
