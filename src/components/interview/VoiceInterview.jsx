import React, { useState, useRef, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Square, Volume2, VolumeX, ChevronRight, RotateCcw,
  Trophy, Sparkles, Brain, Eye, Clock, CheckCircle2, AlertCircle,
  TrendingUp, ThumbsUp, Loader2, Play, SkipForward, X, Camera,
  MessageSquare, Zap, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Waveform Visualizer ───────────────────────────────────────────────────────
function WaveformBars({ active, color = "#34d399" }) {
  return (
    <div className="flex items-center justify-center gap-0.5 h-10">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full w-1"
          style={{ backgroundColor: color }}
          animate={active ? {
            height: [`${8 + Math.sin(i) * 4}px`, `${24 + Math.sin(i * 1.5) * 12}px`, `${8 + Math.sin(i) * 4}px`],
            opacity: [0.5, 1, 0.5],
          } : { height: "4px", opacity: 0.2 }}
          transition={{ duration: 0.6 + i * 0.03, repeat: Infinity, delay: i * 0.04, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ── Animated AI Face ──────────────────────────────────────────────────────────
function AIInterviewer({ isSpeaking, isListening, isThinking }) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Outer glow ring */}
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: isSpeaking ? "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)" : isListening ? "radial-gradient(circle, rgba(52,211,153,0.3) 0%, transparent 70%)" : "none" }}
          animate={{ scale: isSpeaking || isListening ? [1, 1.15, 1] : 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* Pulse rings */}
        {(isSpeaking || isListening) && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: isSpeaking ? "rgba(99,102,241,0.4)" : "rgba(52,211,153,0.4)" }}
              animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border"
              style={{ borderColor: isSpeaking ? "rgba(99,102,241,0.25)" : "rgba(52,211,153,0.25)" }}
              animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </>
        )}

        {/* Face container */}
        <div className="relative w-28 h-28 rounded-full flex items-center justify-center shadow-2xl"
          style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)", border: "2px solid rgba(99,102,241,0.4)" }}>

          {/* Brain icon center */}
          <motion.div
            animate={isThinking ? { rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] } : isSpeaking ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <Brain className={`w-12 h-12 ${isSpeaking ? "text-indigo-300" : isListening ? "text-emerald-400" : isThinking ? "text-amber-400" : "text-slate-400"}`} />
          </motion.div>

          {/* Status dot */}
          <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-[#1e1b4b] ${isSpeaking ? "bg-indigo-400" : isListening ? "bg-emerald-400" : isThinking ? "bg-amber-400" : "bg-slate-600"}`}>
            {(isSpeaking || isListening) && <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: isSpeaking ? "rgba(99,102,241,0.5)" : "rgba(52,211,153,0.5)" }} />}
          </div>
        </div>
      </div>

      {/* Status label */}
      <motion.div
        key={`${isSpeaking}-${isListening}-${isThinking}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-3 px-3 py-1 rounded-full text-xs font-bold ${
          isSpeaking ? "bg-indigo-500/20 border border-indigo-500/40 text-indigo-300" :
          isListening ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300" :
          isThinking ? "bg-amber-500/20 border border-amber-500/40 text-amber-300" :
          "bg-white/5 border border-white/10 text-slate-500"
        }`}
      >
        {isSpeaking ? "AI Speaking..." : isListening ? "Listening..." : isThinking ? "Analyzing..." : "AI Interviewer"}
      </motion.div>
    </div>
  );
}

