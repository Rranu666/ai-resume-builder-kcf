import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Sparkles, Target, Download, Star, FileText,
  TrendingUp, Zap, Shield, Brain, BrainCircuit,
  PenLine, ScanSearch, CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { memo } from "react";
import LandingHero from "@/components/landing/LandingHero";
import ClassicHeroBanner from "@/components/landing/ClassicHeroBanner";

/* ─── Floating orb (memoized) ─── */
const Orb = memo(function Orb({ className, size = 400, delay = 0 }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      style={{ width: size, height: size, opacity: 0.25 }}
    />
  );
});

export default function Home() {
  return (
    <div className="min-h-screen bg-[#060b12] text-white overflow-x-hidden">

      <div>

        {/* ══════════════════════ 3D HERO ══════════════════════ */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <LandingHero />
        </section>

        {/* ══════════════════════ CLASSIC HERO BANNER ══════════════════════ */}
        <ClassicHeroBanner />

        {/* ══════════════════════ FREE INTERVIEW PRACTICE BANNER ══════════════════════ */}
        <section className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(42,42,42,0.4) 0%, rgba(26,26,26,0.5) 50%, rgba(42,42,42,0.4) 100%)" }}>
          <div className="absolute inset-0 mesh-bg opacity-20" />
          <Orb className="opacity-20" size={280} delay={0} style={{ background: "rgba(232,232,232,0.08)" }} />

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-gradient-to-r from-slate-700/40 via-slate-800/60 to-slate-700/40 border border-slate-400/20 rounded-3xl p-10 lg:p-16 shadow-2xl hover:shadow-3xl transition-shadow duration-500"
              style={{ boxShadow: "0 0 30px rgba(232,232,232,0.15)" }}
            >
              {/* Left content */}
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="flex items-start gap-6 flex-1"
              >
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-300 to-slate-200 flex items-center justify-center shadow-lg flex-shrink-0 hover:scale-110 transition-transform duration-300" 
                  style={{ boxShadow: "0 0 20px rgba(232,232,232,0.25)" }}
                >
                  <BrainCircuit className="w-8 h-8 text-slate-900" />
                </motion.div>
                <div className="flex-1">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex items-center gap-2 bg-slate-400/15 border border-slate-300/30 px-3 py-1 rounded-full text-slate-300 text-xs font-bold uppercase tracking-widest mb-4"
                  >
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-pulse" />
                    100% Free Feature
                  </motion.div>
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.25 }}
                    className="text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight" 
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Free Interview Practice
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="text-slate-300 text-base leading-relaxed max-w-xl mb-6 font-light"
                  >
                    Ace your next interview with AI-powered mock sessions. Get personalized questions for your target role, real-time feedback, and expert tips — completely free. Practice unlimited times and walk into every interview with confidence.
                  </motion.p>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.35 }}
                    className="flex flex-wrap gap-4 text-sm text-slate-400"
                  >
                    {["AI-Generated Questions", "Real-time Feedback", "Any Role or Industry", "Unlimited Practice"].map((t, i) => (
                      <motion.div 
                        key={t} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.35 + i * 0.05 }}
                        className="flex items-center gap-1.5"
                      >
                        <span className="text-slate-300 font-bold">✓</span>
                        <span>{t}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col items-center gap-3 flex-shrink-0 w-full lg:w-auto"
              >
                <Link to={createPageUrl("InterviewPrep")} className="w-full lg:w-auto">
                  <Button size="lg" className="w-full lg:w-auto bg-gradient-to-r from-slate-200 to-slate-100 hover:from-white hover:to-slate-200 text-slate-900 font-bold px-6 lg:px-8 py-3 lg:py-4 rounded-xl text-sm lg:text-base shadow-xl hover:shadow-2xl transition-all duration-300 group whitespace-nowrap hover:scale-105" style={{ boxShadow: "0 0 20px rgba(232,232,232,0.2)" }}>
                    <BrainCircuit className="w-4 lg:w-5 h-4 lg:h-5 mr-2" />
                    <span className="hidden sm:inline">Start Practicing Free</span>
                    <span className="sm:hidden">Practice Free</span>
                    <ArrowRight className="w-4 lg:w-5 h-4 lg:h-5 ml-2 group-hover:translate-x-1 transition-transform hidden sm:inline" />
                  </Button>
                </Link>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-slate-500 text-xs font-light"
                >
                  No sign-up required
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════ AI TOOLS BANNERS ══════════════════════ */}
        <section className="relative py-12 overflow-hidden bg-[#060b12]">
          <div className="container mx-auto px-6 relative z-10 space-y-6">

            {/* Cover Letter AI Banner */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row items-center justify-between gap-8 rounded-3xl p-8 lg:p-10 border border-violet-500/25 shadow-2xl"
              style={{ background: "linear-gradient(135deg, #1a0a3c 0%, #0d0a20 50%, #0a0a1a 100%)" }}
            >
              <div className="flex items-start gap-6 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0" style={{ boxShadow: "0 0 30px rgba(139,92,246,0.4)" }}>
                  <PenLine className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 bg-violet-500/15 border border-violet-500/30 px-3 py-1 rounded-full text-violet-400 text-xs font-bold uppercase tracking-wider mb-3">
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                    100% Free · AI-Powered
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-2 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    AI Cover Letter Generator
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-xl mb-3">
                    Create personalized, ATS-optimized cover letters in seconds. Choose your tone, industry, and let AI craft a compelling letter tailored to the exact job — with keyword matching and refinement tools.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                    {["15+ Industry Sectors", "Multiple Tones", "ATS Score Included", "Keyword Optimization"].map(t => (
                      <div key={t} className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-violet-400" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 flex-shrink-0 w-full lg:w-auto">
                <Link to={createPageUrl("CoverLetter")} className="w-full lg:w-auto">
                  <Button size="lg" className="w-full lg:w-auto font-bold px-6 lg:px-8 py-3 lg:py-4 rounded-xl text-sm lg:text-base shadow-xl transition-all duration-300 group whitespace-nowrap text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #9333ea)", boxShadow: "0 0 25px rgba(139,92,246,0.35)" }}>
                    <PenLine className="w-4 lg:w-5 h-4 lg:h-5 mr-2" />
                    <span className="hidden sm:inline">Generate Cover Letter</span>
                    <span className="sm:hidden">Cover Letter</span>
                    <ArrowRight className="w-4 lg:w-5 h-4 lg:h-5 ml-2 group-hover:translate-x-1 transition-transform hidden sm:inline" />
                  </Button>
                </Link>
                <p className="text-slate-500 text-xs">Instant generation</p>
              </div>
            </motion.div>

            {/* ATS Scanner Banner */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col lg:flex-row items-center justify-between gap-8 rounded-3xl p-8 lg:p-10 border border-cyan-500/25 shadow-2xl"
              style={{ background: "linear-gradient(135deg, #001a2c 0%, #041420 50%, #060b12 100%)" }}
            >
              <div className="flex items-start gap-6 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0" style={{ boxShadow: "0 0 30px rgba(34,211,238,0.35)" }}>
                  <ScanSearch className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 rounded-full text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    ATS Applicant Tracking System
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-2 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    ATS Scanner
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-xl mb-3">
                    Instantly scan your resume against any job description. Get a detailed match score, keyword gap analysis, hard vs soft skills breakdown, action verb strength, and formatting tips to maximize your chances.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                    {["Match Score", "Keyword Gap Analysis", "Skills Breakdown", "Formatting Tips"].map(t => (
                      <div key={t} className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 flex-shrink-0 w-full lg:w-auto">
                <Link to={createPageUrl("ATSScanner")} className="w-full lg:w-auto">
                  <Button size="lg" className="w-full lg:w-auto font-bold px-6 lg:px-8 py-3 lg:py-4 rounded-xl text-sm lg:text-base shadow-xl transition-all duration-300 group whitespace-nowrap text-white" style={{ background: "linear-gradient(135deg, #0891b2, #0e7490)", boxShadow: "0 0 25px rgba(34,211,238,0.3)" }}>
                    <ScanSearch className="w-4 lg:w-5 h-4 lg:h-5 mr-2" />
                    <span className="hidden sm:inline">Scan My Resume</span>
                    <span className="sm:hidden">Scan Resume</span>
                    <ArrowRight className="w-4 lg:w-5 h-4 lg:h-5 ml-2 group-hover:translate-x-1 transition-transform hidden sm:inline" />
                  </Button>
                </Link>
                <p className="text-slate-500 text-xs">Instant results</p>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ══════════════════════ FEATURES ══════════════════════ */}
        <section className="py-32 relative bg-[#080e18]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#060b12] via-transparent to-transparent" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-slate-400/10 border border-slate-300/20 px-4 py-2 rounded-full text-slate-300 text-sm font-medium mb-6"
              >
                <Zap className="w-4 h-4" /> Why AI Resume Builder?
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight"
              >
                Powered by Intelligence.<br />Built for Humans.
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed"
              >
                Every feature engineered to give you a decisive edge in today's competitive job market.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Brain, title: "AI-Generated Content", desc: "Smart bullet points & summaries tailored to your industry and role.", grad: "from-slate-500 to-slate-600", glow: "hover:shadow-slate-500/20" },
                { icon: Target, title: "ATS Optimized", desc: "Beat 99% of applicant tracking systems with keyword intelligence.", grad: "from-slate-400 to-slate-500", glow: "hover:shadow-slate-400/20" },
                { icon: Download, title: "Multiple Formats", desc: "Export to PDF, DOCX, and shareable links in one click.", grad: "from-slate-500 to-slate-600", glow: "hover:shadow-slate-500/20" },
                { icon: TrendingUp, title: "Real-time Analytics", desc: "Track performance and get actionable improvement insights.", grad: "from-slate-400 to-slate-500", glow: "hover:shadow-slate-400/20" },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.7, ease: "easeOut" }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className={`group bg-slate-800/40 border border-slate-400/10 hover:border-slate-300/20 rounded-2xl p-8 hover:shadow-2xl ${f.glow} transition-all duration-500 cursor-default backdrop-blur-sm`}
                >
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 + 0.1 }}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.grad} flex items-center justify-center mb-6 group-hover:scale-125 transition-transform duration-300 shadow-lg`}
                  >
                    <f.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-white font-bold text-lg mb-3 tracking-tight">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-light">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
        <section className="py-32 relative overflow-hidden bg-gradient-to-b from-[#060b12] via-[#080e18] to-[#060b12]">
          {/* Orb removed for performance */}
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-24"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-slate-400/10 border border-slate-300/20 px-4 py-2 rounded-full text-slate-300 text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" /> Simple Process
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight"
              >
                From Zero to Interview-Ready
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-slate-400 text-lg max-w-xl mx-auto font-light"
              >
                4 steps. 2 minutes. One winning resume.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Connecting line */}
              <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-slate-400/40 to-transparent origin-left" 
              />

              {[
                { step: "01", emoji: "🎨", title: "Choose Template", desc: "Pick from ATS-optimized professional templates", color: "text-slate-300", ring: "border-slate-300/30 bg-slate-400/10" },
                { step: "02", emoji: "🤖", title: "AI Assistance", desc: "AI generates compelling content based on your input", color: "text-slate-300", ring: "border-slate-300/30 bg-slate-400/10" },
                { step: "03", emoji: "👁️", title: "Live Preview", desc: "See your resume update in real-time as you edit", color: "text-slate-300", ring: "border-slate-300/30 bg-slate-400/10" },
                { step: "04", emoji: "🚀", title: "Export & Apply", desc: "Download and start applying immediately", color: "text-slate-300", ring: "border-slate-300/30 bg-slate-400/10" },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.7, ease: "easeOut" }}
                  className="relative flex flex-col items-center text-center group"
                >
                  <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.1, duration: 0.6 }}
                    className={`w-24 h-24 rounded-2xl border-2 ${s.ring} flex items-center justify-center text-4xl mb-6 group-hover:scale-125 transition-transform duration-300 shadow-lg backdrop-blur-sm`}
                  >
                    {s.emoji}
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.2 }}
                    className={`text-3xl font-black ${s.color} mb-3`}
                  >
                    {s.step}
                  </motion.div>
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.25 }}
                    className="text-white font-bold text-lg mb-2 tracking-tight"
                  >
                    {s.title}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.3 }}
                    className="text-slate-400 text-sm leading-relaxed font-light"
                  >
                    {s.desc}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════ TESTIMONIALS ══════════════════════ */}
        <section className="py-32 relative bg-[#080e18]">
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-slate-400/10 border border-slate-300/20 px-4 py-2 rounded-full text-slate-300 text-sm font-medium mb-6"
              >
                <Star className="w-4 h-4 fill-slate-300" /> Social Proof
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight"
              >
                Loved by Job Seekers Worldwide
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-slate-400 text-lg font-light"
              >
                Join thousands who landed their dream jobs
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Sarah Chen", role: "Software Engineer @ Google", text: "AI Resume Builder helped me land my dream job at Google! The AI suggestions were spot-on and the ATS optimization really works.", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face", color: "from-slate-400/15 to-slate-500/10" },
                { name: "Michael Rodriguez", role: "Product Manager @ Meta", text: "From unemployed to PM at Meta in 3 weeks. The resume templates and job matching feature are game-changers!", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", color: "from-slate-400/15 to-slate-500/10" },
                { name: "Priya Sharma", role: "Data Scientist @ Microsoft", text: "The AI-generated content saved me hours and helped me articulate my experience perfectly. Highly recommend!", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", color: "from-slate-400/15 to-slate-500/10" },
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.7, ease: "easeOut" }}
                  whileHover={{ y: -8 }}
                  className={`bg-gradient-to-br ${t.color} border border-slate-300/10 hover:border-slate-200/20 rounded-2xl p-8 transition-all duration-400 hover:shadow-xl group backdrop-blur-sm`}
                >
                  <div className="flex text-slate-300 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-slate-200 italic mb-6 leading-relaxed font-light">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-300/20" />
                    <div>
                      <div className="text-white font-semibold text-sm">{t.name}</div>
                      <div className="text-slate-400 text-xs">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════ CTA ══════════════════════ */}
        <section className="py-40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-[#060b12] to-slate-900/30" />
          <Orb className="opacity-20" size={500} delay={0} style={{ background: "rgba(232,232,232,0.08)", left: "50%", transform: "translateX(-50%)" }} />
          {/* Grid */}
          <div className="absolute inset-0 mesh-bg opacity-30" />

          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="max-w-4xl mx-auto"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-slate-400/10 border border-slate-300/20 px-4 py-2 rounded-full text-slate-300 text-sm font-medium mb-10"
              >
                <Shield className="w-4 h-4" /> Free Forever Plan Available
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl sm:text-6xl font-extrabold text-white mb-8 leading-tight tracking-tight"
              >
                Ready to Transform<br />
                <span className="gradient-text-animated">Your Career?</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
              >
                Join 50,000+ professionals who've successfully landed their dream jobs using AI Resume Builder. Start building your winning resume today — it's completely free to get started!
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12 w-full sm:w-auto"
              >
                <Link to={createPageUrl("Templates")} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-slate-200 to-slate-100 hover:from-white hover:to-slate-200 text-slate-900 font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105" style={{ boxShadow: "0 0 25px rgba(232,232,232,0.2)" }}>
                    <FileText className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                    <span className="hidden sm:inline">Start Building Free</span>
                    <span className="sm:hidden">Build Free</span>
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform hidden sm:inline" />
                  </Button>
                </Link>
                <Link to={createPageUrl("InterviewPrep")} className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-300/40 hover:border-slate-200 text-slate-300 hover:text-white hover:bg-slate-400/10 px-6 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 group hover:scale-105">
                    <BrainCircuit className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                    <span className="hidden sm:inline">Free Interview Practice</span>
                    <span className="sm:hidden">Interview Practice</span>
                  </Button>
                </Link>
              </motion.div>

              {/* Interview Practice highlight strip */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="mb-12 inline-flex items-center gap-3 bg-slate-400/10 border border-slate-300/25 rounded-2xl px-6 py-3 hover:bg-slate-400/15 transition-all duration-300"
              >
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-pulse" />
                <span className="text-slate-300 text-sm font-light">✦ Try our <span className="font-semibold text-slate-200">Free Interview Practice</span> — AI mock interviews with real-time feedback, zero cost</span>
                <Link to={createPageUrl("InterviewPrep")} className="text-slate-200 hover:text-white text-sm font-semibold flex items-center gap-1 transition-colors">
                  Try Now <ArrowRight className="w-3 h-3" />
                </Link>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-8 text-slate-500 text-sm"
              >
                {["No Credit Card Required", "Free Forever Plan", "Start in 2 Minutes"].map((t, i) => (
                  <motion.div 
                    key={t} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-slate-300 font-semibold">✓</span>
                    <span className="font-light">{t}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}