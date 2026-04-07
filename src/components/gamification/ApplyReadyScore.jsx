import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Target } from "lucide-react";

export default function ApplyReadyScore({ resumes = [], streak = null, hasInterviewed = false }) {
  const { score, factors } = useMemo(() => {
    const f = [
      { label: "Resume Created", done: resumes.length > 0, points: 20 },
      { label: "ATS Score > 70%", done: resumes.some(r => (r.ats_score || 0) >= 70), points: 25 },
      { label: "Profile Complete", done: resumes.some(r => r.personal_info?.summary && r.personal_info?.email), points: 20 },
      { label: "Skills Added", done: resumes.some(r => r.skills?.length >= 5), points: 15 },
      { label: "Interview Practice", done: hasInterviewed || (streak?.total_points || 0) >= 30, points: 20 },
    ];
    const total = f.reduce((s, fac) => s + (fac.done ? fac.points : 0), 0);
    return { score: total, factors: f };
  }, [resumes, streak, hasInterviewed]);

  const color = score >= 80 ? "from-emerald-500 to-cyan-500" : score >= 50 ? "from-amber-500 to-orange-500" : "from-red-500 to-rose-500";
  const label = score >= 80 ? "Interview Ready! 🎉" : score >= 50 ? "Getting There 💪" : "Just Starting 🚀";

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/4 border border-white/8 rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" /> Apply Ready Score
        </h3>
        <span className={`text-sm font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{label}</span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            <motion.circle
              cx="40" cy="40" r="32" fill="none"
              stroke="url(#scoreGrad)" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 32}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - score / 100) }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444"} />
                <stop offset="100%" stopColor={score >= 80 ? "#06b6d4" : score >= 50 ? "#f97316" : "#f43f5e"} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-black text-xl">{score}</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {factors.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              {f.done ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />}
              <span className={`text-sm ${f.done ? "text-slate-300" : "text-slate-500"}`}>{f.label}</span>
              <span className={`ml-auto text-xs font-medium ${f.done ? "text-emerald-400" : "text-slate-600"}`}>+{f.points}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}