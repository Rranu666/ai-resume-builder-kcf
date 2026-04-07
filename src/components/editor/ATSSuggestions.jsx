import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Target, ChevronDown, ChevronUp, Plus, Wand2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const SECTIONS = ["summary", "experience", "skills", "projects"];

const sectionLabel = { summary: "Summary", experience: "Experience", skills: "Skills", projects: "Projects" };

export default function ATSSuggestions({ resume, onUpdateResume }) {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null); // { score, sections: { summary, experience, skills, projects } }
  const [expanded, setExpanded] = useState({});
  const [applied, setApplied] = useState({});

  const analyze = async () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    setResults(null);
    setApplied({});
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert ATS resume optimizer. Analyze this resume against the job description and provide SPECIFIC, actionable improvements for each section.

JOB DESCRIPTION:
${jobDescription}

RESUME:
Name: ${resume.personal_info?.full_name}
Summary: ${resume.personal_info?.summary || "(none)"}
Skills: ${(resume.skills || []).join(", ") || "(none)"}
Experience: ${(resume.experience || []).map(e => `${e.title} at ${e.company}: ${(e.bullets || []).join(" | ")}`).join("\n") || "(none)"}
Projects: ${(resume.projects || []).map(p => `${p.name}: ${p.description}`).join("\n") || "(none)"}

Provide:
1. An overall ATS match score (0-100)
2. For "summary": 1-2 specific keyword phrases to add, and an improved summary text that naturally includes them
3. For "experience": for each existing experience entry (by index 0,1,2...), suggest 1-2 improved bullet points that add missing keywords from the JD
4. For "skills": list of missing skills/keywords from the JD that should be added
5. For "projects": any keyword phrases to naturally add to project descriptions

