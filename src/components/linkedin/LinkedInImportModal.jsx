import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Linkedin, Loader2 } from "lucide-react";

export default function LinkedInImportModal({ isOpen, onClose, onSuccess }) {
  const [linkedinData, setLinkedinData] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const parseMutation = useMutation({
    mutationFn: async (data) => {
      const result = await base44.functions.invoke('parseLinkedInData', { 
        linkedinData: data 
      });
      return result.data;
    },
    onSuccess: (data) => {
      setPreview(data);
      setError("");
    },
    onError: (err) => {
      setError(err.message || "Failed to parse LinkedIn data");
      setPreview(null);
    },
  });

  const handleImport = () => {
    if (!linkedinData.trim()) {
      setError("Please paste your LinkedIn profile data");
      return;
    }
    parseMutation.mutate(linkedinData);
  };

  const handleConfirm = () => {
    if (preview) {
      onSuccess(preview.data);
      setLinkedinData("");
      setPreview(null);
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#0d1420] border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Linkedin className="w-5 h-5 text-blue-400" />
            Import LinkedIn Profile
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Paste your LinkedIn profile data (JSON export or profile text) to auto-populate your resume
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!preview ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  LinkedIn Profile Data
                </label>
                <Textarea
                  placeholder={`Paste your LinkedIn profile data here. You can:
1. Export your LinkedIn profile as JSON
2. Copy your LinkedIn profile URL
3. Paste profile text with your details

Example fields:
- Name: John Doe
- Email: john@example.com
- Headline: Senior Software Engineer
- Experience: [company, title, dates]
- Education: [school, degree, year]
- Skills: [list of skills]`}
                  value={linkedinData}
                  onChange={(e) => {
                    setLinkedinData(e.target.value);
                    setError("");
                  }}
                  className="h-48 bg-[#060b12] border-white/10 text-white placeholder-slate-600"
                />
              </div>

              {error && (
                <Alert className="border-red-500/30 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleImport}
                disabled={parseMutation.isPending || !linkedinData.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white"
              >
                {parseMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  <>
                    <Linkedin className="w-4 h-4 mr-2" />
                    Parse Profile
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Alert className="border-emerald-500/30 bg-emerald-500/10">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <AlertDescription className="text-emerald-400">
                  {preview.message}
                </AlertDescription>
              </Alert>

              <div className="space-y-3 bg-[#060b12] rounded-lg p-4 max-h-96 overflow-y-auto">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Personal Info</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                    {preview.data.personal_info.full_name && (
                      <div>
                        <span className="text-slate-500">Name:</span> {preview.data.personal_info.full_name}
                      </div>
                    )}
                    {preview.data.personal_info.email && (
                      <div>
                        <span className="text-slate-500">Email:</span> {preview.data.personal_info.email}
                      </div>
                    )}
                    {preview.data.personal_info.location && (
                      <div className="col-span-2">
                        <span className="text-slate-500">Location:</span> {preview.data.personal_info.location}
                      </div>
                    )}
                  </div>
                </div>

                {preview.data.experience.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">
                      Experience ({preview.data.experience.length})
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {preview.data.experience.map((exp, i) => (
                        <li key={i}>
                          {exp.title} at {exp.company}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {preview.data.education.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">
                      Education ({preview.data.education.length})
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {preview.data.education.map((edu, i) => (
                        <li key={i}>
                          {edu.degree} from {edu.institution}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {preview.data.skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">
                      Skills ({preview.data.skills.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {preview.data.skills.slice(0, 8).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {preview.data.skills.length > 8 && (
                        <span className="px-2 py-1 text-xs text-slate-400">
                          +{preview.data.skills.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-white/10 text-white hover:bg-white/5"
          >
            Cancel
          </Button>
          {preview && (
            <Button
              onClick={handleConfirm}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-semibold"
            >
              Import to Resume
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}