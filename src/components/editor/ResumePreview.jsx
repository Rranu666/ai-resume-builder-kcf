import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Eye, FileDown, FileText, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import PDFExportModal from "@/components/editor/PDFExportModal";

const templateStyles = {
  modern: { accent: "#34d399", heading: "#0f172a", border: "#34d399" },
  creative: { accent: "#f59e0b", heading: "#1c1917", border: "#f59e0b" },
  executive: { accent: "#6366f1", heading: "#1e1b4b", border: "#6366f1" },
  minimal: { accent: "#64748b", heading: "#0f172a", border: "#e2e8f0" },
  tech: { accent: "#a78bfa", heading: "#0f0f1a", border: "#a78bfa" },
  startup: { accent: "#f43f5e", heading: "#1c0010", border: "#f43f5e" },
  healthcare: { accent: "#22d3ee", heading: "#082f49", border: "#22d3ee" },
  academic: { accent: "#818cf8", heading: "#1e1b4b", border: "#818cf8" },
};

export default function ResumePreview({ resume, theme }) {
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const pi = resume.personal_info || {};
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const baseStyle = templateStyles[resume.template] || templateStyles.modern;

  // Merge theme overrides
  const accentColor = theme?.accentColor || baseStyle.accent;
  const style = { ...baseStyle, accent: accentColor, border: accentColor };
  const fontFamily = theme?.font || "system-ui, sans-serif";
  const vis = theme?.visibleSections || { summary: true, experience: true, education: true, skills: true, projects: true };
  const marginMap = { compact: "4px", normal: "8px", spacious: "16px" };
  const sectionGap = marginMap[theme?.marginSize] || "8px";

  const handleDownload = async () => {
    const authed = await base44.auth.isAuthenticated();
    if (!authed) { setShowAuthGate(true); return; }
    setShowExportModal(true);
  };

  const doExport = async (format = "pdf") => {
    setIsExporting(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a professional, well-styled resume HTML with inline CSS. Style: ${resume.template}, accent color: ${style.accent}.

Personal: ${JSON.stringify(pi)}
Experience: ${JSON.stringify(experience)}
Education: ${JSON.stringify(education)}
Skills: ${JSON.stringify(skills)}
Projects: ${JSON.stringify(projects)}

Requirements:
- Clean, modern layout with the template accent color
- ATS-friendly structure with proper headings
- Print-ready with @media print styles
- All content fully formatted
- No external CSS/font dependencies
${format === "word" ? "- Format as a simple, clean Word-compatible HTML document" : ""}`,
        response_json_schema: { type: "object", properties: { html: { type: "string" } } },
      });

      if (response.html) {
        const w = window.open("", "_blank");
        w.document.write(response.html);
        w.document.close();
        w.focus();
        setTimeout(() => w.print(), 600);
      }
    } catch (e) { console.error(e); }
    setIsExporting(false);
  };

  const loginWithGoogle = async () => {
    setAuthLoading(true);
    await base44.auth.redirectToLogin(window.location.href);
  };

  return (
    <>
      <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-semibold text-sm">Live Preview</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              onClick={handleDownload}
              disabled={isExporting}
              className="text-xs h-7 px-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold hover:opacity-90 shadow-sm shadow-emerald-500/20 gap-1"
            >
              <FileDown className="w-3 h-3" /> Export PDF
            </Button>
          </div>
        </div>

        {/* Resume preview – white paper */}
        <div className="p-3">
          <div className="bg-white rounded-xl shadow-xl overflow-y-auto" style={{ maxHeight: "420px", fontFamily }}>
            <div className="p-6">
              {/* Header strip */}
              <div className="pb-3 mb-3" style={{ borderBottom: `2.5px solid ${style.accent}` }}>
                <h1 style={{ color: style.heading, fontSize: "20px", fontWeight: "800", fontFamily, marginBottom: "2px" }}>
                  {pi.full_name || "Your Name"}
                </h1>
                <p style={{ color: "#64748b", fontSize: "11px", fontFamily }}>
                  {[pi.email, pi.phone, pi.location].filter(Boolean).join(" · ")}
                  {pi.linkedin && ` · ${pi.linkedin}`}
                  {pi.website && ` · ${pi.website}`}
                </p>
              </div>

              {vis.summary && pi.summary && (
                <div style={{ marginBottom: sectionGap }}>
                  <p style={{ color: "#374151", fontSize: "11px", lineHeight: "1.6", fontFamily }}>{pi.summary}</p>
                </div>
              )}

              {vis.experience && experience.length > 0 && (
                <div style={{ marginBottom: sectionGap }}>
                  <h3 style={{ fontSize: "11px", fontWeight: "700", color: style.accent, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: `1px solid ${style.accent}33`, paddingBottom: "2px", marginBottom: "6px", fontFamily }}>
                    Experience
                  </h3>
                  {experience.map((exp, i) => (
                    <div key={i} style={{ marginBottom: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <p style={{ fontSize: "11px", fontWeight: "700", color: "#1e293b", fontFamily }}>{exp.title}</p>
                        <p style={{ fontSize: "10px", color: "#94a3b8", fontFamily }}>{exp.start_date}{exp.start_date && " – "}{exp.current ? "Present" : exp.end_date}</p>
                      </div>
                      <p style={{ fontSize: "10px", color: "#64748b", fontFamily, marginBottom: "3px" }}>{exp.company}{exp.location && `, ${exp.location}`}</p>
                      <ul style={{ paddingLeft: "14px", margin: 0 }}>
                        {exp.bullets?.map((b, bi) => (
                          <li key={bi} style={{ fontSize: "10px", color: "#374151", lineHeight: "1.5", fontFamily }}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {vis.education && education.length > 0 && (
                <div style={{ marginBottom: sectionGap }}>
                  <h3 style={{ fontSize: "11px", fontWeight: "700", color: style.accent, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: `1px solid ${style.accent}33`, paddingBottom: "2px", marginBottom: "6px", fontFamily }}>
                    Education
                  </h3>
                  {education.map((edu, i) => (
                    <div key={i} style={{ marginBottom: "5px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p style={{ fontSize: "11px", fontWeight: "700", color: "#1e293b", fontFamily }}>{edu.degree}</p>
                        <p style={{ fontSize: "10px", color: "#94a3b8", fontFamily }}>{edu.graduation_year}</p>
                      </div>
                      <p style={{ fontSize: "10px", color: "#64748b", fontFamily }}>{edu.institution}{edu.gpa && ` · GPA: ${edu.gpa}`}</p>
                    </div>
                  ))}
                </div>
              )}

              {vis.skills && skills.length > 0 && (
                <div style={{ marginBottom: sectionGap }}>
                  <h3 style={{ fontSize: "11px", fontWeight: "700", color: style.accent, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: `1px solid ${style.accent}33`, paddingBottom: "2px", marginBottom: "6px", fontFamily }}>
                    Skills
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {skills.map((s, i) => (
                      <span key={i} style={{ fontSize: "10px", padding: "1px 8px", borderRadius: "20px", border: `1px solid ${style.accent}55`, color: style.accent, fontFamily, background: `${style.accent}11` }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {vis.projects && projects.length > 0 && (
                <div>
                  <h3 style={{ fontSize: "11px", fontWeight: "700", color: style.accent, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: `1px solid ${style.accent}33`, paddingBottom: "2px", marginBottom: "6px", fontFamily }}>
                    Projects
                  </h3>
                  {projects.map((proj, i) => (
                    <div key={i} style={{ marginBottom: "5px" }}>
                      <p style={{ fontSize: "11px", fontWeight: "700", color: "#1e293b", fontFamily }}>{proj.name}</p>
                      <p style={{ fontSize: "10px", color: "#374151", fontFamily }}>{proj.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PDF Export Modal */}
      <PDFExportModal open={showExportModal} onOpenChange={setShowExportModal} resume={resume} />

      {/* Auth Gate Modal */}
      <Dialog open={showAuthGate} onOpenChange={setShowAuthGate}>
        <DialogContent className="bg-[#0d1a26] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Lock className="w-4 h-4 text-black" />
              </div>
              Sign in to Download
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm mt-2">
              Your resume preview is always free! To download as PDF or Word, create a free account — it takes seconds.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Benefits */}
            <div className="bg-white/4 border border-white/8 rounded-xl p-4 space-y-2">
              {[
                "✅ Download as PDF & Word",
                "✅ Save unlimited resumes",
                "✅ AI chat coach & voice input",
                "✅ ATS score & job matching",
              ].map((b, i) => (
                <p key={i} className="text-sm text-slate-300">{b}</p>
              ))}
            </div>

            {/* Google Sign Up */}
            <Button
              onClick={loginWithGoogle}
              disabled={authLoading}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold h-11 gap-3 shadow-lg"
            >
              {authLoading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              Continue with Google
            </Button>

            <Button
              onClick={loginWithGoogle}
              variant="outline"
              className="w-full border-white/10 text-slate-300 hover:bg-white/5 hover:text-white h-11"
            >
              Sign up with Email
            </Button>

            <p className="text-center text-xs text-slate-600">
              Already have an account?{" "}
              <button onClick={loginWithGoogle} className="text-emerald-400 hover:underline">Log in</button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}