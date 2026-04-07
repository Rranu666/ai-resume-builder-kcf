import React, { useState } from "react";
import { Resume } from "@/entities/Resume";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, AlertCircle, AlertTriangle, Plus, Wand2, ChevronDown, ChevronUp,
  KeyRound, Briefcase, BarChart2, Zap, Star, ArrowRight, Copy, Check,
  Brain, Wrench, TrendingUp, FileText
} from "lucide-react";

function ScoreRing({ score }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label = score >= 75 ? "Strong Match" : score >= 50 ? "Moderate Match" : "Weak Match";
  const labelColor = score >= 75 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-rose-400";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circ} strokeDashoffset={circ - fill}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{score}%</span>
          <span className="text-xs text-slate-500">match</span>
        </div>
      </div>
      <span className={`text-sm font-bold ${labelColor}`}>{label}</span>
    </div>
  );
}

function KeywordPill({ kw, variant }) {
  const styles = {
    found: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
    missing: "bg-rose-500/15 border-rose-500/30 text-rose-300",
    suggested: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${styles[variant]}`}>
      {variant === "found" && <Check className="w-2.5 h-2.5" />}
      {variant === "missing" && <AlertCircle className="w-2.5 h-2.5" />}
      {variant === "suggested" && <Plus className="w-2.5 h-2.5" />}
      {kw}
    </span>
  );
}

function CollapsibleSection({ title, icon: Icon, iconColor, badge, badgeColor, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/4 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-semibold text-white">{title}</span>
          {badge !== undefined && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor || "bg-white/10 text-slate-400"}`}>{badge}</span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ATSScannerResults({ result, resume, onApplyChanges }) {
  const [applied, setApplied] = useState({});
  const [saving, setSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({
    skills: null,
    summary: null,
    bullets: {}, // expIndex → bullets[]
  });

  const stageSummaryChange = () => {
    setPendingChanges(p => ({ ...p, summary: result.summary_suggestion }));
  };

  const stageSkillsChange = () => {
    const existing = new Set(resume.skills || []);
    const toAdd = (result.skill_suggestions || []).filter(s => !existing.has(s));
    setPendingChanges(p => ({ ...p, skills: toAdd }));
  };

  const stageBullets = (index, bullets) => {
    setPendingChanges(p => ({ ...p, bullets: { ...p.bullets, [index]: bullets } }));
  };

  const applyAllChanges = async () => {
    setSaving(true);
    let updated = { ...resume };

    if (pendingChanges.summary) {
      updated = { ...updated, personal_info: { ...updated.personal_info, summary: pendingChanges.summary } };
      setApplied(p => ({ ...p, summary: true }));
    }

    if (pendingChanges.skills) {
      const existing = resume.skills || [];
      updated = { ...updated, skills: [...new Set([...existing, ...pendingChanges.skills])] };
      setApplied(p => ({ ...p, skills: true }));
    }

    if (Object.keys(pendingChanges.bullets).length > 0) {
      const exp = [...(updated.experience || [])];
      Object.entries(pendingChanges.bullets).forEach(([idx, bullets]) => {
        if (exp[idx]) exp[idx] = { ...exp[idx], bullets };
      });
      updated = { ...updated, experience: exp };
      setApplied(p => ({ ...p, bullets: true }));
    }

    await Resume.update(resume.id, updated);
    onApplyChanges(updated);
    setSaving(false);
  };

  const hasPending = pendingChanges.summary || pendingChanges.skills || Object.keys(pendingChanges.bullets).length > 0;

  const kw = result.keyword_analysis || {};
  const found = kw.found_keywords || [];
  const missing = kw.missing_keywords || [];
  const partial = kw.partial_matches || [];

  return (
    <div className="space-y-5">
      {/* Top Row: Score + Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-cyan-950/40 to-blue-950/40 border border-cyan-500/20 rounded-2xl p-6 flex flex-col items-center justify-center">
          <ScoreRing score={result.match_score || 0} />
        </div>
        <div className="sm:col-span-2 grid grid-cols-2 gap-3">
          {[
            { label: "Keywords Found", value: found.length, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
            { label: "Keywords Missing", value: missing.length, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
            { label: "Skills to Add", value: (result.skill_suggestions || []).length, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
            { label: "Weak Verbs", value: (result.action_verb_strength?.weak_verbs || []).length, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
            { label: "Hard Skills Missing", value: (result.hard_skills_analysis?.missing || []).length, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
            { label: "Formatting Tips", value: (result.formatting_tips || []).length, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`border rounded-xl p-3 ${bg}`}>
              <p className="text-xs text-slate-500 mb-1">{label}</p>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Red Flags */}
      {result.red_flags?.length > 0 && (
        <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-white">Critical Gaps — Fix These First</h3>
          </div>
          <ul className="space-y-2">
            {result.red_flags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-rose-300">
                <span className="text-rose-500 mt-0.5 shrink-0">✕</span> {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Wins */}
      {result.quick_wins?.length > 0 && (
        <CollapsibleSection
          title="Quick Wins"
          icon={Zap}
          iconColor="bg-amber-500/15 text-amber-400"
          badge={`${result.quick_wins.length} actions`}
          badgeColor="bg-amber-500/20 text-amber-400"
        >
          <div className="pt-4 space-y-2">
            {result.quick_wins.map((win, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-black text-amber-400">{i + 1}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{win}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Keyword Analysis */}
      <CollapsibleSection
        title="Keyword Analysis"
        icon={KeyRound}
        iconColor="bg-cyan-500/15 text-cyan-400"
        badge={`${found.length} found · ${missing.length} missing`}
        badgeColor="bg-white/10 text-slate-400"
      >
        <div className="pt-4 space-y-4">
          {missing.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Missing Keywords ({missing.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {missing.map((kw, i) => <KeywordPill key={i} kw={kw} variant="missing" />)}
              </div>
            </div>
          )}
          {found.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Already Present ({found.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {found.map((kw, i) => <KeywordPill key={i} kw={kw} variant="found" />)}
              </div>
            </div>
          )}
          {partial.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Partial Matches — Consider Updating</p>
              <div className="space-y-1.5">
                {partial.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs bg-amber-500/5 border border-amber-500/15 rounded-lg px-3 py-2">
                    <span className="text-amber-300 font-medium">{m.resume_term}</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="text-white font-semibold">{m.jd_term}</span>
                    <span className="text-slate-600 ml-1">— use exact JD phrasing</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Skills to Add */}
      {result.skill_suggestions?.length > 0 && (
        <CollapsibleSection
          title="Skills to Add"
          icon={Star}
          iconColor="bg-violet-500/15 text-violet-400"
          badge={`+${result.skill_suggestions.length} skills`}
          badgeColor="bg-violet-500/20 text-violet-400"
        >
          <div className="pt-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {result.skill_suggestions.map((s, i) => <KeywordPill key={i} kw={s} variant="suggested" />)}
            </div>
            <Button
              size="sm"
              onClick={stageSkillsChange}
              disabled={!!applied.skills || !!pendingChanges.skills}
              className="gap-1.5 bg-violet-500/15 border border-violet-500/30 text-violet-300 hover:bg-violet-500/25 h-8 text-xs"
            >
              {applied.skills ? <><CheckCircle2 className="w-3 h-3" /> Added!</> :
                pendingChanges.skills ? <><Check className="w-3 h-3" /> Staged ({pendingChanges.skills.length} new)</> :
                <><Plus className="w-3 h-3" /> Stage All Skills</>}
            </Button>
          </div>
        </CollapsibleSection>
      )}

      {/* Summary Rewrite */}
      {result.summary_suggestion && (
        <CollapsibleSection
          title="Rewritten Summary"
          icon={Wand2}
          iconColor="bg-emerald-500/15 text-emerald-400"
        >
          <div className="pt-4 space-y-3">
            <p className="text-xs text-slate-500 mb-2">AI-optimized with the most critical missing keywords:</p>
            <div className="bg-white/4 border border-white/8 rounded-xl p-4">
              <p className="text-sm text-slate-200 leading-relaxed italic">"{result.summary_suggestion}"</p>
            </div>
            <Button
              size="sm"
              onClick={stageSummaryChange}
              disabled={!!applied.summary || !!pendingChanges.summary}
              className="gap-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 h-8 text-xs"
            >
              {applied.summary ? <><CheckCircle2 className="w-3 h-3" /> Applied!</> :
                pendingChanges.summary ? <><Check className="w-3 h-3" /> Staged</> :
                <><Wand2 className="w-3 h-3" /> Stage Summary Rewrite</>}
            </Button>
          </div>
        </CollapsibleSection>
      )}

      {/* Bullet Suggestions */}
      {result.bullet_suggestions?.length > 0 && (
        <CollapsibleSection
          title="Experience Bullet Rewrites"
          icon={Briefcase}
          iconColor="bg-blue-500/15 text-blue-400"
          badge={`${result.bullet_suggestions.length} roles`}
          badgeColor="bg-blue-500/20 text-blue-400"
        >
          <div className="pt-4 space-y-4">
            {result.bullet_suggestions.map((expSug, i) => {
              const isStaged = !!pendingChanges.bullets[expSug.index];
              return (
                <div key={i} className="bg-white/4 border border-white/8 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="text-sm font-bold text-white">{expSug.job_title}</p>
                      {expSug.company && <p className="text-xs text-slate-500">{expSug.company}</p>}
                    </div>
                    {expSug.keywords_added?.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {expSug.keywords_added.map((kw, ki) => (
                          <span key={ki} className="text-[10px] bg-blue-500/15 border border-blue-500/25 text-blue-300 px-2 py-0.5 rounded-full">+{kw}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {expSug.bullets?.map((b, bi) => (
                      <li key={bi} className="flex gap-2 text-sm text-slate-300">
                        <span className="text-blue-400 mt-0.5 shrink-0">▸</span>
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="sm"
                    onClick={() => stageBullets(expSug.index, expSug.bullets)}
                    disabled={isStaged}
                    className="gap-1.5 bg-blue-500/15 border border-blue-500/30 text-blue-300 hover:bg-blue-500/25 h-8 text-xs w-full"
                  >
                    {isStaged ? <><Check className="w-3 h-3" /> Staged</> : <><Plus className="w-3 h-3" /> Stage These Bullets</>}
                  </Button>
                </div>
              );
            })}
          </div>
        </CollapsibleSection>
      )}

      {/* Section Gaps */}
      {result.section_gaps?.length > 0 && (
        <CollapsibleSection
          title="Section-Level Gaps"
          icon={BarChart2}
          iconColor="bg-rose-500/15 text-rose-400"
          badge={`${result.section_gaps.length} sections`}
          badgeColor="bg-rose-500/20 text-rose-400"
          defaultOpen={false}
        >
          <div className="pt-4 space-y-3">
            {result.section_gaps.map((gap, i) => (
              <div key={i} className="p-3 bg-rose-500/5 border border-rose-500/15 rounded-xl">
                <p className="text-xs font-bold text-rose-400 uppercase mb-1">{gap.section}</p>
                <p className="text-sm text-slate-300 mb-2">{gap.issue}</p>
                {gap.missing_terms?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {gap.missing_terms.map((t, ti) => (
                      <span key={ti} className="text-xs bg-rose-500/10 border border-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Hard & Soft Skills Split */}
      {(result.hard_skills_analysis || result.soft_skills_analysis) && (
        <CollapsibleSection
          title="Hard Skills vs. Soft Skills"
          icon={Brain}
          iconColor="bg-violet-500/15 text-violet-400"
          defaultOpen={false}
        >
          <div className="pt-4 grid sm:grid-cols-2 gap-4">
            {result.hard_skills_analysis && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" /> Hard / Technical Skills
                </p>
                {result.hard_skills_analysis.found?.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-600 mb-1.5">✓ Present in resume</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.hard_skills_analysis.found.map((s, i) => <KeywordPill key={i} kw={s} variant="found" />)}
                    </div>
                  </div>
                )}
                {result.hard_skills_analysis.missing?.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-600 mb-1.5">✕ Missing from resume</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.hard_skills_analysis.missing.map((s, i) => <KeywordPill key={i} kw={s} variant="missing" />)}
                    </div>
                  </div>
                )}
              </div>
            )}
            {result.soft_skills_analysis && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" /> Soft Skills
                </p>
                {result.soft_skills_analysis.found?.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-600 mb-1.5">✓ Present in resume</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.soft_skills_analysis.found.map((s, i) => <KeywordPill key={i} kw={s} variant="found" />)}
                    </div>
                  </div>
                )}
                {result.soft_skills_analysis.missing?.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-600 mb-1.5">✕ Missing from resume</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.soft_skills_analysis.missing.map((s, i) => <KeywordPill key={i} kw={s} variant="missing" />)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CollapsibleSection>
      )}

      {/* Action Verb Strength */}
      {result.action_verb_strength?.weak_verbs?.length > 0 && (
        <CollapsibleSection
          title="Action Verb Strength"
          icon={TrendingUp}
          iconColor="bg-orange-500/15 text-orange-400"
          badge={`${result.action_verb_strength.weak_verbs.length} weak verbs found`}
          badgeColor="bg-orange-500/20 text-orange-400"
          defaultOpen={false}
        >
          <div className="pt-4 space-y-3">
            <p className="text-xs text-slate-500">Strong action verbs increase ATS ranking and impress recruiters. Replace these weak verbs:</p>
            {result.action_verb_strength.strong_replacements?.length > 0 ? (
              <div className="space-y-2">
                {result.action_verb_strength.strong_replacements.map((pair, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-2.5">
                    <span className="text-sm text-rose-300 font-mono line-through opacity-70">{pair.weak}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span className="text-sm text-emerald-300 font-semibold">{pair.strong}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {result.action_verb_strength.weak_verbs.map((v, i) => (
                  <span key={i} className="text-xs bg-orange-500/10 border border-orange-500/20 text-orange-300 px-2.5 py-1 rounded-full line-through">{v}</span>
                ))}
              </div>
            )}
          </div>
        </CollapsibleSection>
      )}

      {/* Formatting Tips */}
      {result.formatting_tips?.length > 0 && (
        <CollapsibleSection
          title="Formatting & Structure Tips"
          icon={FileText}
          iconColor="bg-amber-500/15 text-amber-400"
          badge={`${result.formatting_tips.length} tips`}
          badgeColor="bg-amber-500/20 text-amber-400"
          defaultOpen={false}
        >
          <div className="pt-4 space-y-2">
            <p className="text-xs text-slate-500 mb-3">ATS systems reject poorly formatted resumes even when keywords match. Fix these:</p>
            {result.formatting_tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                <div className="w-5 h-5 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-black text-amber-400">{i + 1}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Job Title Match */}
      {result.job_title_match && (
        <div className={`flex items-start gap-4 p-4 rounded-2xl border ${result.job_title_match.matches ? "bg-emerald-500/8 border-emerald-500/25" : "bg-amber-500/8 border-amber-500/25"}`}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${result.job_title_match.matches ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
            {result.job_title_match.matches ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">
              Job Title Match: {result.job_title_match.matches ? "✓ Good Alignment" : "⚠ Title Mismatch Detected"}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">{result.job_title_match.note}</p>
          </div>
        </div>
      )}

      {/* Apply All Banner */}
      <div className={`sticky bottom-4 rounded-2xl border p-4 transition-all duration-300 ${hasPending
        ? "bg-gradient-to-r from-cyan-900/80 to-blue-900/80 border-cyan-500/40 shadow-xl shadow-cyan-500/20 backdrop-blur-xl"
        : "bg-white/4 border-white/8"}`}
      >
        {hasPending ? (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-white font-semibold text-sm">Changes Staged & Ready</p>
              <p className="text-cyan-300 text-xs mt-0.5">
                {[
                  pendingChanges.summary && "Summary rewrite",
                  pendingChanges.skills && `${pendingChanges.skills.length} new skills`,
                  Object.keys(pendingChanges.bullets).length > 0 && `${Object.keys(pendingChanges.bullets).length} experience bullet sets`,
                ].filter(Boolean).join(" · ")}
              </p>
            </div>
            <Button
              onClick={applyAllChanges}
              disabled={saving}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg gap-2"
            >
              {saving ? <><Wand2 className="w-4 h-4 animate-spin" /> Saving...</> : <><CheckCircle2 className="w-4 h-4" /> Apply All Changes</>}
            </Button>
          </div>
        ) : (
          <p className="text-xs text-slate-600 text-center">Stage suggestions above, then apply all at once to your resume.</p>
        )}
      </div>
    </div>
  );
}