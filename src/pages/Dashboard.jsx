import React, { useState, useEffect } from "react";
import { Resume } from "@/entities/Resume";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FileText, Eye, Download, Sparkles, Target, Linkedin, Trash2, Brain } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { format } from "date-fns";
import LinkedInImportModal from "@/components/linkedin/LinkedInImportModal";
import AuthPromptModal from "@/components/common/AuthPromptModal";
import StreakWidget from "@/components/gamification/StreakWidget";
import ApplyReadyScore from "@/components/gamification/ApplyReadyScore";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const templateColors = {
  modern: "from-emerald-500 to-cyan-500",
  creative: "from-amber-400 to-orange-500",
  executive: "from-blue-500 to-indigo-500",
  minimal: "from-slate-400 to-slate-600",
  tech: "from-violet-500 to-purple-600",
  startup: "from-rose-500 to-pink-500",
  healthcare: "from-cyan-400 to-teal-500",
  academic: "from-indigo-500 to-violet-600",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLinkedIn, setShowLinkedIn] = useState(false);
  const [authPrompt, setAuthPrompt] = useState({ open: false, reason: "" });
  const [deletingId, setDeletingId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const requireAuth = async (reason, action) => {
    const authed = await base44.auth.isAuthenticated();
    if (authed) action();
    else setAuthPrompt({ open: true, reason });
  };

  useEffect(() => {
    loadResumes();
    base44.auth.isAuthenticated().then(a => { if (a) base44.auth.me().then(setCurrentUser).catch(console.error); }).catch(console.error);
  }, []);

  const loadResumes = async () => {
    setIsLoading(true);
    try {
      const data = await Resume.list("-updated_date");
      setResumes(data);
    } catch (e) { console.error(e); }
    setIsLoading(false);
  };

  const createFromLinkedIn = async (parsed) => {
    try {
      const newResume = await Resume.create({
        title: parsed.personal_info?.full_name ? `${parsed.personal_info.full_name}'s Resume` : `Resume ${resumes.length + 1}`,
        template: "modern",
        personal_info: parsed.personal_info || {},
        experience: parsed.experience || [],
        education: parsed.education || [],
        skills: parsed.skills || [],
        projects: parsed.projects || [],
        ats_score: 0,
      });
      navigate(createPageUrl(`Editor?id=${newResume.id}`));
    } catch (e) { console.error(e); }
  };

  const createNewResume = async () => {
    try {
      const newResume = await Resume.create({
        title: `Resume ${resumes.length + 1}`,
        template: "modern",
        personal_info: { full_name: "", email: "", phone: "", location: "", summary: "" },
        experience: [], education: [], skills: [], projects: [], ats_score: 0,
      });
      navigate(createPageUrl(`Editor?id=${newResume.id}`));
    } catch (e) { console.error(e); }
  };

  const deleteResume = async (id) => {
    setDeletingId(id);
    try {
      await Resume.delete(id);
      setResumes(prev => prev.filter(r => r.id !== id));
    } catch (e) { console.error(e); }
    setDeletingId(null);
  };

  const avgATS = resumes.length > 0
    ? Math.round(resumes.reduce((s, r) => s + (r.ats_score || 0), 0) / resumes.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#060b12] p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Your Resumes</h1>
            <p className="text-slate-400">Create and manage your AI-powered resumes</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => requireAuth("import your LinkedIn profile", () => setShowLinkedIn(true))}
              variant="outline"
              className="border-blue-500/40 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              Import LinkedIn
            </Button>
            <Button
              onClick={() => requireAuth("create a new resume", createNewResume)}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Resume
            </Button>
          </div>
        </motion.div>

        {/* Gamification widgets */}
        {currentUser && (
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <ApplyReadyScore resumes={resumes} />
            <StreakWidget userEmail={currentUser.email} />
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {[
            { label: "Total Resumes", value: resumes.length, IconComp: FileText, gradient: "from-emerald-500/20 to-cyan-500/20", border: "border-emerald-500/20", text: "text-emerald-400" },
            { label: "Avg ATS Score", value: `${avgATS}%`, IconComp: Target, gradient: "from-blue-500/20 to-indigo-500/20", border: "border-blue-500/20", text: "text-blue-400" },
            { label: "AI Sections", value: resumes.reduce((s, r) => s + (r.experience?.length || 0), 0), IconComp: Sparkles, gradient: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/20", text: "text-violet-400" },
          ].map(({ label, value, IconComp, gradient, border, text }, i) => (
            <motion.div key={i} {...fadeUp(0.1 + i * 0.08)}>
              <div className={`bg-gradient-to-br ${gradient} border ${border} rounded-2xl p-6 backdrop-blur-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${text} text-sm font-medium mb-1`}>{label}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center border ${border}`}>
                    <IconComp className={`w-6 h-6 ${text}`} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Resume Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white/5 rounded-2xl h-64 border border-white/5" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <motion.div {...fadeUp(0.2)} className="text-center py-24">
            <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
              <FileText className="w-12 h-12 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">No resumes yet</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Get started by creating your first AI-powered, ATS-optimized resume. Takes just minutes!
            </p>
            <Button
              onClick={createNewResume}
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold px-8 shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Resume
            </Button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume, index) => {
              const grad = templateColors[resume.template] || "from-emerald-500 to-cyan-500";
              return (
                <motion.div key={resume.id} {...fadeUp(0.1 + index * 0.05)}>
                  <div className="group bg-white/4 border border-white/8 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                    {/* Preview strip */}
                    <div className={`h-32 bg-gradient-to-br ${grad} relative flex items-center justify-center`}>
                      <FileText className="w-12 h-12 text-black/30" />
                      {resume.ats_score > 0 && (
                        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {resume.ats_score}%
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-semibold text-white text-lg mb-1 truncate">{resume.title}</h3>
                      <p className="text-slate-500 text-sm mb-1 capitalize">{resume.template} template</p>
                      <p className="text-slate-600 text-xs mb-4">
                        Updated {format(new Date(resume.updated_date), "MMM d, yyyy")}
                      </p>

                      <div className="flex gap-2">
                        <Link to={createPageUrl(`Editor?id=${resume.id}`)} className="flex-1">
                          <Button size="sm" className={`w-full bg-gradient-to-r ${grad} text-black font-semibold hover:opacity-90`}>
                            <Eye className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Link to={`/ats-analysis/${resume.id}`} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:border-violet-500/50">
                            <Brain className="w-4 h-4 mr-1" />
                            ATS Analysis
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                          disabled={deletingId === resume.id}
                          onClick={() => deleteResume(resume.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <LinkedInImportModal isOpen={showLinkedIn} onClose={() => setShowLinkedIn(false)} onSuccess={createFromLinkedIn} />
      <AuthPromptModal open={authPrompt.open} onClose={() => setAuthPrompt({ open: false, reason: "" })} reason={authPrompt.reason} />
    </div>
  );
}