
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

// Pages
import Index from "./pages/Index";
import Generate from "./pages/Generate";
import Credits from "./pages/Credits";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TextToSpeech from "./pages/TextToSpeech";

// Components
import AppLayout from "./components/layouts/AppLayout";
import SplashScreen from "./components/SplashScreen";

// Contexts
import { UserProvider } from "./contexts/UserContext";
import { AdProvider } from "./contexts/AdContext";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if we've already shown the splash screen in this session
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    
    if (hasSeenSplash === "true") {
      setShowSplash(false);
    } else {
      // If not, show it and set the flag
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("hasSeenSplash", "true");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <UserProvider>
            <AdProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<AppLayout><Index /></AppLayout>} />
                  <Route path="/generate" element={<AppLayout><Generate /></AppLayout>} />
                  <Route path="/credits" element={<AppLayout><Credits /></AppLayout>} />
                  <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
                  <Route path="/text-to-speech" element={<AppLayout><TextToSpeech /></AppLayout>} />
                  <Route path="/privacy-policy" element={<AppLayout><PrivacyPolicy /></AppLayout>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AdProvider>
          </UserProvider>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
