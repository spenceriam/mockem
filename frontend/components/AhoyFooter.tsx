import { Sailboat } from "lucide-react";

export function AhoyFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
            <Sailboat className="h-4 w-4" />
          </div>
          <span className="text-base font-semibold">MockEm</span>
        </div>
        <p className="text-center text-slate-500">
          Professional mock data generation for enterprise development teams.
        </p>
        <p className="mt-2 text-center text-xs text-slate-400">
          All generated data is purely fictional and created for testing purposes only.
        </p>
      </div>
    </footer>
  );
}
