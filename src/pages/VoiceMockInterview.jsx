import { useState, useRef, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Square, Volume2, VolumeX, X, Brain, Trophy,
  ChevronRight, SkipForward, Loader2, MessageSquare, Download,
  Eye, Zap, Star, Clock, ThumbsUp, TrendingUp, AlertCircle,
  CheckCircle2, Camera, RotateCcw, Play, FileText, Sparkles,
  List, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Resume } from "@/entities/Resume";

// ── Waveform Bars ─────────────────────────────────────────────────────────────
function WaveformBars({ active, color = "#34d399" }) {
  return (
    <div className="flex items-center justify-center gap-0.5 h-8">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full w-1"
          style={{ backgroundColor: color }}
          animate={active ? {
            height: [`${6 + Math.sin(i) * 4}px`, `${22 + Math.sin(i * 1.5) * 10}px`, `${6 + Math.sin(i) * 4}px`],
            opacity: [0.5, 1, 0.5],
          } : { height: "3px", opacity: 0.15 }}
          transition={{ duration: 0.6 + i * 0.04, repeat: Infinity, delay: i * 0.04, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ── AI Avatar ─────────────────────────────────────────────────────────────────
function AIAvatar({ state }) {
  const colors = {
    idle: { ring: "rgba(99,102,241,0.15)", icon: "text-slate-400", dot: "bg-slate-600", label: "AI Interviewer", labelCls: "bg-white/5 border-white/10 text-slate-500" },
    speaking: { ring: "rgba(99,102,241,0.45)", icon: "text-indigo-300", dot: "bg-indigo-400", label: "AI Speaking...", labelCls: "bg-indigo-500/20 border-indigo-500/40 text-indigo-300" },
    listening: { ring: "rgba(52,211,153,0.45)", icon: "text-emerald-400", dot: "bg-emerald-400", label: "Listening...", labelCls: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" },
    thinking: { ring: "rgba(251,191,36,0.4)", icon: "text-amber-400", dot: "bg-amber-400", label: "Analyzing...", labelCls: "bg-amber-500/20 border-amber-500/40 text-amber-300" },
  };
  const c = colors[state] || colors.idle;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: `radial-gradient(circle, ${c.ring} 0%, transparent 70%)` }}
          animate={{ scale: state !== "idle" ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {state !== "idle" && (
          <>
            <motion.div className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: c.ring }}
              animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }} />
            <motion.div className="absolute inset-0 rounded-full border"
              style={{ borderColor: c.ring }}
              animate={{ scale: [1, 1.9], opacity: [0.4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} />
          </>
        )}
        <div className="relative w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81, #1e1b4b)", border: "2px solid rgba(99,102,241,0.35)" }}>
          <motion.div
            animate={state === "thinking" ? { rotate: [0, 8, -8, 0] } : state === "speaking" ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <Brain className={`w-11 h-11 ${c.icon}`} />
          </motion.div>
          <div className={`absolute bottom-1.5 right-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#1e1b4b] ${c.dot}`}>
            {state !== "idle" && <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: c.ring }} />}
          </div>
        </div>
      </div>
      <motion.span
        key={state}
        initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}
        className={`px-3 py-1 rounded-full text-xs font-bold border ${c.labelCls}`}
      >
        {c.label}
      </motion.span>
    </div>
  );
}

// ── Body Language Tips ─────────────────────────────────────────────────────
const BL_TIPS = [
  { icon: Eye, text: "Look into the camera lens, not at the screen.", color: "text-cyan-400" },
  { icon: MessageSquare, text: "Pause 2–3 seconds before answering — it signals composure.", color: "text-violet-400" },
  { icon: Star, text: "Smile naturally — warmth builds instant rapport.", color: "text-amber-400" },
  { icon: Zap, text: "Sit upright, shoulders back — posture radiates confidence.", color: "text-emerald-400" },
  { icon: Brain, text: "Nod occasionally to show active listening.", color: "text-pink-400" },
  { icon: Volume2, text: "Vary your tone — monotone delivery loses attention.", color: "text-blue-400" },
  { icon: Clock, text: "Aim for 60–90 second answers — concise wins.", color: "text-orange-400" },
];

