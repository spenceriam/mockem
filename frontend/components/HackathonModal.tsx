import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, X } from "lucide-react";

interface HackathonModalProps {
  children: React.ReactNode;
}

export function HackathonModal({ children }: HackathonModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Hackathon Submission</DialogTitle>
          <DialogDescription className="text-slate-600">
            This is a hackathon submission project showcasing mock data generation capabilities.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-slate-700">
            For any questions, feedback, or interest in this project, please reach out to me on X (formerly Twitter).
          </p>
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="https://x.com/spencer_i_am" target="_blank" rel="noopener noreferrer">
              <X className="mr-2 h-4 w-4" />
              Message me on X
              <ExternalLink className="ml-auto h-4 w-4" />
            </a>
          </Button>
          <div className="pt-4 border-t">
            <Button 
              onClick={() => setOpen(false)} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Got it!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
