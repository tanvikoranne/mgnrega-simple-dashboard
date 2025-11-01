import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/language-context";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { MonthlyPerformance } from "@shared/schema";

interface TrendsProps {
  districtId: number;
}

export function Trends({ districtId }: TrendsProps) {
  const { t } = useLanguage();

  const { data: performanceHistory = [], isLoading } = useQuery<MonthlyPerformance[]>({
    queryKey: ["/api/districts", districtId, "trends"],
    enabled: !!districtId,
  });

  if (isLoading) {
    return (
      <div className="p-4 pb-20 md:pb-4 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[300px] rounded-xl" />
        ))}
      </div>
    );
  }

  const metrics = [
    { key: "workersEmployed", label: "Workers Employed", labelMarathi: "कार्यरत कामगार" },
    { key: "personDaysGenerated", label: "Person-Days", labelMarathi: "व्यक्ती-दिन" },
    { key: "wagesPaid", label: "Wages Paid", labelMarathi: "वेतन दिले", isCurrency: true },
    { key: "assetsCreated", label: "Assets Created", labelMarathi: "मालमत्ता निर्माण" },
  ];

  const getMonthLabel = (month: string) => {
    const [year, monthNum] = month.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames[parseInt(monthNum) - 1];
  };

  const getTrend = (current: number, previous: number): "up" | "down" | "stable" => {
    const change = ((current - previous) / previous) * 100;
    if (change > 5) return "up";
    if (change < -5) return "down";
    return "stable";
  };

  const getColorBand = (value: number, max: number): "green" | "yellow" | "red" => {
    const percentage = (value / max) * 100;
    if (percentage >= 70) return "green";
    if (percentage >= 40) return "yellow";
    return "red";
  };

  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {t("12-Month Trends", "12 महिन्यांचे ट्रेंड")}
        </h2>
        <p className="text-muted-foreground">
          {t("Historical performance over the last year", "मागील वर्षाचे ऐतिहासिक प्रदर्शन")}
        </p>
      </div>

      <div className="space-y-6">
        {metrics.map((metric) => {
          const maxValue = Math.max(
            ...performanceHistory.map(p => {
              const val = p[metric.key as keyof MonthlyPerformance];
              return typeof val === "string" ? parseFloat(val) : (val as number || 0);
            })
          );

          return (
            <Card key={metric.key} className="p-6" data-testid={`trend-${metric.key}`}>
              <h3 className="text-lg font-semibold mb-4">
                {t(metric.label, metric.labelMarathi)}
              </h3>

              <div className="overflow-x-auto">
                <div className="flex gap-2 min-w-max pb-4">
                  {performanceHistory.slice(-12).map((perf, index, arr) => {
                    const value = perf[metric.key as keyof MonthlyPerformance];
                    const numValue = typeof value === "string" ? parseFloat(value) : (value as number || 0);
                    const prevValue = index > 0 ? 
                      (() => {
                        const prev = arr[index - 1][metric.key as keyof MonthlyPerformance];
                        return typeof prev === "string" ? parseFloat(prev) : (prev as number || 0);
                      })() : numValue;
                    
                    const trend = index > 0 ? getTrend(numValue, prevValue) : "stable";
                    const colorBand = getColorBand(numValue, maxValue);
                    const heightPercentage = maxValue > 0 ? (numValue / maxValue) * 100 : 0;

                    const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

                    const colorClasses = {
                      green: "bg-success",
                      yellow: "bg-warning",
                      red: "bg-destructive",
                    };

                    return (
                      <div key={perf.month} className="flex flex-col items-center gap-2 w-16">
                        <div className="text-xs font-medium text-muted-foreground">
                          {getMonthLabel(perf.month)}
                        </div>
                        <div className="relative w-full h-40 bg-muted/30 rounded-md overflow-hidden">
                          <div
                            className={`absolute bottom-0 left-0 right-0 ${colorClasses[colorBand]} transition-all`}
                            style={{ height: `${heightPercentage}%` }}
                          />
                        </div>
                        <TrendIcon className={`w-4 h-4 ${
                          trend === "up" ? "text-success" :
                          trend === "down" ? "text-destructive" :
                          "text-muted-foreground"
                        }`} />
                        <div className="text-xs font-semibold">
                          {metric.isCurrency 
                            ? `₹${(numValue / 10000000).toFixed(1)}Cr`
                            : numValue.toLocaleString("en-IN")
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 pt-4 border-t text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span>{t("Excellent (70%+)", "उत्कृष्ट (70%+)")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span>{t("Moderate (40-70%)", "मध्यम (40-70%)")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span>{t("Needs Attention (<40%)", "लक्ष देणे आवश्यक (<40%)")}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
