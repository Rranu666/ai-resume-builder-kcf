import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Resume } from "@/entities/Resume";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, TrendingUp, TrendingDown, Zap, ArrowRight, Star, AlertTriangle } from "lucide-react";

export default function CareerTimeMachine() {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [targetSalary, setTargetSalary] = useState("");
  const [loading, setLoading] = useState(false);
  const [simulation, setSimulation] = useState(null);

  useEffect(() => {
    Resume.list("-updated_date").then(data => { setResumes(data); if (data.length > 0) setSelectedResume(data[0]); }).catch(console.error);
  }, []);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("careerTimeMachine", {
        resumeId: selectedResume?.id,
        targetRole,
        targetSalary
      });
      setSimulation(res.data.simulation);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const TimelineCard = ({ year, data, isPathA }) => (
    <div className={`p-4 rounded-xl border ${isPathA ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isPathA ? "bg-emerald-500 text-black" : "bg-red-800 text-white"}`}>{year}y</div>
        <span className={`font-semibold text-sm ${isPathA ? "text-emerald-300" : "text-red-300"}`}>{data?.title}</span>
      </div>
      <p className={`text-xl font-bold ${isPathA ? "text-white" : "text-slate-400"}`}>{data?.salary}</p>
      <p className="text-slate-400 text-xs mt-1">{data?.milestone}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060b12] flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-4">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-medium">AI Future Simulation</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Career Time Machine ⏰</h1>
            <p className="text-slate-400 max-w-2xl mx-auto mb-2">See where your career could go in 1, 3, and 5 years — with and without taking action.</p>
            <p className="text-slate-500 text-sm">Visualize two possible futures: one where you invest in yourself versus one where you stay on your current path. The salary and title differences might surprise you.</p>
          </motion.div>

        {!simulation ? (
          <div className="bg-white/4 border border-white/8 rounded-2xl p-8 space-y-6">
            {resumes.length > 0 && (
              <div>
                <label className="text-slate-300 text-sm font-medium mb-2 block">Base Resume</label>
                <select
                  value={selectedResume?.id || ""}
                  onChange={e => setSelectedResume(resumes.find(r => r.id === e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500/50"
                >
                  {resumes.map(r => <option key={r.id} value={r.id} style={{ background: "#0d1420" }}>{r.title}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">Target Role / Dream Job</label>
              <Input
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Product Manager at a FAANG company"
                className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">Target Salary (optional)</label>
              <Input
                value={targetSalary}
                onChange={e => setTargetSalary(e.target.value)}
                placeholder="e.g. $150,000/year"
                className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-cyan-500/50"
              />
            </div>
            <Button
              onClick={runSimulation}
              disabled={!targetRole.trim() || loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold h-12 text-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Simulating your future...</span>
              ) : (
                <span className="flex items-center gap-2"><Clock className="w-5 h-5" /> Simulate My Career Future</span>
              )}
            </Button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Motivational message */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6 text-center">
              <p className="text-xl text-white font-medium">{simulation.motivational_message}</p>
              {simulation.salary_gap_5yr && (
                <p className="text-cyan-300 font-bold text-2xl mt-2">{simulation.salary_gap_5yr} salary difference in 5 years</p>
              )}
            </div>

            {/* Path Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Path A */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-emerald-300 font-bold text-lg">{simulation.path_a?.title || "Path A: Take Action"}</h3>
                </div>
                <div className="space-y-3">
                  {[1, 3, 5].map(y => <TimelineCard key={y} year={y} data={simulation.path_a?.[`year_${y}`]} isPathA={true} />)}
                </div>
              </div>

              {/* Path B */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                  <h3 className="text-red-300 font-bold text-lg">{simulation.path_b?.title || "Path B: Status Quo"}</h3>
                </div>
                <div className="space-y-3">
                  {[1, 3, 5].map(y => <TimelineCard key={y} year={y} data={simulation.path_b?.[`year_${y}`]} isPathA={false} />)}
                </div>
              </div>
            </div>

            {/* Key Decisions */}
            {simulation.key_decisions?.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
                <h3 className="text-amber-300 font-bold mb-3 flex items-center gap-2"><Zap className="w-4 h-4" /> Key Decision Points</h3>
                {simulation.key_decisions.map((d, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <ArrowRight className="w-4 h-4 text-amber-400 flex-shrink-0 mt-1" />
                    <p className="text-slate-300 text-sm">{d}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setSimulation(null)} className="border-white/10 text-slate-300">Run Again</Button>
              <Button onClick={() => { const t = `I used the Career Time Machine and could earn ${simulation.salary_gap_5yr} more in 5 years by taking action! 🚀 Check your career trajectory at KCF Resume Builder`; window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}`, '_blank'); }} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold">
                <Star className="w-4 h-4 mr-2" /> Share My Future
              </Button>
            </div>
          </motion.div>
        )}
        </div>
      </div>

      {/* SEO Content Footer */}
      <div className="bg-white/3 border-t border-white/5 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Visualize Your Career Trajectory and Make Informed Decisions</h2>
          <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
            <p>Career decisions compound over time. Small actions today can result in dramatically different outcomes in 5 years—but it's hard to visualize that impact. The Career Time Machine changes that.</p>
            <p>Our AI simulates two parallel career paths: one where you take strategic action (upskilling, applying to better roles, negotiating salary) and one where you maintain the status quo. You'll see concrete projections for salary growth, title progression, and key career milestones.</p>
            <p>Sometimes seeing your future is the motivation you need to take action today.</p>
          </div>
          <p className="text-slate-500 text-xs text-center mt-6">Powered by AI Resume Builder · A free initiative by Kindness Community Foundation (KCF LLC) · Built to empower users with intelligent, real-time assistance and meaningful interaction.</p>
        </div>
      </div>
    </div>
  );
}