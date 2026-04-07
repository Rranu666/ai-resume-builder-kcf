import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileDown, Palette, Type, Check, Loader2, ExternalLink } from "lucide-react";

const EXPORT_THEMES = [
  { id: "classic",   label: "Classic",   accent: "#1e40af", bg: "#f8fafc", desc: "Clean blue" },
  { id: "emerald",   label: "Emerald",   accent: "#059669", bg: "#f0fdf4", desc: "Modern green" },
  { id: "executive", label: "Executive", accent: "#6366f1", bg: "#fafaf9", desc: "Bold indigo" },
  { id: "minimal",   label: "Minimal",   accent: "#475569", bg: "#ffffff", desc: "Grayscale" },
  { id: "crimson",   label: "Crimson",   accent: "#dc2626", bg: "#fff7f7", desc: "Bold red" },
  { id: "midnight",  label: "Midnight",  accent: "#0ea5e9", bg: "#f8fafc", desc: "Sky blue" },
];

const FONT_STYLES = [
  { id: "inter",        label: "Inter",        stack: "'Inter', system-ui, sans-serif" },
  { id: "georgia",      label: "Georgia",      stack: "Georgia, 'Times New Roman', serif" },
  { id: "helvetica",    label: "Helvetica",    stack: "'Helvetica Neue', Arial, sans-serif" },
  { id: "merriweather", label: "Merriweather", stack: "Merriweather, Georgia, serif" },
  { id: "mono",         label: "Mono",         stack: "'Courier New', Courier, monospace" },
];

export default function PDFExportModal({ open, onOpenChange, resume }) {
  const [selectedTheme, setSelectedTheme] = useState("classic");
  const [selectedFont, setSelectedFont] = useState("inter");
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");

  const theme = EXPORT_THEMES.find(t => t.id === selectedTheme);
  const font = FONT_STYLES.find(f => f.id === selectedFont);

  const handleExport = async () => {
    if (!resume) return;
    setIsExporting(true);
    setError("");

    try {
      const response = await base44.functions.invoke("exportResumePDF", {
        resumeId: resume.id,
        theme: { accent: theme.accent, bg: theme.bg },
        fontStack: font.stack,
      });

      const html = response?.data?.html;
      if (!html) throw new Error("No HTML returned from server");

      // Open in new tab and trigger print dialog
      const w = window.open("", "_blank");
      if (!w) throw new Error("Popup was blocked. Please allow popups for this site.");
      w.document.write(html);
      w.document.close();
      w.focus();
      // Give browser time to render fonts/images before print dialog
      setTimeout(() => w.print(), 900);
    } catch (e) {
      setError(e.message || "Export failed. Please try again.");
    }

    setIsExporting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0d1420] border border-white/10 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <FileDown className="w-4 h-4 text-black" />
            </div>
            Export ATS-Compliant PDF
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-1">
          {/* ATS badge */}
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-xs text-emerald-300">ATS-optimized: clean headings, no graphics parsing issues, logical section order</p>
          </div>

          {/* Theme Picker */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-slate-300">Color Theme</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {EXPORT_THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTheme(t.id)}
                  className={`relative p-3 rounded-xl border text-left transition-all ${
                    selectedTheme === t.id
                      ? "border-emerald-500/60 bg-emerald-500/10"
                      : "border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15"
                  }`}
                >
                  {selectedTheme === t.id && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-black" />
                    </div>
                  )}
                  <div className="flex gap-1 mb-2">
                    <div className="w-5 h-5 rounded-md border border-white/10" style={{ background: t.accent }} />
                    <div className="w-5 h-5 rounded-md border border-white/10" style={{ background: t.bg === "#ffffff" ? "#f1f5f9" : t.bg }} />
                  </div>
                  <p className="text-xs font-semibold text-white">{t.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-tight">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Font Picker */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-semibold text-slate-300">Font</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {FONT_STYLES.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFont(f.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
                    selectedFont === f.id
                      ? "border-violet-500/60 bg-violet-500/15 text-violet-200"
                      : "border-white/8 bg-white/3 text-slate-400 hover:text-white hover:border-white/15"
                  }`}
                >
                  <span style={{ fontFamily: f.stack }} className="text-base font-bold leading-none">Aa</span>
                  <span className="text-xs">{f.label}</span>
                  {selectedFont === f.id && <Check className="w-3 h-3 text-violet-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Mini preview */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white/4 border border-white/8 rounded-xl">
            <div className="w-10 h-13 rounded border-2 flex flex-col gap-1 p-1.5 shrink-0 overflow-hidden" style={{ borderColor: theme?.accent, background: theme?.bg === "#ffffff" ? "#f8fafc" : theme?.bg }}>
              <div className="h-2 rounded-sm w-full" style={{ background: theme?.accent }} />
              <div className="h-1 rounded-sm w-3/4" style={{ background: theme?.accent + "66" }} />
              <div className="h-0.5 rounded-sm w-full bg-gray-200 mt-0.5" />
              <div className="h-0.5 rounded-sm w-5/6 bg-gray-200 mt-0.5" />
              <div className="h-0.5 rounded-sm w-2/3 bg-gray-200" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">{theme?.label} theme · {font?.label} font</p>
              <p className="text-xs text-slate-500 mt-0.5">Template: <span className="capitalize text-slate-400">{resume?.template || "modern"}</span> · A4 layout</p>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button
            onClick={handleExport}
            disabled={isExporting}
            size="lg"
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold shadow-lg shadow-emerald-500/20"
          >
            {isExporting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating PDF...</>
            ) : (
              <><FileDown className="w-4 h-4 mr-2" /> Generate &amp; Download PDF</>
            )}
          </Button>

          <div className="flex items-start gap-2 px-1">
            <ExternalLink className="w-3.5 h-3.5 text-slate-600 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600">Opens a formatted resume in a new tab. Use <strong className="text-slate-500">Save as PDF</strong> in the print dialog (Ctrl+P / Cmd+P).</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}