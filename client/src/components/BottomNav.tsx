import { useLocation, useRouter } from "wouter";
import { BarChart3, TrendingUp, ArrowLeftRight, Bell, FileDown } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const navItems = [
  { path: "/", icon: BarChart3, labelEn: "Dashboard", labelMr: "डॅशबोर्ड" },
  { path: "/trends", icon: TrendingUp, labelEn: "Trends", labelMr: "ट्रेंड" },
  { path: "/compare", icon: ArrowLeftRight, labelEn: "Compare", labelMr: "तुलना" },
  { path: "/alerts", icon: Bell, labelEn: "Alerts", labelMr: "सूचना" },
  { path: "/reports", icon: FileDown, labelEn: "Reports", labelMr: "अहवाल" },
];

export function BottomNav() {
  const [location] = useLocation();
  const { language } = useLanguage();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border z-50 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          const label = language === "en" ? item.labelEn : item.labelMr;

          return (
            <button
              key={item.path}
              onClick={() => router.navigate(item.path)}
              className={`flex flex-col items-center justify-center px-3 py-2 gap-1 min-w-[60px] hover-elevate active-elevate-2 rounded-lg ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid={`nav-${item.labelEn.toLowerCase()}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
