import { Link } from "react-router-dom";
import { ArrowLeft, Sailboat } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AhoyHeaderProps {
  backTo?: string;
  backLabel?: string;
  nav?: { label: string; href: string }[];
}

export function AhoyHeader({ backTo, backLabel = "Back", nav }: AhoyHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
                <Sailboat className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold tracking-tight">MockEm</span>
            </Link>
            {backTo && (
              <Button variant="outline" className="ml-3 hidden sm:inline-flex border-slate-300 text-slate-700 hover:bg-slate-50" asChild>
                <Link to={backTo}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {backLabel}
                </Link>
              </Button>
            )}
          </div>
          {nav && nav.length > 0 && (
            <nav className="hidden md:flex items-center gap-6">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
