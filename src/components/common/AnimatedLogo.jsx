import React from "react";
import { motion } from "framer-motion";

export default function AnimatedLogo({ size = "md", showText = true, textColor = "dark" }) {
  const sizes = {
    sm: { icon: 32, titleSize: "text-sm",  subSize: "text-[9px]", gap: "gap-2" },
    md: { icon: 44, titleSize: "text-base", subSize: "text-[10px]", gap: "gap-2.5" },
    lg: { icon: 56, titleSize: "text-lg",  subSize: "text-xs",     gap: "gap-3" },
  };
  const s = sizes[size] || sizes.md;

  const isLight = textColor === "dark"; // "dark" means dark text on light bg
  const titleColor = isLight ? "#ffffff" : "#ffffff";
  const subColor   = isLight ? "#34d399" : "#34d399";

  const iconSize = s.icon;

  return (
    <div className={`flex items-center ${s.gap} select-none`}>
      {/* ── K Icon ── */}
      <div style={{ width: iconSize, height: iconSize, flexShrink: 0, position: "relative" }}>
        <svg
          viewBox="0 0 200 200"
          width={iconSize}
          height={iconSize}
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="kGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d9ff" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <filter id="kGlow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Rounded square background */}
          <rect
            x="0"
            y="0"
            width="200"
            height="200"
            rx="40"
            fill="#0a5f5f"
            stroke="url(#kGrad)"
            strokeWidth="2"
            filter="url(#kGlow)"
          />

          {/* K letter - left vertical bar */}
          <rect
            x="45"
            y="45"
            width="35"
            height="110"
            rx="8"
            fill="#e8f8f8"
          />

          {/* K letter - top right diagonal */}
          <path
            d="M 100 55 L 155 95 L 145 110 L 95 75 Z"
            fill="#e8f8f8"
          />

          {/* K letter - bottom right diagonal */}
          <path
            d="M 95 125 L 155 105 L 165 120 L 100 145 Z"
            fill="#e8f8f8"
          />

          {/* Center circle connector */}
          <circle
            cx="110"
            cy="100"
            r="20"
            fill="#0a5f5f"
            stroke="#e8f8f8"
            strokeWidth="6"
          />
        </svg>
      </div>

      {/* ── Text ── */}
      {showText && (
        <div className="leading-none">
          <div
            style={{
              color: titleColor,
              fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
            className={s.titleSize}
          >
            <span style={{ color: subColor }}>AI</span>
            {" "}Resume Builder
          </div>
          <div
            style={{
              color: subColor,
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 400,
              letterSpacing: "0.03em",
              lineHeight: 1,
              opacity: 0.85,
              marginTop: "2px",
            }}
            className={s.subSize}
          >
            by KCF LLC
          </div>
        </div>
      )}
    </div>
  );
}