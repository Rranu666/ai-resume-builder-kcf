import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Resume } from "@/entities/Resume";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Skull, AlertTriangle, Target, Zap, ChevronDown, ChevronUp, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function RedTeamResume() {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    Resume.list("-updated_date").then(setResumes).catch(console.error);
  }, []);

  const runRedTeam = async () => {
    if (!selectedResume) return;
    setLoading(true);
    setReport(null);
    try {
      const res = await base44.functions.invoke("redTeamResume", { resumeId: selectedResume.id });
      setReport(res.data.report);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const scoreColor = (s) => s >= 70 ? "text-emerald-400" : s >= 45 ? "text-amber-400" : "text-red-400";
  const scoreBg = (s) => s >= 70 ? "from-emerald-500/20 to-cyan-500/20 border-emerald-500/20" : s >= 45 ? "from-amber-500/20 to-orange-500/20 border-amber-500/20" : "from-red-500/20 to-rose-500/20 border-red-500/20";

  const Section = ({ id, title, icon: Icon, color, items, renderItem }) => (
    <div className={`border ${color} rounded-xl overflow-hidden mb-4`}>
      <button
        className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors"
        onClick={() => setExpandedSection(expandedSection === id ? null : id)}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${color.replace('border-', 'text-').replace('/30', '/80')}`} />
          <span className="text-white font-medium">{title}</span>
          <Badge className={`${color.replace('border-', 'bg-').replace('/30', '/10')} ${color.replace('border-', 'text-').replace('/30', '/80')} border-0`}>{items?.length || 0}</Badge>
        </div>
        {expandedSection === id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      <AnimatePresence>
        {expandedSection === id && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 space-y-2">
              {items?.map((item, i) => renderItem(item, i))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060b12] flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-4">
              <Skull className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-sm font-medium">Adversarial Resume Analysis</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">AI Red Team Attack 💀</h1>
            <p className="text-slate-400 max-w-2xl mx-auto mb-2">Our AI acts as a hostile ATS + skeptical recruiter trying to REJECT your resume. Find every weakness before they do.</p>
            <p className="text-slate-500 text-sm">Identify keyword gaps, weak phrasing, ATS vulnerabilities, and missing critical qualifications that could trigger automated rejections.</p>
          </motion.div>

        {!report ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/4 border border-white/8 rounded-2xl p-8">
            <h3 className="text-white font-semibold text-lg mb-4">Choose your resume to attack:</h3>
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {resumes.map(r => (
                <div
                  key={r.id}
                  onClick={() => setSelectedResume(r)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedResume?.id === r.id
                      ? "border-red-500/50 bg-red-500/10"
                      : "border-white/8 hover:border-white/20 bg-white/3"
                  }`}
                >
                  <p className="text-white font-medium truncate">{r.title}</p>
                  <p className="text-slate-500 text-sm capitalize">{r.template} · ATS {r.ats_score || 0}%</p>
                </div>
              ))}
              {resumes.length === 0 && (
                <div className="col-span-2 text-center py-8 text-slate-400">
                  <p>No resumes found. <Link to={createPageUrl("Dashboard")} className="text-emerald-400 hover:underline">Create one first →</Link></p>
                </div>
              )}
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-300 font-medium">Warning: This will be brutal</p>
                  <p className="text-slate-400 text-sm mt-1">Our AI is trained to find every possible rejection reason. The feedback is harsh but it's what real ATS systems and recruiters think. Use it to improve.</p>
                </div>
              </div>
            </div>

            <Button
              onClick={runRedTeam}
              disabled={!selectedResume || loading}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold h-12 text-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Running Red Team Attack...</span>
              ) : (
                <span className="flex items-center gap-2"><Skull className="w-5 h-5" /> Launch AI Attack</span>
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Survivability Score */}
            <div className={`bg-gradient-to-br ${scoreBg(report.survivability_score)} border rounded-2xl p-8 text-center mb-6`}>
              <p className="text-slate-400 text-sm mb-1">Survivability Score</p>
              <div className={`text-8xl font-black ${scoreColor(report.survivability_score)} mb-2`}>{report.survivability_score}</div>
              <p className="text-slate-400">out of 100</p>
              <p className="text-white mt-3 font-medium">{report.summary}</p>
            </div>

            {/* Critical Fixes */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 mb-4">
              <h3 className="text-emerald-300 font-bold mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Top 3 Critical Fixes (Do These First)</h3>
              {report.critical_fixes?.map((fix, i) => (
                <div key={i} className="flex items-start gap-3 mb-2">
                  <span className="w-6 h-6 bg-emerald-500 text-black text-xs font-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-white">{fix}</p>
                </div>
              ))}
            </div>

            <Section id="ats" title="ATS Auto-Rejection Reasons" icon={Target} color="border-red-500/30"
              items={report.ats_rejections}
              renderItem={(item, i) => <div key={i} className="flex items-start gap-2 p-2"><AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /><p className="text-slate-300 text-sm">{item}</p></div>}
            />
            <Section id="recruiter" title="Recruiter Rejection Reasons" icon={Skull} color="border-orange-500/30"
              items={report.recruiter_rejections}
              renderItem={(item, i) => <div key={i} className="flex items-start gap-2 p-2"><AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" /><p className="text-slate-300 text-sm">{item}</p></div>}
            />
            <Section id="phrases" title="Weak Phrases → Better Alternatives" icon={Zap} color="border-amber-500/30"
              items={report.weak_phrases}
              renderItem={(item, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <span className="text-red-400 text-sm line-through">{item.original}</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span className="text-emerald-400 text-sm">{item.better}</span>
                </div>
              )}
            />
            <Section id="keywords" title="Missing Critical Keywords" icon={Shield} color="border-violet-500/30"
              items={report.missing_keywords}
              renderItem={(item, i) => <Badge key={i} className="mr-2 mb-2 bg-violet-500/10 text-violet-300 border-violet-500/20">{item}</Badge>}
            />

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => { setReport(null); setSelectedResume(null); }} className="border-white/10 text-slate-300">
                ← Attack Another Resume
              </Button>
              <Link to={createPageUrl(`Editor?id=${selectedResume?.id}`)} className="flex-1">
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold">
                  Fix My Resume Now →
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
        </div>
      </div>

      {/* SEO Content Footer */}
      <div className="bg-white/3 border-t border-white/5 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Strengthen Your Resume Against AI and Human Rejection</h2>
          <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
            <p>The AI Red Team Attack is a revolutionary adversarial analysis tool that simulates how ATS systems and skeptical recruiters view your resume. Instead of sugar-coating feedback, our AI plays devil's advocate, finding every possible reason to reject your application.</p>
            <p>Get honest feedback on missing keywords, weak language patterns, ATS vulnerabilities, formatting issues, and gaps in qualifications. Armed with this candid analysis, you can strategically improve your resume to survive both algorithmic screening and human review.</p>
            <p>This isn't feedback designed to make you feel good—it's feedback designed to make your resume undeniable.</p>
          </div>
          <p className="text-slate-500 text-xs text-center mt-6">Powered by AI Resume Builder · A free initiative by Kindness Community Foundation (KCF LLC) · Built to empower users with intelligent, real-time assistance and meaningful interaction.</p>
        </div>
      </div>
    </div>
  );
}