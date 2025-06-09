import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { useEffect } from 'react';
import { Globe } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  // Set RTL direction when language changes
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="relative h-8 w-8 rounded-full"
          >
            <Globe className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 text-[10px] font-medium bg-[#3498DB] text-white rounded-full w-4 h-4 flex items-center justify-center">
              {i18n.language === 'en' ? 'ع' : 'E'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Switch to {i18n.language === 'en' ? 'Arabic' : 'English'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}