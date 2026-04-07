import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";

export default function RoadmapChecklist({ items, checked, onToggle, color = "emerald" }) {
  const colorMap = {
    emerald: { ring: "text-emerald-400", dot: "bg-emerald-500", check: "text-emerald-400" },
    cyan:    { ring: "text-cyan-400",    dot: "bg-cyan-500",    check: "text-cyan-400"    },
    violet:  { ring: "text-violet-400",  dot: "bg-violet-500",  check: "text-violet-400"  },
    pink:    { ring: "text-pink-400",    dot: "bg-pink-500",    check: "text-pink-400"    },
    orange:  { ring: "text-orange-400",  dot: "bg-orange-500",  check: "text-orange-400"  },
  };
  const c = colorMap[color] || colorMap.emerald;

  return (
    <ul className="space-y-2">
      {items.map((item, i) => {
        const id = `${color}-${i}`;
        const done = checked.includes(id);
        return (
          <motion.li
            key={id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 group ${
              done
                ? "bg-white/3 border-white/5 opacity-60"
                : "bg-slate-800/40 border-white/8 hover:border-white/15 hover:bg-slate-800/70"
            }`}
            onClick={() => onToggle(id)}
          >
            {done
              ? <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${c.check}`} />
              : <Circle className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
            }
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium leading-snug ${done ? "line-through text-slate-500" : "text-slate-200"}`}>
                {item.title}
              </p>
              {item.description && (
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
              )}
              {item.priority && (
                <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.priority === "high"   ? "bg-red-500/15 text-red-400" :
                  item.priority === "medium" ? "bg-yellow-500/15 text-yellow-400" :
                                               "bg-slate-700 text-slate-400"
                }`}>
                  {item.priority.toUpperCase()} PRIORITY
                </span>
              )}
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}