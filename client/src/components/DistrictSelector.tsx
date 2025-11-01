import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Navigation, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/lib/language-context";
import type { District } from "@shared/schema";

interface DistrictSelectorProps {
  selectedDistrictId: number | null;
  onSelectDistrict: (districtId: number) => void;
}

export function DistrictSelector({ selectedDistrictId, onSelectDistrict }: DistrictSelectorProps) {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isGeolocating, setIsGeolocating] = useState(false);

  const { data: districts = [] } = useQuery<District[]>({
    queryKey: ["/api/districts"],
  });

  const selectedDistrict = districts.find(d => d.id === selectedDistrictId);

  const filteredDistricts = districts.filter(district => {
    const searchLower = search.toLowerCase();
    return (
      district.name.toLowerCase().includes(searchLower) ||
      district.nameMarathi.includes(search) ||
      district.code.toLowerCase().includes(searchLower)
    );
  });

  const handleAutoDetect = () => {
    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        const nearest = districts.reduce((prev, curr) => {
          const prevLat = parseFloat(prev.latitude || "0");
          const prevLon = parseFloat(prev.longitude || "0");
          const currLat = parseFloat(curr.latitude || "0");
          const currLon = parseFloat(curr.longitude || "0");

          const prevDist = Math.sqrt(
            Math.pow(prevLat - latitude, 2) + Math.pow(prevLon - longitude, 2)
          );
          const currDist = Math.sqrt(
            Math.pow(currLat - latitude, 2) + Math.pow(currLon - longitude, 2)
          );

          return currDist < prevDist ? curr : prev;
        });

        if (nearest) {
          onSelectDistrict(nearest.id);
          setOpen(false);
        }
        setIsGeolocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsGeolocating(false);
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="min-h-14 justify-start gap-3 px-4 w-full md:w-auto md:min-w-[300px]"
          data-testid="button-select-district"
        >
          <MapPin className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1 text-left">
            {selectedDistrict ? (
              <div className="font-semibold">
                {language === "en" ? selectedDistrict.name : selectedDistrict.nameMarathi}
              </div>
            ) : (
              <div className="text-muted-foreground">
                {t("Select District", "जिल्हा निवडा")}
              </div>
            )}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("Select District", "जिल्हा निवडा")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("Search district...", "जिल्हा शोधा...")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-testid="input-search-district"
              />
            </div>
            <Button
              onClick={handleAutoDetect}
              disabled={isGeolocating}
              size="icon"
              variant="outline"
              data-testid="button-auto-detect"
            >
              <Navigation className={`w-4 h-4 ${isGeolocating ? "animate-spin" : ""}`} />
            </Button>
          </div>
          <div className="max-h-[400px] overflow-y-auto space-y-1">
            {filteredDistricts.map((district) => (
              <button
                key={district.id}
                onClick={() => {
                  onSelectDistrict(district.id);
                  setOpen(false);
                }}
                className={`w-full text-left p-3 rounded-lg hover-elevate active-elevate-2 ${
                  district.id === selectedDistrictId ? "bg-primary/10" : ""
                }`}
                data-testid={`district-${district.code}`}
              >
                <div className="font-medium">
                  {language === "en" ? district.name : district.nameMarathi}
                </div>
                <div className="text-sm text-muted-foreground">{district.code}</div>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
