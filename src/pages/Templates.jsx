import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles, Eye, Plus, Star, Palette, Zap, X, ChevronLeft, ChevronRight,
  Briefcase, GraduationCap, Stethoscope, BarChart2, Wand2, Monitor, Layers, Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import TemplateRenderer from "@/components/templates/TemplateRenderer";
import AIResumeBuilder from "@/components/templates/AIResumeBuilder";

export const templates = [
  // ── Original 12 ────────────────────────────────────────────────────────
  { id: "modern",        name: "Modern Professional",  description: "Clean, contemporary layout with emerald accents and ATS-friendly structure.",           accent: "#34d399", grad: "from-emerald-500 to-cyan-500",      features: ["ATS Optimized", "Clean", "Professional"],   category: "professional", popular: true },
  { id: "creative",      name: "Creative Portfolio",   description: "Bold amber left-sidebar ideal for designers and brand creatives.",                       accent: "#f59e0b", grad: "from-amber-400 to-orange-500",    features: ["Eye-catching", "Sidebar", "Portfolio"],     category: "creative" },
  { id: "executive",     name: "Executive Pro",         description: "Navy-accented classic layout for C-suite and senior leadership roles.",                 accent: "#4f46e5", grad: "from-blue-500 to-indigo-600",    features: ["Traditional", "Formal", "Executive"],       category: "professional", popular: true },
  { id: "minimal",       name: "Minimal Clean",         description: "Helvetica-style ultra-clean layout — content first, zero clutter.",                    accent: "#94a3b8", grad: "from-slate-400 to-slate-600",    features: ["Minimal", "Elegant", "Readable"],           category: "minimal" },
  { id: "tech",          name: "Tech Innovator",         description: "Dark-mode inspired layout with monospace vibes for engineers & devs.",                 accent: "#a78bfa", grad: "from-violet-500 to-purple-600",  features: ["Dark Style", "Futuristic", "Dev Focus"],    category: "tech", popular: true },
  { id: "startup",       name: "Startup Founder",       description: "High-energy gradient design for founders and entrepreneurial roles.",                  accent: "#f43f5e", grad: "from-rose-500 to-pink-500",      features: ["Bold", "Entrepreneurial", "Modern"],        category: "startup" },
  { id: "healthcare",    name: "Healthcare Pro",         description: "Trustworthy, clinical layout for medical and healthcare professionals.",               accent: "#06b6d4", grad: "from-cyan-400 to-teal-500",      features: ["Medical", "Trust", "Credentials"],          category: "healthcare" },
  { id: "academic",      name: "Academic Scholar",       description: "Serif-based scholarly layout for researchers, PhDs, and academics.",                  accent: "#4338ca", grad: "from-indigo-500 to-violet-600",  features: ["Academic", "Research", "Publications"],     category: "academic" },
  { id: "finance",       name: "Finance & Banking",      description: "Authoritative slate & gold layout for finance, consulting, and law.",                 accent: "#ca8a04", grad: "from-slate-600 to-yellow-600",   features: ["Authoritative", "Classic", "Finance"],      category: "professional" },
  { id: "designer",      name: "UX / Designer",          description: "Purple sidebar with skill progress bars — perfect for UX & product design.",         accent: "#7c3aed", grad: "from-purple-600 to-fuchsia-600", features: ["Portfolio", "Skill Bars", "Visual"],         category: "creative", popular: true },
  { id: "compact",       name: "Compact Power",          description: "3-column dense layout that fits maximum content in one page.",                        accent: "#0d9488", grad: "from-teal-500 to-cyan-600",      features: ["Dense", "One Page", "Efficient"],           category: "minimal" },
  { id: "infographic",   name: "Infographic Pro",        description: "Vibrant orange sidebar with visual skill bars and timeline dots.",                    accent: "#f97316", grad: "from-orange-400 to-amber-500",   features: ["Visual", "Infographic", "Eye-catching"],    category: "creative" },
  // ── New 8 ───────────────────────────────────────────────────────────────
  { id: "glass",         name: "Glassmorphism",          description: "Dark gradient background with frosted-glass card sections. Ultra-modern dark style.",  accent: "#22d3ee", grad: "from-cyan-400 to-blue-600",      features: ["Dark Mode", "Glassmorphism", "Modern"],     category: "tech", popular: true, isNew: true },
  { id: "neon",          name: "Neon / Cyberpunk",       description: "Black background with neon-green accents — perfect for tech roles that stand out.",   accent: "#00ff87", grad: "from-green-400 to-cyan-400",     features: ["Neon", "Cyberpunk", "Dev Focus"],           category: "tech", isNew: true },
  { id: "bold_split",    name: "Bold Split",             description: "Dramatic split layout — deep violet left panel, clean white right panel.",            accent: "#7c3aed", grad: "from-violet-500 to-purple-700",  features: ["Split Layout", "Bold", "Modern"],           category: "creative", isNew: true },
  { id: "timeline",      name: "Timeline",               description: "Left-column vertical timeline for experience — perfect for storytelling your career.", accent: "#38bdf8", grad: "from-sky-400 to-blue-600",       features: ["Timeline", "Visual", "Storytelling"],       category: "professional", isNew: true },
  { id: "elegant",       name: "Elegant Serif",          description: "Luxury magazine-style serif layout — sophisticated, elegant, unforgettable.",         accent: "#1a1a1a", grad: "from-gray-600 to-gray-900",     features: ["Luxury", "Serif", "Elegant"],               category: "minimal", isNew: true },
  { id: "gradient_hero", name: "Gradient Hero",          description: "Full-bleed amber-to-pink gradient header with warm-toned card sections.",             accent: "#f59e0b", grad: "from-amber-400 to-pink-500",    features: ["Gradient", "Vibrant", "Eye-catching"],      category: "creative", isNew: true },
  { id: "two_tone",      name: "Two-Tone Pro",           description: "Deep navy left panel + soft white right — a timeless two-column contrast layout.",   accent: "#6366f1", grad: "from-indigo-500 to-violet-500",  features: ["Two-Tone", "Contrast", "Professional"],     category: "professional", isNew: true },
  { id: "photo_card",    name: "Photo Card",             description: "Large avatar card header with teal gradient — ideal for personal brands.",            accent: "#059669", grad: "from-emerald-500 to-cyan-600",   features: ["Photo", "Personal Brand", "Card Layout"],   category: "creative", isNew: true },
];

