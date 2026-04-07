import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock, Trophy, Share2, RotateCcw, CheckCircle, Users, Star, Flame } from "lucide-react";

export default function InterviewRoulette() {
  const [challenge, setChallenge] = useState(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [user, setUser] = useState(null);
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    loadChallenge();
    loadUser();
  }, []);

  useEffect(() => {
    if (!timerActive) return;
    if (timeLeft <= 0) { setTimerActive(false); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timerActive, timeLeft]);

  const loadUser = async () => {
    try {
      const authed = await base44.auth.isAuthenticated();
      if (authed) {
        const u = await base44.auth.me();
        setUser(u);
        const streaks = await base44.entities.CareerStreak.filter({ user_email: u.email });
        if (streaks.length > 0) setStreak(streaks[0]);

        // Check if already submitted today
        const today = new Date().toISOString().split('T')[0];
        const responses = await base44.entities.ChallengeResponse.filter({ user_email: u.email, challenge_date: today });
        if (responses.length > 0) {
          setAlreadySubmitted(true);
          setResult({ score: responses[0].ai_score, feedback: responses[0].ai_feedback });
          setResponse(responses[0].response_text);
        }
      }
    } catch (e) { console.error(e); }
  };

  const loadChallenge = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("dailyChallenge", {});
      setChallenge(res.data.challenge);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const startTimer = () => {
    setTimeLeft(60);
    setTimerActive(true);
  };

  const submitResponse = async () => {
    if (!response.trim() || !user) return;
    setSubmitting(true);
    try {
      const res = await base44.functions.invoke("submitChallengeResponse", {
        challengeId: challenge.id,
        question: challenge.question,
        responseText: response
      });
      setResult({ score: res.data.score, feedback: res.data.feedback });
      setAlreadySubmitted(true);
      // Refresh streak
      const streaks = await base44.entities.CareerStreak.filter({ user_email: user.email });
      if (streaks.length > 0) setStreak(streaks[0]);
    } catch (e) { console.error(e); }
    setSubmitting(false);
  };

  const difficultyColor = { easy: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", medium: "text-amber-400 border-amber-500/30 bg-amber-500/10", hard: "text-red-400 border-red-500/30 bg-red-500/10" };
  const scoreColor = (s) => s >= 80 ? "text-emerald-400" : s >= 60 ? "text-amber-400" : "text-red-400";

  return (
    <div className="min-h-screen bg-[#060b12] flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-4">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">Daily Challenge — Resets at Midnight</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Interview Roulette 🎯</h1>
            <p className="text-slate-400 max-w-2xl mx-auto mb-2">Answer today's interview question, get AI feedback, and compete with thousands of professionals building their interview skills.</p>
            <p className="text-slate-500 text-sm">Daily challenges help you master behavioral interview techniques, practice under pressure, and earn career points toward your professional goals.</p>

          {streak && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-orange-300 text-sm font-bold">{streak.current_streak} day streak</span>
              </div>
              <div className="flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1">
                <Star className="w-4 h-4 text-violet-400" />
                <span className="text-violet-300 text-sm font-bold">{streak.total_points} pts</span>
              </div>
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div key="question" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}>
                {/* Question Card */}
                <div className="bg-gradient-to-br from-white/5 to-white/2 border border-white/10 rounded-2xl p-8 mb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
                  <div className="flex items-center gap-3 mb-4">
                    {challenge?.category && <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/20">{challenge.category}</Badge>}
                    {challenge?.difficulty && <Badge className={difficultyColor[challenge.difficulty]}>{challenge.difficulty}</Badge>}
                    <div className="ml-auto flex items-center gap-1 text-slate-500 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{(challenge?.total_responses || 0) + 1} answered today</span>
                    </div>
                  </div>
                  <p className="text-xl text-white font-medium leading-relaxed">{challenge?.question}</p>
                </div>

                {/* Timer */}
                {!alreadySubmitted && (
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-400 text-sm">Take your time or challenge yourself with a 60-second timer</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={startTimer}
                      disabled={timerActive}
                      className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      {timerActive ? `${timeLeft}s` : "Start Timer"}
                    </Button>
                  </div>
                )}

                {timerActive && (
                  <div className="w-full bg-white/5 rounded-full h-1.5 mb-4">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all duration-1000"
                      style={{ width: `${(timeLeft / 60) * 100}%` }}
                    />
                  </div>
                )}

                {!alreadySubmitted ? (
                  <>
                    <Textarea
                      value={response}
                      onChange={e => setResponse(e.target.value)}
                      placeholder="Type your answer here... Use the STAR method (Situation, Task, Action, Result) for behavioral questions."
                      className="bg-white/5 border-white/10 text-white placeholder-slate-500 min-h-[160px] mb-4 focus:border-emerald-500/50 rounded-xl resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-sm">{response.length} characters</span>
                      <Button
                        onClick={submitResponse}
                        disabled={submitting || response.trim().length < 20 || !user}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold px-8"
                      >
                        {submitting ? (
                          <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Evaluating...</span>
                        ) : (
                          <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Submit & Get Score</span>
                        )}
                      </Button>
                    </div>
                    {!user && <p className="text-amber-400 text-sm mt-2 text-center">Sign in to submit and track your score</p>}
                  </>
                ) : (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-blue-300 font-medium">You've already completed today's challenge!</p>
                    <p className="text-slate-400 text-sm mt-1">Come back tomorrow for a new question.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Result */}
                <div className="bg-gradient-to-br from-white/5 to-white/2 border border-white/10 rounded-2xl p-8 mb-6 text-center">
                  <div className={`text-7xl font-black mb-2 ${scoreColor(result.score)}`}>{result.score}</div>
                  <p className="text-slate-400 mb-1">out of 100</p>
                  <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold mb-6 ${
                    result.score >= 80 ? "bg-emerald-500/15 text-emerald-300" :
                    result.score >= 60 ? "bg-amber-500/15 text-amber-300" :
                    "bg-red-500/15 text-red-300"
                  }`}>
                    <Trophy className="w-4 h-4" />
                    {result.score >= 80 ? "Excellent!" : result.score >= 60 ? "Good Answer!" : "Keep Practicing!"}
                  </div>

                  <div className="bg-white/5 rounded-xl p-5 text-left mb-6">
                    <p className="text-slate-300 text-sm font-medium mb-2">AI Feedback:</p>
                    <p className="text-white leading-relaxed">{result.feedback}</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-5 text-left mb-6">
                    <p className="text-slate-300 text-sm font-medium mb-2">Your Answer:</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{response}</p>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      className="border-white/10 text-slate-300 hover:bg-white/5"
                      onClick={() => { setResult(null); setResponse(""); setAlreadySubmitted(false); }}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-blue-500 to-violet-500 text-white font-bold"
                      onClick={() => {
                        const text = `I scored ${result.score}/100 on today's Interview Roulette challenge! 🎯 Practice your interview skills at KCF Resume Builder`;
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Score
                    </Button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                  <p className="text-emerald-300 font-medium">+15 Career Points Earned! 🔥</p>
                  <p className="text-slate-400 text-sm">Come back tomorrow for a new challenge to keep your streak going</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        </div>
        </div>

        {/* SEO Content Footer */}
        <div className="bg-white/3 border-t border-white/5 py-12 px-6">
        <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Level Up Your Interview Skills with Daily Practice</h2>
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>Interview Roulette is your daily interview challenge platform. Each day features a fresh behavioral, technical, or situational interview question that you can answer in 60 seconds or take your time to craft a thoughtful response.</p>
          <p>Our AI evaluates your answers using the same scoring rubric that top tech companies and leading organizations use. Get instant feedback on what you did well and areas for improvement. Compare your score to other job seekers and build a consistent daily habit to ace your next interview.</p>
          <p>With Interview Roulette, you're not just practicing — you're building the muscle memory, confidence, and communication skills that transform you from a good candidate into an unforgettable one.</p>
        </div>
        <p className="text-slate-500 text-xs text-center mt-6">Powered by AI Resume Builder · A free initiative by Kindness Community Foundation (KCF LLC) · Built to empower users with intelligent, real-time assistance and meaningful interaction.</p>
        </div>
      </div>
    </div>
  );
}