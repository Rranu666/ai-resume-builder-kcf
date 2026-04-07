import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Resume } from "@/entities/Resume";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanSearch, Target, Zap, CheckCircle2, AlertCircle, Plus, Wand2,
  Loader2, ChevronDown, ChevronUp, FileText, ArrowRight, BarChart2,
  Star, AlertTriangle, RefreshCw, KeyRound, Briefcase, BookOpen, Brain
} from "lucide-react";
import ATSScannerResults from "@/components/ats/ATSScannerResults";
import ATSExplainerBanner from "@/components/ats/ATSExplainerBanner";

const STAGES = { SETUP: "setup", SCANNING: "scanning", RESULTS: "results" };

export default function ATSScanner() {
  const [stage, setStage] = useState(STAGES.SETUP);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    Resume.list("-updated_date").then(list => {
      setResumes(list);
      if (list.length > 0) setSelectedResumeId(list[0].id);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedResumeId) {
      setSelectedResume(resumes.find(r => r.id === selectedResumeId) || null);
    }
  }, [selectedResumeId, resumes]);

  const runScan = async () => {
    if (!selectedResumeId || !jobDescription.trim()) return;
    setStage(STAGES.SCANNING);
    const resume = resumes.find(r => r.id === selectedResumeId);

    const resumeText = `
Name: ${resume.personal_info?.full_name || ""}
Summary: ${resume.personal_info?.summary || "(none)"}
Skills: ${(resume.skills || []).join(", ") || "(none)"}
Experience:
${(resume.experience || []).map((e, i) => `  [${i}] ${e.title} at ${e.company}
  Bullets: ${(e.bullets || []).join(" | ") || "(none)"}`).join("\n")}
Education: ${(resume.education || []).map(e => `${e.degree} at ${e.institution}`).join("; ") || "(none)"}
Projects: ${(resume.projects || []).map(p => `${p.name}: ${p.description}`).join(" | ") || "(none)"}
    `.trim();

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a world-class ATS (Applicant Tracking System) expert. Perform a deep analysis of this resume against the job description.

JOB TITLE: ${jobTitle || "Not specified"}
JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Perform a thorough ATS keyword-match analysis and provide:

1. match_score: Overall ATS match percentage (0-100). Be accurate — compare actual resume keywords to JD requirements.

2. keyword_analysis: 
   - found_keywords: Keywords/skills from JD that ARE present in the resume
   - missing_keywords: Important keywords/skills from JD that are COMPLETELY ABSENT from the resume. Be thorough and specific.
   - partial_matches: Terms in the resume that are related but not exact matches (e.g. resume says "ML" but JD says "Machine Learning")

3. section_gaps: For each resume section that needs improvement:
   - section: "summary" | "skills" | "experience" | "projects"
   - issue: What's missing or wrong
   - missing_terms: Exact terms from the JD missing from this section

4. skill_suggestions: Specific skills/tools/technologies to add to the skills section (exact phrases from the JD)

5. bullet_suggestions: For each experience entry (by index), suggest 2-3 improved bullet points that:
   - Incorporate missing JD keywords naturally
   - Use strong action verbs
   - Include quantified metrics where possible
   - Match the job level/scope
   
6. summary_suggestion: A rewritten professional summary that naturally incorporates the top 5-7 missing keywords from the JD

7. quick_wins: Top 5 highest-impact, easiest changes the candidate can make right now to boost their ATS score

8. red_flags: Any critical issues that would immediately disqualify this resume (missing required skills, experience gaps, etc.)

9. hard_skills_analysis: 
   - found: Hard/technical skills from JD found in resume
   - missing: Hard/technical skills from JD not in resume

10. soft_skills_analysis:
    - found: Soft skills from JD found in resume (communication, leadership, etc.)
    - missing: Soft skills from JD not in resume

11. action_verb_strength: 
    - weak_verbs: Weak action verbs found in resume bullets (e.g., "helped", "worked on", "assisted")
    - strong_replacements: For each weak verb, suggest a stronger alternative (e.g., "helped" → "accelerated")

12. formatting_tips: 2-4 specific formatting improvements this resume needs to pass ATS parsing (based on what you can infer from the resume data)

13. job_title_match: Whether the candidate's most recent job title closely matches the JD title (true/false) and a note why it matters`,
      response_json_schema: {
        type: "object",
        properties: {
          match_score: { type: "number" },
          keyword_analysis: {
            type: "object",
            properties: {
              found_keywords: { type: "array", items: { type: "string" } },
              missing_keywords: { type: "array", items: { type: "string" } },
              partial_matches: { type: "array", items: { type: "object", properties: { resume_term: { type: "string" }, jd_term: { type: "string" } } } },
            },
          },
          section_gaps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                section: { type: "string" },
                issue: { type: "string" },
                missing_terms: { type: "array", items: { type: "string" } },
              },
            },
          },
          skill_suggestions: { type: "array", items: { type: "string" } },
          bullet_suggestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                index: { type: "number" },
                job_title: { type: "string" },
                company: { type: "string" },
                bullets: { type: "array", items: { type: "string" } },
                keywords_added: { type: "array", items: { type: "string" } },
              },
            },
          },
          summary_suggestion: { type: "string" },
          quick_wins: { type: "array", items: { type: "string" } },
          red_flags: { type: "array", items: { type: "string" } },
          hard_skills_analysis: {
            type: "object",
            properties: {
              found: { type: "array", items: { type: "string" } },
              missing: { type: "array", items: { type: "string" } },
            },
          },
          soft_skills_analysis: {
            type: "object",
            properties: {
              found: { type: "array", items: { type: "string" } },
              missing: { type: "array", items: { type: "string" } },
            },
          },
          action_verb_strength: {
            type: "object",
            properties: {
              weak_verbs: { type: "array", items: { type: "string" } },
              strong_replacements: { type: "array", items: { type: "object", properties: { weak: { type: "string" }, strong: { type: "string" } } } },
            },
          },
          formatting_tips: { type: "array", items: { type: "string" } },
          job_title_match: {
            type: "object",
            properties: {
              matches: { type: "boolean" },
              note: { type: "string" },
            },
          },
        },
      },
    });

    setScanResult(result);
    setStage(STAGES.RESULTS);
  };

  const handleApplyAndRefresh = (updatedResume) => {
    setResumes(prev => prev.map(r => r.id === updatedResume.id ? updatedResume : r));
    setSelectedResume(updatedResume);
  };

  const reset = () => {
    setScanResult(null);
    setStage(STAGES.SETUP);
  };

  return (
    <div className="min-h-screen bg-[#060b12]">
      {/* Header Banner */}
      <div className="relative overflow-hidden border-b border-cyan-500/20" style={{ background: "linear-gradient(135deg, #030d18 0%, #061420 50%, #041018 100%)" }}>
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 left-20 w-48 h-48 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 py-7 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/30 shrink-0">
                <ScanSearch className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>ATS Scanner</h1>
                  <span className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-[10px] font-black rounded-full uppercase tracking-wider">AI-Powered</span>
                </div>
                <p className="text-slate-400 text-sm">Paste any job description → get exact keywords, bullet rewrites & skills to add</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { icon: KeyRound, text: "Keyword Gap Analysis", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
                { icon: Wand2, text: "1-Click Apply", color: "text-violet-400 border-violet-500/30 bg-violet-500/10" },
                { icon: BarChart2, text: "Match Score", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
                { icon: Star, text: "Hard & Soft Skills", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
                { icon: AlertCircle, text: "Formatting Fixes", color: "text-rose-400 border-rose-500/30 bg-rose-500/10" },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-semibold ${color}`}>
                  <Icon className="w-3.5 h-3.5" /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">

          {/* ── SETUP ── */}
          {stage === STAGES.SETUP && (
            <motion.div key="setup" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <ATSExplainerBanner />
              <div className="grid lg:grid-cols-5 gap-6">
                {/* Left: Inputs */}
                <div className="lg:col-span-3 space-y-5">
                  <div className="bg-white/4 border border-white/8 rounded-2xl p-6 space-y-5">
                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-cyan-400" /> Job Details
                    </h2>

                    {/* Resume Select */}
                    <div>
                      <label className="text-sm font-semibold text-slate-300 mb-2 block">Select Resume</label>
                      {resumes.length === 0 ? (
                        <div className="flex items-center gap-2 px-3 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-sm">
                          <AlertTriangle className="w-4 h-4 shrink-0" /> No resumes yet. Create one in the Dashboard first.
                        </div>
                      ) : (
                        <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white h-11">
                            <SelectValue placeholder="Choose a resume..." />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0d1a26] border-white/10">
                            {resumes.map(r => (
                              <SelectItem key={r.id} value={r.id} className="text-white hover:bg-white/10">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>{r.title}</span>
                                  {r.ats_score > 0 && <span className="text-xs text-slate-500">({r.ats_score}% ATS)</span>}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* Job Title */}
                    <div>
                      <label className="text-sm font-semibold text-slate-300 mb-2 block">Job Title <span className="text-slate-600 font-normal">(optional)</span></label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={e => setJobTitle(e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                        className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    {/* JD Input */}
                    <div>
                      <label className="text-sm font-semibold text-slate-300 mb-2 block">
                        Job Description <span className="text-cyan-400">*</span>
                      </label>
                      <Textarea
                        value={jobDescription}
                        onChange={e => setJobDescription(e.target.value)}
                        placeholder="Paste the full job description here — requirements, responsibilities, qualifications, skills needed, etc. The more complete, the better the analysis."
                        rows={12}
                        className="bg-white/5 border-white/10 text-white placeholder-slate-600 text-sm resize-none"
                      />
                      {jobDescription.length > 0 && (
                        <p className="text-xs text-slate-600 mt-1">{jobDescription.length} characters · {jobDescription.split(/\s+/).filter(Boolean).length} words</p>
                      )}
                    </div>

                    <Button
                      onClick={runScan}
                      disabled={!selectedResumeId || !jobDescription.trim()}
                      size="lg"
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/20 h-12"
                    >
                      <ScanSearch className="w-5 h-5 mr-2" />
                      Scan & Analyze ATS Fit
                    </Button>
                  </div>
                </div>

                {/* Right: How it works */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-slate-400" /> What You Get
                    </h3>
                    <div className="space-y-3">
                      {[
                        { icon: BarChart2, color: "text-emerald-400 bg-emerald-500/10", title: "ATS Match Score", desc: "Overall % match of your resume vs. the job description" },
                        { icon: KeyRound, color: "text-cyan-400 bg-cyan-500/10", title: "Keyword Gap Report", desc: "Exact keywords from the JD missing in your resume" },
                        { icon: Star, color: "text-amber-400 bg-amber-500/10", title: "Hard & Soft Skills Split", desc: "Separate analysis for technical skills vs. soft skills" },
                        { icon: Plus, color: "text-violet-400 bg-violet-500/10", title: "Skills to Add", desc: "Specific skills/tools from the JD you should list" },
                        { icon: Wand2, color: "text-rose-400 bg-rose-500/10", title: "Rewritten Summary", desc: "A new summary packed with the right keywords" },
                        { icon: Briefcase, color: "text-blue-400 bg-blue-500/10", title: "Bullet Point Rewrites", desc: "AI-improved bullets with stronger action verbs" },
                        { icon: AlertCircle, color: "text-orange-400 bg-orange-500/10", title: "Formatting & Structure Tips", desc: "Fix ATS-breaking formatting issues in your resume" },
                        { icon: Zap, color: "text-pink-400 bg-pink-500/10", title: "Quick Wins", desc: "Top 5 easiest changes to boost your score instantly" },
                      ].map(({ icon: Icon, color, title, desc }) => (
                        <div key={title} className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-semibold">{title}</p>
                            <p className="text-slate-500 text-xs">{desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedResume && (
                    <div className="bg-white/4 border border-white/8 rounded-2xl p-4">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Selected Resume</p>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-500/15 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                          <FileText className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{selectedResume.title}</p>
                          <p className="text-slate-500 text-xs capitalize">{selectedResume.template} template · {selectedResume.skills?.length || 0} skills</p>
                        </div>
                      </div>
                      {selectedResume.ats_score > 0 && (
                        <div className="mt-3 flex items-center justify-between bg-white/4 rounded-lg px-3 py-2">
                          <span className="text-xs text-slate-500">Current ATS Score</span>
                          <span className={`text-sm font-bold ${selectedResume.ats_score >= 80 ? "text-emerald-400" : selectedResume.ats_score >= 60 ? "text-amber-400" : "text-rose-400"}`}>
                            {selectedResume.ats_score}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SCANNING ── */}
          {stage === STAGES.SCANNING && (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-32">
              <div className="relative inline-flex mb-8">
                <div className="w-24 h-24 bg-cyan-500/15 border border-cyan-500/30 rounded-full flex items-center justify-center">
                  <ScanSearch className="w-12 h-12 text-cyan-400 animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Scanning Your Resume...</h3>
              <p className="text-slate-400 mb-1">AI is comparing every line of your resume against the job description</p>
              <p className="text-slate-600 text-sm">Finding keyword gaps · Crafting bullet rewrites · Building your action plan</p>
              <div className="flex justify-center gap-1.5 mt-8">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── RESULTS ── */}
          {stage === STAGES.RESULTS && scanResult && (
            <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Scan Results</h2>
                  <p className="text-slate-500 text-sm mt-0.5">
                    {selectedResume?.title} vs. {jobTitle || "Job Description"}
                  </p>
                </div>
                <Button
                  onClick={reset}
                  variant="outline"
                  className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5 gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> New Scan
                </Button>
              </div>
              <ATSScannerResults
                result={scanResult}
                resume={selectedResume}
                onApplyChanges={handleApplyAndRefresh}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}