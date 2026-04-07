import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Lightbulb, Target, FileText, TrendingUp } from "lucide-react";

export default function RecommendationList({ recommendations }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500/20 border-red-500/40 text-red-400";
      case "medium": return "bg-amber-500/20 border-amber-500/40 text-amber-400";
      case "low": return "bg-blue-500/20 border-blue-500/40 text-blue-400";
      default: return "bg-slate-500/20 border-slate-500/40 text-slate-400";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "keywords": return Target;
      case "formatting": return FileText;
      case "impact": return TrendingUp;
      default: return Lightbulb;
    }
  };

  const sortedRecs = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-3">
      {sortedRecs.map((rec, index) => {
        const Icon = getCategoryIcon(rec.category);
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/3 border border-white/8 rounded-xl p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                rec.priority === "high" ? "bg-red-500/20" : rec.priority === "medium" ? "bg-amber-500/20" : "bg-blue-500/20"
              }`}>
                <Icon className={`w-4 h-4 ${
                  rec.priority === "high" ? "text-red-400" : rec.priority === "medium" ? "text-amber-400" : "text-blue-400"
                }`} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{rec.action}</p>
                  <Badge className={`${getPriorityColor(rec.priority)} text-xs font-bold`}>
                    {rec.priority.toUpperCase()}
                  </Badge>
                </div>
                {rec.example && (
                  <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                    <p className="text-xs text-slate-400 mb-1 font-medium">Example:</p>
                    <p className="text-sm text-slate-300 italic">{rec.example}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}