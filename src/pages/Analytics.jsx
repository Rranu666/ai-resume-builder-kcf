import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
const Resume = base44.entities.Resume;
const JobApplication = base44.entities.JobApplication;
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Target, FileText, Calendar, Award, Eye, BarChart2, CheckCircle2, Users, Globe, Zap, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import ResumeLoader from "@/components/common/ResumeLoader";

const COLORS = ["#34d399", "#6366f1", "#f59e0b", "#f43f5e", "#a78bfa"];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const darkTooltipStyle = {
  contentStyle: { backgroundColor: "#0d1a26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" },
  labelStyle: { color: "#94a3b8" },
};

export default function Analytics() {
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resumeData, appData] = await Promise.all([
        Resume.list("-updated_date"),
        JobApplication.list("-application_date"),
      ]);
      setResumes(resumeData);
      setApplications(appData);
    } catch (e) { console.error(e); }
    setIsLoading(false);
  };

  const statusData = Object.entries(
    applications.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  const scoreData = resumes.map(r => ({ name: r.title.slice(0, 12) + (r.title.length > 12 ? "…" : ""), score: r.ats_score || 0 }));

  const trendData = [...Array(6)].map((_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    return {
      month: d.toLocaleDateString("en-US", { month: "short" }),
      applications: applications.filter(a => {
        const ad = new Date(a.application_date);
        return ad.getMonth() === d.getMonth() && ad.getFullYear() === d.getFullYear();
      }).length,
    };
  });

  const avgATS = resumes.length > 0 ? Math.round(resumes.reduce((s, r) => s + (r.ats_score || 0), 0) / resumes.length) : 0;
  const successRate = applications.length > 0
    ? Math.round((applications.filter(a => ["interview", "offer"].includes(a.status)).length / applications.length) * 100)
    : 0;

  if (isLoading) return <ResumeLoader />;

  return (
    <div className="min-h-screen bg-[#060b12] text-white">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden border-b border-blue-500/20" style={{ background: "linear-gradient(135deg, #060b18 0%, #0a1020 40%, #060b12 100%)" }}>
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 right-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 flex-shrink-0">
                <BarChart2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h1 className="text-2xl lg:text-3xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Career Analytics Dashboard</h1>
                  <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/40 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-wider">Free</span>
                </div>
                <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                  Track every stage of your job search — from resume ATS scores and application funnel status to interview success rates and 6-month activity trends. Make data-driven decisions to land your dream job faster. A free initiative by <span className="text-blue-400 font-semibold">Kindness Community Foundation (KCF LLC)</span>.
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  {[
                    { text: "Real-time ATS Score Tracking", color: "text-emerald-400" },
                    { text: "Application Funnel Analysis", color: "text-blue-400" },
                    { text: "6-Month Trend Reports", color: "text-indigo-400" },
                  ].map(({ text, color }) => (
                    <div key={text} className={`flex items-center gap-1.5 text-xs ${color} font-medium`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />{text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-2 flex-shrink-0">
              <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 bg-blue-500/15 border border-blue-500/30 text-blue-400 hover:text-blue-300 rounded-xl text-sm font-semibold transition-colors">
                <RefreshCw className="w-4 h-4" /> Refresh Data
              </button>
              <p className="text-xs text-slate-600">Auto-updates as you apply</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 lg:p-8">

        {/* Platform KPI strip */}
        <motion.div {...fadeUp(0)} className="mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-gradient-to-r from-blue-950/40 to-indigo-950/30 border border-blue-500/15 rounded-2xl">
            {[
              { icon: Globe, label: "Global Users", value: "50K+", color: "text-emerald-400" },
              { icon: Award, label: "Avg ATS Pass Rate", value: "94%", color: "text-blue-400" },
              { icon: Users, label: "Countries Served", value: "120+", color: "text-violet-400" },
              { icon: Zap, label: "Always Free", value: "100%", color: "text-amber-400" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-3 p-2">
                <Icon className={`w-5 h-5 ${color} flex-shrink-0`} />
                <div>
                  <p className={`text-lg font-extrabold ${color}`}>{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Empty state */}
        {resumes.length === 0 && applications.length === 0 && (
          <motion.div {...fadeUp(0.1)} className="mb-8">
            <div className="text-center py-14 bg-white/3 border border-white/8 rounded-2xl">
              <BarChart2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Your Analytics Dashboard is Ready</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                Start building resumes and tracking job applications to unlock powerful insights — ATS scores, application trends, interview success rates and more. Completely free, powered by KCF LLC.
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                <Link to={createPageUrl("Templates")}>
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-sm">
                    <FileText className="w-4 h-4 mr-2" /> Build My First Resume
                  </Button>
                </Link>
                <Link to={createPageUrl("Dashboard")}>
                  <Button variant="outline" className="border-white/10 text-slate-300 hover:text-white text-sm">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: "Total Resumes", value: resumes.length, icon: FileText, grad: "from-emerald-500/20 to-cyan-500/20", border: "border-emerald-500/20", text: "text-emerald-400", sub: "created & saved" },
            { label: "Avg ATS Score", value: `${avgATS}%`, icon: Target, grad: "from-blue-500/20 to-indigo-500/20", border: "border-blue-500/20", text: "text-blue-400", sub: "across all resumes" },
            { label: "Applications", value: applications.length, icon: Calendar, grad: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/20", text: "text-violet-400", sub: "tracked & logged" },
            { label: "Interview Rate", value: `${successRate}%`, icon: Award, grad: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/20", text: "text-amber-400", sub: "interviews + offers" },
          ].map(({ label, value, icon: IconComp, grad, border, text, sub }, i) => (
            <motion.div key={i} {...fadeUp(0.05 + i * 0.07)}>
              <div className={`bg-gradient-to-br ${grad} border ${border} rounded-2xl p-5 h-full`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`${text} text-xs font-semibold mb-1 uppercase tracking-wide`}>{label}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                    <p className="text-slate-500 text-xs mt-1">{sub}</p>
                  </div>
                  <IconComp className={`w-7 h-7 ${text} opacity-80`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <motion.div {...fadeUp(0.3)}>
            <div className="bg-white/4 border border-white/8 rounded-2xl p-6 h-full">
              <h3 className="text-white font-semibold mb-1 flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-emerald-400" /> Resume ATS Scores
              </h3>
              <p className="text-slate-600 text-xs mb-4">Higher = better chance of passing ATS filters</p>
              {scoreData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={scoreData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <YAxis stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip {...darkTooltipStyle} />
                    <Bar dataKey="score" fill="#34d399" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[240px] text-slate-600">
                  <Target className="w-8 h-8 mb-3 opacity-40" />
                  <p className="text-sm">No resume data yet</p>
                  <Link to={createPageUrl("Templates")} className="text-xs text-emerald-500 mt-2 hover:underline">Create a resume →</Link>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.35)}>
            <div className="bg-white/4 border border-white/8 rounded-2xl p-6 h-full">
              <h3 className="text-white font-semibold mb-1 flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4 text-blue-400" /> Application Status Breakdown
              </h3>
              <p className="text-slate-600 text-xs mb-4">Visual distribution of your job application pipeline</p>
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}>
                      {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip {...darkTooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[240px] text-slate-600">
                  <Eye className="w-8 h-8 mb-3 opacity-40" />
                  <p className="text-sm">No application data yet</p>
                  <p className="text-xs mt-1 text-slate-700">Track applications from your dashboard</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Trend chart */}
        <motion.div {...fadeUp(0.4)}>
          <div className="bg-white/4 border border-white/8 rounded-2xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-1 flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-violet-400" /> Application Activity — Last 6 Months
            </h3>
            <p className="text-slate-600 text-xs mb-4">Monitor your job search momentum and identify peak activity periods</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                <Tooltip {...darkTooltipStyle} />
                <Line type="monotone" dataKey="applications" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: "#6366f1", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Resume Performance Table */}
        {resumes.length > 0 && (
          <motion.div {...fadeUp(0.45)}>
            <div className="bg-white/4 border border-white/8 rounded-2xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-1 text-sm">Resume Performance Overview</h3>
              <p className="text-slate-600 text-xs mb-5">ATS score ratings for each resume — aim for 80%+ to maximize employer visibility</p>
              <div className="space-y-3">
                {resumes.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-4 bg-white/3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div>
                      <p className="font-medium text-white text-sm">{r.title}</p>
                      <p className="text-slate-500 text-xs capitalize mt-0.5">{r.template} template · Last updated {new Date(r.updated_date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white">{r.ats_score || 0}%</p>
                        <Progress value={r.ats_score || 0} className="w-24 h-1.5 mt-1" />
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        (r.ats_score || 0) >= 80 ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" :
                        (r.ats_score || 0) >= 60 ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" :
                        "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                      }`}>
                        {(r.ats_score || 0) >= 80 ? "✓ Excellent" : (r.ats_score || 0) >= 60 ? "Good" : "Needs Work"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tips Section */}
        <motion.div {...fadeUp(0.5)}>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { title: "Boost Your ATS Score", tip: "Use the ATS Scanner to compare your resume against job descriptions and identify missing keywords.", link: createPageUrl("ATSScanner"), linkText: "Open ATS Scanner →", color: "border-emerald-500/20 bg-emerald-500/5" },
              { title: "Generate a Cover Letter", tip: "Pair every application with a personalized AI cover letter to dramatically increase callback rates.", link: createPageUrl("CoverLetter"), linkText: "Open Cover Letter AI →", color: "border-violet-500/20 bg-violet-500/5" },
              { title: "Practice for Interviews", tip: "Use our free AI interview practice tool to prepare for the roles you're applying for.", link: createPageUrl("InterviewPrep"), linkText: "Start Practicing →", color: "border-cyan-500/20 bg-cyan-500/5" },
            ].map(({ title, tip, link, linkText, color }) => (
              <div key={title} className={`rounded-2xl border p-5 ${color}`}>
                <h4 className="text-white font-semibold text-sm mb-2">{title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed mb-3">{tip}</p>
                <Link to={link} className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">{linkText}</Link>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer attribution */}
        <motion.div {...fadeUp(0.55)}>
          <div className="text-center py-6 border-t border-white/5">
            <p className="text-slate-600 text-xs">
              Career Analytics · Powered by AI Resume Builder · A free initiative by{" "}
              <span className="text-blue-500 font-semibold">Kindness Community Foundation (KCF LLC)</span>
              {" "}· Built to empower job seekers worldwide with intelligent, real-time career insights.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}