import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="font-medium min-h-8"
      data-testid="button-language-toggle"
    >
      {language === "en" ? "EN | मर" : "मर | EN"}
    </Button>
  );
}
