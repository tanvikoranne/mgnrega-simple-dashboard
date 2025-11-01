import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/language-context";
import { BottomNav } from "@/components/BottomNav";
import { OfflineBanner } from "@/components/OfflineBanner";
import { DistrictSelector } from "@/components/DistrictSelector";
import { LanguageToggle } from "@/components/LanguageToggle";
import NotFound from "@/pages/not-found";
import { Dashboard } from "@/pages/Dashboard";
import { Trends } from "@/pages/Trends";
import { Compare } from "@/pages/Compare";
import { Alerts } from "@/pages/Alerts";
import { Reports } from "@/pages/Reports";

function Router() {
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(() => {
    const saved = localStorage.getItem("mgnrega-selected-district");
    return saved ? parseInt(saved) : null;
  });

  useEffect(() => {
    if (selectedDistrictId) {
      localStorage.setItem("mgnrega-selected-district", selectedDistrictId.toString());
      localStorage.setItem("mgnrega-last-update", new Date().toISOString());
    }
  }, [selectedDistrictId]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <h1 className="text-xl font-bold text-primary hidden md:block">
              MGNREGA Maharashtra
            </h1>
            <h1 className="text-lg font-bold text-primary md:hidden">
              MGNREGA MH
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <DistrictSelector
              selectedDistrictId={selectedDistrictId}
              onSelectDistrict={setSelectedDistrictId}
            />
            <LanguageToggle />
          </div>
        </div>
      </header>

      <OfflineBanner />

      <main className="flex-1 bg-background">
        {selectedDistrictId ? (
          <Switch>
            <Route path="/">
              <Dashboard districtId={selectedDistrictId} />
            </Route>
            <Route path="/trends">
              <Trends districtId={selectedDistrictId} />
            </Route>
            <Route path="/compare">
              <Compare districtId={selectedDistrictId} />
            </Route>
            <Route path="/alerts">
              <Alerts districtId={selectedDistrictId} />
            </Route>
            <Route path="/reports">
              <Reports districtId={selectedDistrictId} />
            </Route>
            <Route component={NotFound} />
          </Switch>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh] p-4">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold mb-3">Welcome to MGNREGA Dashboard</h2>
              <p className="text-muted-foreground mb-6">
                Please select a district to view performance metrics and insights
              </p>
              <p className="text-sm text-muted-foreground">
                महाराष्ट्र मनरेगा डॅशबोर्डमध्ये आपले स्वागत आहे
              </p>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Router />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
