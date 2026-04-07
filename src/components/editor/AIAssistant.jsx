import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Mic, MicOff, Send, Wand2, Target, Lightbulb, MessageSquare, StopCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIAssistant({ resume, onUpdateResume }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your AI resume coach. You can chat with me or use the mic 🎤 to talk. Ask me to improve your summary, generate bullet points, optimize for a job, or just describe your background and I'll update your resume!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Voice Input ──
  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      addMessage("assistant", "⚠ Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const addMessage = (role, text) => {
    setMessages(prev => [...prev, { role, text }]);
  };

  // ── Send message to AI ──
  const sendMessage = async (text = input) => {
    const msg = text.trim();
    if (!msg) return;
    setInput("");
    addMessage("user", msg);
    setIsThinking(true);
    setSuggestions([]);

    try {
      const resumeContext = JSON.stringify({
        name: resume.personal_info?.full_name,
        summary: resume.personal_info?.summary,
        skills: resume.skills,
        experience: resume.experience?.map(e => ({ title: e.title, company: e.company, bullets: e.bullets })),
        education: resume.education?.map(e => ({ degree: e.degree, institution: e.institution })),
        projects: resume.projects?.map(p => p.name),
      });

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert AI resume coach. The user is editing their resume.

Current Resume Data:
${resumeContext}

User message: "${msg}"

Respond helpfully. If the user describes their background, experience, or asks you to generate/improve content:
- Update the resume fields as needed
- Return an action with specific resume updates
- Also reply in a friendly, encouraging conversational tone

If the user asks to:
- "improve summary" / "write summary" → generate a new professional summary
- "generate bullets" for a job → generate 3-4 strong bullet points
- "add skills" / "what skills should I add" → suggest relevant skills
- "optimize for [job]" → give targeted keyword/optimization advice
- Describe their background conversationally → extract and structure data

Always respond with both a friendly message AND specific updates when applicable.`,
        response_json_schema: {
          type: "object",
          properties: {
            reply: { type: "string" },
            action: {
              type: "string",
              enum: ["none", "update_summary", "update_bullets", "add_skills", "suggest_keywords", "full_update"],
            },
            new_summary: { type: "string" },
            experience_index: { type: "number" },
            new_bullets: { type: "array", items: { type: "string" } },
            skills_to_add: { type: "array", items: { type: "string" } },
            keywords: { type: "array", items: { type: "string" } },
            suggestions_list: { type: "array", items: { type: "string" } },
          },
        },
      });

      addMessage("assistant", response.reply || "Done! Let me know if you'd like any other changes.");

      // Apply AI updates to resume
      const updated = { ...resume };
      let changed = false;

      if (response.action === "update_summary" && response.new_summary) {
        updated.personal_info = { ...updated.personal_info, summary: response.new_summary };
        changed = true;
      }
      if (response.action === "update_bullets" && response.new_bullets?.length) {
        const idx = response.experience_index ?? 0;
        const exp = [...(updated.experience || [])];
        if (exp[idx]) { exp[idx] = { ...exp[idx], bullets: response.new_bullets }; updated.experience = exp; changed = true; }
      }
      if (response.action === "add_skills" && response.skills_to_add?.length) {
        const existing = updated.skills || [];
        updated.skills = [...new Set([...existing, ...response.skills_to_add])];
        setSuggestions(response.skills_to_add.map(s => ({ type: "skill", label: s })));
        changed = true;
      }
      if (response.action === "suggest_keywords" && response.keywords?.length) {
        setSuggestions(response.keywords.map(k => ({ type: "keyword", label: k })));
      }
      if (response.suggestions_list?.length) {
        setSuggestions(response.suggestions_list.map(s => ({ type: "tip", label: s })));
      }

      if (changed) onUpdateResume(updated);
    } catch (e) {
      addMessage("assistant", "Sorry, something went wrong. Please try again.");
    }
    setIsThinking(false);
  };

  const quickPrompts = [
    "Improve my professional summary",
    "Generate bullets for my latest job",
    "What skills should I add?",
    "Make my resume ATS-friendly",
  ];

  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-gradient-to-r from-violet-500/10 to-purple-500/10">
        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">AI Resume Coach</p>
          <p className="text-violet-400 text-xs">Chat or speak to refine your resume</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs text-emerald-400">Live</span>
        </div>
      </div>

      {/* Chat messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3 flex-1">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-medium rounded-br-sm"
                  : "bg-white/8 border border-white/10 text-slate-300 rounded-bl-sm"
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isThinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white/8 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                {[0, 0.15, 0.3].map((delay, i) => (
                  <motion.span key={i} className="w-1.5 h-1.5 bg-violet-400 rounded-full"
                    animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions chips */}
      {suggestions.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s, i) => (
            <span key={i} className={`text-xs px-2.5 py-1 rounded-full border font-medium cursor-default ${
              s.type === "skill" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" :
              s.type === "keyword" ? "bg-blue-500/15 border-blue-500/30 text-blue-300" :
              "bg-amber-500/15 border-amber-500/30 text-amber-300"
            }`}>
              {s.type === "skill" ? "✓ " : s.type === "keyword" ? "🔑 " : "💡 "}{s.label}
            </span>
          ))}
        </div>
      )}

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {quickPrompts.map((p, i) => (
            <button key={i} onClick={() => sendMessage(p)}
              className="text-xs bg-violet-500/10 border border-violet-500/20 text-violet-300 hover:bg-violet-500/20 px-2.5 py-1 rounded-full transition-colors">
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-white/5">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Chat with AI or click 🎤 to speak..."
            rows={2}
            className="flex-1 bg-white/5 border-white/10 text-white placeholder-slate-600 text-sm resize-none"
          />
          <div className="flex flex-col gap-1.5">
            <Button
              size="icon"
              onClick={isListening ? stopVoice : startVoice}
              className={`w-9 h-9 rounded-xl ${
                isListening
                  ? "bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/30"
                  : "bg-white/10 hover:bg-white/15 border border-white/15"
              }`}
            >
              {isListening ? <StopCircle className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-slate-300" />}
            </Button>
            <Button
              size="icon"
              onClick={() => sendMessage()}
              disabled={!input.trim() || isThinking}
              className="w-9 h-9 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/20"
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
        {isListening && (
          <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" /> Listening... speak now
          </p>
        )}
      </div>
    </div>
  );
}