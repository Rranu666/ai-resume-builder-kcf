import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Resume } from "@/entities/Resume";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Wand2, CheckCircle, ArrowRight, Zap, FileText, Star,
  Link as LinkIcon, AlignLeft, ChevronDown, ChevronUp,
  TrendingUp, AlertTriangle, Plus, ArrowUpRight, Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const tabs = [
  { id: "text", label: "Paste Text", icon: AlignLeft },
  { id: "url", label: "Job URL", icon: LinkIcon },
];

export default function TailorResume() {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [activeTab, setActiveTab] = useState("text");
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [expandedRole, setExpandedRole] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    Resume.list("-updated_date").then(data => {
      setResumes(data);
      if (data.length > 0) setSelectedResume(data[0]);
    }).catch(console.error);
  }, []);

  const canSubmit = selectedResume && (
    (activeTab === "text" && jobDescription.trim().length >= 50) ||
    (activeTab === "url" && jobUrl.trim().startsWith("http"))
  );

  const tailorResume = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await base44.functions.invoke("tailorResume", {
        resumeId: selectedResume.id,
        jobDescription: activeTab === "text" ? jobDescription : "",
        jobUrl: activeTab === "url" ? jobUrl : "",
      });
      if (res.data.error) { setError(res.data.error); setLoading(false); return; }
      setResult(res.data);
      setExpandedRole(0);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const ScorePill = ({ label, score, color }) => (
    <div className={`flex flex-col items-center px-5 py-3 rounded-xl border ${color}`}>
      <span className="text-2xl font-black text-white">{score}%</span>
      <span className="text-xs text-slate-400 mt-0.5">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060b12] flex flex-col">
      <div className="flex-1 p-4 lg:p-8">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-4">
              <Wand2 className="w-4 h-4 text-violet-400" />
              <span className="text-violet-300 text-sm font-medium">AI Resume Tailoring</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Tailor to Job 🎯</h1>
            <p className="text-slate-400 max-w-2xl mx-auto mb-2">
              Paste a job description or URL. AI identifies missing keywords, rewrites your bullets, and suggests skills to maximize match scores.
            </p>
            <p className="text-slate-500 text-sm">Every application is unique. Get custom resume versions that speak directly to what each employer is looking for.</p>
          </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">

              {/* Step 1 — Resume Selection */}
              <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-1">
                  <span className="text-violet-400 mr-2">①</span> Select your base resume
                </h3>
                <p className="text-slate-500 text-sm mb-4">AI will tailor a copy — your original stays untouched</p>
                {resumes.length === 0 ? (
                  <div className="text-center py-6 text-slate-400">
                    <Link to={createPageUrl("Dashboard")} className="text-emerald-400 hover:underline">Create a resume first →</Link>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {resumes.map(r => (
                      <button
                        key={r.id}
                        onClick={() => setSelectedResume(r)}
                        className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                          selectedResume?.id === r.id
                            ? "border-violet-500/60 bg-violet-500/10 ring-1 ring-violet-500/30"
                            : "border-white/8 hover:border-white/20 bg-white/3"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <p className="text-white text-sm font-medium truncate">{r.title}</p>
                        </div>
                        <p className="text-slate-500 text-xs capitalize">{r.template} · ATS {r.ats_score || 0}%</p>
                        {selectedResume?.id === r.id && (
                          <CheckCircle className="w-4 h-4 text-violet-400 mt-2" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 2 — Job Input */}
              <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">
                  <span className="text-violet-400 mr-2">②</span> Add the job description
                </h3>

                {/* Tabs */}
                <div className="flex gap-2 mb-5 bg-white/5 p-1 rounded-xl w-fit">
                  {tabs.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === t.id ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <t.icon className="w-4 h-4" />
                      {t.label}
                    </button>
                  ))}
                </div>

                {activeTab === "text" ? (
                  <>
                    <Textarea
                      value={jobDescription}
                      onChange={e => setJobDescription(e.target.value)}
                      placeholder="Paste the full job description here — include requirements, responsibilities, qualifications, and any tech stack mentioned. The more detail, the better the tailoring."
                      className="bg-white/5 border-white/10 text-white placeholder-slate-500 min-h-[220px] focus:border-violet-500/50 rounded-xl resize-none text-sm"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-slate-500 text-xs">{jobDescription.length} characters {jobDescription.length < 50 && jobDescription.length > 0 ? "— needs at least 50" : ""}</p>
                      <p className="text-slate-600 text-xs">Tip: Include the full posting for best results</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-3">
                      <Input
                        value={jobUrl}
                        onChange={e => setJobUrl(e.target.value)}
                        placeholder="https://www.linkedin.com/jobs/view/..."
                        className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-violet-500/50 flex-1"
                      />
                    </div>
                    <p className="text-slate-500 text-xs mt-2">Works with LinkedIn, Indeed, Greenhouse, Lever, Workday, and most job boards</p>
                    <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-amber-300/80 text-xs">Some job boards block automated fetching. If it fails, paste the text directly.</p>
                    </div>
                  </>
                )}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <Button
                onClick={tailorResume}
                disabled={!canSubmit || loading}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold h-12 text-base"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing job & tailoring resume...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5" /> Tailor My Resume Now
                  </span>
                )}
              </Button>
            </motion.div>

          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

              {/* Score Banner */}
              <div className="bg-gradient-to-br from-violet-500/15 via-purple-500/10 to-indigo-500/15 border border-violet-500/25 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="text-center flex-1">
                    <p className="text-slate-400 text-sm mb-1">Match Score Improvement</p>
                    <div className="flex items-center justify-center gap-3">
                      <ScorePill label="Before" score={result.tailored?.match_score_before || 0} color="border-red-500/20 bg-red-500/10" />
                      <ArrowRight className="w-5 h-5 text-slate-500" />
                      <ScorePill label="After" score={result.tailored?.match_score_after || result.matchScoreAfter || 0} color="border-emerald-500/20 bg-emerald-500/10" />
                    </div>
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <CheckCircle className="w-8 h-8 text-emerald-400 mb-2 mx-auto sm:mx-0" />
                    <h2 className="text-white font-bold text-lg">Tailored Resume Saved!</h2>
                    <p className="text-slate-400 text-sm">"{selectedResume?.title} — Tailored" added to your dashboard</p>
                  </div>
                </div>
                {result.tailored?.role_fit_analysis && (
                  <div className="mt-4 pt-4 border-t border-white/8">
                    <p className="text-slate-300 text-sm"><span className="text-violet-300 font-medium">Role Fit: </span>{result.tailored.role_fit_analysis}</p>
                  </div>
                )}
              </div>

              {/* Top Improvements */}
              {result.tailored?.top_improvements?.length > 0 && (
                <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-5">
                  <h3 className="text-emerald-300 font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Key Improvements Made
                  </h3>
                  <div className="space-y-2">
                    {result.tailored.top_improvements.map((imp, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-300 text-sm">{imp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gap Analysis Row */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Missing Keywords */}
                {result.tailored?.missing_keywords?.length > 0 && (
                  <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-4">
                    <h4 className="text-red-300 font-medium text-sm mb-3 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {result.tailored.missing_keywords.map((kw, i) => (
                        <Badge key={i} className="bg-red-500/10 text-red-300 border-red-500/20 text-xs">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keywords Added */}
                {result.tailored?.keywords_added?.length > 0 && (
                  <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4">
                    <h4 className="text-emerald-300 font-medium text-sm mb-3 flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> Keywords Added
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {result.tailored.keywords_added.map((kw, i) => (
                        <Badge key={i} className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-xs">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills to Add */}
                {result.tailored?.skills_to_add?.length > 0 && (
                  <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4">
                    <h4 className="text-amber-300 font-medium text-sm mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Suggested Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {result.tailored.skills_to_add.map((sk, i) => (
                        <Badge key={i} className="bg-amber-500/10 text-amber-300 border-amber-500/20 text-xs">{sk}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bullet Comparison — per role */}
              {result.tailored?.experience?.length > 0 && (
                <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-white/8">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <Zap className="w-4 h-4 text-violet-400" /> Bullet-by-Bullet Rewrites
                    </h3>
                    <p className="text-slate-400 text-sm mt-0.5">Expand each role to see original vs. tailored bullets</p>
                  </div>
                  {result.tailored.experience.map((exp, i) => (
                    <div key={i} className="border-b border-white/5 last:border-0">
                      <button
                        className="w-full flex items-center justify-between p-5 hover:bg-white/3 transition-colors"
                        onClick={() => setExpandedRole(expandedRole === i ? null : i)}
                      >
                        <div className="text-left">
                          <p className="text-white font-medium">{exp.title}</p>
                          <p className="text-slate-400 text-sm">{exp.company}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            {exp.bullets?.length || 0} bullets updated
                          </span>
                          {expandedRole === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedRole === i && (
                          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                            <div className="px-5 pb-5">
                              <div className="grid md:grid-cols-2 gap-4">
                                {/* Original */}
                                <div>
                                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Original</p>
                                  <div className="space-y-2">
                                    {(exp.original_bullets || []).map((b, j) => (
                                      <div key={j} className="flex items-start gap-2 bg-white/3 rounded-lg p-2.5">
                                        <span className="text-slate-600 mt-0.5 flex-shrink-0">•</span>
                                        <p className="text-slate-400 text-sm leading-relaxed">{b}</p>
                                      </div>
                                    ))}
                                    {(!exp.original_bullets || exp.original_bullets.length === 0) && (
                                      <p className="text-slate-600 text-sm italic">No original bullets</p>
                                    )}
                                  </div>
                                </div>
                                {/* Tailored */}
                                <div>
                                  <p className="text-violet-400 text-xs font-semibold uppercase tracking-wider mb-2">Tailored ✨</p>
                                  <div className="space-y-2">
                                    {(exp.bullets || []).map((b, j) => (
                                      <div key={j} className="flex items-start gap-2 bg-violet-500/8 border border-violet-500/15 rounded-lg p-2.5">
                                        <span className="text-violet-400 mt-0.5 flex-shrink-0">•</span>
                                        <p className="text-slate-200 text-sm leading-relaxed">{b}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills Gap */}
              {result.tailored?.skills_gap?.length > 0 && (
                <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-5">
                  <h4 className="text-blue-300 font-medium mb-3 flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4" /> Skills Gap — Consider Adding These
                  </h4>
                  <p className="text-slate-400 text-xs mb-3">These are required/preferred in the JD but absent from your resume. Add them if applicable.</p>
                  <div className="flex flex-wrap gap-2">
                    {result.tailored.skills_gap.map((sk, i) => (
                      <Badge key={i} className="bg-blue-500/10 text-blue-300 border-blue-500/20">{sk}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => { setResult(null); setJobDescription(""); setJobUrl(""); setError(""); }}
                  className="border-white/10 text-slate-300 hover:bg-white/5"
                >
                  ← Tailor Another
                </Button>
                <Link to={createPageUrl(`Editor?id=${result.newResumeId}`)} className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold">
                    Open Tailored Resume <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* SEO Content Footer */}
      <div className="bg-white/3 border-t border-white/5 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Perfect Your Resume for Every Job Application</h2>
          <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
            <p>One-size-fits-all resumes don't work anymore. Applicant Tracking Systems (ATS) and recruiters look for specific keywords, skills, and experience that match the exact job description. That's where AI Resume Tailoring comes in.</p>
            <p>Simply paste a job description or provide a LinkedIn job URL, and our AI analyzes the requirements in seconds. It identifies what's missing from your resume, rewrites your achievement bullets to match employer language, suggests skills to add, and shows you exactly how much your match score improves.</p>
            <p>Get personalized resume versions for every application, increasing your chances of passing ATS screening and impressing human recruiters.</p>
          </div>
          <p className="text-slate-500 text-xs text-center mt-6">Powered by AI Resume Builder · A free initiative by Kindness Community Foundation (KCF LLC) · Built to empower users with intelligent, real-time assistance and meaningful interaction.</p>
        </div>
      </div>
    </div>
  );
}