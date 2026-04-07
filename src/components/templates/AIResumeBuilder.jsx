import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Sparkles, Mic, MicOff, Send, Bot, User, RotateCcw, ChevronRight, Loader2, CheckCircle2, FileText, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

const STEPS = [
  "Understanding your background...",
  "Crafting your experience bullets...",
  "Optimizing skills for ATS...",
  "Writing professional summary...",
  "Generating final resume...",
];

const QUICK_STARTERS = [
  "I'm a software engineer with 5 years experience in React and Node.js",
  "I'm a recent graduate in Marketing looking for my first job",
  "I'm a nurse with 8 years in emergency care",
  "I'm a project manager transitioning to product management",
  "I'm a teacher wanting to move into corporate training",
  "I'm a sales executive with $5M+ quota experience",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="w-2 h-2 rounded-full bg-emerald-400"
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function AIResumeBuilder({ templates, onResumeCreated }) {
  const [phase, setPhase] = useState("intro"); // intro | chat | generating | done
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(0);
  const [generatedResume, setGeneratedResume] = useState(null);
  const [chosenTemplate, setChosenTemplate] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const stepsIntervalRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const startChat = () => {
    setPhase("chat");
    setMessages([{
      role: "bot",
      text: "Hi! I'm your AI Resume Builder 🎉\n\nJust tell me about yourself — your job title, years of experience, key skills, and what kind of role you're targeting. You can speak or type, and I'll handle everything else!\n\nFor example: *\"I'm a software engineer with 5 years at startups, expert in React, Node.js and AWS, looking for a senior engineer role at a tech company.\"*",
    }]);
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;
    const userMsg = { role: "user", text: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Check if we have enough info to generate
    const history = newMessages.map(m => `${m.role === "bot" ? "Assistant" : "User"}: ${m.text}`).join("\n");
    
    const analysisPrompt = `You are an AI resume builder assistant. 
Based on this conversation, determine if you have enough information to build a complete resume.
Conversation:
${history}

Required info: name (optional), job title/field, at least some experience or background, target role.
If you have enough info, respond with JSON: {"ready": true, "summary": "brief of what you know"}
If not, ask ONE specific follow-up question as JSON: {"ready": false, "question": "your question here"}
Only output valid JSON, nothing else.`;

    try {
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: analysisPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            ready: { type: "boolean" },
            summary: { type: "string" },
            question: { type: "string" },
          },
          required: ["ready"]
        }
      });

      if (analysis.ready) {
        setMessages(prev => [...prev, { role: "bot", text: "Perfect! I have everything I need. Let me build your professional resume now... 🚀" }]);
        setIsLoading(false);
        setTimeout(() => generateResume(history), 800);
      } else {
        const botReply = analysis.question || "Could you tell me a bit more about your experience?";
        setMessages(prev => [...prev, { role: "bot", text: botReply }]);
        setIsLoading(false);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "Tell me more about your target role and key skills!" }]);
      setIsLoading(false);
    }
  };

  const generateResume = async (conversationHistory) => {
    setPhase("generating");
    setGeneratingStep(0);

    stepsIntervalRef.current = setInterval(() => {
      setGeneratingStep(prev => {
        if (prev >= STEPS.length - 1) {
          clearInterval(stepsIntervalRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, 1800);

    const prompt = `You are an expert resume writer and career coach. Based on this conversation, create a complete, professional, ATS-optimized resume.

Conversation:
${conversationHistory}

Generate a full, realistic resume with:
- Professional summary (3-4 sentences, keyword-rich, ATS-friendly)
- 2-3 experience entries with strong action-verb bullet points with metrics/numbers where possible
- 2 education entries (infer reasonable ones if not stated)
- 8-10 relevant technical and soft skills
- 1-2 relevant projects
- Suggest the best template from: modern, creative, executive, minimal, tech, startup, healthcare, academic, finance, designer, compact, infographic, glass, neon, bold_split, timeline, elegant, gradient_hero, two_tone, photo_card

Make the resume compelling, specific, and tailored to the target role. Use strong action verbs. Include metrics. Make it look real and impressive.`;

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            suggested_template: { type: "string" },
            title: { type: "string" },
            personal_info: {
              type: "object",
              properties: {
                full_name: { type: "string" },
                email: { type: "string" },
                phone: { type: "string" },
                location: { type: "string" },
                linkedin: { type: "string" },
                summary: { type: "string" },
              }
            },
            experience: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  company: { type: "string" },
                  location: { type: "string" },
                  start_date: { type: "string" },
                  end_date: { type: "string" },
                  current: { type: "boolean" },
                  bullets: { type: "array", items: { type: "string" } }
                }
              }
            },
            education: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  degree: { type: "string" },
                  institution: { type: "string" },
                  graduation_year: { type: "string" },
                  gpa: { type: "string" }
                }
              }
            },
            skills: { type: "array", items: { type: "string" } },
            projects: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  technologies: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      });

      clearInterval(stepsIntervalRef.current);
      setGeneratingStep(STEPS.length - 1);

      // Save to DB
      const template = result.suggested_template || "modern";
      const resume = await base44.entities.Resume.create({
        title: result.title || `My AI Resume`,
        template,
        personal_info: result.personal_info || {},
        experience: result.experience || [],
        education: result.education || [],
        skills: result.skills || [],
        projects: result.projects || [],
        ats_score: 0,
      });

      setTimeout(() => {
        setGeneratedResume({ ...resume, suggested_template: template });
        setChosenTemplate(templates.find(t => t.id === template) || templates[0]);
        setPhase("done");
        if (onResumeCreated) onResumeCreated(resume);
      }, 1000);

    } catch (err) {
      clearInterval(stepsIntervalRef.current);
      setPhase("chat");
      setMessages(prev => [...prev, { role: "bot", text: "Sorry, something went wrong. Please try again!" }]);
    }
  };

  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice input is not supported in your browser. Please try Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const handleReset = () => {
    setPhase("intro");
    setMessages([]);
    setInput("");
    setGeneratedResume(null);
    setChosenTemplate(null);
  };

  // INTRO
  if (phase === "intro") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-emerald-500/20 shadow-2xl shadow-emerald-500/10"
        style={{ background: "linear-gradient(135deg, #031a0e 0%, #050f18 60%, #060b12 100%)" }}
      >
        {/* Background glow */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider mb-5">
                <Wand2 className="w-3.5 h-3.5" />
                AI Resume Builder — Zero Effort
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Just Talk.<br />
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  We Build Your Resume.
                </span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-6 max-w-lg">
                No forms. No hard work. Just describe yourself — by typing or speaking — and our AI will generate a complete, professional, ATS-optimized resume in seconds.
              </p>
              <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
                {[
                  { icon: "🎙️", text: "Voice or text input" },
                  { icon: "🤖", text: "AI writes everything" },
                  { icon: "⚡", text: "Ready in 30 seconds" },
                  { icon: "✏️", text: "Fully editable after" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                    {icon} {text}
                  </div>
                ))}
              </div>
              <Button
                onClick={startChat}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-black text-base px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/30 hover:from-emerald-400 hover:to-cyan-400 h-auto"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Build My Resume with AI
              </Button>
            </div>

            {/* Right: quick starters */}
            <div className="flex-shrink-0 w-full lg:w-80">
              <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-3 text-center lg:text-left">Try one of these to start:</p>
              <div className="space-y-2">
                {QUICK_STARTERS.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => { startChat(); setTimeout(() => sendMessage(s), 600); }}
                    className="w-full text-left text-xs text-slate-300 bg-white/4 border border-white/8 hover:border-emerald-500/40 hover:bg-emerald-500/8 px-4 py-3 rounded-xl transition-all duration-200 group flex items-center gap-2"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // GENERATING
  if (phase === "generating") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-3xl border border-white/8 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #031a0e 0%, #060b12 100%)" }}
      >
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
              <Wand2 className="w-10 h-10 text-black" />
            </div>
            <div className="absolute inset-0 rounded-3xl bg-emerald-500/30 animate-ping" />
          </div>
          <h3 className="text-2xl font-extrabold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Building Your Resume...
          </h3>
          <p className="text-slate-400 text-sm mb-10">Our AI is crafting a professional, ATS-optimized resume just for you</p>
          <div className="w-full max-w-md space-y-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: i <= generatingStep ? 1 : 0.25, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 text-sm"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  i < generatingStep ? "bg-emerald-500" : i === generatingStep ? "bg-emerald-500/40 border border-emerald-500" : "bg-white/5 border border-white/10"
                }`}>
                  {i < generatingStep ? (
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  ) : i === generatingStep ? (
                    <Loader2 className="w-3 h-3 text-emerald-400 animate-spin" />
                  ) : null}
                </div>
                <span className={i <= generatingStep ? "text-white" : "text-slate-600"}>{step}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // DONE
  if (phase === "done" && generatedResume) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-emerald-500/30 overflow-hidden shadow-2xl shadow-emerald-500/20"
        style={{ background: "linear-gradient(135deg, #031a0e 0%, #060b12 100%)" }}
      >
        <div className="p-8 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-emerald-500/40">
            <CheckCircle2 className="w-8 h-8 text-black" />
          </motion.div>
          <h3 className="text-2xl font-extrabold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Your Resume is Ready! 🎉
          </h3>
          <p className="text-slate-400 text-sm mb-2">
            Created with the <span className="text-emerald-400 font-semibold capitalize">{chosenTemplate?.name || generatedResume.template}</span> template
          </p>
          <p className="text-slate-500 text-xs mb-8">You can now open the editor to fine-tune, add more details, or switch templates.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={createPageUrl(`Editor?id=${generatedResume.id}`)}>
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-black text-sm px-6 py-3 rounded-xl h-auto w-full sm:w-auto">
                <FileText className="w-4 h-4 mr-2" />
                Open & Edit Resume
              </Button>
            </a>
            <Button variant="outline" onClick={handleReset} className="border-white/15 text-slate-300 hover:text-white text-sm rounded-xl h-auto w-full sm:w-auto">
              <RotateCcw className="w-4 h-4 mr-2" />
              Build Another
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  // CHAT
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/8 overflow-hidden shadow-2xl"
      style={{ background: "linear-gradient(180deg, #0d1420 0%, #060b12 100%)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/6" style={{ background: "rgba(52,211,153,0.05)" }}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg">
          <Wand2 className="w-5 h-5 text-black" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-white text-sm">AI Resume Builder</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-medium">Tell me about yourself and I'll build your resume</span>
          </div>
        </div>
        <button onClick={handleReset} className="w-7 h-7 rounded-lg hover:bg-white/8 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors" title="Start over">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div className="h-72 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((msg, i) => {
          const isBot = msg.role === "bot";
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}>
              {isBot && <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5"><Bot className="w-3.5 h-3.5 text-black" /></div>}
              <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isBot ? "bg-slate-800/70 border border-white/8 text-slate-300 rounded-tl-sm" : "bg-gradient-to-br from-emerald-600 to-cyan-600 text-white rounded-tr-sm"}`}>
                {msg.text.split("\n").map((line, li) => {
                  const parts = line.split(/(\*[^*]+\*)/g);
                  return <span key={li}>{parts.map((p, pi) => p.startsWith("*") && p.endsWith("*") ? <em key={pi} className="text-emerald-300 not-italic font-medium">{p.slice(1, -1)}</em> : <span key={pi}>{p}</span>)}{li < msg.text.split("\n").length - 1 && <br />}</span>;
                })}
              </div>
              {!isBot && <div className="w-7 h-7 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5"><User className="w-3.5 h-3.5 text-slate-300" /></div>}
            </motion.div>
          );
        })}
        {isLoading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0"><Bot className="w-3.5 h-3.5 text-black" /></div>
            <div className="bg-slate-800/70 border border-white/8 rounded-2xl rounded-tl-sm"><TypingDots /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-white/5">
        <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex items-center gap-2 bg-slate-800/60 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-emerald-500/40 transition-colors">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Tell me about your experience and goals…"
            className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-600 focus:outline-none"
            disabled={isLoading}
          />
          <button type="button" onClick={toggleVoice}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${isListening ? "bg-red-500/20 text-red-400 animate-pulse" : "text-slate-500 hover:text-slate-300"}`}>
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
          <button type="submit" disabled={!input.trim() || isLoading}
            className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center disabled:opacity-40 flex-shrink-0 hover:from-emerald-400 hover:to-cyan-400">
            <Send className="w-3.5 h-3.5 text-black" />
          </button>
        </form>
        <p className="text-[10px] text-slate-700 text-center mt-1.5">AI by <span className="text-emerald-700">KCF LLC</span> · Free forever · Your data is private</p>
      </div>
    </motion.div>
  );
}