// ── Body Language Tip ─────────────────────────────────────────────────────────
const BODY_LANGUAGE_TIPS = [
  { icon: Eye, tip: "Maintain eye contact with the camera — look into the lens, not the screen.", color: "text-cyan-400" },
  { icon: MessageSquare, tip: "Slow down and pause briefly before answering — it shows composure.", color: "text-violet-400" },
  { icon: Star, tip: "Smile naturally — warmth builds instant rapport with interviewers.", color: "text-amber-400" },
  { icon: Zap, tip: "Sit up straight with shoulders back — posture signals confidence.", color: "text-emerald-400" },
  { icon: Brain, tip: "Nod occasionally while the interviewer speaks — it shows active listening.", color: "text-pink-400" },
  { icon: Volume2, tip: "Speak clearly and vary your tone — monotone delivery loses engagement.", color: "text-blue-400" },
  { icon: Clock, tip: "Keep answers focused — aim for 60-90 seconds per response.", color: "text-orange-400" },
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function VoiceInterview({ questions, jobRole, onComplete, onExit }) {
  const [phase, setPhase] = useState("intro"); // intro | speaking | listening | thinking | feedback | done
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [bodyLangTip, setBodyLangTip] = useState(BODY_LANGUAGE_TIPS[0]);
  const [tipIndex, setTipIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState([]);
  const [overallFeedback, setOverallFeedback] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const speechRef = useRef(null);
  const recordTimerRef = useRef(null);
  const tipTimerRef = useRef(null);

  // Rotate body language tips every 15s
  useEffect(() => {
    tipTimerRef.current = setInterval(() => {
      setTipIndex(i => {
        const next = (i + 1) % BODY_LANGUAGE_TIPS.length;
        setBodyLangTip(BODY_LANGUAGE_TIPS[next]);
        return next;
      });
    }, 15000);
    return () => clearInterval(tipTimerRef.current);
  }, []);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordTimerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } else {
      clearInterval(recordTimerRef.current);
      setRecordingTime(0);
    }
    return () => clearInterval(recordTimerRef.current);
  }, [isRecording]);

  const speak = useCallback((text) => {
    if (isMuted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    // Try to get a natural voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes("Google") || v.name.includes("Alex") || v.name.includes("Samantha") || v.lang === "en-US");
    if (preferred) utter.voice = preferred;
    speechRef.current = utter;
    window.speechSynthesis.speak(utter);
    return utter;
  }, [isMuted]);

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
  };

  const startInterview = () => {
    setPhase("speaking");
    const q = questions[0];
    const intro = `Welcome to your ${jobRole} mock interview. I'll be asking you ${questions.length} questions. Take a breath, and let's begin. Question 1: ${q.question}`;
    const utter = speak(intro);
    if (utter) {
      utter.onend = () => setPhase("listening");
    } else {
      setTimeout(() => setPhase("listening"), 3000);
    }
  };

  const askCurrentQuestion = (idx = currentIndex) => {
    setPhase("speaking");
    setCurrentAnswer("");
    setCurrentFeedback(null);
    const q = questions[idx];
    const prefix = idx === 0 ? "" : `Great. Next question. `;
    const utter = speak(`${prefix}Question ${idx + 1}: ${q.question}`);
    if (utter) {
      utter.onend = () => setPhase("listening");
    } else {
      setTimeout(() => setPhase("listening"), 2500);
    }
  };

  const startLiveTranscription = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Microphone not available. Please try Chrome or Edge.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    let final = "";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
        else interim += e.results[i][0].transcript;
      }
      setCurrentAnswer(final + interim);
    };
    rec.onerror = () => setIsRecording(false);
    rec.onend = () => {
      setIsRecording(false);
      if (final.trim().length > 5) evaluateAnswer(final.trim());
    };
    rec.start();
    mediaRecorderRef.current = { stop: () => rec.stop() };
    setIsRecording(true);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorderRef.current.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await transcribeAndEvaluate(blob);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      // Fallback: use Web Speech API for live transcription
      startLiveTranscription();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const transcribeAndEvaluate = async (blob) => {
    setPhase("thinking");
    try {
      const uploadResult = await base44.integrations.Core.UploadFile({ file: blob });
      const transcript = await base44.integrations.Core.InvokeLLM({
        prompt: "Transcribe this interview audio answer verbatim. Return only the spoken text, no commentary.",
        file_urls: uploadResult.file_url,
        model: "gemini_3_flash"
      });
      const text = typeof transcript === "string" ? transcript : transcript?.text || "";
      setCurrentAnswer(text);
      await evaluateAnswer(text);
    } catch (err) {
      setPhase("listening");
    }
  };

  const evaluateAnswer = async (answerText) => {
    setPhase("thinking");
    const q = questions[currentIndex];

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a world-class interview coach evaluating a live mock interview response for a ${jobRole} role.

Question: "${q.question}"
Type: ${q.type} | Difficulty: ${q.difficulty}
Candidate's Answer: "${answerText}"

Evaluate across 4 dimensions and provide real-time coaching feedback as if you are speaking to them face-to-face:

1. CONTENT (0-10): Relevance, depth, use of examples
2. CLARITY (0-10): Structure, conciseness, ease of understanding  
3. CONFIDENCE (0-10): Assertive language, conviction, no hedging
4. BODY LANGUAGE COACHING (separate - analyze writing style clues and provide tips): Based on how they answered, infer potential body language issues (e.g., nervousness shown by very short answer, over-explanation showing anxiety, confident answer suggesting good posture etc.)

Also provide:
- A one-sentence spoken reaction (as if you just heard them live) — warm and encouraging but honest
- 1-2 quick improvement tips (very specific, actionable)
- A model answer snippet (1-2 sentences showing an ideal response)`,
      response_json_schema: {
        type: "object",
        properties: {
          score: { type: "number" },
          content_score: { type: "number" },
          clarity_score: { type: "number" },
          confidence_score: { type: "number" },
          spoken_reaction: { type: "string" },
          body_language_feedback: { type: "string" },
          quick_tips: { type: "array", items: { type: "string" } },
          model_snippet: { type: "string" },
          passed: { type: "boolean" },
        },
        required: ["score", "spoken_reaction", "quick_tips"]
      }
    });

    setCurrentFeedback(result);
    setSessionResults(prev => [...prev, { question: q, answer: answerText, feedback: result }]);

    // AI speaks the reaction
    const reaction = result?.spoken_reaction || "Good effort! Let's continue.";
    const nextAction = currentIndex < questions.length - 1
      ? " Ready for the next question?"
      : " That was your final question. Let me compile your results.";

    setPhase("feedback");
    const utter = speak(reaction + nextAction);
    // Don't auto-advance — let user click
  };

  const handleSkip = () => {
    stopSpeaking();
    stopRecording();
    const q = questions[currentIndex];
    setSessionResults(prev => [...prev, { question: q, answer: "(skipped)", feedback: null }]);
    moveNext();
  };

  const moveNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setCurrentAnswer("");
      setCurrentFeedback(null);
      askCurrentQuestion(currentIndex + 1);
    } else {
      finishInterview();
    }
  };

  const finishInterview = async () => {
    stopSpeaking();
    setPhase("thinking");
    const answered = sessionResults.filter(r => r.feedback);
    const avgScore = answered.length > 0 ? (answered.reduce((s, r) => s + (r.feedback?.score || 0), 0) / answered.length).toFixed(1) : 0;

    const summary = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a senior interview coach. Summarize this mock interview session for a ${jobRole} candidate.
Questions answered: ${answered.length}/${questions.length}
Average score: ${avgScore}/10
Answers summary: ${answered.map((r, i) => `Q${i + 1}: ${r.question.question} — Score: ${r.feedback?.score}/10`).join("\n")}

Provide:
1. A warm, encouraging overall assessment (2-3 sentences)
2. Top 3 strengths across all answers
3. Top 3 areas to improve
4. One key action item they should practice before their real interview`,
      response_json_schema: {
        type: "object",
        properties: {
          overall_assessment: { type: "string" },
          top_strengths: { type: "array", items: { type: "string" } },
          top_improvements: { type: "array", items: { type: "string" } },
          key_action_item: { type: "string" },
          final_score: { type: "number" },
        },
        required: ["overall_assessment", "top_strengths", "top_improvements"]
      }
    });

    setOverallFeedback({ ...summary, avgScore: parseFloat(avgScore) });
    setPhase("done");
    speak(`Your mock interview is complete. ${summary?.overall_assessment || "Great job today!"}`);
    if (onComplete) onComplete(sessionResults);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const progress = ((currentIndex + (phase === "done" ? 1 : 0)) / questions.length) * 100;

  // ── INTRO SCREEN ──────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center py-10 px-4">
        <div className="mb-8">
          <AIInterviewer isSpeaking={false} isListening={false} isThinking={false} />
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Voice Mock Interview
        </h2>
        <p className="text-slate-400 mb-2 leading-relaxed">
          Your AI interviewer will ask you <span className="text-violet-400 font-semibold">{questions.length} questions</span> for the <span className="text-white font-semibold">{jobRole}</span> role — out loud, just like a real interview.
        </p>
        <p className="text-slate-500 text-sm mb-8">Answer using your microphone. After each answer, you'll receive instant feedback on content, confidence, clarity, and body language coaching.</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Mic, label: "Voice Answers", desc: "Speak naturally", color: "text-violet-400 bg-violet-500/10" },
            { icon: Brain, label: "AI Evaluates", desc: "Real-time scoring", color: "text-cyan-400 bg-cyan-500/10" },
            { icon: Eye, label: "Body Language", desc: "Live coaching tips", color: "text-emerald-400 bg-emerald-500/10" },
          ].map(({ icon: Icon, label, desc, color }) => (
            <div key={label} className={`rounded-2xl border border-white/8 p-4 text-center ${color.split(" ")[1]}`}>
              <div className={`w-9 h-9 rounded-xl ${color.split(" ")[1]} flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-5 h-5 ${color.split(" ")[0]}`} />
              </div>
              <p className="text-white text-xs font-semibold">{label}</p>
              <p className="text-slate-500 text-[10px] mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={startInterview}
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-bold px-8 py-3 h-auto rounded-xl text-base shadow-xl shadow-violet-500/20">
            <Mic className="w-5 h-5 mr-2" /> Start Voice Interview
          </Button>
          <Button variant="outline" onClick={onExit}
            className="border-white/10 text-slate-400 hover:text-white h-auto rounded-xl px-6 py-3">
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
        </div>

        <p className="text-xs text-slate-600 mt-4">Allow microphone access when prompted · Works best in Chrome or Edge</p>
      </motion.div>
    );
  }

  // ── DONE SCREEN ───────────────────────────────────────────────────────────
  if (phase === "done" && overallFeedback) {
    const avgScore = overallFeedback.avgScore || 0;
    const scoreColor = avgScore >= 8 ? "text-emerald-400" : avgScore >= 6 ? "text-amber-400" : "text-red-400";
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Interview Complete! 🎉
          </h2>
          <p className="text-slate-400 text-sm">{jobRole} Mock Interview — Voice Session</p>
        </div>

        {/* Score */}
        <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-2xl p-6 mb-6 text-center">
          <p className="text-slate-400 text-sm mb-1">Overall Interview Score</p>
          <p className={`text-6xl font-extrabold ${scoreColor}`}>{avgScore}<span className="text-xl text-slate-500">/10</span></p>
          <div className="w-48 mx-auto bg-white/10 h-2 rounded-full mt-3">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(avgScore / 10) * 100}%` }} transition={{ duration: 1 }}
              className={`h-2 rounded-full ${avgScore >= 8 ? "bg-emerald-400" : avgScore >= 6 ? "bg-amber-400" : "bg-red-400"}`} />
          </div>
          <p className="text-slate-300 text-sm italic mt-4">{overallFeedback.overall_assessment}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {overallFeedback.top_strengths?.length > 0 && (
            <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4">
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5" /> Top Strengths
              </p>
              <ul className="space-y-2">
                {overallFeedback.top_strengths.map((s, i) => (
                  <li key={i} className="text-sm text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {overallFeedback.top_improvements?.length > 0 && (
            <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4">
              <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Areas to Improve
              </p>
              <ul className="space-y-2">
                {overallFeedback.top_improvements.map((s, i) => (
                  <li key={i} className="text-sm text-amber-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {overallFeedback.key_action_item && (
          <div className="bg-violet-500/8 border border-violet-500/20 rounded-xl p-4 mb-6">
            <p className="text-violet-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Key Action Before Your Real Interview
            </p>
            <p className="text-violet-300 text-sm">{overallFeedback.key_action_item}</p>
          </div>
        )}

        {/* Question breakdown */}
        <div className="bg-white/4 border border-white/8 rounded-xl p-4 mb-6">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Answer Breakdown</p>
          <div className="space-y-2">
            {sessionResults.map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-semibold flex items-center justify-center shrink-0">{i + 1}</span>
                <p className="text-slate-300 text-xs flex-1 truncate">{r.question.question}</p>
                {r.feedback ? (
                  <span className={`text-sm font-bold shrink-0 ${r.feedback.score >= 8 ? "text-emerald-400" : r.feedback.score >= 5 ? "text-amber-400" : "text-red-400"}`}>
                    {r.feedback.score}/10
                  </span>
                ) : <span className="text-slate-600 text-xs shrink-0">Skipped</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onExit} className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold h-11 rounded-xl">
            <RotateCcw className="w-4 h-4 mr-2" /> Practice Again
          </Button>
        </div>
      </motion.div>
    );
  }

  // ── MAIN INTERVIEW UI ─────────────────────────────────────────────────────
  const q = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">{jobRole}</span>
          <span className="text-xs text-slate-600">·</span>
          <span className="text-xs text-slate-500">Q{currentIndex + 1}/{questions.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(m => !m)}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => { stopSpeaking(); stopRecording(); onExit(); }}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/5 rounded-full h-1.5 mb-8">
        <motion.div className="bg-gradient-to-r from-violet-500 to-purple-600 h-1.5 rounded-full"
          animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: AI Interviewer + body language */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white/4 border border-white/8 rounded-2xl p-5 flex flex-col items-center">
            <AIInterviewer
              isSpeaking={phase === "speaking"}
              isListening={phase === "listening" || isRecording}
              isThinking={phase === "thinking"}
            />
            {phase === "listening" && !isRecording && (
              <p className="text-slate-500 text-xs mt-3 text-center">Tap the mic button to answer</p>
            )}
          </div>

          {/* Body Language Tips - Live Coaching */}
          <motion.div
            key={tipIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/8 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider">Live Body Language Coach</p>
            </div>
            <div className="flex items-start gap-2">
              <bodyLangTip.icon className={`w-4 h-4 ${bodyLangTip.color} mt-0.5 shrink-0`} />
              <p className="text-slate-300 text-xs leading-relaxed">{bodyLangTip.tip}</p>
            </div>
            <div className="flex gap-1 mt-3 justify-center">
              {BODY_LANGUAGE_TIPS.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${i === tipIndex ? "w-4 bg-cyan-400" : "w-1.5 bg-white/15"}`} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: Question + Interaction */}
        <div className="lg:col-span-2 space-y-4">
          {/* Question Card */}
          <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                q.difficulty === "hard" ? "bg-red-500/15 text-red-400 border-red-500/30" :
                q.difficulty === "medium" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" :
                "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              }`}>{q.difficulty}</span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-400">{q.type}</span>
              <span className="ml-auto text-xs text-slate-600">Q{currentIndex + 1} of {questions.length}</span>
            </div>

            <motion.p key={currentIndex} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="text-lg font-semibold text-white leading-snug">
              {q.question}
            </motion.p>

            {/* Waveform while speaking/listening */}
            {(phase === "speaking" || (phase === "listening" && isRecording)) && (
              <div className="mt-4">
                <WaveformBars active={true} color={phase === "speaking" ? "#6366f1" : "#34d399"} />
              </div>
            )}
          </div>

          {/* Recording Controls */}
          <AnimatePresence mode="wait">
            {(phase === "listening" || phase === "speaking") && !currentFeedback && (
              <motion.div key="recording" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-white/4 border border-white/8 rounded-2xl p-5">
                <div className="flex flex-col items-center gap-4">
                  {/* Big mic button */}
                  <motion.button
                    onClick={isRecording ? stopRecording : (phase === "listening" ? startRecording : undefined)}
                    disabled={phase === "speaking" || phase === "thinking"}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all ${
                      isRecording
                        ? "bg-red-500 shadow-red-500/40 animate-pulse"
                        : phase === "listening"
                        ? "bg-gradient-to-br from-violet-500 to-purple-700 shadow-violet-500/40 cursor-pointer"
                        : "bg-white/10 cursor-not-allowed opacity-40"
                    }`}
                  >
                    {isRecording ? <Square className="w-8 h-8 text-white fill-white" /> : <Mic className="w-9 h-9 text-white" />}
                  </motion.button>

                  {isRecording && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-ping" />
                      <span className="text-red-400 text-sm font-mono font-bold">{formatTime(recordingTime)}</span>
                      <span className="text-slate-500 text-xs">Recording...</span>
                    </motion.div>
                  )}

                  {phase === "listening" && !isRecording && (
                    <p className="text-slate-500 text-sm">Tap the mic to start your answer</p>
                  )}
                  {phase === "speaking" && (
                    <p className="text-slate-500 text-sm">AI is asking the question...</p>
                  )}

                  <div className="flex gap-3 w-full justify-center">
                    <button onClick={handleSkip}
                      className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/10">
                      <SkipForward className="w-3 h-3" /> Skip Question
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Thinking Spinner */}
            {phase === "thinking" && (
              <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white/4 border border-violet-500/20 rounded-2xl p-6 text-center">
                <Loader2 className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-3" />
                <p className="text-violet-300 font-semibold text-sm">Analyzing your answer...</p>
                <p className="text-slate-500 text-xs mt-1">Evaluating content, clarity, confidence & body language</p>
              </motion.div>
            )}

            {/* Feedback Panel */}
            {phase === "feedback" && currentFeedback && (
              <motion.div key="feedback" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-4">
                {/* Transcript */}
                {currentAnswer && (
                  <div className="bg-white/4 border border-white/8 rounded-xl p-4">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3" /> Your Answer (Transcript)
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed">{currentAnswer}</p>
                  </div>
                )}

                {/* Score */}
                <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">AI Score</p>
                    <span className={`text-3xl font-extrabold ${currentFeedback.score >= 8 ? "text-emerald-400" : currentFeedback.score >= 5 ? "text-amber-400" : "text-red-400"}`}>
                      {currentFeedback.score}<span className="text-base text-slate-500">/10</span>
                    </span>
                  </div>
                  {/* 3 Dimension mini-scores */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: "Content", score: currentFeedback.content_score, color: "text-cyan-400" },
                      { label: "Clarity", score: currentFeedback.clarity_score, color: "text-violet-400" },
                      { label: "Confidence", score: currentFeedback.confidence_score, color: "text-emerald-400" },
                    ].map(({ label, score, color }) => (
                      <div key={label} className="text-center bg-white/5 rounded-lg p-2">
                        <p className={`text-lg font-bold ${color}`}>{score ?? "—"}</p>
                        <p className="text-[10px] text-slate-500">{label}</p>
                      </div>
                    ))}
                  </div>
                  {currentFeedback.spoken_reaction && (
                    <p className="text-slate-300 text-sm italic border-t border-white/8 pt-3">
                      💬 "{currentFeedback.spoken_reaction}"
                    </p>
                  )}
                </div>

                {/* Body Language Feedback */}
                {currentFeedback.body_language_feedback && (
                  <div className="bg-cyan-500/8 border border-cyan-500/20 rounded-xl p-4">
                    <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" /> Body Language Feedback
                    </p>
                    <p className="text-cyan-300 text-sm leading-relaxed">{currentFeedback.body_language_feedback}</p>
                  </div>
                )}

                {/* Quick Tips */}
                {currentFeedback.quick_tips?.length > 0 && (
                  <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4">
                    <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Quick Improvement Tips
                    </p>
                    <ul className="space-y-2">
                      {currentFeedback.quick_tips.map((tip, i) => (
                        <li key={i} className="text-amber-300 text-sm flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5 shrink-0">→</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Model Snippet */}
                {currentFeedback.model_snippet && (
                  <div className="bg-violet-500/8 border border-violet-500/20 rounded-xl p-4">
                    <p className="text-violet-400 text-xs font-bold uppercase tracking-wider mb-2">Stronger Phrasing Example</p>
                    <p className="text-violet-300 text-sm italic">"{currentFeedback.model_snippet}"</p>
                  </div>
                )}

                {/* Next Button */}
                <Button onClick={moveNext}
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-bold h-12 rounded-xl text-base shadow-lg shadow-violet-500/20">
                  {currentIndex < questions.length - 1 ? (
                    <><ChevronRight className="w-5 h-5 mr-2" /> Next Question</>
                  ) : (
                    <><Trophy className="w-5 h-5 mr-2" /> See Final Results</>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}