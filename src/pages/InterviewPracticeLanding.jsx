import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  BrainCircuit, ArrowRight, Sparkles, Zap, Users, TrendingUp,
  Mic, BarChart2, Star, RefreshCw, Heart, CheckCircle2,
  Target, MessageSquare, Shield, Globe, Lightbulb, Award
} from "lucide-react";

function Orb({ className, size = 400, delay = 0 }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      style={{ width: size, height: size }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

const FEATURES = [
  { icon: BrainCircuit, emoji: "🚀", title: "Real Interview Simulation", desc: "Practice with questions that feel like real interviews across multiple industries and roles.", color: "from-violet-500 to-purple-600", glow: "hover:shadow-violet-500/20" },
  { icon: Target, emoji: "🎯", title: "Role-Based Question Sets", desc: "Choose your job role and get tailored questions that match what recruiters actually ask.", color: "from-cyan-500 to-blue-600", glow: "hover:shadow-cyan-500/20" },
  { icon: Zap, emoji: "🤖", title: "Instant AI Feedback", desc: "Receive clear, actionable feedback on your answers to improve instantly.", color: "from-emerald-500 to-teal-600", glow: "hover:shadow-emerald-500/20" },
  { icon: Mic, emoji: "🎙️", title: "Voice & Video Practice", desc: "Practice speaking your answers out loud — just like in real interviews.", color: "from-amber-500 to-orange-600", glow: "hover:shadow-amber-500/20" },
  { icon: BarChart2, emoji: "📊", title: "Performance Insights", desc: "Track your progress, identify weak areas, and improve with structured guidance.", color: "from-pink-500 to-rose-600", glow: "hover:shadow-pink-500/20" },
  { icon: Lightbulb, emoji: "💡", title: "Smart Answer Suggestions", desc: "Learn how to structure strong answers with examples and tips.", color: "from-yellow-500 to-amber-600", glow: "hover:shadow-yellow-500/20" },
  { icon: RefreshCw, emoji: "🔁", title: "Unlimited Practice", desc: "Practice anytime, anywhere — no limits, no restrictions.", color: "from-indigo-500 to-violet-600", glow: "hover:shadow-indigo-500/20" },
  { icon: Heart, emoji: "🧠", title: "Confidence Building", desc: "Reduce anxiety with repeated mock sessions and guided improvement.", color: "from-rose-500 to-pink-600", glow: "hover:shadow-rose-500/20" },
];

const CHALLENGES = [
  "Not knowing what questions to expect",
  "Lack of real practice experience",
  "Fear and nervousness",
  "No feedback on their performance",
];

const WHAT_OFFERS = [
  { icon: BrainCircuit, title: "Smart Interview Preparation", desc: "Get structured guidance tailored to your role, experience level, and industry." },
  { icon: MessageSquare, title: "Real Interview Questions & Answers", desc: "Practice with commonly asked and role-specific questions, along with suggested answers." },
  { icon: Users, title: "Mock Interview Experience", desc: "Simulate real interview scenarios to build confidence and improve your responses." },
  { icon: Zap, title: "Instant Feedback & Improvement Tips", desc: "Learn what works, fix what doesn't, and continuously improve." },
  { icon: Star, title: "Resume & Communication Guidance", desc: "Enhance how you present yourself — both on paper and in conversation." },
  { icon: TrendingUp, title: "Beginner to Advanced Support", desc: "Whether you're a fresher or experienced professional, this adapts to your needs." },
  { icon: Sparkles, title: "Interactive & Easy to Use", desc: "No complicated setup — just start and improve instantly." },
];

export default function InterviewPracticeLanding() {
  return (
    <div className="min-h-screen bg-[#060b12] text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0218 0%, #0f0520 40%, #060b12 100%)" }}>
        <Orb className="bg-violet-600/25 top-[-100px] left-[-60px]" size={500} delay={0} />
        <Orb className="bg-purple-500/15 bottom-[-80px] right-[-80px]" size={450} delay={2} />
        <Orb className="bg-cyan-500/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={600} delay={1} />

        {/* Floating particles */}
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? "#a78bfa" : i % 3 === 1 ? "#34d399" : "#22d3ee",
            }}
            animate={{ y: [-20, 20], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: Math.random() * 6 + 4, repeat: Infinity, delay: Math.random() * 4 }}
          />
        ))}

        <div className="container mx-auto px-6 text-center relative z-10 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full text-emerald-400 text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            100% Free · An Initiative by Kindness Community Foundation (KCF LLC)
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="text-white">Free Interview Practice</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Built for Everyone
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto mb-10"
          >
            Get ready to succeed with our <span className="text-white font-semibold">Free Interview Practice</span> platform — a complete, easy-to-use solution designed to help you <span className="text-violet-400 font-semibold">prepare, improve, and confidently crack any interview.</span>
            <br /><br />
            Created by the <span className="text-emerald-400 font-semibold">Kindness Community Foundation (KCF LLC)</span> as a service initiative, this platform is <span className="text-white font-semibold">100% free for all</span> — because everyone deserves access to the right tools to succeed.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link to={createPageUrl("InterviewPrep")}>
              <Button size="lg" className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-bold px-10 py-4 rounded-xl text-base shadow-xl shadow-violet-500/25 group">
                <BrainCircuit className="w-5 h-5 mr-2" />
                Start Practicing Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8"
          >
            {[
              { icon: Users, value: "50K+", label: "Interviews Practiced" },
              { icon: Star, value: "4.9★", label: "Average Rating" },
              { icon: TrendingUp, value: "87%", label: "Improved Confidence" },
              { icon: Globe, value: "120+", label: "Countries" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Icon className="w-4 h-4 text-violet-400" />
                  <span className="text-2xl font-bold text-white">{value}</span>
                </div>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WHAT MAKES THIS DIFFERENT ── */}
      <section className="py-24 relative bg-[#080e18]">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 px-4 py-2 rounded-full text-violet-400 text-sm font-medium mb-5">
              <Sparkles className="w-4 h-4" /> What Makes This Different?
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Everything You Need.<br />
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">In One Place.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We've designed this feature to solve the real problems candidates face in interviews — from lack of practice to low confidence and unclear feedback.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={i} {...fadeUp(i * 0.08)}
                className={`group bg-slate-900/60 border border-white/5 hover:border-white/15 rounded-2xl p-6 hover:shadow-2xl ${f.glow} transition-all duration-300 cursor-default`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg text-2xl`}>
                  {f.emoji}
                </div>
                <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACE YOUR INTERVIEWS ── */}
      <section className="py-24 relative overflow-hidden">
        <Orb className="bg-cyan-500/15 top-0 right-0" size={400} delay={1} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp()}>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-4 py-2 rounded-full text-emerald-400 text-sm font-medium mb-6">
                <Award className="w-4 h-4" /> Ace Your Interviews — For Free
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Struggling with interviews?<br />
                <span className="text-violet-400">You're not alone.</span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-6">
                From preparation gaps to confidence issues, most candidates face the same challenges. That's exactly why we built this all-in-one, interactive solution — designed to help you succeed from day one.
              </p>
              <div className="space-y-3 mb-8">
                <p className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Common challenges this solves:</p>
                {CHALLENGES.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-rose-500/5 border border-rose-500/15 rounded-xl">
                    <span className="w-5 h-5 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-400 text-xs shrink-0">✕</span>
                    <span className="text-sm text-slate-300">{c}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl">
                <p className="text-emerald-300 text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> This platform solves all of these — in one place.
                </p>
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.2)} className="space-y-4">
              {WHAT_OFFERS.map(({ icon: Icon, title, desc }, i) => (
                <motion.div key={i} {...fadeUp(i * 0.07)}
                  className="flex items-start gap-4 p-4 bg-white/4 border border-white/8 rounded-2xl hover:bg-white/6 hover:border-white/12 transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-violet-500/15 border border-violet-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">{title}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WHY THIS MATTERS ── */}
      <section className="py-20 relative bg-[#080e18]">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp()} className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full text-amber-400 text-sm font-medium mb-6">
              <Globe className="w-4 h-4" /> Why This Matters
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Most candidates fail not because they lack skills —<br />
              <span className="text-amber-400">but because they lack the right preparation.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-12">
              This feature bridges that gap — helping you feel ready, confident, and in control. Whether you're a fresher, experienced professional, or switching careers — this tool helps you prepare smarter, perform better, and succeed faster.
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: BrainCircuit, value: "100% Free", label: "No hidden fees, forever", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
                { icon: Zap, value: "Instant AI", label: "Real-time expert scoring", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
                { icon: Shield, value: "No Limits", label: "Unlimited practice sessions", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
              ].map(({ icon: Icon, value, label, color, bg }) => (
                <motion.div key={value} {...fadeUp()}
                  className={`p-6 rounded-2xl border ${bg} text-center`}
                >
                  <Icon className={`w-8 h-8 ${color} mx-auto mb-3`} />
                  <p className={`text-2xl font-extrabold ${color} mb-1`}>{value}</p>
                  <p className="text-slate-500 text-sm">{label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FREE FOR ALL — KCF ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0f0520 0%, #0a0218 50%, #130530 100%)" }} />
        <Orb className="bg-violet-600/20 top-0 left-0" size={400} delay={0} />
        <Orb className="bg-emerald-500/15 bottom-0 right-0" size={350} delay={2} />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div {...fadeUp()} className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-4 py-2 rounded-full text-emerald-400 text-sm font-medium mb-6">
              💙 Free for All — Always
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Proudly Free. Powered by<br />
              <span className="text-emerald-400">Kindness Community Foundation</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-4">
              This initiative is completely free and accessible to all, proudly supported by the <span className="text-white font-semibold">Kindness Community Foundation (KCF LLC)</span> as part of our mission to serve and uplift individuals through meaningful opportunities.
            </p>
            <p className="text-slate-500 text-base mb-10">
              <span className="text-white font-semibold">No subscriptions. No hidden costs.</span> Just pure support.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
              {["No Credit Card", "No Sign-up Required to Explore", "Free Forever", "No Usage Limits"].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {t}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #060b12 0%, #0f0520 50%, #060b12 100%)" }}>
        <Orb className="bg-violet-500/20 top-0 left-1/2 -translate-x-1/2" size={600} delay={0} />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(167,139,250,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div {...fadeUp()} className="max-w-3xl mx-auto">
            <h2 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              🎯 Start Practicing<br />
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Today</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed">
              <span className="text-white font-semibold">Start your free interview practice now</span> and take the next step toward your dream job.
            </p>

            <Link to={createPageUrl("InterviewPrep")}>
              <Button size="lg" className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-bold px-12 py-5 rounded-xl text-lg shadow-2xl shadow-violet-500/25 group mb-6">
                <BrainCircuit className="w-6 h-6 mr-2" />
                Start Free Interview Practice
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <p className="text-slate-600 text-sm mt-4">
              Free Interview Practice · Powered by AI Resume Builder · An initiative by KCF LLC
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}