import { useQuery } from "@tanstack/react-query";
import { Users, Clock, IndianRupee, Building2, CheckCircle2, CreditCard } from "lucide-react";
import { KPICard } from "@/components/KPICard";
import { useLanguage } from "@/lib/language-context";
import { Skeleton } from "@/components/ui/skeleton";
import type { MonthlyPerformance } from "@shared/schema";

interface DashboardProps {
  districtId: number;
}

export function Dashboard({ districtId }: DashboardProps) {
  const { t } = useLanguage();

  const { data: performance, isLoading } = useQuery<MonthlyPerformance>({
    queryKey: ["/api/districts", districtId, "performance"],
    enabled: !!districtId,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 pb-20 md:pb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[240px] rounded-xl" />
        ))}
      </div>
    );
  }

  if (!performance) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <div className="text-center">
          <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {t("No Data Available", "डेटा उपलब्ध नाही")}
          </h3>
          <p className="text-muted-foreground">
            {t("Please select a district to view performance metrics", "कृपया प्रदर्शन मेट्रिक्स पाहण्यासाठी एक जिल्हा निवडा")}
          </p>
        </div>
      </div>
    );
  }

  const getColorBand = (value: number, thresholds: { green: number; yellow: number }): "green" | "yellow" | "red" => {
    if (value >= thresholds.green) return "green";
    if (value >= thresholds.yellow) return "yellow";
    return "red";
  };

  const kpis = [
    {
      icon: Users,
      label: "Workers Employed",
      labelMarathi: "कार्यरत कामगार",
      value: performance.workersEmployed,
      trend: "up" as const,
      trendPercentage: 8.5,
      colorBand: getColorBand(performance.workersEmployed, { green: 50000, yellow: 30000 }),
      explanation: "Total number of workers who received employment under MGNREGA this month",
      explanationMarathi: "या महिन्यात मनरेगा अंतर्गत रोजगार मिळालेल्या एकूण कामगारांची संख्या",
    },
    {
      icon: Clock,
      label: "Person-Days Generated",
      labelMarathi: "व्यक्ती-दिन निर्माण",
      value: performance.personDaysGenerated,
      trend: "up" as const,
      trendPercentage: 12.3,
      colorBand: getColorBand(performance.personDaysGenerated, { green: 500000, yellow: 300000 }),
      explanation: "Total person-days of employment created in the district",
      explanationMarathi: "जिल्ह्यात निर्माण केलेल्या रोजगाराचे एकूण व्यक्ती-दिन",
    },
    {
      icon: IndianRupee,
      label: "Wages Paid",
      labelMarathi: "वेतन दिले",
      value: `₹${(parseFloat(performance.wagesPaid) / 10000000).toFixed(2)}Cr`,
      trend: "up" as const,
      trendPercentage: 15.7,
      colorBand: getColorBand(parseFloat(performance.wagesPaid), { green: 50000000, yellow: 30000000 }),
      explanation: "Total wages paid to workers this month in crores of rupees",
      explanationMarathi: "या महिन्यात कामगारांना दिलेले एकूण वेतन कोटी रुपयांमध्ये",
    },
    {
      icon: Building2,
      label: "Assets Created",
      labelMarathi: "मालमत्ता निर्माण",
      value: performance.assetsCreated,
      trend: "stable" as const,
      trendPercentage: 2.1,
      colorBand: getColorBand(performance.assetsCreated, { green: 500, yellow: 300 }),
      explanation: "Number of durable assets like roads, wells, and ponds created",
      explanationMarathi: "रस्ते, विहिरी आणि तलाव यांसारख्या टिकाऊ मालमत्तेची संख्या",
    },
    {
      icon: CheckCircle2,
      label: "Work Completion Rate",
      labelMarathi: "काम पूर्णता दर",
      value: `${parseFloat(performance.workCompletionRate).toFixed(1)}%`,
      trend: "down" as const,
      trendPercentage: -5.2,
      colorBand: getColorBand(parseFloat(performance.workCompletionRate), { green: 80, yellow: 60 }),
      explanation: "Percentage of works completed out of total works started",
      explanationMarathi: "सुरू केलेल्या एकूण कामांपैकी पूर्ण झालेल्या कामांची टक्केवारी",
    },
    {
      icon: CreditCard,
      label: "Active Job Cards",
      labelMarathi: "सक्रिय जॉब कार्ड",
      value: performance.activeJobCards,
      trend: "up" as const,
      trendPercentage: 6.8,
      colorBand: getColorBand(performance.activeJobCards, { green: 80000, yellow: 50000 }),
      explanation: "Number of active job cards registered in the district",
      explanationMarathi: "जिल्ह्यात नोंदणीकृत सक्रिय जॉब कार्डांची संख्या",
    },
  ];

  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {t("Performance Dashboard", "प्रदर्शन डॅशबोर्ड")}
        </h2>
        <p className="text-muted-foreground">
          {t("Current month performance metrics", "चालू महिन्याचे प्रदर्शन मेट्रिक्स")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>
    </div>
  );
}
