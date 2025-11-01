import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/language-context";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, TrendingDown, Target } from "lucide-react";
import type { ComparisonData } from "@shared/schema";

interface CompareProps {
  districtId: number;
}

export function Compare({ districtId }: CompareProps) {
  const { language, t } = useLanguage();

  const { data: comparison, isLoading } = useQuery<ComparisonData>({
    queryKey: ["/api/districts", districtId, "compare"],
    enabled: !!districtId,
  });

  if (isLoading) {
    return (
      <div className="p-4 pb-20 md:pb-4 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[200px] rounded-xl" />
        ))}
      </div>
    );
  }

  if (!comparison) {
    return null;
  }

  const metrics = [
    { key: "workersEmployed", label: "Workers Employed", labelMarathi: "कार्यरत कामगार" },
    { key: "personDaysGenerated", label: "Person-Days", labelMarathi: "व्यक्ती-दिन" },
    { key: "assetsCreated", label: "Assets Created", labelMarathi: "मालमत्ता निर्माण" },
  ];

  const getPercentage = (value: number, avgValue: number): number => {
    if (avgValue === 0) return 0;
    return ((value - avgValue) / avgValue) * 100;
  };

  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {t("District Comparison", "जिल्हा तुलना")}
        </h2>
        <p className="text-muted-foreground">
          {t("Compare with state average and other districts", "राज्य सरासरी आणि इतर जिल्ह्यांशी तुलना करा")}
        </p>
      </div>

      <div className="space-y-6">
        {metrics.map((metric) => {
          const currentValue = comparison.performance[metric.key as keyof typeof comparison.performance] as number || 0;
          const avgValue = comparison.stateAverage[metric.key as keyof typeof comparison.stateAverage] as number || 0;
          const percentage = getPercentage(currentValue, avgValue);

          return (
            <Card key={metric.key} className="p-6" data-testid={`compare-${metric.key}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                {t(metric.label, metric.labelMarathi)}
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {language === "en" ? comparison.district.name : comparison.district.nameMarathi}
                    </span>
                    <span className="text-2xl font-bold">{currentValue.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${Math.min(100, (currentValue / (avgValue * 1.5)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("State Average", "राज्य सरासरी")}
                    </span>
                    <span className="text-lg font-semibold text-muted-foreground">
                      {avgValue.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-muted-foreground/40 transition-all"
                      style={{ width: `${Math.min(100, (avgValue / (avgValue * 1.5)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${
                  percentage >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                }`}>
                  <span className="font-semibold">
                    {percentage >= 0 ? "+" : ""}{percentage.toFixed(1)}%
                  </span>
                  <span className="ml-2 text-sm">
                    {t("vs state average", "राज्य सरासरी विरुद्ध")}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-success" />
            {t("Top Performing Districts", "शीर्ष कामगिरी करणारे जिल्हे")}
          </h3>
          <div className="space-y-3">
            {comparison.topDistricts.map((item, index) => (
              <div
                key={item.district.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-success/5"
                data-testid={`top-district-${index + 1}`}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/20 text-success font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium">
                    {language === "en" ? item.district.name : item.district.nameMarathi}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.performance.workersEmployed.toLocaleString("en-IN")} {t("workers", "कामगार")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-destructive" />
            {t("Districts Needing Attention", "लक्ष देणे आवश्यक असलेले जिल्हे")}
          </h3>
          <div className="space-y-3">
            {comparison.bottomDistricts.map((item, index) => (
              <div
                key={item.district.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5"
                data-testid={`bottom-district-${index + 1}`}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive/20 text-destructive font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium">
                    {language === "en" ? item.district.name : item.district.nameMarathi}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.performance.workersEmployed.toLocaleString("en-IN")} {t("workers", "कामगार")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
