import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Palette, ChevronDown, ChevronUp, Save, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FONTS = [
  { label: "System Sans", value: "system-ui, sans-serif" },
  { label: "Georgia (Serif)", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Courier (Mono)", value: "'Courier New', monospace" },
  { label: "Garamond", value: "Garamond, serif" },
  { label: "Arial", value: "Arial, sans-serif" },
];

const ACCENT_PRESETS = [
  "#34d399", "#22d3ee", "#818cf8", "#f59e0b",
  "#f43f5e", "#a78bfa", "#6366f1", "#64748b",
];

const SECTIONS = [
  { key: "summary", label: "Summary" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
];

export const DEFAULT_THEME = {
  font: "system-ui, sans-serif",
  accentColor: "#34d399",
  marginSize: "normal", // compact | normal | spacious
  visibleSections: { summary: true, experience: true, education: true, skills: true, projects: true },
};

export default function ThemeEditor({ theme, onChange }) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const update = (key, value) => onChange({ ...theme, [key]: value });
  const toggleSection = (key) => update("visibleSections", { ...theme.visibleSections, [key]: !theme.visibleSections[key] });

  const saveAsTemplate = async () => {
    setIsSaving(true);
    try {
      await base44.auth.updateMe({ custom_theme: theme });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { console.error(e); }
    setIsSaving(false);
  };

  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/4 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-pink-500 to-violet-600 rounded-lg flex items-center justify-center">
            <Palette className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white font-semibold text-sm">Theme Editor</span>
          <span className="text-xs text-pink-400 bg-pink-500/10 border border-pink-500/20 px-1.5 py-0.5 rounded-full">Custom</span>
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
            <div className="px-4 pb-4 space-y-5 border-t border-white/5">
              {/* Font Family */}
              <div className="pt-4">
                <label className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2 block">Font Family</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {FONTS.map(f => (
                    <button
                      key={f.value}
                      onClick={() => update("font", f.value)}
                      style={{ fontFamily: f.value }}
                      className={`text-xs px-2.5 py-2 rounded-lg border text-left transition-all ${
                        theme.font === f.value
                          ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                          : "bg-white/4 border-white/8 text-slate-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2 block">Accent Color</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {ACCENT_PRESETS.map(color => (
                    <button
                      key={color}
                      onClick={() => update("accentColor", color)}
                      className="w-7 h-7 rounded-full border-2 transition-all hover:scale-110"
                      style={{
                        background: color,
                        borderColor: theme.accentColor === color ? "white" : "transparent",
                        boxShadow: theme.accentColor === color ? `0 0 8px ${color}` : "none",
                      }}
                    />
                  ))}
                  {/* Custom color picker */}
                  <div className="relative">
                    <input
                      type="color"
                      value={theme.accentColor}
                      onChange={e => update("accentColor", e.target.value)}
                      className="w-7 h-7 rounded-full cursor-pointer border-2 border-white/20 opacity-0 absolute inset-0"
                    />
                    <div className="w-7 h-7 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center text-white/40 text-xs pointer-events-none">+</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-4 h-4 rounded-full border border-white/20" style={{ background: theme.accentColor }} />
                  <span className="text-xs text-slate-500 font-mono">{theme.accentColor}</span>
                </div>
              </div>

              {/* Margin Size */}
              <div>
                <label className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2 block">Margin / Spacing</label>
                <div className="flex gap-1.5">
                  {["compact", "normal", "spacious"].map(size => (
                    <button
                      key={size}
                      onClick={() => update("marginSize", size)}
                      className={`flex-1 text-xs py-2 rounded-lg border capitalize transition-all ${
                        theme.marginSize === size
                          ? "bg-pink-500/20 border-pink-500/40 text-pink-300"
                          : "bg-white/4 border-white/8 text-slate-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Visibility */}
              <div>
                <label className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2 block">Section Visibility</label>
                <div className="space-y-1.5">
                  {SECTIONS.map(s => (
                    <div key={s.key} className="flex items-center justify-between px-3 py-2 bg-white/3 border border-white/6 rounded-lg">
                      <span className="text-sm text-slate-300">{s.label}</span>
                      <button
                        onClick={() => toggleSection(s.key)}
                        className={`w-10 h-5 rounded-full transition-all relative ${
                          theme.visibleSections[s.key] ? "bg-emerald-500" : "bg-white/10"
                        }`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                          theme.visibleSections[s.key] ? "left-5" : "left-0.5"
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save as template */}
              <Button
                onClick={saveAsTemplate}
                disabled={isSaving || saved}
                className="w-full bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500 text-white font-bold gap-2 shadow-lg shadow-violet-500/20"
              >
                {saved ? <><Check className="w-4 h-4" /> Saved as My Template!</> :
                 isSaving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> :
                 <><Save className="w-4 h-4" /> Save as My Template</>}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}