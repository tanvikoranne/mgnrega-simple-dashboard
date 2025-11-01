import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/language-context";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, TrendingDown, Clock, Info } from "lucide-react";
import type { Alert } from "@shared/schema";

interface AlertsProps {
  districtId: number;
}

export function Alerts({ districtId }: AlertsProps) {
  const { language, t } = useLanguage();

  const { data: alerts = [], isLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts", districtId],
    enabled: !!districtId,
  });

  if (isLoading) {
    return (
      <div className="p-4 pb-20 md:pb-4 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] rounded-xl" />
        ))}
      </div>
    );
  }

  const activeAlerts = alerts.filter(alert => alert.isActive === 1);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "wage_delay":
        return Clock;
      case "performance_drop":
        return TrendingDown;
      case "info":
        return Info;
      default:
        return AlertTriangle;
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-l-4 border-l-destructive bg-destructive/5";
      case "warning":
        return "border-l-4 border-l-warning bg-warning/5";
      case "info":
        return "border-l-4 border-l-info bg-info/5";
      default:
        return "border-l-4 border-l-muted";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-destructive";
      case "warning":
        return "text-warning";
      case "info":
        return "text-info";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {t("Alerts & Notifications", "सूचना आणि अलर्ट")}
        </h2>
        <p className="text-muted-foreground">
          {t("Important updates and irregularities detected", "आढळलेल्या महत्वाच्या अपडेट्स आणि अनियमितता")}
        </p>
      </div>

      {activeAlerts.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <Info className="w-16 h-16 mx-auto text-success mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-success">
              {t("All Clear!", "सर्व ठीक आहे!")}
            </h3>
            <p className="text-muted-foreground">
              {t("No active alerts for this district", "या जिल्ह्यासाठी कोणतेही सक्रिय अलर्ट नाहीत")}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {activeAlerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            const title = language === "en" ? alert.title : alert.titleMarathi;
            const description = language === "en" ? alert.description : alert.descriptionMarathi;

            return (
              <Card
                key={alert.id}
                className={`p-4 ${getSeverityStyles(alert.severity)}`}
                data-testid={`alert-${alert.id}`}
              >
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 ${getSeverityColor(alert.severity)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{description}</p>
                    {alert.affectedMetric && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">
                          {t("Affected Metric:", "प्रभावित मेट्रिक:")}
                        </span>
                        <span className="font-medium">{alert.affectedMetric}</span>
                        {alert.value && (
                          <span className={getSeverityColor(alert.severity)}>
                            {alert.value}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="mt-2 text-xs text-muted-foreground">
                      {new Date(alert.createdAt).toLocaleDateString(language === "en" ? "en-IN" : "mr-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
