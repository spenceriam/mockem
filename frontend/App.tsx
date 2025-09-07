import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { LandingPage } from "./pages/LandingPage";
import { CategoryPage } from "./pages/CategoryPage";
import { SchemaPage } from "./pages/SchemaPage";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useEffect } from "react";
import backend from "~backend/client";

function AppInner() {
  useEffect(() => {
    // Initialize session on app start to ensure cookies are set
    const initializeGlobalSession = async () => {
      try {
        await backend.data.getSession({});
        console.log("Global session initialized");
      } catch (error) {
        console.error("Failed to initialize global session:", error);
      }
    };

    initializeGlobalSession();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/category/:category/:platform/:schema" element={<SchemaPage />} />
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="mockem-theme">
      <AppInner />
    </ThemeProvider>
  );
}
