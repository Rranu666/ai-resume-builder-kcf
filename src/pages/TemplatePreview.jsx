import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import TemplateRenderer from "@/components/templates/TemplateRenderer";
import { templates } from "./Templates";

export default function TemplatePreview() {
  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get("template") || "modern";
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const currentIdx = templates.findIndex(t => t.id === templateId);
  const template = templates[currentIdx] || templates[0];

  const navigate = (id) => {
    window.location.href = createPageUrl(`TemplatePreview?template=${id}`);
  };

  const createResumeWithTemplate = async () => {
    setCreating(true);
    try {
      const newResume = await base44.entities.Resume.create({
        title: `My ${template.name} Resume`,
        template: templateId,
        personal_info: { full_name: "", email: "", phone: "", location: "", summary: "", profile_photo: "" },
        experience: [], education: [], skills: [], projects: [], ats_score: 0,
      });
      setCreated(true);
      setTimeout(() => {
        window.location.href = createPageUrl(`Editor?id=${newResume.id}`);
      }, 600);
    } catch (error) {
      console.error("Error creating resume:", error);
    }
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-[#060b12] flex flex-col">
      {/* Top bar */}
      <div className="bg-[#080d14] border-b border-white/8 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl("Templates")}>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Templates
            </Button>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div>
            <h1 className="text-white font-bold">{template.name}</h1>
            <p className="text-slate-500 text-xs">{template.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Template switcher nav */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => navigate(t.id)}
                title={t.name}
                className={`w-6 h-6 rounded transition-all ${t.id === templateId ? "ring-2 ring-white/60" : "opacity-50 hover:opacity-100"}`}
                style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.accent}88)` }}
              />
            ))}
          </div>
          <Button
            onClick={createResumeWithTemplate}
            disabled={creating || created}
            className={`bg-gradient-to-r ${template.grad} text-black font-bold`}
          >
            {created ? (
              <><Check className="w-4 h-4 mr-1" /> Opening Editor...</>
            ) : creating ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <><Plus className="w-4 h-4 mr-1" /> Use This Template</>
            )}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Prev button */}
        <button
          onClick={() => currentIdx > 0 && navigate(templates[currentIdx - 1].id)}
          disabled={currentIdx === 0}
          className="hidden md:flex flex-shrink-0 w-14 items-center justify-center text-slate-600 hover:text-white disabled:opacity-20 transition-colors"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        {/* Preview area */}
        <div className="flex-1 overflow-auto py-6 px-4">
          <motion.div
            key={templateId}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto shadow-2xl rounded-xl overflow-hidden border border-white/10"
          >
            <TemplateRenderer templateId={templateId} />
          </motion.div>
        </div>

        {/* Next button */}
        <button
          onClick={() => currentIdx < templates.length - 1 && navigate(templates[currentIdx + 1].id)}
          disabled={currentIdx === templates.length - 1}
          className="hidden md:flex flex-shrink-0 w-14 items-center justify-center text-slate-600 hover:text-white disabled:opacity-20 transition-colors"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>

      {/* Bottom template strip */}
      <div className="bg-[#080d14] border-t border-white/8 px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => navigate(t.id)}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 group`}
            >
              <div
                className={`w-12 h-16 rounded-lg overflow-hidden border-2 transition-all ${t.id === templateId ? "border-emerald-400 shadow-lg shadow-emerald-500/20" : "border-white/10 hover:border-white/30"}`}
              >
                <div className="scale-[0.16] origin-top-left" style={{ width: "625%", height: "625%" }}>
                  <TemplateRenderer templateId={t.id} />
                </div>
              </div>
              <span className={`text-[10px] font-medium transition-colors whitespace-nowrap ${t.id === templateId ? "text-emerald-400" : "text-slate-600 group-hover:text-slate-400"}`}>
                {t.name.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}