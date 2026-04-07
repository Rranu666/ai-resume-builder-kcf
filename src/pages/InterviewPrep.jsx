import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Resume } from "@/entities/Resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, BrainCircuit, ChevronRight, ChevronLeft, RotateCcw,
  Trophy, FileText, Target, Mic, Clock, Star, Zap, BookOpen,
  TrendingUp, Users, Award, CheckCircle2, MessageSquare, Volume2
} from "lucide-react";
import QuestionCard from "@/components/interview/QuestionCard";
import VoiceInterview from "@/components/interview/VoiceInterview";

const STAGES = { SETUP: "setup", GENERATING: "generating", PRACTICE: "practice", VOICE: "voice", COMPLETE: "complete" };

const POPULAR_ROLES = [
  "Software Engineer", "Product Manager", "Data Scientist", "Marketing Manager",
  "UX Designer", "Business Analyst", "DevOps Engineer", "Project Manager",
  "Sales Executive", "Financial Analyst", "HR Manager", "Customer Success"
];

const INTERVIEW_TYPES = [
  { id: "general", label: "General / Behavioral", icon: Users, color: "from-blue-500 to-cyan-500", desc: "Core soft skills & situational questions" },
  { id: "technical", label: "Technical Deep Dive", icon: Zap, color: "from-violet-500 to-purple-500", desc: "Role-specific technical knowledge" },
  { id: "leadership", label: "Leadership & Culture", icon: Award, color: "from-amber-500 to-orange-500", desc: "Management, vision & team dynamics" },
  { id: "comprehensive", label: "Comprehensive (All Types)", icon: Star, color: "from-emerald-500 to-cyan-500", desc: "Full-spectrum mixed interview" },
];