const ROLES = ["Software Engineer", "Product Manager", "Data Scientist", "UX Designer", "Marketing Manager",
  "Business Analyst", "DevOps Engineer", "Project Manager", "Sales Executive", "Financial Analyst"];

const STAGES = { SETUP: "setup", GENERATING: "generating", INTRO: "intro", INTERVIEW: "interview", REPORT: "report" };

export default function VoiceMockInterview() {
  // Setup
  const [stage, setStage] = useState(STAGES.SETUP);
  const [jobRole, setJobRole] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");

  // Interview state
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [interviewState, setInterviewState] = useState("idle");
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  // Transcript / session log
  const [sessionLog, setSessionLog] = useState([]);
  const [finalReport, setFinalReport] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);

  const recRef = useRef(null);
  const recordTimerRef = useRef(null);
  const tipTimerRef = useRef(null);
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    Resume.list("-updated_date").then(setResumes).catch(() => {});
    tipTimerRef.current = setInterval(() => setTipIndex(i => (i + 1) % BL_TIPS.length), 12000);
    return () => { clearInterval(tipTimerRef.current); clearInterval(recordTimerRef.current); };
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessionLog, currentTranscript]);

  useEffect(() => {
    if (isRecording) {
      recordTimerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } else {
      clearInterval(recordTimerRef.current);
      setRecordingTime(0);
    }
    return () => clearInterval(recordTimerRef.current);
  }, [isRecording]);

  const speak = useCallback((text, onDone) => {
    if (isMuted || !window.speechSynthesis) { onDone?.(); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.92; utter.pitch = 1.0; utter.volume = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.lang === "en-US" && (v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Alex")));
    if (pref) utter.voice = pref;
    utter.onend = () => onDone?.();
    window.speechSynthesis.speak(utter);
  }, [isMuted]);

  const stopSpeaking = () => window.speechSynthesis?.cancel();

  const generateAndStart = async () => {
    if (!jobRole.trim()) return;
    setStage(STAGES.GENERATING);
    const resume = resumes.find(r => r.id === selectedResumeId);
    const ctx = resume ? `Candidate: ${resume.personal_info?.full_name}, Skills: ${(resume.skills || []).join(", ")}, Experience: ${(resume.experience || []).map(e => `${e.title} at ${e.company}`).join("; ")}` : "No resume.";
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate exactly ${questionCount} realistic interview questions for a ${jobRole} role. Mix behavioral, technical, and situational. Include context: ${ctx}. For each: question text, type, difficulty (easy/medium/hard), and a brief ideal_answer_outline (2 bullet points).`,
      response_json_schema: {
        type: "object",
        properties: {
          questions: {
            type: "array",
            items: { type: "object", properties: { question: { type: "string" }, type: { type: "string" }, difficulty: { type: "string" }, ideal_answer_outline: { type: "array", items: { type: "string" } } } }
          }
        }
      }
    });
    setQuestions(result.questions || []);
    setCurrentIndex(0);
    setSessionLog([]);
    setStage(STAGES.INTRO);
  };

  const startInterview = () => {
    setStage(STAGES.INTERVIEW);
    askQuestion(0);
  };

  const askQuestion = (idx) => {
    setCurrentFeedback(null);
    setShowFeedback(false);
    setCurrentTranscript("");
    setInterviewState("speaking");
    const q = questions[idx];
    const prefix = idx === 0
      ? `Welcome to your ${jobRole} mock interview. I'll ask you ${questions.length} questions. Let's begin. `
      : `Great. Question ${idx + 1}: `;
    addToLog("ai", `${idx === 0 ? `[Introduction] ` : ""}Q${idx + 1}: ${q.question}`);
    speak(`${prefix}Question ${idx + 1}: ${q.question}`, () => setInterviewState("listening"));
  };

  const addToLog = (role, text, feedback = null) => {
    setSessionLog(prev => [...prev, { role, text, feedback, timestamp: new Date().toLocaleTimeString() }]);
  };

  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Your browser doesn't support voice input. Please use Chrome or Edge.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    let finalText = "";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript + " ";
        else interim += e.results[i][0].transcript;
      }
      setCurrentTranscript(finalText + interim);
    };
    rec.onerror = () => setIsRecording(false);
    rec.onend = () => {
      setIsRecording(false);
      if (finalText.trim().length > 3) evaluateAnswer(finalText.trim());
      else setInterviewState("listening");
    };
    rec.start();
    recRef.current = rec;
    setIsRecording(true);
    setInterviewState("listening");
  };

  const stopRecording = () => {
    recRef.current?.stop();
    setIsRecording(false);
  };

  const evaluateAnswer = async (text) => {
    setInterviewState("thinking");
    const q = questions[currentIndex];
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert interview coach evaluating a live voice response for a ${jobRole} position.
Question: "${q.question}" (${q.type}, ${q.difficulty})
Candidate's Answer: "${text}"

Score on 4 dimensions (0–10):
1. CONTENT — relevance, depth, examples
2. CLARITY — structure, conciseness
3. CONFIDENCE — assertiveness, no hedging  
4. OVERALL — weighted average

Also provide:
- spoken_reaction: A 1-sentence warm but honest live reaction (as if face-to-face)
- body_language_tip: One specific tip based on their answer style
- improvement_tip: One most important thing to improve
- model_snippet: A stronger 1-sentence version of a key part of their answer`,
      response_json_schema: {
        type: "object",
        properties: {
          overall: { type: "number" },
          content: { type: "number" },
          clarity: { type: "number" },
          confidence: { type: "number" },
          spoken_reaction: { type: "string" },
          body_language_tip: { type: "string" },
          improvement_tip: { type: "string" },
          model_snippet: { type: "string" },
        }
      }
    });

    addToLog("candidate", text, result);
    setCurrentFeedback(result);
    setShowFeedback(true);
    setInterviewState("idle");
    speak(result.spoken_reaction || "Good effort. Let's keep going.");
  };

  const skipQuestion = () => {
    stopSpeaking();
    if (isRecording) stopRecording();
    addToLog("candidate", "(skipped)", null);
    moveNext();
  };

  const moveNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => {
        const next = i + 1;
        setTimeout(() => askQuestion(next), 100);
        return next;
      });
    } else {
      generateFinalReport();
    }
  };

  const generateFinalReport = async () => {
    stopSpeaking();
    setInterviewState("thinking");
    const answered = sessionLog.filter(e => e.role === "candidate" && e.feedback);
    const avgScore = answered.length > 0
      ? (answered.reduce((s, e) => s + (e.feedback.overall || 0), 0) / answered.length).toFixed(1)
      : 0;

    const report = await base44.integrations.Core.InvokeLLM({
      prompt: `Summarize this mock interview for a ${jobRole} role.
Answered: ${answered.length}/${questions.length} questions. Avg score: ${avgScore}/10.
Q&A Summary: ${answered.map((e, i) => `Q${i + 1}: Score ${e.feedback?.overall}/10`).join(", ")}

Provide:
- overall_assessment: 2–3 sentence encouraging but honest summary
- hire_signal: "Strong Yes" | "Lean Yes" | "Lean No" | "Strong No"  
- hire_reasoning: 1 sentence explaining the hire signal
- top_strengths: 3 bullet points
- top_improvements: 3 bullet points  
- action_plan: 3 specific things to practice before the real interview`,
      response_json_schema: {
        type: "object",
        properties: {
          overall_assessment: { type: "string" },
          hire_signal: { type: "string" },
          hire_reasoning: { type: "string" },
          top_strengths: { type: "array", items: { type: "string" } },
          top_improvements: { type: "array", items: { type: "string" } },
          action_plan: { type: "array", items: { type: "string" } },
          final_score: { type: "number" }
        }
      }
    });

    setFinalReport({ ...report, avgScore: parseFloat(avgScore), totalAnswered: answered.length });
    setInterviewState("idle");
    speak(`Your interview is complete! ${report?.overall_assessment?.split(".")[0] || "Great job today!"}`);
    setStage(STAGES.REPORT);
  };

  const downloadTranscript = () => {
    const lines = [
      `MOCK INTERVIEW TRANSCRIPT`,
      `Role: ${jobRole} | Date: ${new Date().toLocaleDateString()}`,
      `Questions: ${questions.length} | Score: ${finalReport?.avgScore || "—"}/10`,
      `${"═".repeat(60)}`,
      "",
      ...sessionLog.map(e => {
        const prefix = e.role === "ai" ? "🤖 AI INTERVIEWER" : "👤 CANDIDATE";
        const score = e.feedback ? ` [Score: ${e.feedback.overall}/10]` : "";
        return `[${e.timestamp}] ${prefix}${score}\n${e.text}\n`;
      }),
      "",
      `${"═".repeat(60)}`,
      "FINAL REPORT",
      `${"═".repeat(60)}`,
      finalReport ? [
        `Overall Score: ${finalReport.avgScore}/10`,
        `Hire Signal: ${finalReport.hire_signal}`,
        `Assessment: ${finalReport.overall_assessment}`,
        "",
        "STRENGTHS:",
        ...(finalReport.top_strengths || []).map(s => `  • ${s}`),
        "",
        "AREAS TO IMPROVE:",
        ...(finalReport.top_improvements || []).map(s => `  • ${s}`),
        "",
        "ACTION PLAN:",
        ...(finalReport.action_plan || []).map((s, i) => `  ${i + 1}. ${s}`),
      ].join("\n") : ""
    ].join("\n");

    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-transcript-${jobRole.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const tip = BL_TIPS[tipIndex];

  if (stage === STAGES.SETUP) {
    return (
      <div className="min-h-screen bg-[#060b12] flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-500/30">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-white mb-2">Voice Mock Interview 🎤</h1>
              <p className="text-slate-400 mb-2">Talk to your AI interviewer. Practice speaking under pressure with realistic feedback.</p>
              <p className="text-slate-500 text-sm">Get a full transcript, scoring on content/clarity/confidence, and actionable coaching. No hiring manager judgement — just smart feedback.</p>
            </div>

            <div className="bg-white/4 border border-white/8 rounded-2xl p-6 space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-300 block mb-2">Target Role *</label>
                <Input value={jobRole} onChange={e => setJobRole(e.target.value)}
                  placeholder="e.g. Software Engineer, Product Manager..."
                  className="bg-white/5 border-white/10 text-white placeholder-slate-600 h-11" />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {ROLES.map(r => (
                    <button key={r} onClick={() => setJobRole(r)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${jobRole === r ? "border-violet-500/60 bg-violet-500/15 text-violet-300" : "border-white/8 text-slate-500 hover:text-white hover:border-white/20"}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-300 block mb-2">Questions</label>
                  <div className="flex gap-2">
                    {[3, 5, 8, 10].map(n => (
                      <button key={n} onClick={() => setQuestionCount(n)}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${questionCount === n ? "bg-violet-500/20 border-violet-500/50 text-violet-300" : "bg-white/5 border-white/10 text-slate-400 hover:text-white"}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300 block mb-2">Resume (optional)</label>
                  <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-10 text-sm">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0d1a26] border-white/10">
                      {resumes.map(r => (
                        <SelectItem key={r.id} value={r.id} className="text-white hover:bg-white/10">{r.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                {[
                  { icon: Mic, label: "Speak Answers", color: "text-violet-400" },
                  { icon: Brain, label: "AI Evaluates", color: "text-cyan-400" },
                  { icon: FileText, label: "Full Transcript", color: "text-emerald-400" },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="text-center p-3 bg-white/3 rounded-xl border border-white/6">
                    <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
                    <p className="text-xs text-slate-400">{label}</p>
                  </div>
                ))}
              </div>

              <Button onClick={generateAndStart} disabled={!jobRole.trim()}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold h-11">
                <Mic className="w-4 h-4 mr-2" /> Start Voice Interview
              </Button>
              <p className="text-xs text-slate-600 text-center">Best in Chrome or Edge · Microphone required</p>
            </div>
          </motion.div>
        </div>

        <div className="bg-white/3 border-t border-white/5 py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Experience Real Interview Pressure in a Safe Environment</h2>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>Voice mock interviews are fundamentally different from text practice. You have to think on your feet, manage nervousness, watch your pacing, and hear how you actually sound. The Voice Mock Interview simulates a live 1-on-1 with realistic questions, body language coaching, and AI feedback on every answer.</p>
              <p>Our AI interviewer speaks naturally, listens to your answers, and provides instant scoring on content quality, clarity, and confidence. You also get real-time body language tips (eye contact, pacing, tone variation) and improvements for the next answer.</p>
              <p>Download your full transcript and final report afterward. Practice until you're unshakeable, then ace the real interview.</p>
            </div>
            <p className="text-slate-500 text-xs text-center mt-6">Powered by AI Resume Builder · A free initiative by Kindness Community Foundation (KCF LLC) · Built to empower users with intelligent, real-time assistance and meaningful interaction.</p>
          </div>
        </div>
      </div>
    );
  }

  if (stage === STAGES.GENERATING) {
    return (
      <div className="min-h-screen bg-[#060b12] flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-flex mb-6">
            <div className="w-20 h-20 bg-violet-500/15 border border-violet-500/30 rounded-full flex items-center justify-center">
              <Brain className="w-10 h-10 text-violet-400 animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-violet-400/30 animate-ping" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Preparing your interview...</h3>
          <p className="text-slate-400 text-sm">Generating {questionCount} questions for <span className="text-violet-400">{jobRole}</span></p>
        </div>
      </div>
    );
  }

  if (stage === STAGES.INTRO) {
    return (
      <div className="min-h-screen bg-[#060b12] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg text-center">
          <AIAvatar state="idle" />
          <h2 className="text-2xl font-extrabold text-white mt-6 mb-2">Ready to begin?</h2>
          <p className="text-slate-400 text-sm mb-6">
            Your AI interviewer will ask <span className="text-violet-400 font-semibold">{questions.length} questions</span> for the <span className="text-white font-semibold">{jobRole}</span> role. Speak your answers naturally, and receive instant feedback after each one. A full transcript and report are generated at the end.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: Mic, t: "Speak freely", s: "Natural voice answers", c: "text-violet-400 bg-violet-500/10" },
              { icon: Brain, t: "Instant scores", s: "Content, clarity, confidence", c: "text-cyan-400 bg-cyan-500/10" },
              { icon: FileText, t: "Full report", s: "Downloadable transcript", c: "text-emerald-400 bg-emerald-500/10" },
            ].map(({ icon: Icon, t, s, c }) => (
              <div key={t} className={`p-3 rounded-xl border border-white/8 ${c.split(" ")[1]}`}>
                <Icon className={`w-5 h-5 ${c.split(" ")[0]} mx-auto mb-1.5`} />
                <p className="text-white text-xs font-semibold">{t}</p>
                <p className="text-slate-500 text-[10px] mt-0.5">{s}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={startInterview}
              className="bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold px-8 h-11 rounded-xl shadow-lg shadow-violet-500/25">
              <Play className="w-4 h-4 mr-2" /> Start Interview
            </Button>
            <Button variant="outline" onClick={() => setStage(STAGES.SETUP)}
              className="border-white/10 text-slate-400 hover:text-white h-11 px-6 rounded-xl">
              <X className="w-4 h-4 mr-1" /> Back
            </Button>
          </div>
          <p className="text-xs text-slate-600 mt-4">Allow microphone access when prompted</p>
        </motion.div>
      </div>
    );
  }

  if (stage === STAGES.REPORT && finalReport) {
    const score = finalReport.avgScore || 0;
    const scoreColor = score >= 8 ? "text-emerald-400" : score >= 6 ? "text-amber-400" : "text-red-400";
    const hireColors = {
      "Strong Yes": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      "Lean Yes": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      "Lean No": "bg-amber-500/20 text-amber-300 border-amber-500/30",
      "Strong No": "bg-red-500/20 text-red-300 border-red-500/30",
    };

    return (
      <div className="min-h-screen bg-[#060b12] p-4 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-1">Interview Complete!</h1>
            <p className="text-slate-400 text-sm">{jobRole} · Voice Session · {finalReport.totalAnswered}/{questions.length} answered</p>
          </div>

          <div className="bg-gradient-to-br from-violet-500/12 to-purple-500/12 border border-violet-500/20 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center">
                <p className="text-slate-400 text-xs mb-1">Overall Score</p>
                <p className={`text-5xl font-extrabold ${scoreColor}`}>{score}<span className="text-lg text-slate-500">/10</span></p>
                <div className="w-28 mx-auto bg-white/10 h-1.5 rounded-full mt-2">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(score / 10) * 100}%` }} transition={{ duration: 1 }}
                    className={`h-1.5 rounded-full ${score >= 8 ? "bg-emerald-400" : score >= 6 ? "bg-amber-400" : "bg-red-400"}`} />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold mb-2 ${hireColors[finalReport.hire_signal] || hireColors["Lean Yes"]}`}>
                  <span>Hire Signal: {finalReport.hire_signal}</span>
                </div>
                <p className="text-slate-300 text-sm">{finalReport.hire_reasoning}</p>
                <p className="text-slate-400 text-sm mt-2 italic">"{finalReport.overall_assessment}"</p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4">
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5" /> Top Strengths
              </p>
              <ul className="space-y-2">
                {(finalReport.top_strengths || []).map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4">
              <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Areas to Improve
              </p>
              <ul className="space-y-2">
                {(finalReport.top_improvements || []).map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-300">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {finalReport.action_plan?.length > 0 && (
            <div className="bg-violet-500/8 border border-violet-500/20 rounded-xl p-4">
              <p className="text-violet-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Your Action Plan Before the Real Interview
              </p>
              <ol className="space-y-2">
                {finalReport.action_plan.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-violet-300">
                    <span className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="bg-white/4 border border-white/8 rounded-xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors"
              onClick={() => setShowTranscript(t => !t)}>
              <span className="text-white font-semibold flex items-center gap-2">
                <List className="w-4 h-4 text-slate-400" /> Full Conversation Transcript
                <Badge className="bg-white/10 text-slate-400 border-white/10 text-xs">{sessionLog.length} messages</Badge>
              </span>
              {showTranscript ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            <AnimatePresence>
              {showTranscript && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="p-4 pt-0 max-h-96 overflow-y-auto space-y-3">
                    {sessionLog.map((entry, i) => (
                      <div key={i} className={`flex gap-3 ${entry.role === "ai" ? "" : "flex-row-reverse"}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${entry.role === "ai" ? "bg-indigo-500/20 text-indigo-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                          {entry.role === "ai" ? "AI" : "Me"}
                        </div>
                        <div className={`flex-1 max-w-[85%] ${entry.role === "candidate" ? "text-right" : ""}`}>
                          <div className={`inline-block px-3 py-2 rounded-xl text-sm ${entry.role === "ai" ? "bg-white/6 text-slate-300" : "bg-violet-500/15 text-violet-200"}`}>
                            {entry.text}
                          </div>
                          {entry.feedback && (
                            <div className="mt-1 flex items-center gap-2 justify-end">
                              <span className={`text-xs font-bold ${entry.feedback.overall >= 8 ? "text-emerald-400" : entry.feedback.overall >= 5 ? "text-amber-400" : "text-red-400"}`}>
                                {entry.feedback.overall}/10
                              </span>
                              <span className="text-slate-600 text-xs">C:{entry.feedback.content} | Cl:{entry.feedback.clarity} | Conf:{entry.feedback.confidence}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-3">
            <Button onClick={downloadTranscript} variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5 gap-2">
              <Download className="w-4 h-4" /> Download Report
            </Button>
            <Button onClick={() => { setStage(STAGES.SETUP); setSessionLog([]); setFinalReport(null); }}
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold h-10">
              <RotateCcw className="w-4 h-4 mr-2" /> Practice Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#060b12] flex flex-col">
      <div className="border-b border-white/5 bg-[#060b12]/90 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">{jobRole}</span>
          <span className="text-xs text-slate-700">·</span>
          <span className="text-xs text-slate-500">Q{currentIndex + 1}/{questions.length}</span>
        </div>
        <div className="flex-1 max-w-48 mx-4 bg-white/5 rounded-full h-1.5">
          <motion.div className="bg-gradient-to-r from-violet-500 to-purple-600 h-1.5 rounded-full"
            animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(m => !m)}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => { stopSpeaking(); if (isRecording) stopRecording(); setStage(STAGES.SETUP); }}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white/4 border border-white/8 rounded-2xl p-5 flex flex-col items-center">
                <AIAvatar state={isRecording ? "listening" : interviewState} />
                {interviewState === "listening" && !isRecording && (
                  <p className="text-slate-500 text-xs mt-3">Tap the mic to answer</p>
                )}
              </div>
              <motion.div key={tipIndex} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 border border-white/8 rounded-2xl p-4 flex flex-col justify-center">
                <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Camera className="w-3 h-3" /> Body Language Coach
                </p>
                <div className="flex items-start gap-2">
                  <tip.icon className={`w-4 h-4 ${tip.color} shrink-0 mt-0.5`} />
                  <p className="text-slate-300 text-xs leading-relaxed">{tip.text}</p>
                </div>
                <div className="flex gap-1 mt-3">
                  {BL_TIPS.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all ${i === tipIndex ? "w-4 bg-cyan-400" : "w-1.5 bg-white/15"}`} />
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${q.difficulty === "hard" ? "bg-red-500/15 text-red-400 border-red-500/30" : q.difficulty === "medium" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"}`}>{q.difficulty}</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-violet-500/15 text-violet-400">{q.type}</span>
              </div>
              <motion.p key={currentIndex} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="text-lg font-semibold text-white leading-snug">
                {q.question}
              </motion.p>
              {(interviewState === "speaking" || (interviewState === "listening" && isRecording)) && (
                <div className="mt-4">
                  <WaveformBars active color={interviewState === "speaking" ? "#6366f1" : "#34d399"} />
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {interviewState === "thinking" && (
                <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="bg-white/4 border border-violet-500/20 rounded-2xl p-6 text-center">
                  <Loader2 className="w-7 h-7 text-violet-400 animate-spin mx-auto mb-2" />
                  <p className="text-violet-300 text-sm font-medium">Analyzing your answer...</p>
                </motion.div>
              )}

              {(interviewState === "listening" || interviewState === "speaking") && !showFeedback && (
                <motion.div key="mic" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-white/4 border border-white/8 rounded-2xl p-5">
                  <div className="flex flex-col items-center gap-4">
                    <motion.button
                      onClick={isRecording ? stopRecording : (interviewState === "listening" ? startRecording : undefined)}
                      disabled={interviewState === "speaking" || interviewState === "thinking"}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all ${isRecording ? "bg-red-500 shadow-red-500/40" : interviewState === "listening" ? "bg-gradient-to-br from-violet-500 to-purple-700 shadow-violet-500/40 cursor-pointer" : "bg-white/10 cursor-not-allowed opacity-40"}`}
                    >
                      {isRecording ? <Square className="w-6 h-6 text-white fill-white" /> : <Mic className="w-7 h-7 text-white" />}
                    </motion.button>
                    {isRecording && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-ping" />
                        <span className="text-red-400 text-sm font-mono font-bold">{formatTime(recordingTime)}</span>
                      </div>
                    )}
                    {interviewState === "listening" && !isRecording && <p className="text-slate-500 text-sm">Tap to speak your answer</p>}
                    {interviewState === "speaking" && <p className="text-slate-500 text-sm">AI is asking...</p>}
                    <button onClick={skipQuestion} className="text-xs text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/10">
                      <SkipForward className="w-3 h-3" /> Skip
                    </button>
                  </div>

                  {currentTranscript && (
                    <div className="mt-4 pt-4 border-t border-white/8">
                      <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Live transcript</p>
                      <p className="text-slate-300 text-sm leading-relaxed">{currentTranscript}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {showFeedback && currentFeedback && (
                <motion.div key="feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  {currentTranscript && (
                    <div className="bg-white/4 border border-white/8 rounded-xl p-4">
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <MessageSquare className="w-3 h-3" /> Your Answer
                      </p>
                      <p className="text-slate-300 text-sm leading-relaxed">{currentTranscript}</p>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Score</p>
                      <span className={`text-2xl font-extrabold ${currentFeedback.overall >= 8 ? "text-emerald-400" : currentFeedback.overall >= 5 ? "text-amber-400" : "text-red-400"}`}>
                        {currentFeedback.overall}<span className="text-sm text-slate-500">/10</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[["Content", currentFeedback.content, "text-cyan-400"], ["Clarity", currentFeedback.clarity, "text-violet-400"], ["Confidence", currentFeedback.confidence, "text-emerald-400"]].map(([l, s, c]) => (
                        <div key={l} className="text-center bg-white/5 rounded-lg p-2">
                          <p className={`text-base font-bold ${c}`}>{s ?? "—"}</p>
                          <p className="text-[10px] text-slate-500">{l}</p>
                        </div>
                      ))}
                    </div>
                    {currentFeedback.spoken_reaction && (
                      <p className="text-slate-300 text-sm italic border-t border-white/8 pt-3">💬 "{currentFeedback.spoken_reaction}"</p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {currentFeedback.body_language_tip && (
                      <div className="bg-cyan-500/8 border border-cyan-500/20 rounded-xl p-3">
                        <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1"><Camera className="w-3 h-3" /> Body Language</p>
                        <p className="text-cyan-300 text-xs leading-relaxed">{currentFeedback.body_language_tip}</p>
                      </div>
                    )}
                    {currentFeedback.improvement_tip && (
                      <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-3">
                        <p className="text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Improve</p>
                        <p className="text-amber-300 text-xs leading-relaxed">{currentFeedback.improvement_tip}</p>
                      </div>
                    )}
                  </div>

                  {currentFeedback.model_snippet && (
                    <div className="bg-violet-500/8 border border-violet-500/20 rounded-xl p-3">
                      <p className="text-violet-400 text-[10px] font-bold uppercase tracking-wider mb-1">Stronger Phrasing</p>
                      <p className="text-violet-300 text-xs italic">"{currentFeedback.model_snippet}"</p>
                    </div>
                  )}

                  <Button onClick={moveNext}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold h-11 rounded-xl">
                    {currentIndex < questions.length - 1 ? <><ChevronRight className="w-4 h-4 mr-1" /> Next Question</> : <><Trophy className="w-4 h-4 mr-1" /> See Final Report</>}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden lg:flex flex-col w-72 border-l border-white/5 bg-[#080d14]/60">
          <div className="p-4 border-b border-white/5">
            <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <List className="w-3.5 h-3.5" /> Live Transcript
              <span className="ml-auto text-slate-600">{sessionLog.length} msgs</span>
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {sessionLog.map((entry, i) => (
              <div key={i} className={`text-xs ${entry.role === "ai" ? "text-slate-400" : "text-slate-300"}`}>
                <span className={`font-bold ${entry.role === "ai" ? "text-indigo-400" : "text-emerald-400"}`}>
                  {entry.role === "ai" ? "AI: " : "You: "}
                </span>
                <span className="leading-relaxed">{entry.text}</span>
                {entry.feedback && (
                  <span className={`ml-1 font-bold ${entry.feedback.overall >= 8 ? "text-emerald-400" : entry.feedback.overall >= 5 ? "text-amber-400" : "text-red-400"}`}>
                    [{entry.feedback.overall}/10]
                  </span>
                )}
              </div>
            ))}
            {currentTranscript && isRecording && (
              <div className="text-xs text-slate-500 italic">
                <span className="text-emerald-400 font-bold">You: </span>{currentTranscript}
                <span className="animate-pulse">▌</span>
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}