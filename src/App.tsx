import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AstralMap from "./pages/AstralMap";
import AIOracle from "./pages/AIOracle";
import SpiritualDiary from "./pages/SpiritualDiary";
import WeeklyReport from "./pages/WeeklyReport";
import Tarot from "./pages/Tarot";
import Horoscope from "./pages/Horoscope";
import Compatibility from "./pages/Compatibility";
import LoveSketch from "./pages/LoveSketch";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/useAuth";
import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
            {/* English routes (default) */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/horoscope" element={<Horoscope />} />
            <Route path="/compatibility" element={<Compatibility />} />
            <Route path="/love-sketch" element={<LoveSketch />} />
            <Route path="/astral-map" element={<AstralMap />} />
            <Route path="/ai-oracle" element={<AIOracle />} />
            <Route path="/diary" element={<SpiritualDiary />} />
            <Route path="/weekly-report" element={<WeeklyReport />} />
            <Route path="/tarot" element={<Tarot />} />
            
            {/* Portuguese routes (with /pt prefix) */}
            <Route path="/pt" element={<Index />} />
            <Route path="/pt/auth" element={<Auth />} />
            <Route path="/pt/horoscope" element={<Horoscope />} />
            <Route path="/pt/compatibility" element={<Compatibility />} />
            <Route path="/pt/love-sketch" element={<LoveSketch />} />
            <Route path="/pt/astral-map" element={<AstralMap />} />
            <Route path="/pt/ai-oracle" element={<AIOracle />} />
            <Route path="/pt/diary" element={<SpiritualDiary />} />
            <Route path="/pt/weekly-report" element={<WeeklyReport />} />
            <Route path="/pt/tarot" element={<Tarot />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
