import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M160,80a32,32,0,1,0-32-32A32,32,0,0,0,160,80Zm0-48a16,16,0,1,1-16,16A16,16,0,0,1,160,32ZM64,80a32,32,0,1,0-32-32A32,32,0,0,0,64,80ZM64,32A16,16,0,1,1,48,48,16,16,0,0,1,64,32ZM224,80a32,32,0,1,0-32-32A32,32,0,0,0,224,80Zm0-48a16,16,0,1,1-16,16A16,16,0,0,1,224,32ZM32,128a32,32,0,1,0,32,32A32,32,0,0,0,32,128Zm16,32a16,16,0,1,1,16-16A16,16,0,0,1,48,160Zm144-32a32,32,0,1,0,32,32A32,32,0,0,0,192,128Zm16,32a16,16,0,1,1,16-16A16,16,0,0,1,208,160ZM96,208a32,32,0,1,0,32,32A32,32,0,0,0,96,208Zm16,32a16,16,0,1,1,16-16A16,16,0,0,1,112,240ZM136,112V96a8,8,0,0,0-16,0v16H104a8,8,0,0,0,0,16h16v16a8,8,0,0,0,16,0V128h16a8,8,0,0,0,0-16Zm40-48h8v24a8,8,0,0,0,16,0V64h8a8,8,0,0,0,0-16h-8V40a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16ZM56,184h8v8a8,8,0,0,0,16,0v-8h8a8,8,0,0,0,0-16H80v-8a8,8,0,0,0-16,0v8H56a8,8,0,0,0,0,16Z"></path>
                </svg>
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
