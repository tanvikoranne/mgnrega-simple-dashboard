import { useLanguage } from "@/lib/language-context";

interface BilingualTextProps {
  en: string;
  mr: string;
  className?: string;
  showBoth?: boolean;
}

export function BilingualText({ en, mr, className = "", showBoth = false }: BilingualTextProps) {
  const { language } = useLanguage();

  if (showBoth) {
    return (
      <div className={`space-y-0.5 ${className}`}>
        <div className="font-medium">{en}</div>
        <div className="text-sm opacity-90">{mr}</div>
      </div>
    );
  }

  return <span className={className}>{language === "en" ? en : mr}</span>;
}
