import { Sailboat, Coffee, X } from "lucide-react";
import { PrivacyModal } from "./PrivacyModal";
import { TermsModal } from "./TermsModal";

export function AhoyFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
            <Sailboat className="h-4 w-4" />
          </div>
          <span className="text-base font-semibold">MockEm</span>
        </div>
        
        <div className="text-center space-y-4">
          <p className="text-slate-500">
            Professional mock data generation for enterprise development teams.
          </p>
          
          <div className="flex justify-center items-center gap-6 text-sm">
            <a 
              href="https://x.com/spencer_i_am" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <X className="h-4 w-4" />
              Follow on X
            </a>
            <a 
              href="https://ko-fi.com/spenceriam" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Coffee className="h-4 w-4" />
              Send me a coffee!
            </a>
          </div>
          
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <p className="text-xs text-slate-400">
              All generated data is purely fictional and created for testing purposes only.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-xs text-slate-500">
              <p>
                © 2025{" "}
                <a 
                  href="https://www.lionmystic.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Lion Mystic
                </a>
              </p>
              <div className="hidden sm:block">•</div>
              <PrivacyModal>
                <button className="text-slate-500 hover:text-slate-700 transition-colors">
                  Privacy Policy
                </button>
              </PrivacyModal>
              <div className="hidden sm:block">•</div>
              <TermsModal>
                <button className="text-slate-500 hover:text-slate-700 transition-colors">
                  Terms of Service
                </button>
              </TermsModal>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
