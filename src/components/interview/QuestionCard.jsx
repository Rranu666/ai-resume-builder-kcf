import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Lightbulb, CheckCircle2, Loader2, ThumbsUp, TrendingUp, RefreshCcw, ListChecks, Mic, Square, Play, Pause } from "lucide-react";

const DIFFICULTY_STYLES = {
  easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  hard: "bg-red-500/15 text-red-400 border-red-500/30",
};

const TYPE_STYLES = {
  behavioral: "bg-blue-500/15 text-blue-400",
  technical: "bg-violet-500/15 text-violet-400",
  situational: "bg-orange-500/15 text-orange-400",
  motivation: "bg-pink-500/15 text-pink-400",
  "culture fit": "bg-pink-500/15 text-pink-400",
  "resume-specific": "bg-teal-500/15 text-teal-400",
  leadership: "bg-amber-500/15 text-amber-400",
};

export default function QuestionCard({ question, index, total, onAnswerSubmit, jobRole }) {
  const [answer, setAnswer] = useState(question.answer || "");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(question.feedback || null);
  const [showTip, setShowTip] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  const handleGetFeedback = async () => {
    if (!answer.trim()) return;
    setIsEvaluating(true);
    try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a world-class interview coach evaluating a candidate's response for a ${jobRole} position.

Interview Question: "${question.question}"
Question Type: ${question.type}
Difficulty: ${question.difficulty}

Candidate's Answer:
"${answer}"

Provide detailed, honest, and encouraging feedback evaluating THREE key dimensions:

1. **CLARITY**: How clear and well-structured is the response? Is it easy to follow? Does it use specific examples?
2. **CONFIDENCE**: How confident does the candidate sound? Do they use assertive language? Any hedging or uncertainty?
3. **CONTENT QUALITY**: How relevant and substantive is the content? Does it directly address the question? Does it demonstrate relevant skills/experience?

Score strictly but fairly out of 10. Provide specific, actionable observations.`,
      response_json_schema: {
        type: "object",
        properties: {
          score: { type: "number", description: "Overall score out of 10 (be accurate and strict)" },
          overall: { type: "string", description: "One clear overall assessment sentence" },
          clarity_score: { type: "number", description: "Clarity score out of 10" },
          clarity_feedback: { type: "string", description: "Specific feedback on clarity" },
          confidence_score: { type: "number", description: "Confidence score out of 10" },
          confidence_feedback: { type: "string", description: "Specific feedback on confidence level" },
          content_score: { type: "number", description: "Content quality score out of 10" },
          content_feedback: { type: "string", description: "Specific feedback on content quality" },
          strengths: { type: "array", items: { type: "string" }, description: "2-3 specific, detailed strengths" },
          improvements: { type: "array", items: { type: "string" }, description: "2-3 actionable, specific improvements" },
          sample_phrase: { type: "string", description: "One strong example phrase or rephrasing to improve the answer" },
        },
        required: ["score", "overall", "clarity_score", "confidence_score", "content_score", "strengths", "improvements"],
      },
    });

    setFeedback(result);
    onAnswerSubmit(answer, result);
    } catch (err) {
      console.error("Feedback error:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsTranscribing(true);

        // Upload and transcribe
        const formData = new FormData();
        formData.append("file", blob, "recording.webm");
        
        try {
          const uploadResult = await base44.integrations.Core.UploadFile({ file: blob });
          const transcriptResult = await base44.integrations.Core.InvokeLLM({
            prompt: `Transcribe this interview answer audio. Provide only the raw transcript text, no commentary or formatting.`,
            file_urls: uploadResult.file_url,
            model: "gemini_3_flash"
          });
          setAnswer(transcriptResult);
        } catch (err) {
          console.error("Transcription error:", err);
        }

        setIsTranscribing(false);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Please allow microphone access to record audio answers.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleRetry = () => {
    setFeedback(null);
    setAnswer("");
    setAudioBlob(null);
    setAudioUrl(null);
    setShowTip(false);
    setShowOutline(false);
    if (audioRef.current) audioRef.current.src = "";
  };

  const scorePercent = feedback ? Math.round((feedback.score / 10) * 100) : 0;
  const scoreColor = feedback
    ? feedback.score >= 8 ? "text-emerald-400" : feedback.score >= 5 ? "text-amber-400" : "text-red-400"
    : "";
  const scoreBg = feedback
    ? feedback.score >= 8 ? "from-emerald-500/20 to-cyan-500/20 border-emerald-500/30"
    : feedback.score >= 5 ? "from-amber-500/20 to-orange-500/20 border-amber-500/30"
    : "from-red-500/20 to-rose-500/20 border-red-500/30"
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden"
    >
      {/* Card Header */}
      <div className="p-6 border-b border-white/6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 flex-wrap">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${DIFFICULTY_STYLES[question.difficulty] || "bg-white/10 text-slate-400 border-white/10"}`}>
              {question.difficulty}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${TYPE_STYLES[question.type?.toLowerCase()] || "bg-white/10 text-slate-400"}`}>
              {question.type}
            </span>
          </div>
          <span className="text-xs text-slate-600 font-medium">Q{index + 1} of {total}</span>
        </div>

        <h2 className="text-xl font-semibold text-white leading-snug mb-4">
          {question.question}
        </h2>

        {/* Helper Toggles */}
        <div className="flex gap-3 flex-wrap">
          {question.tip && (
            <button
              onClick={() => { setShowTip(v => !v); setShowOutline(false); }}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                showTip
                  ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
                  : "bg-white/5 border-white/10 text-slate-500 hover:text-amber-400 hover:border-amber-500/30"
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showTip ? "Hide Tip" : "Show Tip"}
            </button>
          )}
          {question.ideal_answer_outline?.length > 0 && (
            <button
              onClick={() => { setShowOutline(v => !v); setShowTip(false); }}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                showOutline
                  ? "bg-violet-500/20 border-violet-500/30 text-violet-400"
                  : "bg-white/5 border-white/10 text-slate-500 hover:text-violet-400 hover:border-violet-500/30"
              }`}
            >
              <ListChecks className="w-3.5 h-3.5" />
              {showOutline ? "Hide Outline" : "Ideal Answer Outline"}
            </button>
          )}
        </div>

        {/* Tip */}
        <AnimatePresence>
          {showTip && question.tip && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-300"
            >
              💡 <span className="font-semibold">Tip:</span> {question.tip}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ideal Answer Outline */}
        <AnimatePresence>
          {showOutline && question.ideal_answer_outline?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 bg-violet-500/10 border border-violet-500/20 rounded-xl p-4"
            >
              <p className="text-xs font-semibold text-violet-300 mb-2 flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5" /> Ideal Answer Should Include:
              </p>
              <ul className="space-y-1.5">
                {question.ideal_answer_outline.map((point, i) => (
                  <li key={i} className="text-sm text-violet-300 flex items-start gap-2">
                    <span className="text-violet-500 mt-0.5 shrink-0">•</span> {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-5">
        {!feedback ? (
          <>
            {/* Audio Recording Section */}
            <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold text-violet-300 mb-3 flex items-center gap-2">
                <Mic className="w-3.5 h-3.5" /> Record Your Answer
              </p>
              
              {!audioUrl ? (
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isEvaluating || isTranscribing}
                    className={`h-14 px-6 rounded-full font-bold text-base transition-all ${
                      isRecording
                        ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                        : "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white"
                    }`}
                  >
                    {isRecording ? (
                      <><Square className="w-5 h-5 mr-2 fill-current" /> Stop Recording</>
                    ) : (
                      <><Mic className="w-5 h-5 mr-2" /> Start Recording</>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onEnded={handleAudioEnded}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      className="hidden"
                    />
                    <Button
                      onClick={togglePlayback}
                      variant="outline"
                      size="sm"
                      className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <div className="flex-1 bg-violet-500/20 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-violet-500 to-purple-500 h-full"
                        animate={isPlaying ? { x: ["-100%", "100%"] } : {}}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                    <Button
                      onClick={() => { setAudioUrl(null); setAudioBlob(null); setAnswer(""); }}
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 hover:text-white"
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </Button>
                  </div>
                  {isTranscribing && (
                    <p className="text-xs text-violet-400 flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" /> Transcribing your audio...
                    </p>
                  )}
                </div>
              )}

              <p className="text-xs text-slate-500 mt-3 text-center">
                Speak naturally for 1-2 minutes. We'll transcribe it automatically.
              </p>
            </div>

            {/* Text Answer Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-400">
                  {audioUrl ? "Edit Transcript (optional)" : "Or Type Your Answer"}
                </label>
                <span className="text-xs text-slate-600">
                  {wordCount} words · {answer.length} chars
                </span>
              </div>
              <Textarea
                placeholder={audioUrl ? "Edit the transcribed text if needed..." : "Type your answer here... Be specific, use examples from your experience, and be concise."}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={audioUrl ? 5 : 7}
                disabled={isEvaluating || isTranscribing}
                className="bg-white/5 border-white/10 text-white placeholder-slate-600 text-sm resize-none focus:border-violet-500/50"
              />
              {wordCount > 0 && (
                <div className="flex items-center gap-3 mt-2">
                  {wordCount < 20 && <span className="text-xs text-amber-500">· Consider elaborating more</span>}
                  {wordCount >= 150 && <span className="text-xs text-emerald-500">· Great detail!</span>}
                </div>
              )}
            </div>

            <Button
              onClick={handleGetFeedback}
              disabled={!answer.trim() || isEvaluating || wordCount < 3}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-bold h-12 text-base shadow-lg shadow-violet-500/20 mt-4"
            >
              {isEvaluating ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Analyzing Your Answer...</>
              ) : (
                <><Sparkles className="w-5 h-5 mr-2" /> Get AI Feedback</>
              )}
            </Button>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {/* Your Answer Recap */}
            <div className="bg-white/4 border border-white/8 rounded-xl p-4">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Your Answer</p>
              <p className="text-sm text-slate-300 leading-relaxed">{answer}</p>
            </div>

            {/* Overall Score */}
            <div className={`bg-gradient-to-r ${scoreBg} border rounded-2xl p-5 mb-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 mb-1 font-medium">Overall AI Score</p>
                  <p className={`text-5xl font-bold ${scoreColor}`}>
                    {feedback.score}<span className="text-lg text-slate-500">/10</span>
                  </p>
                  <div className="w-32 bg-white/10 rounded-full h-1.5 mt-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${scorePercent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-1.5 rounded-full ${
                        feedback.score >= 8 ? "bg-emerald-400" : feedback.score >= 5 ? "bg-amber-400" : "bg-red-400"
                      }`}
                    />
                  </div>
                </div>
                <CheckCircle2 className={`w-12 h-12 ${scoreColor} opacity-60`} />
              </div>
              {feedback.overall && (
                <p className="text-sm text-slate-300 italic mt-4 pt-4 border-t border-white/10">
                  {feedback.overall}
                </p>
              )}
            </div>

            {/* Dimension Scores */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Clarity", score: feedback.clarity_score, max: 10, feedback: feedback.clarity_feedback, color: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/30", text: "text-blue-400" },
                { label: "Confidence", score: feedback.confidence_score, max: 10, feedback: feedback.confidence_feedback, color: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/30", text: "text-violet-400" },
                { label: "Content", score: feedback.content_score, max: 10, feedback: feedback.content_feedback, color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30", text: "text-emerald-400" },
              ].map(dim => {
                const dimPercent = Math.round((dim.score / dim.max) * 100);
                const dimColor = dim.score >= 8 ? "text-emerald-400" : dim.score >= 5 ? "text-amber-400" : "text-red-400";
                return (
                  <div key={dim.label} className={`bg-gradient-to-br ${dim.color} ${dim.border} border rounded-xl p-3`}>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{dim.label}</p>
                    <p className={`text-2xl font-bold ${dimColor}`}>{dim.score}<span className="text-xs text-slate-500">/10</span></p>
                    <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dimPercent}%` }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className={`h-1 rounded-full ${dimColor.replace("text", "bg")}`}
                      />
                    </div>
                    {dim.feedback && (
                      <p className="text-[10px] text-slate-400 mt-2 leading-tight line-clamp-2">{dim.feedback}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Strengths */}
            {feedback.strengths?.length > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                  <ThumbsUp className="w-3.5 h-3.5" /> Strengths
                </p>
                <ul className="space-y-2">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-emerald-300 flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5 shrink-0">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {feedback.improvements?.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                  <TrendingUp className="w-3.5 h-3.5" /> Areas to Improve
                </p>
                <ul className="space-y-2">
                  {feedback.improvements.map((imp, i) => (
                    <li key={i} className="text-sm text-amber-300 flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5 shrink-0">→</span> {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sample Phrase */}
            {feedback.sample_phrase && (
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                <p className="text-xs font-bold text-violet-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Suggested Phrasing
                </p>
                <p className="text-sm text-violet-300 italic leading-relaxed">"{feedback.sample_phrase}"</p>
              </div>
            )}

            <Button
              variant="outline"
              onClick={handleRetry}
              className="w-full border-white/10 text-slate-400 hover:text-white hover:bg-white/5 gap-2"
            >
              <RefreshCcw className="w-4 h-4" /> Try a Different Answer
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}