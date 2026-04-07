import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Target, FileText, TrendingUp, CheckCircle, Star } from "lucide-react";

export default function DimensionCard({ name, score, dimensionKey, color, description }) {
  const icons = {
    keyword_density: Target,
    formatting: FileText,
    impact: TrendingUp,
    completeness: CheckCircle,
    relevance: Star
  };
  const IconComponent = icons[dimensionKey] || Target;
  const colorMap = {
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", progress: "bg-emerald-500" },
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", progress: "bg-cyan-500" },
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400", progress: "bg-violet-500" },
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", progress: "bg-amber-500" },
    pink: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", progress: "bg-pink-500" },
  };

  const theme = colorMap[color] || colorMap.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${theme.bg} ${theme.border} border rounded-xl p-4 space-y-3`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${color}-500 to-${color}-600 flex items-center justify-center`}>
          <IconComponent className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className={`font-bold text-sm ${theme.text}`}>{name}</h4>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <div className={`text-2xl font-bold ${theme.text}`}>{score}</div>
      </div>
      <Progress value={score} className={`h-2 ${theme.bg}`} indicatorClassName={theme.progress} />
    </motion.div>
  );
}