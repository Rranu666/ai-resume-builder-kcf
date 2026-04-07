import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  RotateCcw, Copy, Check, Download, Edit3, RefreshCw, Sparkles,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Wand2,
  KeyRound, TrendingUp, Lightbulb, ArrowRight, FileText, Zap
} from "lucide-react";

const ATSBar = ({ score }) => {
  const color = score >= 75 ? "from-emerald-500 to-green-400" : score >= 50 ? "from-amber-500 to-yellow-400" : "from-rose-500 to-red-400";
  const label = score >= 75 ? "Excellent" : score >= 50 ? "Good" : "Needs Work";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-slate-800/60 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
      <span className={`text-xs font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{score}% — {label}</span>
    </div>
  );
};

const REFINE_SUGGESTIONS = [
  "Make the opening more impactful and unique",
  "Add more quantifiable achievements",
  "Shorten to fit on one page",
  "Make it sound more confident",
  "Add industry-specific keywords",
  "Rewrite for a career change angle",
  "Make the closing stronger",
  "Emphasize leadership and management skills",
];

export default function CoverLetterOutput({ result, jobTitle, companyName, onReset, onRegenerate, onRefine, isLoading, isRefining }) {
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(result.cover_letter);
  const [showRefinePanel, setShowRefinePanel] = useState(false);
  const [refineInstruction, setRefineInstruction] = useState("");
  const [showTips, setShowTips] = useState(true);
  const [showMissing, setShowMissing] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([editedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${(companyName || "company").toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefine = async () => {
    if (!refineInstruction.trim()) return;
    const refined = await onRefine(editedText, refineInstruction);
    if (refined) {
      setEditedText(refined);
      setRefineInstruction("");
      setShowRefinePanel(false);
    }
  };

  const wordCount = editedText.split(/\s+/).filter(Boolean).length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 px-3 py-1 rounded-full text-violet-400 text-xs font-bold mb-2">
            <Sparkles className="w-3 h-3" /> AI Generated
          </div>
          <h2 className="text-2xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {jobTitle ? `Cover Letter — ${jobTitle}` : "Your Cover Letter"}
            {companyName && <span className="text-violet-400"> @ {companyName}</span>}
          </h2>
          <p className="text-slate-500 text-sm mt-1">{wordCount} words · Personalized & ATS-optimized</p>
        </div>
        <Button variant="outline" size="sm" onClick={onReset} className="border-white/10 text-slate-400 hover:text-white flex-shrink-0 rounded-xl">
          <RotateCcw className="w-4 h-4 mr-1.5" /> New Letter
        </Button>
      </div>

      {/* ATS Score */}
      {result.ats_score > 0 && (
        <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> ATS Friendliness Score
            </p>
            {result.tone_analysis && (
              <span className="text-xs text-slate-500 italic max-w-xs text-right">{result.tone_analysis}</span>
            )}
          </div>
          <ATSBar score={result.ats_score} />
        </div>
      )}

      {/* Key Matches */}
      {result.key_matches?.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-950/50 to-cyan-950/30 border border-emerald-500/20 rounded-2xl p-4">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Matched Keywords ({result.key_matches.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {result.key_matches.map((match, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 font-medium">
                ✓ {match}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Keywords */}
      {result.missing_keywords?.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/40 to-orange-950/20 border border-amber-500/20 rounded-2xl overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 text-left"
            onClick={() => setShowMissing(p => !p)}>
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" /> Missing Keywords to Consider Adding
            </p>
            {showMissing ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>
          <AnimatePresence>
            {showMissing && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-4 pb-4 flex flex-wrap gap-2">
                  {result.missing_keywords.map((kw, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 font-medium">
                      + {kw}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Letter Body */}
      <div className="bg-slate-900/70 border border-white/8 rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-4 py-2.5 border-b border-white/5 bg-slate-900/40 flex-wrap">
          <div className="flex items-center gap-1 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <span className="text-xs text-slate-600 flex-1">Cover Letter Draft · {wordCount} words</span>
          <Button variant="ghost" size="sm" onClick={() => setEditMode(e => !e)}
            className={`text-xs h-7 px-3 ${editMode ? "text-yellow-400 bg-yellow-500/10" : "text-slate-400"}`}>
            <Edit3 className="w-3 h-3 mr-1.5" />{editMode ? "Done Editing" : "Edit"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowRefinePanel(p => !p)}
            className={`text-xs h-7 px-3 ${showRefinePanel ? "text-violet-400 bg-violet-500/10" : "text-slate-400"}`}>
            <Wand2 className="w-3 h-3 mr-1.5" />AI Refine
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCopy} className="text-xs h-7 px-3 text-slate-400 hover:text-white">
            {copied ? <><Check className="w-3 h-3 mr-1.5 text-emerald-400" />Copied</> : <><Copy className="w-3 h-3 mr-1.5" />Copy</>}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload} className="text-xs h-7 px-3 text-slate-400 hover:text-white">
            <Download className="w-3 h-3 mr-1.5" />Download
          </Button>
        </div>

        {/* AI Refine Panel */}
        <AnimatePresence>
          {showRefinePanel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-white/5"
            >
              <div className="p-4 bg-violet-500/5 space-y-3">
                <p className="text-xs font-bold text-violet-400 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5" /> AI Refine — tell AI what to change
                </p>
                <div className="flex flex-wrap gap-2">
                  {REFINE_SUGGESTIONS.map(s => (
                    <button key={s} type="button"
                      onClick={() => setRefineInstruction(s)}
                      className="text-xs bg-slate-800/60 border border-white/10 text-slate-400 hover:text-violet-300 hover:border-violet-500/30 px-2.5 py-1 rounded-full transition-all">
                      {s}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={refineInstruction}
                    onChange={e => setRefineInstruction(e.target.value)}
                    placeholder="Or type a custom instruction…"
                    className="flex-1 bg-slate-800/60 border border-white/10 text-white text-sm placeholder:text-slate-600 rounded-xl px-3 py-2 focus:outline-none focus:border-violet-500/50"
                    onKeyDown={e => e.key === "Enter" && handleRefine()}
                  />
                  <Button onClick={handleRefine} disabled={!refineInstruction.trim() || isRefining}
                    className="bg-violet-500 hover:bg-violet-400 text-white px-4 rounded-xl text-sm disabled:opacity-50">
                    {isRefining ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Zap className="w-3.5 h-3.5 mr-1.5" />Apply</>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="p-6">
          {editMode ? (
            <textarea
              value={editedText}
              onChange={e => setEditedText(e.target.value)}
              className="w-full bg-transparent text-slate-200 text-sm leading-8 resize-none focus:outline-none min-h-[420px]"
              style={{ fontFamily: "'Georgia', serif" }}
            />
          ) : (
            <div className="text-slate-200 text-sm leading-8 whitespace-pre-wrap" style={{ fontFamily: "'Georgia', serif" }}>
              {editedText}
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      {result.tips?.length > 0 && (
        <div className="bg-slate-900/60 border border-white/8 rounded-2xl overflow-hidden">
          <button className="w-full flex items-center justify-between p-4"
            onClick={() => setShowTips(p => !p)}>
            <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" /> AI Tips to Strengthen This Letter
            </p>
            {showTips ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>
          <AnimatePresence>
            {showTips && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-4 pb-4 space-y-2">
                  {result.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl">
                      <span className="w-5 h-5 bg-cyan-500/15 rounded-full flex items-center justify-center text-[10px] font-black text-cyan-400 shrink-0">{i + 1}</span>
                      <p className="text-sm text-slate-400 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex gap-3">
        <Button onClick={handleCopy} variant="outline"
          className="flex-1 border-white/10 text-slate-300 hover:text-white hover:bg-white/5 py-3 rounded-xl">
          {copied ? <><Check className="w-4 h-4 mr-2 text-emerald-400" />Copied!</> : <><Copy className="w-4 h-4 mr-2" />Copy Letter</>}
        </Button>
        <Button onClick={handleDownload} variant="outline"
          className="flex-1 border-white/10 text-slate-300 hover:text-white hover:bg-white/5 py-3 rounded-xl">
          <Download className="w-4 h-4 mr-2" />Download .txt
        </Button>
        <Button onClick={onRegenerate} disabled={isLoading} variant="outline"
          className="flex-1 border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:border-violet-500/50 py-3 rounded-xl">
          {isLoading
            ? <><span className="w-4 h-4 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin mr-2" />Regenerating…</>
            : <><RefreshCw className="w-4 h-4 mr-2" />Regenerate</>}
        </Button>
      </div>

      {/* KCF attribution */}
      <div className="text-center py-3 border-t border-white/5">
        <p className="text-xs text-slate-600">
          Free tool by <a href="https://kindnesscommunityfoundation.com" target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:text-violet-400">Kindness Community Foundation (KCF LLC)</a> · Empowering careers worldwide 🌍
        </p>
      </div>
    </motion.div>
  );
}