import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import {
  FileText, Briefcase, Sparkles, ArrowRight, User, ChevronDown,
  Building2, GraduationCap, Target, Lightbulb
} from "lucide-react";

const TONES = [
  { value: "professional", label: "Professional", desc: "Formal & business-focused", emoji: "💼" },
  { value: "enthusiastic", label: "Enthusiastic", desc: "Energetic & passionate", emoji: "🔥" },
  { value: "confident", label: "Confident", desc: "Bold & assertive", emoji: "⚡" },
  { value: "conversational", label: "Conversational", desc: "Warm & approachable", emoji: "🤝" },
  { value: "creative", label: "Creative", desc: "Expressive & unique", emoji: "🎨" },
  { value: "executive", label: "Executive", desc: "Senior & authoritative", emoji: "👔" },
];

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Marketing", "Sales",
  "Education", "Engineering", "Design", "Legal", "Consulting",
  "Operations", "HR / People", "Startups", "Non-profit", "Other"
];

const EXPERIENCE_LEVELS = [
  { value: "fresher", label: "Fresher / Entry Level", desc: "0-1 years" },
  { value: "junior", label: "Junior", desc: "1-3 years" },
  { value: "mid", label: "Mid-Level", desc: "3-6 years" },
  { value: "senior", label: "Senior", desc: "6-10 years" },
  { value: "executive", label: "Executive / Director", desc: "10+ years" },
];

const QUICK_PROMPTS = [
  "Emphasize leadership and team management",
  "Focus on technical skills and projects",
  "Highlight career transition and transferable skills",
  "Mention remote work and async collaboration",
  "Stress startup mindset and adaptability",
];

