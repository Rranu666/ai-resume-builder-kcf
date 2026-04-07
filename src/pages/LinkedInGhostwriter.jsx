import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Resume } from "@/entities/Resume";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Calendar, Copy, CheckCheck, Sparkles, User } from "lucide-react";

export default function LinkedInGhostwriter() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetCompanies, setTargetCompanies] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [activeWeek, setActiveWeek] = useState(1);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    Resume.list("-updated_date").then(data => { setResumes(data); if (data[0]) setSelectedResumeId(data[0].id); }).catch(console.error);
  }, []);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("linkedinContentPlan", {
        resumeId: selectedResumeId || null,
        targetRole,
        targetCompanies
      });
      setPlan(res.data.plan);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const copyPost = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const typeColors = { insight: "bg-blue-500/10 text-blue-300 border-blue-500/20", story: "bg-violet-500/10 text-violet-300 border-violet-500/20", tip: "bg-amber-500/10 text-amber-300 border-amber-500/20", engagement: "bg-pink-500/10 text-pink-300 border-pink-500/20" };

  const weeks = [1, 2, 3, 4];
  const weekPosts = plan?.posts?.filter(p => {
    if (activeWeek === 1) return p.day <= 7;
    if (activeWeek === 2) return p.day > 7 && p.day <= 14;
    if (activeWeek === 3) return p.day > 14 && p.day <= 21;
    return p.day > 21;
  });

  return (
    <div className="min-h-screen bg-[#060b12] flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
              <Linkedin className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">AI LinkedIn Ghostwriter</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">LinkedIn Content Plan 📝</h1>
            <p className="text-slate-400 max-w-2xl mx-auto mb-2">AI generates your personalized 30-day LinkedIn content calendar — tailored to your role, industry, and target companies.</p>
            <p className="text-slate-500 text-sm">Never post generic content again. Get daily hooks, insights, stories, and CTAs ready to copy-paste. Build visibility in your industry.</p>
          </motion.div>

        {!plan ? (
          <div className="bg-white/4 border border-white/8 rounded-2xl p-8 space-y-5">
            {resumes.length > 0 && (
              <div>
                <label className="text-slate-300 text-sm font-medium mb-2 block">Base Resume (for context)</label>
                <select value={selectedResumeId} onChange={e => setSelectedResumeId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50">
                  <option value="" style={{ background: "#0d1420" }}>No resume (use target role only)</option>
                  {resumes.map(r => <option key={r.id} value={r.id} style={{ background: "#0d1420" }}>{r.title}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">Target Role / Industry</label>
              <Input value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="e.g. Product Manager in FinTech" className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">Target Companies (optional)</label>
              <Input value={targetCompanies} onChange={e => setTargetCompanies(e.target.value)} placeholder="e.g. Google, Stripe, Airbnb" className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50" />
            </div>
            <Button onClick={generatePlan} disabled={!targetRole.trim() || loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-12">
              {loading ? (
                <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating your 30-day plan...</span>
              ) : (
                <span className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> Generate 30-Day Content Plan</span>
              )}
            </Button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Profile tips */}
            {plan.profile_tips?.length > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 mb-6">
                <h3 className="text-blue-300 font-bold mb-3 flex items-center gap-2"><User className="w-4 h-4" /> Profile Optimization Tips</h3>
                {plan.profile_tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <span className="text-blue-400 font-bold text-sm mt-0.5">{i + 1}.</span>
                    <p className="text-slate-300 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Headline suggestions */}
            {plan.headline_suggestions?.length > 0 && (
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-5 mb-6">
                <h3 className="text-violet-300 font-bold mb-3">💡 LinkedIn Headline Options</h3>
                {plan.headline_suggestions.map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg group">
                    <p className="text-slate-300 text-sm">{h}</p>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 text-slate-400" onClick={() => copyPost(h)}>
                      {copied === h ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Week tabs */}
            <div className="flex gap-2 mb-4">
              {weeks.map(w => (
                <button key={w} onClick={() => setActiveWeek(w)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeWeek === w ? "bg-blue-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>
                  Week {w}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {weekPosts?.map((post, i) => (
                <div key={i} className="bg-white/4 border border-white/8 rounded-xl p-5 hover:border-blue-500/20 transition-colors group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-blue-600/30 rounded-full flex items-center justify-center text-xs font-bold text-blue-300">D{post.day}</div>
                      <Badge className={typeColors[post.type?.toLowerCase()] || "bg-slate-500/10 text-slate-300 border-slate-500/20"}>{post.type}</Badge>
                      <span className="text-slate-500 text-xs">{post.best_time}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 text-slate-400" onClick={() => copyPost(`${post.hook}\n\n${post.message}\n\n${post.cta}`)}>
                      {copied === `${post.hook}\n\n${post.message}\n\n${post.cta}` ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-white font-medium mb-1">{post.hook}</p>
                  <p className="text-slate-400 text-sm mb-2">{post.message}</p>
                  <p className="text-blue-400 text-xs">{post.cta}</p>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={() => setPlan(null)} className="mt-6 border-white/10 text-slate-300">Generate New Plan</Button>
          </motion.div>
          )}
        </div>

        {/* SEO Content Footer */}
        <div className="bg-white/3 border-t border-white/5 py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Build Your Personal Brand with AI-Powered Content</h2>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>LinkedIn visibility matters more than ever. Your network, recruiter pipeline, and brand all grow through consistent, authentic, valuable posts. But creating 30 days of content is exhausting — and generic posts get ignored.</p>
              <p>The LinkedIn Ghostwriter analyzes your background, target role, and industry landscape to generate a complete 30-day content calendar. Every post includes a hook (to stop the scroll), a message (insight, story, or lesson), and a CTA (call-to-action). Mix types: insights, storytelling, industry commentary, and engagement bait.</p>
              <p>Copy-paste ready. Post daily. Watch your profile visibility and network grow. Perfect for job seekers, career changers, and professionals building thought leadership.</p>
            </div>
            <p className="text-slate-500 text-xs text-center mt-6">Powered by AI Resume Builder · A free initiative by Kindness Community Foundation (KCF LLC) · Built to empower users with intelligent, real-time assistance and meaningful interaction.</p>
          </div>
        </div>
      </div>
    </div>
  );
}