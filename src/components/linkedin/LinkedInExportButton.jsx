import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Linkedin, Loader2, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LinkedInExportButton({ resume }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleExport = async () => {
    setIsLoading(true);
    try {
      // Generate a formatted summary from resume data
      const summary = generateLinkedInSummary(resume);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(summary);
      
      setMessage("Summary copied! Visit LinkedIn and paste into your profile headline/summary section.");
      setTimeout(() => {
        setIsOpen(false);
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage("Failed to copy. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateLinkedInSummary = (resume) => {
    const pi = resume.personal_info || {};
    const exp = resume.experience || [];
    const skills = resume.skills || [];

    let summary = "";

    // Title
    if (pi.summary) {
      summary += pi.summary + "\n\n";
    }

    // Recent experience
    if (exp.length > 0) {
      summary += "EXPERIENCE\n";
      exp.slice(0, 3).forEach(e => {
        summary += `• ${e.title} at ${e.company}${e.location ? ` (${e.location})` : ""}\n`;
      });
      summary += "\n";
    }

    // Top skills
    if (skills.length > 0) {
      summary += "SKILLS\n";
      summary += skills.slice(0, 10).join(" • ") + "\n\n";
    }

    // Resume URL
    if (pi.website) {
      summary += `View my full resume: ${pi.website}`;
    }

    return summary;
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="border-blue-500/40 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 gap-2"
      >
        <Linkedin className="w-4 h-4" />
        Export to LinkedIn
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl bg-[#0d1420] border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Linkedin className="w-5 h-5 text-blue-400" />
              Export to LinkedIn
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Share your resume highlights on your LinkedIn profile
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Alert className="border-blue-500/30 bg-blue-500/10">
              <ExternalLink className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-300">
                We've prepared your resume summary. Copy it and paste it into your LinkedIn profile headline or about section.
              </AlertDescription>
            </Alert>

            <div className="bg-[#060b12] rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto border border-white/10">
              {resume.personal_info?.summary && (
                <div>
                  <p className="text-sm text-slate-300 whitespace-pre-wrap">
                    {generateLinkedInSummary(resume)}
                  </p>
                </div>
              )}
              {!resume.personal_info?.summary && (
                <p className="text-sm text-slate-500">
                  Add a professional summary to your resume to export to LinkedIn.
                </p>
              )}
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <p>📋 Steps to update LinkedIn:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click "Copy Summary" below</li>
                <li>Go to linkedin.com and edit your profile</li>
                <li>Paste in your Headline or About section</li>
                <li>Save changes</li>
              </ol>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isLoading || !resume.personal_info?.summary}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Copying...
                </>
              ) : (
                <>
                  <Linkedin className="w-4 h-4" />
                  Copy Summary
                </>
              )}
            </Button>
          </DialogFooter>

          {message && (
            <Alert className="border-emerald-500/30 bg-emerald-500/10 mt-4">
              <AlertDescription className="text-emerald-300">
                {message}
              </AlertDescription>
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}