export default function CoverLetterSetup({ onGenerate, isLoading }) {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [hiringManager, setHiringManager] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("professional");
  const [industry, setIndustry] = useState("Technology");
  const [experienceLevel, setExperienceLevel] = useState("mid");
  const [extraContext, setExtraContext] = useState("");
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [step, setStep] = useState(1); // 1 = basics, 2 = customization

  useEffect(() => {
    base44.entities.Resume.list("-updated_date", 20)
      .then(data => { setResumes(data); if (data.length) setSelectedResumeId(data[0].id); })
      .catch(() => {})
      .finally(() => setLoadingResumes(false));
  }, []);

  const selectedResume = resumes.find(r => r.id === selectedResumeId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;
    onGenerate({ selectedResume, jobTitle, companyName, hiringManager, jobDescription, tone, industry, experienceLevel, extraContext });
  };

  const canProceedToStep2 = jobDescription.trim().length > 30;

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2].map(s => (
          <React.Fragment key={s}>
            <button
              onClick={() => s === 2 && canProceedToStep2 ? setStep(2) : s === 1 ? setStep(1) : null}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                step === s
                  ? "bg-violet-500/20 border border-violet-500/40 text-violet-300"
                  : s < step
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-white/4 border border-white/8 text-slate-500"
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                step === s ? "bg-violet-500 text-white" : s < step ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-400"
              }`}>{s < step ? "✓" : s}</span>
              {s === 1 ? "Job Details" : "Customize"}
            </button>
            {s < 2 && <div className="flex-1 h-px bg-white/8" />}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            {/* Resume picker */}
            <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-6">
              <label className="block text-sm font-semibold text-violet-400 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" /> Your Resume
              </label>
              {loadingResumes ? (
                <div className="h-10 bg-slate-800/60 rounded-lg animate-pulse" />
              ) : resumes.length === 0 ? (
                <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-3 text-sm text-amber-300">
                  No resumes found. <a href="/Dashboard" className="underline font-semibold">Create one first</a> for best results, or use manual context below.
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedResumeId}
                    onChange={e => setSelectedResumeId(e.target.value)}
                    className="w-full bg-slate-800/60 border border-white/10 text-white rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:border-violet-500/50 pr-8"
                  >
                    {resumes.map(r => (
                      <option key={r.id} value={r.id}>{r.title || "Untitled Resume"}</option>
                    ))}
                    <option value="">— No resume (use manual context below) —</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}
              {selectedResume?.personal_info?.full_name && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs bg-violet-500/10 border border-violet-500/20 text-violet-300 px-2.5 py-1 rounded-full">
                    👤 {selectedResume.personal_info.full_name}
                  </span>
                  <span className="text-xs bg-slate-700/50 border border-white/8 text-slate-400 px-2.5 py-1 rounded-full">
                    💼 {(selectedResume.experience || []).length} experiences
                  </span>
                  <span className="text-xs bg-slate-700/50 border border-white/8 text-slate-400 px-2.5 py-1 rounded-full">
                    🛠 {(selectedResume.skills || []).length} skills
                  </span>
                </div>
              )}
            </div>

            {/* Job info */}
            <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-6 space-y-4">
              <label className="block text-sm font-semibold text-pink-400 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Job Details
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">Job Title *</label>
                  <Input value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="bg-slate-800/60 border-white/10 text-white placeholder:text-slate-600 focus:border-pink-500/50 rounded-xl" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">Company Name</label>
                  <Input value={companyName} onChange={e => setCompanyName(e.target.value)}
                    placeholder="e.g. Google"
                    className="bg-slate-800/60 border-white/10 text-white placeholder:text-slate-600 focus:border-pink-500/50 rounded-xl" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Hiring Manager Name <span className="text-slate-600">(optional)</span></label>
                <Input value={hiringManager} onChange={e => setHiringManager(e.target.value)}
                  placeholder="e.g. Sarah Johnson — personalizes the salutation"
                  className="bg-slate-800/60 border-white/10 text-white placeholder:text-slate-600 focus:border-pink-500/50 rounded-xl" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Job Description *</label>
                <Textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here — responsibilities, requirements, qualifications, about company…"
                  className="bg-slate-800/60 border-white/10 text-white placeholder:text-slate-600 min-h-[160px] resize-none focus:border-pink-500/50 rounded-xl"
                />
                {jobDescription.length > 0 && (
                  <p className="text-xs text-slate-600 mt-1.5">{jobDescription.length} characters · {jobDescription.split(/\s+/).filter(Boolean).length} words</p>
                )}
              </div>
            </div>

            <Button
              type="button"
              disabled={!canProceedToStep2}
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl text-base disabled:opacity-40"
            >
              <span className="flex items-center gap-2">
                Next: Customize Your Letter
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">

            {/* Industry */}
            <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-6">
              <label className="block text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Industry
              </label>
              <div className="relative">
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full bg-slate-800/60 border border-white/10 text-white rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:border-cyan-500/50 pr-8"
                >
                  {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Experience Level */}
            <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-6">
              <label className="block text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Experience Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EXPERIENCE_LEVELS.map(lv => (
                  <button key={lv.value} type="button" onClick={() => setExperienceLevel(lv.value)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                      experienceLevel === lv.value
                        ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-300"
                        : "bg-slate-800/40 border-white/8 text-slate-400 hover:border-white/15"
                    }`}>
                    <div className="font-semibold text-xs">{lv.label}</div>
                    <div className="text-[10px] opacity-60 mt-0.5">{lv.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-6">
              <label className="block text-sm font-semibold text-violet-400 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" /> Writing Tone
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TONES.map(t => (
                  <button key={t.value} type="button" onClick={() => setTone(t.value)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                      tone === t.value
                        ? "bg-violet-500/15 border-violet-500/50 text-violet-300"
                        : "bg-slate-800/40 border-white/8 text-slate-400 hover:border-white/15"
                    }`}>
                    <div className="text-base mb-0.5">{t.emoji}</div>
                    <div className="font-semibold text-xs">{t.label}</div>
                    <div className="text-[10px] opacity-60 mt-0.5">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Extra context + quick prompts */}
            <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-6 space-y-3">
              <label className="block text-sm font-semibold text-pink-400 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> Additional Context <span className="text-slate-600 font-normal">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map(p => (
                  <button key={p} type="button"
                    onClick={() => setExtraContext(prev => prev ? `${prev}\n${p}` : p)}
                    className="text-xs bg-slate-800/60 border border-white/10 text-slate-400 hover:text-white hover:border-pink-500/30 px-3 py-1.5 rounded-full transition-all">
                    + {p}
                  </button>
                ))}
              </div>
              <Textarea value={extraContext} onChange={e => setExtraContext(e.target.value)}
                placeholder="Referral name, specific achievements, reason you love this company, career change context, notable projects…"
                className="bg-slate-800/60 border-white/10 text-white placeholder:text-slate-600 min-h-[80px] resize-none focus:border-pink-500/50 rounded-xl" />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)}
                className="border-white/10 text-slate-400 hover:text-white px-6 rounded-xl">
                ← Back
              </Button>
              <Button type="submit" disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-400 hover:to-pink-400 text-white font-bold py-4 rounded-xl text-base shadow-lg transition-all duration-300 group disabled:opacity-50">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Crafting Your Cover Letter…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Generate Cover Letter
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}