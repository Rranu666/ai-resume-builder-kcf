import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import RoadmapSetup from "@/components/roadmap/RoadmapSetup";
import RoadmapResults from "@/components/roadmap/RoadmapResults";
import { motion } from "framer-motion";
import { Target, Sparkles, Heart, Users, Globe, Zap, BrainCircuit, TrendingUp, Award, CheckCircle2, ArrowRight, Clock, BookOpen, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function CareerRoadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async ({ targetRole, resumeSummary }) => {
    setIsLoading(true);
    setTargetRole(targetRole);
    try {
      const prompt = `You are a senior career coach and talent expert. 
Generate a detailed, personalized career roadmap for someone who wants to become a "${targetRole}".
${resumeSummary ? `Their current background: "${resumeSummary}"` : "Assume they are an early-to-mid career professional."}

Return a comprehensive roadmap with actionable items in each category. Each item must have a title, description, and priority (high/medium/low).

Guidelines:
- certifications: 4-7 specific, well-known credentials (e.g. AWS Certified, PMP, Google Analytics)
- skills: 6-10 technical and soft skills to develop, be specific (tools, frameworks, methodologies)
- projects: 4-6 concrete portfolio projects with clear outcomes
- experiences: 4-6 real-world experiences, roles, or exposure areas to seek out
- resources: 5-8 specific courses, books, communities, or platforms by name
- timeline: realistic total timeline (e.g. "6–12 months", "12–18 months")
- summary: 2-3 sentence personalized overview of the path ahead`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            summary:        { type: "string" },
            timeline:       { type: "string" },
            certifications: {
              type: "array",
              items: { type: "object", properties: { title: { type: "string" }, description: { type: "string" }, priority: { type: "string" } }, required: ["title"] }
            },
            skills: {
              type: "array",
              items: { type: "object", properties: { title: { type: "string" }, description: { type: "string" }, priority: { type: "string" } }, required: ["title"] }
            },
            projects: {
              type: "array",
              items: { type: "object", properties: { title: { type: "string" }, description: { type: "string" }, priority: { type: "string" } }, required: ["title"] }
            },
            experiences: {
              type: "array",
              items: { type: "object", properties: { title: { type: "string" }, description: { type: "string" }, priority: { type: "string" } }, required: ["title"] }
            },
            resources: {
              type: "array",
              items: { type: "object", properties: { title: { type: "string" }, description: { type: "string" }, priority: { type: "string" } }, required: ["title"] }
            }
          }
        }
      });
      setRoadmap(result);
    } catch (err) {
      console.error("Roadmap generation failed:", err);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#060b12] text-white">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden border-b border-emerald-500/20" style={{ background: "linear-gradient(135deg, #031a0e 0%, #050f18 40%, #060b12 100%)" }}>
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 right-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-5xl mx-auto px-6 py-10 relative z-10">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            {/* Left: Title & description */}
            <div className="flex items-start gap-5 flex-1">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 flex-shrink-0">
                <BrainCircuit className="w-7 h-7 text-black" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h1 className="text-2xl lg:text-3xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    AI Career Roadmap Builder
                  </h1>
                  <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-wider">100% Free</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                  Tell us your dream career destination and our AI will map a complete, personalized learning path to get you there — with certifications, skills, portfolio projects, experiences to gain, and curated resources. Built to empower your career by <span className="text-emerald-400 font-semibold">Kindness Community Foundation (KCF LLC)</span>.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  {[
                    { icon: Target, text: "Personalized for Your Role" },
                    { icon: BookOpen, text: "Skills, Certs & Resources" },
                    { icon: Briefcase, text: "Real-world Experience Guide" },
                    { icon: Clock, text: "Realistic Timeline" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Stats pills */}
            <div className="flex flex-row lg:flex-col gap-3 flex-shrink-0 flex-wrap">
              {[
                { icon: Users, label: "Users Guided", value: "50K+", color: "text-emerald-400 border-emerald-500/25 bg-emerald-500/10" },
                { icon: Globe, label: "Countries", value: "120+", color: "text-cyan-400 border-cyan-500/25 bg-cyan-500/10" },
                { icon: Zap, label: "Always Free", value: "100%", color: "text-amber-400 border-amber-500/25 bg-amber-500/10" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${color}`}>
                  <Icon className="w-4 h-4" />
                  <div>
                    <span className="font-extrabold">{value}</span>
                    <span className="ml-1 opacity-70">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature highlights strip */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { emoji: "🎯", title: "Role-Specific", desc: "Questions tailored to your exact target job title" },
              { emoji: "🧠", title: "AI-Powered", desc: "Uses the latest AI to map a data-driven career path" },
              { emoji: "📋", title: "Actionable Checklist", desc: "Track your progress item by item with built-in checklist" },
              { emoji: "🆓", title: "Completely Free", desc: "No fees, no paywalls — a KCF LLC community initiative" },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="bg-white/3 border border-white/6 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{emoji}</div>
                <p className="text-white text-xs font-semibold">{title}</p>
                <p className="text-slate-600 text-[10px] mt-0.5 leading-tight">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        {!roadmap ? (
          <RoadmapSetup onGenerate={handleGenerate} isLoading={isLoading} />
        ) : (
          <RoadmapResults
            roadmap={roadmap}
            targetRole={targetRole}
            onReset={() => { setRoadmap(null); setTargetRole(""); }}
          />
        )}
      </div>

      {/* ── Footer Strip ── */}
      {!roadmap && (
        <div className="relative overflow-hidden border-t border-emerald-500/15 mt-4" style={{ background: "linear-gradient(135deg, #031a0e 0%, #060b12 100%)" }}>
          <div className="absolute bottom-0 left-1/4 w-64 h-32 bg-emerald-600/8 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-5xl mx-auto px-6 py-10 relative z-10">
            <div className="text-center mb-6">
              <p className="text-xs font-semibold text-emerald-500/60 uppercase tracking-widest mb-1">Why use our Career Roadmap Builder?</p>
              <h3 className="text-xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                The Smarter Way to Plan Your Career Growth
              </h3>
              <p className="text-slate-500 text-sm mt-2 max-w-2xl mx-auto">
                Unlike generic career advice, our AI generates a fully customized learning journey based on your current experience and your target role — covering everything from must-have certifications and technical skills to real-world portfolio projects and curated learning resources. It's the career guidance you always deserved, now free for everyone.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { icon: BrainCircuit, value: "AI-Powered", label: "Role-specific roadmaps", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                { icon: TrendingUp, value: "87%", label: "Users improved career clarity", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
                { icon: Award, value: "50K+", label: "Roadmaps generated", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
                { icon: Zap, value: "100% Free", label: "No hidden fees, ever", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
              ].map(({ icon: Icon, value, label, color, bg }) => (
                <div key={value} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${bg}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                  <p className={`text-lg font-extrabold ${color}`}>{value}</p>
                  <p className="text-xs text-slate-500 text-center leading-tight">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-slate-700">
              AI Career Roadmap Builder · Powered by AI Resume Builder · A free initiative by{" "}
              <span className="text-emerald-600 font-semibold">Kindness Community Foundation (KCF LLC)</span>
              {" "}· Built to empower users with intelligent, real-time assistance and meaningful interaction.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}