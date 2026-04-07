import React from "react";
import { motion } from "framer-motion";

export default function ATSScoreGauge({ score, size = "large" }) {
  const getScoreColor = (score) => {
    if (score >= 85) return { from: "from-emerald-500", to: "teal-500", text: "text-emerald-400" };
    if (score >= 70) return { from: "from-cyan-500", to: "blue-500", text: "text-cyan-400" };
    if (score >= 50) return { from: "from-amber-500", to: "orange-500", text: "text-amber-400" };
    return { from: "from-red-500", to: "pink-500", text: "text-red-400" };
  };

  const colors = getScoreColor(score);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  const sizeClasses = {
    small: "w-20 h-20",
    medium: "w-32 h-32",
    large: "w-48 h-48"
  };

  const textSizes = {
    small: "text-lg",
    medium: "text-3xl",
    large: "text-5xl"
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="45"
          fill="transparent"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r="45"
          fill="transparent"
          stroke={`url(#gradient-${size})`}
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
        <defs>
          <linearGradient id={`gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.from.replace("from-", "var(--color-")} />
            <stop offset="100%" stopColor={colors.to.replace("to-", "var(--color-")} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-bold ${textSizes[size]} ${colors.text}`}>
          {score}
        </span>
      </div>
    </div>
  );
}