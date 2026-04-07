import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Target, FileText, Sparkles, ArrowRight, BrainCircuit } from "lucide-react";

const POPULAR_ROLES = [
  "Software Engineer", "Product Manager", "Data Scientist", "UX Designer",
  "DevOps Engineer", "Marketing Manager", "Financial Analyst", "Cybersecurity Engineer",
  "ML Engineer", "Full Stack Developer", "Cloud Architect", "Business Analyst"
];

export default function RoadmapSetup({ onGenerate, isLoading }) {
  const [targetRole, setTargetRole] = useState("");
  const [resumeSummary, setResumeSummary] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetRole.trim()) return;
    onGenerate({ targetRole: targetRole.trim(), resumeSummary: resumeSummary.trim() });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider mb-5">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Free AI Career Planning Tool
        </div>
        <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Build Your Personalized Career Roadmap
        </h2>
        <p className="text-slate-400 text-base max-w-lg mx-auto leading-relaxed">
          Enter your target role and current experience. Our AI will instantly generate a step-by-step career development plan — with the exact skills, certifications, projects, and resources you need to get there.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Target role */}
        <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-6">
          <label className="block text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" /> Target Job Title *
          </label>
          <Input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Software Engineer, Data Scientist, Product Manager…"
            className="bg-slate-800/60 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500/50"
            required
          />
          {/* Quick picks */}
          <div className="flex flex-wrap gap-2 mt-3">
            {POPULAR_ROLES.map(role => (
              <button
                key={role}
                type="button"
                onClick={() => setTargetRole(role)}
                className={`text-xs px-3 py-1 rounded-full border transition-all duration-200 ${
                  targetRole === role
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                    : "border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Current experience */}
        <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-6">
          <label className="block text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Your Current Background <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <Textarea
            value={resumeSummary}
            onChange={(e) => setResumeSummary(e.target.value)}
            placeholder="Briefly describe your current role, experience, and skills. E.g. '3 years as a backend developer with Python and Django. Familiar with REST APIs and SQL. Want to move into ML engineering.'"
            className="bg-slate-800/60 border-white/10 text-white placeholder:text-slate-500 min-h-[100px] focus:border-cyan-500/50 resize-none"
          />
          <p className="text-slate-600 text-xs mt-2">The more detail you provide, the more personalized your roadmap will be.</p>
        </div>

        <Button
          type="submit"
          disabled={!targetRole.trim() || isLoading}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold py-4 rounded-xl text-base shadow-lg transition-all duration-300 group disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Building Your Roadmap…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Generate My Career Roadmap
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </Button>
      </form>
    </motion.div>
  );
}