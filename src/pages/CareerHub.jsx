import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Resume } from "@/entities/Resume";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StreakWidget from "@/components/gamification/StreakWidget";
import ApplyReadyScore from "@/components/gamification/ApplyReadyScore";
import {
  Zap, Shield, Wand2, Clock, DollarSign, Linkedin,
  BrainCircuit, Trophy, TrendingUp, Star, ArrowRight, Flame, BarChart3
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Interview Roulette",
    description: "Daily interview challenge. Answer in 60 seconds, get AI scored, compete with community.",
    badge: "Daily • +15pts",
    badgeColor: "bg-amber-500/15 text-amber-300",
    gradient: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/20",
    link: "/InterviewRoulette",
    isNew: true,
  },
  {
    icon: Shield,
    title: "AI Red Team Attack",
    description: "Hostile AI tries to reject your resume. Find every weakness before recruiters do.",
    badge: "Adversarial AI",
    badgeColor: "bg-red-500/15 text-red-300",
    gradient: "from-red-500/20 to-rose-500/20",
    border: "border-red-500/20",
    link: "/RedTeamResume",
    isNew: true,
  },
  {
    icon: Wand2,
    title: "Auto-Tailor Resume",
    description: "Paste any job description. AI rewrites your resume to maximize match score in 1 click.",
    badge: "1-Click Magic",
    badgeColor: "bg-violet-500/15 text-violet-300",
    gradient: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-500/20",
    link: "/TailorResume",
    isNew: true,
  },
  {
    icon: Clock,
    title: "Career Time Machine",
    description: "Simulate where your career goes in 1, 3, and 5 years — with and without action.",
    badge: "AI Simulation",
    badgeColor: "bg-cyan-500/15 text-cyan-300",
    gradient: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-500/20",
    link: "/CareerTimeMachine",
    isNew: true,
  },
  {
    icon: DollarSign,
    title: "Salary Negotiator",
    description: "Practice salary negotiations with an AI HR manager. Build confidence before the real deal.",
    badge: "Role Play",
    badgeColor: "bg-green-500/15 text-green-300",
    gradient: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/20",
    link: "/SalaryNegotiator",
    isNew: true,
  },
  {
    icon: Linkedin,
    title: "LinkedIn Ghostwriter",
    description: "AI generates your 30-day LinkedIn content calendar, profile tips, and headline ideas.",
    badge: "30-Day Plan",
    badgeColor: "bg-blue-500/15 text-blue-300",
    gradient: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/20",
    link: "/LinkedInGhostwriter",
    isNew: true,
  },
  {
    icon: BrainCircuit,
    title: "Interview Practice",
    description: "AI-powered mock interviews with instant feedback for your target role.",
    badge: "Voice + Text",
    badgeColor: "bg-violet-500/15 text-violet-300",
    gradient: "from-violet-500/20 to-pink-500/20",
    border: "border-violet-500/20",
    link: createPageUrl("InterviewPrep"),
  },
  {
    icon: BarChart3,
    title: "Job Market Intelligence",
    description: "AI-powered dashboard of trending skills, salary benchmarks, and certification ROI for your industry.",
    badge: "Live Data",
    badgeColor: "bg-emerald-500/15 text-emerald-300",
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20",
    link: "/JobMarketIntel",
    isNew: true,
  },
  {
    icon: TrendingUp,
    title: "Career Roadmap",
    description: "AI builds a personalized step-by-step plan to reach your dream job.",
    badge: "Personalized",
    badgeColor: "bg-emerald-500/15 text-emerald-300",
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20",
    link: createPageUrl("CareerRoadmap"),
  },
];

export default function CareerHub() {
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (authed) {
          const u = await base44.auth.me();
          setUser(u);
          const [r, s] = await Promise.all([
            Resume.list("-updated_date"),
            base44.entities.CareerStreak.filter({ user_email: u.email })
          ]);
          setResumes(r);
          if (s.length > 0) setStreak(s[0]);
        }
      } catch (e) { console.error(e); }
    };
    init();
  }, []);

  return (
    <div className="min-h-screen bg-[#060b12] flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
              <Flame className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-sm font-medium">Your Career Command Center</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Career Hub 🚀</h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-2">All your AI-powered career tools in one place. Track your progress, earn points, and accelerate your career growth with intelligent, data-driven insights.</p>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto">Access expert-level interview prep, resume optimization, salary negotiation coaching, LinkedIn strategy, and real-time job market intelligence — all powered by cutting-edge AI.</p>
          </motion.div>

        {user && (
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <ApplyReadyScore resumes={resumes} streak={streak} />
            <StreakWidget userEmail={user.email} />
          </div>
        )}

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
           {features.map((feature, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={feature.link}>
                <div className={`group h-full bg-gradient-to-br ${feature.gradient} border ${feature.border} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden`}>
                  {feature.isNew && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full">NEW</div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} border ${feature.border} flex items-center justify-center flex-shrink-0`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">{feature.title}</h3>
                      </div>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${feature.badgeColor} mb-2`}>{feature.badge}</span>
                      <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-white/60 group-hover:text-white text-sm transition-colors">
                    <span>Open Tool</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        </div>
        </div>

        {/* SEO Content Footer */}
        <div className="bg-white/3 border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Master Your Career with AI-Powered Tools</h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8 text-slate-300 text-sm leading-relaxed">
          <div>
            <h3 className="text-white font-semibold mb-3">Comprehensive Career Development Platform</h3>
            <p>The Career Hub is your all-in-one destination for career acceleration. Whether you're preparing for interviews, optimizing your resume, negotiating salary, or building your professional brand on LinkedIn — we provide AI-powered tools designed to give you a competitive edge.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Real-Time Job Market Intelligence</h3>
            <p>Stay ahead of industry trends with live data on trending skills, salary benchmarks, certification ROI, and hiring hotspots. Our Job Market Intelligence tool analyzes millions of job postings to give you actionable insights on what employers are looking for right now.</p>
          </div>
        </div>
        <p className="text-slate-500 text-xs text-center">Powered by AI Resume Builder · A free initiative by Kindness Community Foundation (KCF LLC) · Built to empower users with intelligent, real-time assistance and meaningful interaction.</p>
        </div>
        </div>
        </div>
        );
        }