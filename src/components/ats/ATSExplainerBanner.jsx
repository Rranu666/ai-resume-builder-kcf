import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanSearch, ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

const HOW_IT_WORKS = [
  { step: "1", title: "Company posts a job", desc: "Recruiters write a job description with specific skills, titles, and requirements." },
  { step: "2", title: "ATS collects resumes", desc: "Every application goes into the ATS database — not directly to a human recruiter." },
  { step: "3", title: "ATS scans & scores", desc: "The system scans your resume for matching keywords, formatting compatibility, and structure." },
  { step: "4", title: "Top matches advance", desc: "Only resumes above a score threshold get reviewed by a real human recruiter." },
];

const ATS_FACTS = [
  { icon: CheckCircle2, text: "99% of Fortune 500 companies use ATS software", color: "text-emerald-400" },
  { icon: AlertTriangle, text: "75% of qualified resumes get rejected by ATS before a human sees them", color: "text-amber-400" },
  { icon: XCircle, text: "Unoptimized resumes are filtered out automatically — no matter how qualified you are", color: "text-rose-400" },
];

export default function ATSExplainerBanner() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 bg-gradient-to-r from-blue-950/50 via-cyan-950/40 to-blue-950/50 border border-cyan-500/25 rounded-2xl overflow-hidden"
    >
      {/* Main Banner */}
      <div className="px-6 py-5">
        <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-cyan-500/15 border border-cyan-500/25 rounded-xl flex items-center justify-center shrink-0">
              <Info className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="text-white font-extrabold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  What is ATS? (Applicant Tracking System)
                </h2>
                <span className="px-2 py-0.5 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Start Here
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                An <span className="text-white font-semibold">ATS (Applicant Tracking System)</span> is software used by employers to automatically scan, sort, and filter resumes before a human ever reads them. If your resume isn't optimized for ATS, it gets rejected automatically — even if you're perfectly qualified.
              </p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors shrink-0 bg-cyan-500/10 border border-cyan-500/20 px-3 py-2 rounded-lg"
          >
            {expanded ? "Less" : "Learn More"}
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* ATS Key Facts */}
        <div className="flex flex-wrap gap-4 mt-4">
          {ATS_FACTS.map(({ icon: Icon, text, color }, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-400 max-w-xs">
              <Icon className={`w-3.5 h-3.5 ${color} shrink-0 mt-0.5`} />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Section */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-cyan-500/15"
          >
            <div className="px-6 py-5 space-y-5">
              {/* How ATS Works */}
              <div>
                <p className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <ScanSearch className="w-4 h-4 text-cyan-400" /> How ATS Works — Step by Step
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {HOW_IT_WORKS.map(({ step, title, desc }) => (
                    <div key={step} className="bg-white/4 border border-white/8 rounded-xl p-4">
                      <div className="w-7 h-7 bg-cyan-500/20 border border-cyan-500/30 rounded-full flex items-center justify-center text-xs font-black text-cyan-400 mb-3">{step}</div>
                      <p className="text-white text-sm font-semibold mb-1">{title}</p>
                      <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ATS Scoring Explanation */}
              <div className="bg-white/3 border border-white/6 rounded-xl p-4">
                <p className="text-sm font-bold text-white mb-3">What is a Good ATS Score?</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { range: "80–100%", label: "Strong Match", desc: "Likely to advance to human review. Your resume aligns well with the JD.", color: "border-emerald-500/30 bg-emerald-500/8 text-emerald-400" },
                    { range: "50–79%", label: "Moderate Match", desc: "May pass depending on competition. Several keyword gaps to address.", color: "border-amber-500/30 bg-amber-500/8 text-amber-400" },
                    { range: "0–49%", label: "Weak Match", desc: "Likely filtered out. Significant optimization needed before applying.", color: "border-rose-500/30 bg-rose-500/8 text-rose-400" },
                  ].map(({ range, label, desc, color }) => (
                    <div key={range} className={`border rounded-xl p-3 ${color}`}>
                      <p className="text-lg font-extrabold">{range}</p>
                      <p className="text-sm font-bold mt-0.5">{label}</p>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formatting Tips */}
              <div>
                <p className="text-sm font-bold text-white mb-3">⚠️ Common ATS Formatting Mistakes to Avoid</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    "Using tables, columns, text boxes (ATS can't parse these)",
                    "Including images, logos, photos, or graphics",
                    "Using headers/footers for important contact info",
                    "Using fancy fonts — stick to Arial, Calibri, or Times New Roman",
                    "Saving as .pages or .jpg — use PDF or DOCX only",
                    "Writing 'References available upon request' (wastes space)",
                    "Using abbreviations without spelling them out once",
                    "No clear section headings (Experience, Education, Skills)",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-400 bg-white/3 border border-white/6 rounded-lg px-3 py-2">
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}