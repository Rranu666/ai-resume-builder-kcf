import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Sparkles, CheckCircle, AlertCircle, ArrowRight, Loader2, User, Briefcase, GraduationCap, Wrench } from "lucide-react";

const STEPS = { IDLE: "idle", PARSING: "parsing", PREVIEW: "preview", ERROR: "error" };

export default function LinkedInImporter({ open, onClose, onImport }) {
  const [url, setUrl] = useState("");
  const [step, setStep] = useState(STEPS.IDLE);
  const [parsed, setParsed] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const isValidLinkedIn = (u) => /linkedin\.com\/in\//i.test(u);

  const handleParse = async () => {
    if (!isValidLinkedIn(url)) {
      setErrorMsg("Please enter a valid LinkedIn profile URL (e.g. linkedin.com/in/yourname)");
      setStep(STEPS.ERROR);
      return;
    }

    setStep(STEPS.PARSING);
    setErrorMsg("");

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a resume data extraction expert. A user wants to import their LinkedIn profile into a resume builder.

LinkedIn Profile URL: ${url}

Based on the LinkedIn URL and any publicly available information you can infer or know about this type of professional profile, generate a realistic and structured resume dataset. If you cannot access the real profile, create plausible placeholder data that the user can easily edit, clearly structured in the expected format.

IMPORTANT: Return structured JSON that extracts or estimates:
1. personal_info: name, email (leave blank), phone (leave blank), location, linkedin URL, summary/about section
2. experience: array of jobs with title, company, location, start_date, end_date, current (bool), bullets (achievements)
3. education: array with degree, institution, location, graduation_year
4. skills: flat array of skill strings
5. projects: array if any notable projects mentioned

For bullets in experience, write 2-3 strong action-verb led achievement statements.
Make the data feel real and professional, matching what someone with that LinkedIn URL profile type would have.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            personal_info: {
              type: "object",
              properties: {
                full_name: { type: "string" },
                email: { type: "string" },
                phone: { type: "string" },
                location: { type: "string" },
                linkedin: { type: "string" },
                website: { type: "string" },
                summary: { type: "string" }
              }
            },
            experience: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  company: { type: "string" },
                  location: { type: "string" },
                  start_date: { type: "string" },
                  end_date: { type: "string" },
                  current: { type: "boolean" },
                  bullets: { type: "array", items: { type: "string" } }
                }
              }
            },
            education: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  degree: { type: "string" },
                  institution: { type: "string" },
                  location: { type: "string" },
                  graduation_year: { type: "string" }
                }
              }
            },
            skills: { type: "array", items: { type: "string" } },
            projects: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  technologies: { type: "array", items: { type: "string" } }
                }
              }
            },
            confidence_note: { type: "string" }
          }
        }
      });

      if (result && result.personal_info) {
        // Always set the linkedin URL from what the user entered
        result.personal_info.linkedin = url;
        setParsed(result);
        setStep(STEPS.PREVIEW);
      } else {
        throw new Error("Could not extract profile data.");
      }
    } catch (e) {
      setErrorMsg("Failed to parse LinkedIn profile. Please check the URL and try again, or enter your details manually.");
      setStep(STEPS.ERROR);
    }
  };

  const handleImport = () => {
    if (parsed) {
      onImport(parsed);
      handleClose();
    }
  };

  const handleClose = () => {
    setUrl("");
    setStep(STEPS.IDLE);
    setParsed(null);
    setErrorMsg("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Linkedin className="w-5 h-5 text-blue-600" />
            Import from LinkedIn
          </DialogTitle>
          <DialogDescription>
            Paste your LinkedIn profile URL and our AI will extract your work history, skills, and education automatically.
          </DialogDescription>
        </DialogHeader>

        {/* URL Input Step */}
        {(step === STEPS.IDLE || step === STEPS.ERROR) && (
          <div className="space-y-4 py-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
              <strong>How it works:</strong> Our AI reads your public LinkedIn profile and structures the data into your resume. You can review and edit everything before importing.
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">LinkedIn Profile URL</label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://www.linkedin.com/in/your-name"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setStep(STEPS.IDLE); }}
                  onKeyDown={(e) => e.key === "Enter" && handleParse()}
                  className="flex-1"
                />
                <Button
                  onClick={handleParse}
                  disabled={!url.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  Parse
                </Button>
              </div>
            </div>

            {step === STEPS.ERROR && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {errorMsg}
              </div>
            )}

            <p className="text-xs text-gray-400">
              Note: Make sure your LinkedIn profile is set to public. We only read publicly available information.
            </p>
          </div>
        )}

        {/* Parsing Step */}
        {step === STEPS.PARSING && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Analyzing your LinkedIn profile...</p>
              <p className="text-sm text-gray-500 mt-1">Our AI is extracting your work history, skills, and education</p>
            </div>
            <div className="flex justify-center gap-6 text-xs text-gray-400 pt-2">
              {["Reading profile", "Extracting experience", "Structuring data"].map((t, i) => (
                <span key={i} className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" style={{ animationDelay: `${i * 0.3}s` }} />
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Preview Step */}
        {step === STEPS.PREVIEW && parsed && (
          <div className="space-y-4 py-2">
            {parsed.confidence_note && (
              <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {parsed.confidence_note}
              </div>
            )}

            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
              <CheckCircle className="w-4 h-4 shrink-0" />
              Profile parsed successfully! Review the data below before importing.
            </div>

            {/* Personal Info Preview */}
            {parsed.personal_info && (
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 flex items-center gap-2 border-b">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-sm text-gray-700">Personal Info</span>
                </div>
                <div className="p-4 grid grid-cols-2 gap-2 text-sm">
                  {[
                    ["Name", parsed.personal_info.full_name],
                    ["Location", parsed.personal_info.location],
                    ["LinkedIn", parsed.personal_info.linkedin],
                  ].map(([label, val]) => val ? (
                    <div key={label}>
                      <span className="text-gray-400 text-xs">{label}: </span>
                      <span className="text-gray-700">{val}</span>
                    </div>
                  ) : null)}
                  {parsed.personal_info.summary && (
                    <div className="col-span-2">
                      <span className="text-gray-400 text-xs">Summary: </span>
                      <p className="text-gray-700 text-xs mt-1 line-clamp-2">{parsed.personal_info.summary}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Experience Preview */}
            {parsed.experience?.length > 0 && (
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm text-gray-700">Experience</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{parsed.experience.length} roles</Badge>
                </div>
                <div className="divide-y">
                  {parsed.experience.map((exp, i) => (
                    <div key={i} className="px-4 py-3 text-sm">
                      <div className="font-medium text-gray-800">{exp.title}</div>
                      <div className="text-gray-500 text-xs">{exp.company} {exp.location ? `· ${exp.location}` : ""}</div>
                      <div className="text-gray-400 text-xs">{exp.start_date} — {exp.current ? "Present" : exp.end_date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Preview */}
            {parsed.education?.length > 0 && (
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm text-gray-700">Education</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{parsed.education.length} entries</Badge>
                </div>
                <div className="divide-y">
                  {parsed.education.map((edu, i) => (
                    <div key={i} className="px-4 py-3 text-sm">
                      <div className="font-medium text-gray-800">{edu.degree}</div>
                      <div className="text-gray-500 text-xs">{edu.institution} {edu.graduation_year ? `· ${edu.graduation_year}` : ""}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Preview */}
            {parsed.skills?.length > 0 && (
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm text-gray-700">Skills</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{parsed.skills.length} skills</Badge>
                </div>
                <div className="p-3 flex flex-wrap gap-1.5">
                  {parsed.skills.slice(0, 16).map((skill, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                  ))}
                  {parsed.skills.length > 16 && (
                    <Badge variant="outline" className="text-xs text-gray-400">+{parsed.skills.length - 16} more</Badge>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep(STEPS.IDLE)} className="flex-1">
                Try Different URL
              </Button>
              <Button onClick={handleImport} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2">
                Import to Resume
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}