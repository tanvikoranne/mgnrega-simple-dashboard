import { useLanguage } from "@/lib/language-context";
import { AlertCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

export function OfflineBanner() {
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setIsDismissed(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline || isDismissed) return null;

  const lastUpdate = localStorage.getItem("mgnrega-last-update");
  const date = lastUpdate ? new Date(lastUpdate).toLocaleDateString() : t("Unknown", "अज्ञात");

  return (
    <div className="bg-warning/10 border-b border-warning/20 px-4 py-3" data-testid="banner-offline">
      <div className="flex items-center justify-between max-w-7xl mx-auto gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
          <p className="text-sm font-medium text-foreground">
            {t(`Showing cached data from ${date}`, `${date} पासूनचा कॅश केलेला डेटा दाखवत आहे`)}
          </p>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 hover-elevate rounded"
          aria-label="Dismiss"
          data-testid="button-dismiss-offline"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
