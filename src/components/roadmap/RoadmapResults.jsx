import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import RoadmapChecklist from "./RoadmapChecklist";
import {
  Award, Briefcase, Code2, BookOpen, Target,
  RotateCcw, TrendingUp, Clock, ChevronDown, ChevronUp
} from "lucide-react";

const SECTIONS = [
  { key: "certifications", label: "Certifications", icon: Award,     color: "violet", desc: "credentials to earn" },
  { key: "skills",         label: "Skills to Learn", icon: Code2,    color: "cyan",   desc: "technical & soft skills" },
  { key: "projects",       label: "Projects to Build", icon: Code2,  color: "emerald",desc: "portfolio projects" },
  { key: "experiences",    label: "Key Experiences",  icon: Briefcase,color: "orange", desc: "roles & exposure to seek" },
  { key: "resources",      label: "Learning Resources",icon: BookOpen,color: "pink",  desc: "courses, books & communities" },
];

function SectionCard({ section, items, checked, onToggle }) {
  const [open, setOpen] = useState(true);
  const doneCount = items.filter((_, i) => checked.includes(`${section.color}-${i}`)).length;
  const Icon = section.icon;

  const colorBorder = {
    violet:  "border-violet-500/20 hover:border-violet-500/40",
    cyan:    "border-cyan-500/20 hover:border-cyan-500/40",
    emerald: "border-emerald-500/20 hover:border-emerald-500/40",
    orange:  "border-orange-500/20 hover:border-orange-500/40",
    pink:    "border-pink-500/20 hover:border-pink-500/40",
  };
  const colorIcon = {
    violet:  "from-violet-500 to-purple-600",
    cyan:    "from-cyan-500 to-blue-600",
    emerald: "from-emerald-500 to-teal-600",
    orange:  "from-orange-500 to-pink-600",
    pink:    "from-pink-500 to-rose-600",
  };
  const colorBar = {
    violet:  "bg-violet-500",
    cyan:    "bg-cyan-500",
    emerald: "bg-emerald-500",
    orange:  "bg-orange-500",
    pink:    "bg-pink-500",
  };

  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-slate-900/60 border rounded-2xl overflow-hidden transition-all duration-200 ${colorBorder[section.color]}`}
    >
      {/* Header */}
      <button
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/2 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorIcon[section.color]} flex items-center justify-center flex-shrink-0 shadow`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-bold text-white text-sm">{section.label}</span>
            <span className="text-xs text-slate-500 flex-shrink-0">{doneCount}/{items.length} done</span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${colorBar[section.color]}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
      </button>

      {/* Items */}
      {open && (
        <div className="px-5 pb-5">
          {items.length > 0
            ? <RoadmapChecklist items={items} checked={checked} onToggle={onToggle} color={section.color} />
            : <p className="text-slate-600 text-sm italic">No items generated for this section.</p>
          }
        </div>
      )}
    </motion.div>
  );
}

export default function RoadmapResults({ roadmap, targetRole, onReset }) {
  const [checked, setChecked] = useState([]);

  const toggle = (id) => setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const totalItems = SECTIONS.reduce((s, sec) => s + (roadmap[sec.key]?.length || 0), 0);
  const totalDone  = checked.length;
  const overallPct = totalItems ? Math.round((totalDone / totalItems) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full text-emerald-400 text-xs font-bold mb-3">
            <Target className="w-3 h-3" /> Career Roadmap
          </div>
          <h2 className="text-2xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Path to: <span className="text-emerald-400">{targetRole}</span>
          </h2>
          {roadmap.timeline && (
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Estimated timeline: <span className="text-white font-medium">{roadmap.timeline}</span>
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={onReset} className="border-white/10 text-slate-400 hover:text-white flex-shrink-0">
          <RotateCcw className="w-4 h-4 mr-1.5" /> New Roadmap
        </Button>
      </div>

      {/* Summary card */}
      {roadmap.summary && (
        <div className="bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/20 rounded-2xl p-5 mb-6">
          <p className="text-slate-300 text-sm leading-relaxed">{roadmap.summary}</p>
        </div>
      )}

      {/* Overall progress */}
      <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Overall Progress
          </span>
          <span className="text-emerald-400 font-bold text-sm">{overallPct}%</span>
        </div>
        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${overallPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <p className="text-slate-500 text-xs mt-2">{totalDone} of {totalItems} items completed</p>
      </div>

      {/* Section checklists */}
      <div className="space-y-4">
        {SECTIONS.map(section => {
          const items = roadmap[section.key] || [];
          if (!items.length) return null;
          return (
            <SectionCard
              key={section.key}
              section={section}
              items={items}
              checked={checked}
              onToggle={toggle}
            />
          );
        })}
      </div>
    </motion.div>
  );
}