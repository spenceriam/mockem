import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import backend from "~backend/client";
import { AppInner } from "./AppInner";
import { Loader2 } from "lucide-react";

export default function App() {
  const [sessionReady, setSessionReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // This call is critical. It establishes the session and sets the
        // session cookie that subsequent backend calls will need.
        await backend.data.getSession({});
        setSessionReady(true);
      } catch (err: any) {
        console.error("Failed to initialize session:", err);
        setError("Could not connect to the server. Please refresh the page.");
      }
    };
    initializeSession();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="mockem-theme">
      {error ? (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center flex-col gap-4">
          <h1 className="text-2xl font-bold text-destructive">Connection Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      ) : sessionReady ? (
        <AppInner />
      ) : (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-slate-400" />
        </div>
      )}
    </ThemeProvider>
  );
}