const categories = [
  { id: "all",          label: "All (20)",      icon: Sparkles },
  { id: "professional", label: "Professional",  icon: Briefcase },
  { id: "creative",     label: "Creative",      icon: Palette },
  { id: "tech",         label: "Technology",    icon: Zap },
  { id: "minimal",      label: "Minimal",       icon: Star },
  { id: "healthcare",   label: "Healthcare",    icon: Stethoscope },
  { id: "academic",     label: "Academic",      icon: GraduationCap },
  { id: "startup",      label: "Startup",       icon: BarChart2 },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [creating, setCreating] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const createResumeWithTemplate = async (templateId) => {
    setCreating(templateId);
    try {
      const template = templates.find(t => t.id === templateId);
      const newResume = await base44.entities.Resume.create({
        title: `My ${template?.name} Resume`,
        template: templateId,
        personal_info: { full_name: "", email: "", phone: "", location: "", summary: "", profile_photo: "" },
        experience: [], education: [], skills: [], projects: [], ats_score: 0,
      });
      window.location.href = createPageUrl(`Editor?id=${newResume.id}`);
    } catch (e) { console.error(e); }
    setCreating(null);
  };

  const filteredTemplates = templates.filter(t => selectedCategory === "all" || t.category === selectedCategory);
  const previewIdx = previewTemplate ? templates.findIndex(t => t.id === previewTemplate.id) : -1;
  const goPrev = () => { if (previewIdx > 0) setPreviewTemplate(templates[previewIdx - 1]); };
  const goNext = () => { if (previewIdx < templates.length - 1) setPreviewTemplate(templates[previewIdx + 1]); };

  return (
    <div className="min-h-screen bg-[#060b12]">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden border-b border-violet-500/15" style={{ background: "linear-gradient(135deg, #0d0a1a 0%, #0a0f1e 50%, #060b12 100%)" }}>
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-violet-600/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-12 right-0 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <motion.div {...fadeUp(0)} className="text-center">
            <div className="inline-flex items-center gap-2 bg-violet-500/12 border border-violet-500/25 text-violet-400 text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              20 ATS-Optimized Templates · 8 Brand New Designs
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              AI Resume Templates
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-6 leading-relaxed">
              From sleek minimal to bold glassmorphism and neon cyberpunk — 20 professionally designed, ATS-optimized templates. Pick one and customize, or let our AI build the entire resume for you from a simple conversation.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {[
                { icon: Monitor, text: "20 Unique Designs" },
                { icon: Layers, text: "8 New 3D-Style Templates" },
                { icon: Wand2, text: "AI Builds It For You" },
                { icon: Globe, text: "Free Forever · KCF LLC" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-slate-400">
                  <Icon className="w-4 h-4 text-violet-400" /> {text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── AI Resume Builder ── */}
        <motion.div {...fadeUp(0.1)} className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Don't want to do the work? Let AI do it all.</h2>
              <p className="text-slate-500 text-sm">Talk or type — the AI builds your complete resume in seconds.</p>
            </div>
          </div>
          <AIResumeBuilder templates={templates} />
        </motion.div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-white/6" />
          <span className="text-slate-600 text-sm font-medium px-3">— or pick a template manually —</span>
          <div className="flex-1 h-px bg-white/6" />
        </div>

        {/* Category Filter */}
        <motion.div {...fadeUp(0.15)} className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/20"
                  : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Templates Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-16">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              {...fadeUp(0.05 + index * 0.03)}
              className="group"
            >
              <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1 h-full flex flex-col">
                {/* Thumbnail Preview */}
                <div
                  className="h-52 relative overflow-hidden flex-shrink-0 bg-gray-100 cursor-pointer"
                  style={{ perspective: "800px" }}
                  onClick={() => setPreviewTemplate(template)}
                >
                  <div
                    className="absolute inset-0 scale-[0.42] origin-top-left group-hover:scale-[0.44] transition-transform duration-500"
                    style={{ width: "238%", height: "238%" }}
                  >
                    <TemplateRenderer templateId={template.id} />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 text-gray-900 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-xl">
                      <Eye className="w-3.5 h-3.5" /> Full Preview
                    </div>
                  </div>
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {template.popular && (
                      <div className="bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> Popular
                      </div>
                    )}
                    {template.isNew && (
                      <div className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-xs font-black px-2.5 py-1 rounded-full">
                        ✨ New
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-white mb-1 text-sm">{template.name}</h3>
                  <p className="text-slate-500 text-xs mb-3 leading-relaxed flex-1">{template.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.features.map((f, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full border" style={{ borderColor: `${template.accent}40`, color: template.accent }}>
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewTemplate(template)}
                      className="flex-1 border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-xs h-8"
                    >
                      <Eye className="w-3 h-3 mr-1" /> Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => createResumeWithTemplate(template.id)}
                      disabled={creating === template.id}
                      className={`flex-1 bg-gradient-to-r ${template.grad} text-black font-bold hover:opacity-90 text-xs h-8`}
                    >
                      {creating === template.id ? (
                        <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <><Plus className="w-3 h-3 mr-1" /> Use</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Section */}
        <motion.div {...fadeUp(0.5)} className="border-t border-white/5 pt-12 mb-10">
          <h2 className="text-2xl font-extrabold text-white text-center mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Why Our Templates Win</h2>
          <p className="text-slate-500 text-sm text-center mb-8 max-w-xl mx-auto">Every template is handcrafted to pass ATS systems and impress hiring managers at top companies.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { emoji: "🎯", title: "ATS Optimized", desc: "Pass every applicant tracking system with correct structure and keywords" },
              { emoji: "✨", title: "AI Auto-Fill", desc: "Let AI write your entire resume — skills, bullets, summary and more" },
              { emoji: "🎨", title: "20 Unique Designs", desc: "From minimal to glassmorphism, neon, and luxury serif styles" },
              { emoji: "📄", title: "Perfect PDF Export", desc: "Download pixel-perfect PDFs ready to send to employers" },
            ].map((f, i) => (
              <motion.div key={i} {...fadeUp(0.55 + i * 0.05)} className="text-center p-6 rounded-2xl bg-white/3 border border-white/5 hover:border-white/10 transition-colors">
                <div className="text-3xl mb-3">{f.emoji}</div>
                <h3 className="font-bold text-white text-sm mb-1">{f.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer attribution */}
        <motion.div {...fadeUp(0.7)}>
          <div className="text-center py-6 border-t border-white/5">
            <p className="text-slate-700 text-xs">
              AI Resume Templates · 20 Professional Designs · Free Forever · A{" "}
              <span className="text-violet-600 font-semibold">Kindness Community Foundation (KCF LLC)</span>{" "}initiative
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Preview Modal ── */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
            onClick={() => setPreviewTemplate(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-[#0d1420] border border-white/10 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 flex-shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-white font-bold text-lg">{previewTemplate.name}</h2>
                    {previewTemplate.isNew && <span className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-xs font-black px-2 py-0.5 rounded-full">✨ New</span>}
                  </div>
                  <p className="text-slate-500 text-sm">{previewTemplate.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => createResumeWithTemplate(previewTemplate.id)}
                    disabled={creating === previewTemplate.id}
                    className={`bg-gradient-to-r ${previewTemplate.grad} text-black font-bold`}
                  >
                    {creating === previewTemplate.id ? (
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <><Plus className="w-4 h-4 mr-1" /> Use This Template</>
                    )}
                  </Button>
                  <button onClick={() => setPreviewTemplate(null)} className="text-slate-400 hover:text-white transition-colors p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex flex-1 overflow-hidden">
                <button onClick={goPrev} disabled={previewIdx === 0}
                  className="flex-shrink-0 w-12 flex items-center justify-center text-slate-500 hover:text-white disabled:opacity-20 transition-colors">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex-1 overflow-auto bg-gray-200 my-4 rounded-xl shadow-inner">
                  <TemplateRenderer templateId={previewTemplate.id} />
                </div>
                <button onClick={goNext} disabled={previewIdx === templates.length - 1}
                  className="flex-shrink-0 w-12 flex items-center justify-center text-slate-500 hover:text-white disabled:opacity-20 transition-colors">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-1.5 py-3 flex-shrink-0 overflow-x-auto px-4">
                {templates.map((t, i) => (
                  <button key={t.id} onClick={() => setPreviewTemplate(t)}
                    className={`flex-shrink-0 h-1.5 rounded-full transition-all ${t.id === previewTemplate.id ? "w-5 bg-violet-400" : "w-1.5 bg-white/20 hover:bg-white/40"}`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}