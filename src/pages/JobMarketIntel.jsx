import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp, TrendingDown, Minus, DollarSign, Award, Zap, Target,
  Building2, AlertTriangle, Lightbulb, BarChart3, RefreshCw,
  Sparkles, CheckCircle2, Clock, BookOpen, MapPin, ArrowUpRight,
  Flame, Star, ChevronRight, Brain
} from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const INDUSTRIES = [
  "Software Engineering", "Data Science & AI", "Product Management", "Cybersecurity",
  "Cloud Computing", "DevOps & SRE", "UX/UI Design", "Digital Marketing",
  "Finance & FinTech", "Healthcare & MedTech", "Sales & Business Development",
  "Human Resources", "Operations & Supply Chain", "Legal & Compliance",
  "Education & EdTech", "Real Estate"
];

const EXP_LEVELS = ["Entry Level (0–2 yrs)", "Mid Level (3–5 yrs)", "Senior (6–10 yrs)", "Principal / Lead (10+ yrs)"];

const sentimentConfig = {
  "Very Hot": { color: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/30", icon: Flame },
  "Hot": { color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/30", icon: TrendingUp },
  "Moderate": { color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/30", icon: Minus },
  "Cooling": { color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/30", icon: TrendingDown },
  "Cold": { color: "text-slate-400", bg: "bg-slate-500/15", border: "border-slate-500/30", icon: TrendingDown },
};

const trendConfig = {
  exploding: { label: "🚀 Exploding", cls: "bg-red-500/15 text-red-300 border-red-500/25" },
  rising: { label: "📈 Rising", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25" },
  stable: { label: "➡️ Stable", cls: "bg-slate-500/15 text-slate-300 border-slate-500/25" },
  declining: { label: "📉 Declining", cls: "bg-rose-500/15 text-rose-300 border-rose-500/25" },
};

const priorityConfig = {
  "Critical": "bg-red-500/20 text-red-300 border-red-500/30",
  "High": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Medium": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Nice to Have": "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

const darkTooltip = {
  contentStyle: { backgroundColor: "#0d1a26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff" },
  labelStyle: { color: "#94a3b8" },
};

const fmtSalary = (n) => n ? `$${(n / 1000).toFixed(0)}K` : "—";

export default function JobMarketIntel() {
  const [industry, setIndustry] = useState("");
  const [role, setRole] = useState("");
  const [expLevel, setExpLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // Try to prefill from user's resume
  useEffect(() => {
    const init = async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (authed) {
          const resumes = await base44.entities.Resume.list("-updated_date", 1);
          if (resumes.length > 0 && resumes[0].experience?.length > 0) {
            setRole(resumes[0].experience[0].title || "");
          }
        }
      } catch (_) {}
    };
    init();
  }, []);

  const fetchIntel = async () => {
    if (!industry) return;
    setLoading(true);
    setError("");
    try {
      const res = await base44.functions.invoke("jobMarketIntel", {
        industry, role, experience_level: expLevel
      });
      if (res.data.error) { setError(res.data.error); setLoading(false); return; }
      setData(res.data.data);
      setLastUpdated(new Date());
      setActiveTab("overview");
    } catch (e) {
      setError("Failed to fetch market data. Please try again.");
    }
    setLoading(false);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "skills", label: "Trending Skills", icon: Zap },
    { id: "salary", label: "Salary Data", icon: DollarSign },
    { id: "certs", label: "Certifications", icon: Award },
    { id: "companies", label: "Hiring Now", icon: Building2 },
    { id: "plan", label: "Action Plan", icon: Target },
  ];

  const SentimentIcon = data?.market_summary?.sentiment ? sentimentConfig[data.market_summary.sentiment]?.icon || Flame : Flame;

  return (
    <div className="min-h-screen bg-[#060b12] text-white">

      {/* Header */}
      <div className="border-b border-emerald-500/15 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #060d14 0%, #0a1520 50%, #060b12 100%)" }}>
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-xl shadow-emerald-500/25 flex-shrink-0">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-2xl font-extrabold text-white">Job Market Intelligence</h1>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-black">AI-Powered</span>
                </div>
                <p className="text-slate-400 text-sm max-w-xl">
                  Real-time analysis of trending skills, salary benchmarks, and certification ROI for your target industry — so you invest time in exactly the right places.
                </p>
              </div>
            </div>
            {data && lastUpdated && (
              <div className="text-right flex-shrink-0">
                <p className="text-slate-500 text-xs">Last updated</p>
                <p className="text-slate-300 text-sm font-medium">{lastUpdated.toLocaleTimeString()}</p>
                <button onClick={fetchIntel} className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 mt-1 transition-colors">
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 lg:p-6">

        {/* Setup Panel */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white/4 border border-white/8 rounded-2xl p-5 mb-6">
          <p className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" /> Configure Your Market Report
          </p>
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1.5">Industry *</label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-10 text-sm">
                  <SelectValue placeholder="Select industry..." />
                </SelectTrigger>
                <SelectContent className="bg-[#0d1a26] border-white/10 max-h-60">
                  {INDUSTRIES.map(i => (
                    <SelectItem key={i} value={i} className="text-white hover:bg-white/10 text-sm">{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1.5">Target Role (optional)</label>
              <Input value={role} onChange={e => setRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="bg-white/5 border-white/10 text-white placeholder-slate-600 h-10 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1.5">Experience Level</label>
              <Select value={expLevel} onValueChange={setExpLevel}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-10 text-sm">
                  <SelectValue placeholder="Select level..." />
                </SelectTrigger>
                <SelectContent className="bg-[#0d1a26] border-white/10">
                  {EXP_LEVELS.map(e => (
                    <SelectItem key={e} value={e} className="text-white hover:bg-white/10 text-sm">{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={fetchIntel} disabled={!industry || loading}
              className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-black font-bold h-10 px-6">
              {loading ? (
                <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Analyzing market...</span>
              ) : (
                <span className="flex items-center gap-2"><Brain className="w-4 h-4" /> Generate Intelligence Report</span>
              )}
            </Button>
            {error && <p className="text-red-400 text-sm flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" />{error}</p>}
          </div>
        </motion.div>

        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-20">
              <div className="relative inline-flex mb-6">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
                  <Brain className="w-10 h-10 text-emerald-400 animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400/20 animate-ping" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Scanning the job market...</h3>
              <p className="text-slate-400 text-sm">Pulling trending skills · salary benchmarks · certification ROI · hiring signals</p>
              <div className="flex justify-center gap-1.5 mt-6">
                {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {data && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Tabs */}
            <div className="flex gap-1 bg-white/4 border border-white/8 rounded-xl p-1 mb-5 overflow-x-auto">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeTab === t.id ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}>
                  <t.icon className="w-3.5 h-3.5" />{t.label}
                </button>
              ))}
            </div>

            {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
            {activeTab === "overview" && (
              <div className="space-y-5">
                {/* Market sentiment card */}
                {data.market_summary && (() => {
                  const s = data.market_summary;
                  const sc = sentimentConfig[s.sentiment] || sentimentConfig["Moderate"];
                  const SIcon = sc.icon;
                  return (
                    <div className={`${sc.bg} border ${sc.border} rounded-2xl p-6`}>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-12 h-12 rounded-xl ${sc.bg} border ${sc.border} flex items-center justify-center flex-shrink-0`}>
                            <SIcon className={`w-6 h-6 ${sc.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`text-lg font-extrabold ${sc.color}`}>{s.sentiment} Market</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full border ${sc.bg} ${sc.border} ${sc.color} font-bold`}>{industry}</span>
                            </div>
                            <p className="text-slate-300 text-sm">{s.headline}</p>
                            <p className="text-slate-400 text-xs mt-1">{s.sentiment_reason}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 flex-shrink-0">
                          {[
                            { label: "YoY Job Growth", value: s.yoy_job_growth, icon: TrendingUp },
                            { label: "Open Positions", value: s.open_positions_estimate, icon: Building2 },
                            { label: "Avg Time to Hire", value: s.avg_time_to_hire, icon: Clock },
                            { label: "Remote-Friendly", value: `${s.remote_percentage}%`, icon: MapPin },
                          ].map(({ label, value, icon: Icon }) => (
                            <div key={label} className="bg-white/8 rounded-xl p-3 text-center">
                              <p className="text-white font-bold text-sm">{value}</p>
                              <p className="text-slate-400 text-[10px] mt-0.5">{label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Top 5 skills radar / top insights */}
                <div className="grid lg:grid-cols-2 gap-5">
                  {/* Top skills bar */}
                  <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
                    <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" /> Top 5 Most Demanded Skills
                    </h3>
                    {data.trending_skills?.length > 0 && (
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={data.trending_skills.slice(0, 5)} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                          <XAxis type="number" domain={[0, 100]} stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                          <YAxis dataKey="skill" type="category" stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 10 }} width={110} />
                          <Tooltip {...darkTooltip} />
                          <Bar dataKey="demand_score" fill="#34d399" radius={[0, 6, 6, 0]} name="Demand Score" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Market insights */}
                  <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
                    <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-cyan-400" /> Key Market Insights
                    </h3>
                    <div className="space-y-3">
                      {(data.market_insights || []).map((insight, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-cyan-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-cyan-400 text-[9px] font-black">{i + 1}</span>
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skill gaps */}
                {data.skill_gaps?.length > 0 && (
                  <div className="bg-red-500/6 border border-red-500/15 rounded-2xl p-5">
                    <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" /> Identified Skill Gaps in This Market
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {data.skill_gaps.map((gap, i) => {
                        const cls = gap.severity === "Critical" ? "border-red-500/25 bg-red-500/8" : gap.severity === "High" ? "border-orange-500/25 bg-orange-500/8" : "border-amber-500/25 bg-amber-500/8";
                        const tcls = gap.severity === "Critical" ? "text-red-400" : gap.severity === "High" ? "text-orange-400" : "text-amber-400";
                        return (
                          <div key={i} className={`rounded-xl border p-3 ${cls}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full bg-white/5 ${tcls}`}>{gap.severity}</span>
                              <p className="text-white text-sm font-medium">{gap.gap}</p>
                            </div>
                            <p className="text-slate-400 text-xs"><span className="text-slate-300">Fix: </span>{gap.how_to_close}</p>
                            <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />{gap.timeline}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TRENDING SKILLS ───────────────────────────────────────── */}
            {activeTab === "skills" && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(data.trending_skills || []).map((skill, i) => {
                    const tc = trendConfig[skill.trend] || trendConfig.stable;
                    const demandWidth = `${skill.demand_score}%`;
                    return (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        className="bg-white/4 border border-white/8 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-white font-semibold text-sm">{skill.skill}</p>
                            <p className="text-slate-500 text-xs">{skill.category}</p>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tc.cls}`}>{tc.label}</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full mb-2">
                          <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: demandWidth }} />
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Demand: <span className="text-white font-bold">{skill.demand_score}/100</span></span>
                          <span className="text-emerald-400 font-semibold">{skill.salary_premium}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                          <Building2 className="w-3 h-3" />
                          <span>{skill.jobs_mentioning} jobs</span>
                          <span className="ml-auto text-cyan-400">{skill.growth_rate}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── SALARY DATA ───────────────────────────────────────────── */}
            {activeTab === "salary" && data.salary_data && (() => {
              const s = data.salary_data;
              const barData = [
                { level: "Entry", min: s.entry_level?.min, median: s.entry_level?.median, max: s.entry_level?.max },
                { level: "Mid", min: s.mid_level?.min, median: s.mid_level?.median, max: s.mid_level?.max },
                { level: "Senior", min: s.senior_level?.min, median: s.senior_level?.median, max: s.senior_level?.max },
              ].map(d => ({ ...d, min: Math.round((d.min || 0) / 1000), median: Math.round((d.median || 0) / 1000), max: Math.round((d.max || 0) / 1000) }));

              return (
                <div className="space-y-5">
                  {/* Salary range cards */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { label: "Entry Level", data: s.entry_level, color: "text-cyan-400", bg: "from-cyan-500/10 to-blue-500/10", border: "border-cyan-500/20" },
                      { label: "Mid Level", data: s.mid_level, color: "text-emerald-400", bg: "from-emerald-500/10 to-teal-500/10", border: "border-emerald-500/20" },
                      { label: "Senior Level", data: s.senior_level, color: "text-violet-400", bg: "from-violet-500/10 to-purple-500/10", border: "border-violet-500/20" },
                    ].map(({ label, data: d, color, bg, border }) => (
                      <div key={label} className={`bg-gradient-to-br ${bg} border ${border} rounded-2xl p-5`}>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">{label}</p>
                        <p className={`text-3xl font-extrabold ${color}`}>{fmtSalary(d?.median)}</p>
                        <p className="text-slate-400 text-xs mt-1">median</p>
                        <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                          <span>Min: {fmtSalary(d?.min)}</span>
                          <span>Max: {fmtSalary(d?.max)}</span>
                        </div>
                        <div className="w-full bg-white/10 h-1 rounded-full mt-2">
                          <div className={`h-1 rounded-full bg-gradient-to-r ${bg.replace("/10", "/60")}`} style={{ width: "65%" }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Salary bar chart */}
                  <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
                    <h3 className="text-white font-semibold text-sm mb-4">Salary Range Comparison (K USD)</h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="level" stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                        <YAxis stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                        <Tooltip {...darkTooltip} formatter={(v) => `$${v}K`} />
                        <Bar dataKey="min" fill="#6366f1" name="Min" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="median" fill="#34d399" name="Median" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="max" fill="#f59e0b" name="Max" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Top paying companies */}
                    {s.top_paying_companies?.length > 0 && (
                      <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
                        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-amber-400" /> Top Paying Companies
                        </h3>
                        <div className="space-y-2">
                          {s.top_paying_companies.slice(0, 5).map((c, i) => (
                            <div key={i} className="flex items-center gap-3 p-2.5 bg-white/4 rounded-lg">
                              <span className="w-5 h-5 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400 text-[10px] font-black">{i + 1}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{c.company}</p>
                                <p className="text-slate-500 text-xs truncate">{c.perks}</p>
                              </div>
                              <span className="text-emerald-400 font-bold text-sm flex-shrink-0">{fmtSalary(c.avg_salary)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Location premiums */}
                    {s.top_paying_locations?.length > 0 && (
                      <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
                        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-cyan-400" /> Location Salary Premiums
                        </h3>
                        <div className="space-y-2">
                          {s.top_paying_locations.slice(0, 5).map((l, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <span className="text-slate-500 text-xs w-4">{i + 1}</span>
                              <p className="text-slate-300 text-sm flex-1">{l.city}</p>
                              <span className="text-cyan-400 font-bold text-sm">+{l.premium_percentage}%</span>
                            </div>
                          ))}
                        </div>
                        {s.salary_growth_yoy !== undefined && (
                          <div className="mt-4 pt-3 border-t border-white/8 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <p className="text-slate-300 text-sm">Salaries grew <span className="text-emerald-400 font-bold">{s.salary_growth_yoy}%</span> YoY in this industry</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ── CERTIFICATIONS ────────────────────────────────────────── */}
            {activeTab === "certs" && (
              <div className="space-y-4">
                <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-4 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-300 text-sm">Certifications are ranked by <strong>ROI Score</strong> — a composite of salary boost, time to complete, cost, and current job demand. Focus on <span className="text-white font-bold">Critical</span> first.</p>
                </div>
                <div className="space-y-3">
                  {(data.certifications || []).sort((a, b) => b.roi_score - a.roi_score).map((cert, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="bg-white/4 border border-white/8 rounded-xl p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="text-white font-semibold">{cert.name}</p>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${priorityConfig[cert.priority]}`}>{cert.priority}</span>
                            <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{cert.difficulty}</span>
                          </div>
                          <p className="text-slate-400 text-xs mb-2">by <span className="text-slate-300">{cert.provider}</span></p>
                          <p className="text-slate-300 text-sm">{cert.why_prioritize}</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 flex-shrink-0 min-w-[140px]">
                          <div className="text-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5">
                            <p className="text-emerald-400 font-extrabold text-lg">{cert.roi_score}<span className="text-xs text-slate-500">/100</span></p>
                            <p className="text-[10px] text-slate-500">ROI Score</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-2.5 space-y-1">
                            <p className="text-xs text-slate-400">💰 <span className="text-white">{cert.avg_salary_boost}</span> boost</p>
                            <p className="text-xs text-slate-400">⏱ <span className="text-white">{cert.time_to_complete}</span></p>
                            <p className="text-xs text-slate-400">💵 <span className="text-white">{cert.cost_range}</span></p>
                            <p className="text-xs text-slate-400">📋 <span className="text-white">{cert.jobs_requiring}</span> jobs</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ── HIRING COMPANIES ──────────────────────────────────────── */}
            {activeTab === "companies" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(data.hiring_companies || []).map((co, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-white/4 border border-white/8 rounded-xl p-4 hover:border-white/15 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-semibold truncate">{co.company}</p>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">{co.hiring_volume}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400"><span className="text-slate-300">Culture: </span>{co.culture_tag}</p>
                      <p className="text-xs text-slate-400"><span className="text-slate-300">Top skill: </span>{co.top_skill_needed}</p>
                    </div>
                    <div className="mt-3 flex items-center text-xs text-emerald-400 font-semibold">
                      <span>View openings</span>
                      <ArrowUpRight className="w-3 h-3 ml-1" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ── ACTION PLAN ───────────────────────────────────────────── */}
            {activeTab === "plan" && (
              <div className="space-y-4">
                <div className="bg-violet-500/8 border border-violet-500/20 rounded-xl p-4 flex items-start gap-2">
                  <Star className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                  <p className="text-violet-300 text-sm">A personalized week-by-week action plan to close your skill gaps and maximize your job prospects in <strong className="text-white">{industry}</strong>.</p>
                </div>
                <div className="space-y-3">
                  {(data.action_plan || []).map((step, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                      className="flex gap-4 p-4 bg-white/4 border border-white/8 rounded-xl">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/25 flex items-center justify-center">
                          <span className="text-violet-400 font-extrabold text-xs">{i + 1}</span>
                        </div>
                        {i < (data.action_plan?.length || 0) - 1 && <div className="w-0.5 bg-white/5 flex-1 mt-2" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-violet-300 text-xs font-semibold mb-1">{step.week}</p>
                        <p className="text-white font-medium text-sm mb-1">{step.action}</p>
                        <p className="text-slate-400 text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Expected impact: {step.impact}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Empty state */}
        {!data && !loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/8 border border-emerald-500/15 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-emerald-400 opacity-60" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Select your industry to get started</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">Get real-time trending skills, salary benchmarks, certification ROI rankings, and a personalized action plan.</p>
          </div>
        )}
      </div>
    </div>
  );
}