Be VERY specific — use exact phrases from the job description.`,
        response_json_schema: {
          type: "object",
          properties: {
            ats_score: { type: "number" },
            summary: {
              type: "object",
              properties: {
                missing_keywords: { type: "array", items: { type: "string" } },
                improved_text: { type: "string" },
              },
            },
            experience: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  index: { type: "number" },
                  title: { type: "string" },
                  improved_bullets: { type: "array", items: { type: "string" } },
                  keywords_added: { type: "array", items: { type: "string" } },
                },
              },
            },
            skills: {
              type: "object",
              properties: {
                missing: { type: "array", items: { type: "string" } },
              },
            },
            projects: {
              type: "object",
              properties: {
                suggestions: { type: "array", items: { type: "string" } },
              },
            },
          },
        },
      });
      setResults(res);
      // auto-expand all sections that have suggestions
      const exp = {};
      SECTIONS.forEach(s => { exp[s] = true; });
      setExpanded(exp);
    } catch (e) {
      console.error(e);
    }
    setIsAnalyzing(false);
  };

  const applySummary = () => {
    if (!results?.summary?.improved_text) return;
    onUpdateResume({
      ...resume,
      personal_info: { ...resume.personal_info, summary: results.summary.improved_text },
    });
    setApplied(p => ({ ...p, summary: true }));
  };

  const applySkills = (skillsToAdd) => {
    const existing = resume.skills || [];
    onUpdateResume({ ...resume, skills: [...new Set([...existing, ...skillsToAdd])] });
    setApplied(p => ({ ...p, skills: true }));
  };

  const applyExperienceBullets = (expIndex, bullets) => {
    const exp = [...(resume.experience || [])];
    if (!exp[expIndex]) return;
    exp[expIndex] = { ...exp[expIndex], bullets };
    onUpdateResume({ ...resume, experience: exp });
    setApplied(p => ({ ...p, [`exp_${expIndex}`]: true }));
  };

  const toggle = (section) => setExpanded(p => ({ ...p, [section]: !p[section] }));

  const scoreColor = (s) =>
    s >= 80 ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" :
    s >= 60 ? "text-amber-400 border-amber-500/30 bg-amber-500/10" :
    "text-rose-400 border-rose-500/30 bg-rose-500/10";

  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Target className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">ATS Boost Panel</p>
          <p className="text-cyan-400 text-xs">Section-by-section keyword suggestions</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* JD Input */}
        <div>
          <label className="text-slate-400 text-xs font-medium mb-1.5 block">Paste Job Description</label>
          <Textarea
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here to get tailored ATS suggestions for each resume section..."
            rows={5}
            className="bg-white/5 border-white/10 text-white placeholder-slate-600 text-sm resize-none"
          />
        </div>

        <Button
          onClick={analyze}
          disabled={isAnalyzing || !jobDescription.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-black font-bold shadow-lg shadow-blue-500/20 gap-2"
        >
          {isAnalyzing ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
          ) : (
            <><Target className="w-4 h-4" /> Analyze & Boost ATS</>
          )}
        </Button>

        {/* Results */}
        <AnimatePresence>
          {results && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {/* Score badge */}
              <div className="flex items-center justify-between p-3 bg-white/4 border border-white/8 rounded-xl">
                <span className="text-slate-300 text-sm font-medium">Current ATS Match</span>
                <span className={`text-lg font-bold px-3 py-0.5 rounded-full border ${scoreColor(results.ats_score)}`}>
                  {results.ats_score}%
                </span>
              </div>

              {/* Summary */}
              {results.summary && (
                <SectionPanel
                  label="Summary"
                  icon="📝"
                  expanded={expanded.summary}
                  onToggle={() => toggle("summary")}
                  isApplied={applied.summary}
                  badgeCount={results.summary.missing_keywords?.length}
                >
                  <div className="space-y-3">
                    {results.summary.missing_keywords?.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-500 mb-1.5">Missing keywords:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {results.summary.missing_keywords.map((kw, i) => (
                            <span key={i} className="text-xs bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full">🔑 {kw}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {results.summary.improved_text && (
                      <div>
                        <p className="text-xs text-slate-500 mb-1.5">Improved summary:</p>
                        <p className="text-xs text-slate-300 bg-white/4 border border-white/8 rounded-lg p-3 leading-relaxed italic">"{results.summary.improved_text}"</p>
                        <Button
                          size="sm"
                          onClick={applySummary}
                          disabled={applied.summary}
                          className="mt-2 w-full h-7 text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 gap-1"
                        >
                          {applied.summary ? <><CheckCircle2 className="w-3 h-3" /> Applied!</> : <><Wand2 className="w-3 h-3" /> Apply Improved Summary</>}
                        </Button>
                      </div>
                    )}
                  </div>
                </SectionPanel>
              )}

              {/* Experience */}
              {results.experience?.length > 0 && (
                <SectionPanel
                  label="Experience"
                  icon="💼"
                  expanded={expanded.experience}
                  onToggle={() => toggle("experience")}
                  isApplied={results.experience.every((_, i) => applied[`exp_${i}`])}
                  badgeCount={results.experience.length}
                >
                  <div className="space-y-3">
                    {results.experience.map((expSug, i) => (
                      <div key={i} className="bg-white/4 border border-white/8 rounded-xl p-3 space-y-2">
                        <p className="text-xs font-semibold text-white">{expSug.title || `Experience ${expSug.index + 1}`}</p>
                        {expSug.keywords_added?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {expSug.keywords_added.map((kw, ki) => (
                              <span key={ki} className="text-xs bg-blue-500/15 border border-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full">+ {kw}</span>
                            ))}
                          </div>
                        )}
                        <ul className="space-y-1.5">
                          {expSug.improved_bullets?.map((b, bi) => (
                            <li key={bi} className="text-xs text-slate-300 flex gap-2">
                              <span className="text-cyan-400 mt-0.5 flex-shrink-0">▸</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          size="sm"
                          onClick={() => applyExperienceBullets(expSug.index, expSug.improved_bullets)}
                          disabled={applied[`exp_${expSug.index}`]}
                          className="w-full h-7 text-xs bg-blue-500/15 border border-blue-500/30 text-blue-300 hover:bg-blue-500/25 gap-1"
                        >
                          {applied[`exp_${expSug.index}`] ? <><CheckCircle2 className="w-3 h-3" /> Applied!</> : <><Wand2 className="w-3 h-3" /> Apply These Bullets</>}
                        </Button>
                      </div>
                    ))}
                  </div>
                </SectionPanel>
              )}

              {/* Skills */}
              {results.skills?.missing?.length > 0 && (
                <SectionPanel
                  label="Skills"
                  icon="⚡"
                  expanded={expanded.skills}
                  onToggle={() => toggle("skills")}
                  isApplied={applied.skills}
                  badgeCount={results.skills.missing.length}
                >
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">Missing skills from the job description:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {results.skills.missing.map((s, i) => (
                        <span key={i} className="text-xs bg-violet-500/15 border border-violet-500/30 text-violet-300 px-2.5 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => applySkills(results.skills.missing)}
                      disabled={applied.skills}
                      className="w-full h-7 text-xs bg-violet-500/15 border border-violet-500/30 text-violet-300 hover:bg-violet-500/25 gap-1"
                    >
                      {applied.skills ? <><CheckCircle2 className="w-3 h-3" /> All Added!</> : <><Plus className="w-3 h-3" /> Add All {results.skills.missing.length} Skills</>}
                    </Button>
                  </div>
                </SectionPanel>
              )}

              {/* Projects */}
              {results.projects?.suggestions?.length > 0 && (
                <SectionPanel
                  label="Projects"
                  icon="🚀"
                  expanded={expanded.projects}
                  onToggle={() => toggle("projects")}
                  badgeCount={results.projects.suggestions.length}
                >
                  <ul className="space-y-2">
                    {results.projects.suggestions.map((s, i) => (
                      <li key={i} className="text-xs text-slate-300 flex gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </SectionPanel>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SectionPanel({ label, icon, expanded, onToggle, isApplied, badgeCount, children }) {
  return (
    <div className="border border-white/8 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-white/4 hover:bg-white/6 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-sm font-medium text-white">{label}</span>
          {badgeCount > 0 && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isApplied ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
              {isApplied ? "✓" : `${badgeCount}`}
            </span>
          )}
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 bg-[#060b12]/60">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}