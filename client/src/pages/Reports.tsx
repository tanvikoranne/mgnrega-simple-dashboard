import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/language-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, FileText } from "lucide-react";
import { useRef } from "react";
import type { District, MonthlyPerformance } from "@shared/schema";

interface ReportsProps {
  districtId: number;
}

export function Reports({ districtId }: ReportsProps) {
  const { language, t } = useLanguage();
  const reportRef = useRef<HTMLDivElement>(null);

  const { data: district } = useQuery<District>({
    queryKey: ["/api/districts", districtId],
    enabled: !!districtId,
  });

  const { data: performance } = useQuery<MonthlyPerformance>({
    queryKey: ["/api/districts", districtId, "performance"],
    enabled: !!districtId,
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = reportRef.current;
    if (!content) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>MGNREGA Report - ${district?.name || ""}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px; }
            .metric { margin: 15px 0; padding: 10px; background: #f3f4f6; border-radius: 5px; }
            .metric-label { font-weight: bold; color: #6b7280; }
            .metric-value { font-size: 24px; font-weight: bold; color: #111827; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!district || !performance) {
    return (
      <div className="p-4 pb-20 md:pb-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {t("Select a district to generate report", "अहवाल तयार करण्यासाठी एक जिल्हा निवडा")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {t("Performance Report", "प्रदर्शन अहवाल")}
        </h2>
        <p className="text-muted-foreground">
          {t("Download or print one-page summary for Gram Sabha", "ग्राम सभेसाठी एक पानाचा सारांश डाउनलोड किंवा प्रिंट करा")}
        </p>
      </div>

      <div className="flex gap-3 mb-6">
        <Button onClick={handleDownload} className="gap-2" data-testid="button-download-report">
          <Download className="w-4 h-4" />
          {t("Download", "डाउनलोड")}
        </Button>
        <Button onClick={handlePrint} variant="outline" className="gap-2" data-testid="button-print-report">
          <Printer className="w-4 h-4" />
          {t("Print", "प्रिंट")}
        </Button>
      </div>

      <Card className="p-8 max-w-4xl" ref={reportRef} data-testid="report-preview">
        <div className="space-y-6">
          <div className="text-center border-b pb-4">
            <h1 className="text-3xl font-bold text-primary mb-2">
              {t("MGNREGA Performance Report", "मनरेगा प्रदर्शन अहवाल")}
            </h1>
            <h2 className="text-xl font-semibold">
              {language === "en" ? district.name : district.nameMarathi}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {t("Month:", "महिना:")} {performance.month}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                {t("Workers Employed", "कार्यरत कामगार")}
              </div>
              <div className="text-3xl font-bold">
                {performance.workersEmployed.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                {t("Person-Days Generated", "व्यक्ती-दिन निर्माण")}
              </div>
              <div className="text-3xl font-bold">
                {performance.personDaysGenerated.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                {t("Wages Paid", "वेतन दिले")}
              </div>
              <div className="text-3xl font-bold">
                ₹{(parseFloat(performance.wagesPaid) / 10000000).toFixed(2)}Cr
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                {t("Assets Created", "मालमत्ता निर्माण")}
              </div>
              <div className="text-3xl font-bold">
                {performance.assetsCreated.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                {t("Work Completion Rate", "काम पूर्णता दर")}
              </div>
              <div className="text-3xl font-bold">
                {parseFloat(performance.workCompletionRate).toFixed(1)}%
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                {t("Active Job Cards", "सक्रिय जॉब कार्ड")}
              </div>
              <div className="text-3xl font-bold">
                {performance.activeJobCards.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-6 text-xs text-muted-foreground text-center">
            {t("Generated on", "तयार केले")} {new Date().toLocaleDateString(language === "en" ? "en-IN" : "mr-IN")}
          </div>
        </div>
      </Card>
    </div>
  );
}
