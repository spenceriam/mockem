import { Coffee, X } from "lucide-react";
import { PrivacyModal } from "./PrivacyModal";
import { TermsModal } from "./TermsModal";

export function AhoyFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
              <path d="M160,80a32,32,0,1,0-32-32A32,32,0,0,0,160,80Zm0-48a16,16,0,1,1-16,16A16,16,0,0,1,160,32ZM64,80a32,32,0,1,0-32-32A32,32,0,0,0,64,80ZM64,32A16,16,0,1,1,48,48,16,16,0,0,1,64,32ZM224,80a32,32,0,1,0-32-32A32,32,0,0,0,224,80Zm0-48a16,16,0,1,1-16,16A16,16,0,0,1,224,32ZM32,128a32,32,0,1,0,32,32A32,32,0,0,0,32,128Zm16,32a16,16,0,1,1,16-16A16,16,0,0,1,48,160Zm144-32a32,32,0,1,0,32,32A32,32,0,0,0,192,128Zm16,32a16,16,0,1,1,16-16A16,16,0,0,1,208,160ZM96,208a32,32,0,1,0,32,32A32,32,0,0,0,96,208Zm16,32a16,16,0,1,1,16-16A16,16,0,0,1,112,240ZM136,112V96a8,8,0,0,0-16,0v16H104a8,8,0,0,0,0,16h16v16a8,8,0,0,0,16,0V128h16a8,8,0,0,0,0-16Zm40-48h8v24a8,8,0,0,0,16,0V64h8a8,8,0,0,0,0-16h-8V40a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16ZM56,184h8v8a8,8,0,0,0,16,0v-8h8a8,8,0,0,0,0-16H80v-8a8,8,0,0,0-16,0v8H56a8,8,0,0,0,0,16Z"></path>
            </svg>
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
