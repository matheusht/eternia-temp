import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleReturnHome = () => {
    navigate(language === "pt" ? "/pt" : "/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mystic">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold mb-4 text-foreground">
          {t("notFound.title")}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          {t("notFound.message")}
        </p>
        <Button onClick={handleReturnHome} variant="cosmic" size="lg">
          {t("notFound.returnHome")}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
