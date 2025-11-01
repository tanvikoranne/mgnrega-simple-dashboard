import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ArrowRight, LucideIcon } from "lucide-react";
import { AudioHelp } from "./AudioHelp";
import { useLanguage } from "@/lib/language-context";

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  labelMarathi: string;
  value: string | number;
  trend?: "up" | "down" | "stable";
  trendPercentage?: number;
  colorBand: "green" | "yellow" | "red";
  explanation: string;
  explanationMarathi: string;
}

export function KPICard({
  icon: Icon,
  label,
  labelMarathi,
  value,
  trend,
  trendPercentage,
  colorBand,
  explanation,
  explanationMarathi,
}: KPICardProps) {
  const { language } = useLanguage();

  const colorClasses = {
    green: "bg-success/10 text-success",
    yellow: "bg-warning/10 text-warning",
    red: "bg-destructive/10 text-destructive",
  };

  const trendColors = {
    up: "bg-success/15 text-success",
    down: "bg-destructive/15 text-destructive",
    stable: "bg-muted text-muted-foreground",
  };

  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : ArrowRight;

  return (
    <Card className="p-6 hover-elevate" data-testid={`card-kpi-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-full ${colorClasses[colorBand]}`}>
            <Icon className="w-8 h-8" />
          </div>
          <AudioHelp text={explanation} textMarathi={explanationMarathi} />
        </div>

        <div>
          <div className="text-5xl font-bold text-foreground mb-2" data-testid={`value-${label.toLowerCase().replace(/\s+/g, "-")}`}>
            {typeof value === "number" ? value.toLocaleString("en-IN") : value}
          </div>
          <div className="text-base font-medium text-muted-foreground">
            {language === "en" ? label : labelMarathi}
          </div>
        </div>

        {trend && trendPercentage !== undefined && (
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${trendColors[trend]}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-sm font-semibold">{Math.abs(trendPercentage).toFixed(1)}%</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {language === "en" ? "vs last month" : "मागील महिन्याशी"}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
