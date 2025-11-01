import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">
          {t("Page Not Found", "पृष्ठ सापडले नाही")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("The page you're looking for doesn't exist", "तुम्ही शोधत असलेले पृष्ठ अस्तित्वात नाही")}
        </p>
        <Link href="/">
          <Button className="gap-2" data-testid="button-home">
            <Home className="w-4 h-4" />
            {t("Go Home", "मुख्यपृष्ठावर जा")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