const QUESTION_COUNTS = [5, 8, 10, 15];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function InterviewPrep() {
  const [stage, setStage] = useState(STAGES.SETUP);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [interviewType, setInterviewType] = useState("comprehensive");
  const [questionCount, setQuestionCount] = useState(8);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [practiceMode, setPracticeMode] = useState("text"); // "text" | "voice"

  useEffect(() => {
    Resume.list("-updated_date").then(setResumes).catch(() => {});
  }, []);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => setSessionTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const generateQuestions = async () => {
    if (!jobRole.trim()) return;
    setStage(STAGES.GENERATING);
    try {
    const resume = resumes.find(r => r.id === selectedResumeId);
    const resumeContext = resume
      ? `Candidate resume:\n- Name: ${resume.personal_info?.full_name || "N/A"}\n- Skills: ${(resume.skills || []).join(", ")}\n- Experience: ${(resume.experience || []).map(e => `${e.title} at ${e.company}`).join("; ")}`
      : "No resume provided.";

    const typeInstructions = {
      general: "Focus on behavioral (STAR method), situational, and culture fit questions.",
      technical: "Focus on technical skills, problem-solving, and role-specific knowledge.",
      leadership: "Focus on leadership style, team management, conflict resolution, and vision.",
      comprehensive: "Mix behavioral (STAR), technical, situational, motivation/culture fit, and resume-specific questions evenly."
    };

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a world-class interview coach. Generate exactly ${questionCount} realistic, high-quality interview questions for a ${jobRole} role.
${resumeContext}
Interview focus: ${typeInstructions[interviewType]}
For each question provide: the question text, type (behavioral/technical/situational/motivation/leadership/resume-specific), difficulty (easy/medium/hard), a practical tip on how to answer well, and an ideal_answer_outline (2-3 bullet points outlining what a great answer looks like).`,
      response_json_schema: {
        type: "object",
        properties: {
          questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                type: { type: "string" },
                difficulty: { type: "string" },
                tip: { type: "string" },
                ideal_answer_outline: { type: "array", items: { type: "string" } },
              },
            },
          },
        },
      },
    });

    const qs = (result?.questions || []).map(q => ({ ...q, answer: "", feedback: null }));
    setQuestions(qs);
    setCurrentIndex(0);
    setSessionTime(0);
    setTimerActive(practiceMode === "text");
    setStage(practiceMode === "voice" ? STAGES.VOICE : STAGES.PRACTICE);
    } catch (err) {
      console.error("Question generation error:", err);
      setStage(STAGES.SETUP);
    }
  };

  const handleAnswerSubmit = (index, answer, feedback) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, answer, feedback } : q));
  };

  const handleReset = () => {
    setStage(STAGES.SETUP);
    setQuestions([]);
    setCurrentIndex(0);
    setTimerActive(false);
    setSessionTime(0);
  };

  const answeredQuestions = questions.filter(q => q.feedback);
  const avgScore = answeredQuestions.length > 0
    ? Math.round(answeredQuestions.reduce((acc, q) => acc + (q.feedback?.score || 0), 0) / answeredQuestions.length * 10)
    : 0;

  const handleFinish = () => {
    setTimerActive(false);
    setStage(STAGES.COMPLETE);
  };

  return (
    <div className="min-h-screen bg-[#060b12] flex flex-col">

      {/* ── USP Header Banner ── */}
      <div className="relative overflow-hidden border-b border-violet-500/30" style={{ background: "linear-gradient(135deg, #1e0a3c 0%, #0f0520 40%, #0a0218 60%, #130530 100%)" }}>
        {/* Glowing orbs */}
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 right-10 w-40 h-40 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 py-7 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            {/* Left: Title */}
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/50">
                  <BrainCircuit className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center">
                  <span className="text-[8px] font-black text-black">✓</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-extrabold text-white leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Free Interview Practice
                  </h1>
                  <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-wider">Free</span>
                </div>
                <p className="text-violet-300/80 text-sm">AI-powered coaching · Instant expert feedback · No credit card, ever</p>
              </div>
            </div>

            {/* Right: USP pills */}
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
              {[
                { icon: Sparkles, text: "AI Questions", color: "border-violet-500/40 bg-violet-500/15 text-violet-300" },
                { icon: Star, text: "Expert Feedback", color: "border-amber-500/40 bg-amber-500/10 text-amber-300" },
                { icon: Zap, text: "100% Free", color: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300" },
                { icon: Users, text: "50K+ Practiced", color: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300" },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-semibold ${color}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Session Bar */}
      <div className="border-b border-white/5 bg-[#060b12]/80 backdrop-blur-xl sticky top-0 z-20 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-xs text-slate-500">Practice for any role · Get scored · Improve faster</p>
          {stage === STAGES.PRACTICE && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                <Clock className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-mono text-white">{formatTime(sessionTime)}</span>
              </div>
              <Button size="sm" onClick={handleFinish}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-xs">
                Finish & Review
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 lg:p-8">

        {/* ── SETUP ── */}
        <AnimatePresence mode="wait">
          {stage === STAGES.SETUP && (
            <motion.div key="setup" {...fadeUp(0)} className="space-y-8">
              {/* Hero */}
              <div className="text-center py-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" /> 100% Free · No Sign-up Required for Basic Practice
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Practice Makes{" "}
                  <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                    Perfect
                  </span>
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                  Get AI-generated interview questions tailored to your role, answer them, and receive instant expert feedback to sharpen your skills.
                </p>

                {/* Stats */}
                <div className="flex justify-center gap-8 mt-8">
                  {[
                    { icon: Users, value: "50K+", label: "Interviews practiced" },
                    { icon: Star, value: "4.9★", label: "Average rating" },
                    { icon: TrendingUp, value: "87%", label: "Improved confidence" },
                  ].map(({ icon: Icon, value, label }) => (
                    <div key={label} className="text-center">
                      <p className="text-2xl font-bold text-white">{value}</p>
                      <p className="text-xs text-slate-500 mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Setup Card */}
              <div className="bg-white/4 border border-white/8 rounded-2xl p-8 space-y-8">

                {/* Job Role */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Target Job Role <span className="text-violet-400">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Software Engineer, Product Manager, UX Designer..."
                    value={jobRole}
                    onChange={e => setJobRole(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && jobRole.trim() && generateQuestions()}
                    className="bg-white/5 border-white/10 text-white placeholder-slate-600 text-base h-12"
                  />
                  {/* Quick role suggestions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {POPULAR_ROLES.map(role => (
                      <button
                        key={role}
                        onClick={() => setJobRole(role)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                          jobRole === role
                            ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interview Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">Interview Focus</label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {INTERVIEW_TYPES.map(type => {
                      const Icon = type.icon;
                      const active = interviewType === type.id;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setInterviewType(type.id)}
                          className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                            active
                              ? "bg-violet-500/15 border-violet-500/40 shadow-lg shadow-violet-500/10"
                              : "bg-white/3 border-white/8 hover:bg-white/6 hover:border-white/15"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center shrink-0`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className={`font-medium text-sm ${active ? "text-violet-200" : "text-slate-300"}`}>{type.label}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{type.desc}</p>
                          </div>
                          {active && <CheckCircle2 className="w-4 h-4 text-violet-400 ml-auto shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Options Row */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Number of Questions</label>
                    <div className="flex gap-2">
                      {QUESTION_COUNTS.map(n => (
                        <button
                          key={n}
                          onClick={() => setQuestionCount(n)}
                          className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                            questionCount === n
                              ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Resume (Optional — improves personalization)
                    </label>
                    <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white h-10">
                        <SelectValue placeholder="Select a resume..." />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0d1a26] border-white/10">
                        {resumes.map(r => (
                          <SelectItem key={r.id} value={r.id} className="text-white hover:bg-white/10">
                            <div className="flex items-center gap-2">
                              <FileText className="w-3.5 h-3.5 text-emerald-400" />
                              {r.title}
                              {r.ats_score > 0 && <span className="text-xs text-emerald-500">({r.ats_score}% ATS)</span>}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedResumeId && (
                      <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                        <Target className="w-3 h-3" /> Questions tailored to your resume
                      </p>
                    )}
                  </div>
                </div>

                {/* Practice Mode Selector */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">Practice Mode</label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { id: "text", icon: MessageSquare, label: "Text-Based Practice", desc: "Type answers, get detailed written feedback", grad: "from-blue-500 to-cyan-500" },
                      { id: "voice", icon: Mic, label: "Voice Mock Interview", desc: "Speak your answers — AI interviews you live with body language coaching", grad: "from-violet-500 to-purple-600", badge: "NEW" },
                    ].map(mode => (
                      <button key={mode.id} onClick={() => setPracticeMode(mode.id)}
                        className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                          practiceMode === mode.id
                            ? "bg-violet-500/15 border-violet-500/40 shadow-lg shadow-violet-500/10"
                            : "bg-white/3 border-white/8 hover:bg-white/6 hover:border-white/15"
                        }`}>
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${mode.grad} flex items-center justify-center shrink-0`}>
                          <mode.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`font-medium text-sm ${practiceMode === mode.id ? "text-violet-200" : "text-slate-300"}`}>{mode.label}</p>
                            {mode.badge && <span className="text-[10px] bg-gradient-to-r from-violet-500 to-purple-500 text-white font-black px-1.5 py-0.5 rounded-full">{mode.badge}</span>}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{mode.desc}</p>
                        </div>
                        {practiceMode === mode.id && <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* How it works */}
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { step: "1", icon: BrainCircuit, color: "text-violet-400", bg: "bg-violet-500/10", title: "AI Generates Questions", desc: "Personalized for your role & experience level" },
                    { step: "2", icon: Mic, color: "text-cyan-400", bg: "bg-cyan-500/10", title: "Practice Your Answers", desc: "Type responses at your own pace" },
                    { step: "3", icon: Star, color: "text-amber-400", bg: "bg-amber-500/10", title: "Get Expert Feedback", desc: "Instant scoring, strengths & improvements" },
                  ].map(({ step, icon: Icon, color, bg, title, desc }) => (
                    <div key={step} className="text-center p-4 rounded-xl bg-white/3 border border-white/6">
                      <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                      </div>
                      <p className="text-sm font-semibold text-white mb-1">{title}</p>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={generateQuestions}
                  disabled={!jobRole.trim()}
                  size="lg"
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-bold shadow-lg shadow-violet-500/20 h-13 text-base"
                >
                  {practiceMode === "voice" ? <Mic className="w-5 h-5 mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                  {practiceMode === "voice" ? "Start Voice Mock Interview" : "Start Free Interview Practice"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── GENERATING ── */}
          {stage === STAGES.GENERATING && (
            <motion.div key="generating" {...fadeUp(0)} className="text-center py-32">
              <div className="relative inline-flex mb-8">
                <div className="w-24 h-24 bg-violet-500/15 border border-violet-500/30 rounded-full flex items-center justify-center">
                  <BrainCircuit className="w-12 h-12 text-violet-400 animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-violet-400/30 animate-ping" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Crafting Your Interview...</h3>
              <p className="text-slate-400 mb-2">
                AI is generating <span className="text-violet-400 font-semibold">{questionCount} personalized questions</span>
              </p>
              <p className="text-slate-500 text-sm">for <span className="text-white font-medium">{jobRole}</span> · {INTERVIEW_TYPES.find(t => t.id === interviewType)?.label}</p>
              <div className="flex justify-center gap-1.5 mt-8">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── PRACTICE ── */}
          {stage === STAGES.PRACTICE && questions.length > 0 && (
            <motion.div key="practice" {...fadeUp(0)} className="space-y-6">
              {/* Progress Header */}
              <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-400 text-xs font-semibold">{jobRole}</span>
                    <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs">{INTERVIEW_TYPES.find(t => t.id === interviewType)?.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400">
                      <span className="text-white font-bold">{answeredQuestions.length}</span>/{questions.length} answered
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-500 hover:text-white gap-1.5 text-xs">
                      <RotateCcw className="w-3.5 h-3.5" /> Restart
                    </Button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/5 rounded-full h-2 mb-4">
                  <motion.div
                    className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full"
                    animate={{ width: `${(answeredQuestions.length / questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {/* Question pills */}
                <div className="flex gap-2 flex-wrap">
                  {questions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-9 h-9 rounded-full text-sm font-semibold transition-all duration-200 ${
                        i === currentIndex
                          ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30 scale-110"
                          : q.feedback
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-white/5 border border-white/10 text-slate-500 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Card */}
              <AnimatePresence mode="wait">
                <QuestionCard
                  key={currentIndex}
                  question={questions[currentIndex]}
                  index={currentIndex}
                  total={questions.length}
                  onAnswerSubmit={(answer, feedback) => handleAnswerSubmit(currentIndex, answer, feedback)}
                  jobRole={jobRole}
                />
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentIndex(i => i - 1)}
                  disabled={currentIndex === 0}
                  className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5 gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                {currentIndex < questions.length - 1 ? (
                  <Button
                    onClick={() => setCurrentIndex(i => i + 1)}
                    className="bg-violet-600 hover:bg-violet-500 text-white gap-2"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleFinish}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold gap-2"
                  >
                    <Trophy className="w-4 h-4" /> Finish & See Results
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* ── VOICE INTERVIEW ── */}
          {stage === STAGES.VOICE && questions.length > 0 && (
            <motion.div key="voice" {...fadeUp(0)}>
              <VoiceInterview
                questions={questions}
                jobRole={jobRole}
                onComplete={(results) => {
                  setTimerActive(false);
                  setStage(STAGES.COMPLETE);
                }}
                onExit={() => {
                  setStage(STAGES.SETUP);
                  setQuestions([]);
                  setCurrentIndex(0);
                  setTimerActive(false);
                  setSessionTime(0);
                }}
              />
            </motion.div>
          )}

          {/* ── COMPLETE ── */}
          {stage === STAGES.COMPLETE && (
            <motion.div key="complete" {...fadeUp(0)} className="space-y-8 py-6">
              {/* Trophy Banner */}
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-yellow-400" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-3">Interview Complete! 🎉</h2>
                <p className="text-slate-400 text-lg">Here's how you performed on your {jobRole} mock interview</p>
              </div>

              {/* Score Cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    label: "Average Score",
                    value: answeredQuestions.length > 0 ? `${avgScore}%` : "—",
                    sub: "out of 100",
                    color: avgScore >= 80 ? "text-emerald-400" : avgScore >= 60 ? "text-yellow-400" : "text-red-400",
                    bg: "from-emerald-500/10 to-cyan-500/10 border-emerald-500/20"
                  },
                  {
                    label: "Questions Answered",
                    value: `${answeredQuestions.length}/${questions.length}`,
                    sub: "completed",
                    color: "text-violet-400",
                    bg: "from-violet-500/10 to-purple-500/10 border-violet-500/20"
                  },
                  {
                    label: "Time Spent",
                    value: formatTime(sessionTime),
                    sub: "min:sec",
                    color: "text-cyan-400",
                    bg: "from-cyan-500/10 to-blue-500/10 border-cyan-500/20"
                  },
                ].map(({ label, value, sub, color, bg }) => (
                  <div key={label} className={`bg-gradient-to-br ${bg} border rounded-2xl p-6 text-center`}>
                    <p className="text-sm text-slate-400 mb-2">{label}</p>
                    <p className={`text-4xl font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-slate-500 mt-1">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Per-question Summary */}
              {answeredQuestions.length > 0 && (
                <div className="bg-white/4 border border-white/8 rounded-2xl p-6 space-y-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-violet-400" /> Question Breakdown
                  </h3>
                  <div className="space-y-3">
                    {questions.map((q, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <button
                          onClick={() => { setCurrentIndex(i); setStage(STAGES.PRACTICE); setTimerActive(true); }}
                          className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm font-medium shrink-0 hover:bg-white/10 transition-colors"
                        >
                          {i + 1}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-300 text-sm truncate">{q.question}</p>
                          <p className="text-slate-600 text-xs mt-0.5">{q.type} · {q.difficulty}</p>
                        </div>
                        {q.feedback ? (
                          <div className="shrink-0">
                            <span className={`text-sm font-bold ${
                              q.feedback.score >= 8 ? "text-emerald-400" : q.feedback.score >= 5 ? "text-yellow-400" : "text-red-400"
                            }`}>
                              {q.feedback.score}/10
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-600 shrink-0">Skipped</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleReset}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-bold"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Practice Again
                </Button>
                <Button
                  onClick={() => { setStage(STAGES.PRACTICE); setTimerActive(true); }}
                  variant="outline"
                  size="lg"
                  className="flex-1 border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Review Answers
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── USP Footer Strip ── */}
      <div className="mt-auto relative overflow-hidden border-t border-violet-500/25" style={{ background: "linear-gradient(135deg, #0f0520 0%, #0a0218 50%, #130530 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/4 w-64 h-32 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-24 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
          {/* Headline */}
          <div className="text-center mb-6">
            <p className="text-xs font-semibold text-violet-400/70 uppercase tracking-widest mb-1">Why practice with us?</p>
            <h3 className="text-lg font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              The #1 Free Interview Tool — Built for Real Results
            </h3>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: BrainCircuit, value: "100% Free", label: "No hidden fees, forever", color: "text-violet-400", bg: "bg-violet-500/15", border: "border-violet-500/25" },
              { icon: Zap, value: "Instant AI", label: "Real-time expert scoring", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
              { icon: Users, value: "50K+", label: "Interviews practiced", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
              { icon: TrendingUp, value: "87%", label: "Users improved confidence", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
            ].map(({ icon: Icon, value, label, color, bg, border }) => (
              <div key={value} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${bg} ${border}`}>
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className={`text-xl font-extrabold ${color}`}>{value}</p>
                <p className="text-xs text-slate-500 text-center leading-tight">{label}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-600 mt-5">
            Free Interview Practice · Powered by AI Resume Builder · An initiative by KCF LLC
          </p>
        </div>
      </div>
    </div>
  );
}