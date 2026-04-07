import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Mic, MicOff, Sparkles, RotateCcw, ChevronDown,
  ExternalLink, Bot, User, Minimize2, Maximize2
} from "lucide-react";



const QUICK_PROMPTS = [
  "How do I create a resume?",
  "What is the ATS Scanner?",
  "How does Cover Letter AI work?",
  "Tell me about Interview Practice",
  "What templates are available?",
  "How do I improve my ATS score?",
];

const BOT_INTRO = {
  role: "bot",
  text: "👋 Hi! I'm **KCF Bot**, your AI assistant for the AI Resume Builder by Kindness Community Foundation.\n\nI can help you navigate the platform, answer questions, and guide you to the right tools. What can I help you with today?",
  ts: Date.now(),
};

function MessageBubble({ msg }) {
  const isBot = msg.role === "bot";
  // Simple markdown-ish rendering: bold, newlines
  const renderText = (text) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={j} className="font-semibold text-white">{part.slice(2, -2)}</strong>
              : <span key={j}>{part}</span>
          )}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}
    >
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
          <Bot className="w-3.5 h-3.5 text-black" />
        </div>
      )}
      <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
        isBot
          ? "bg-slate-800/80 border border-white/8 text-slate-300 rounded-tl-sm"
          : "bg-gradient-to-br from-emerald-600 to-cyan-600 text-white rounded-tr-sm shadow-md"
      }`}>
        {renderText(msg.text)}
        {msg.link && (
          <a href={msg.link} className="mt-2 flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
            <ExternalLink className="w-3 h-3" /> Go there
          </a>
        )}
      </div>
      {!isBot && (
        <div className="w-7 h-7 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <User className="w-3.5 h-3.5 text-slate-300" />
        </div>
      )}
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2.5 justify-start">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg">
        <Bot className="w-3.5 h-3.5 text-black" />
      </div>
      <div className="bg-slate-800/80 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.08 }}
          />
        ))}
      </div>
    </div>
  );
}

export default function KCFBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([BOT_INTRO]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;
    const userMsg = { role: "user", text: text.trim(), ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
      setMessages(prev => [...prev, { role: "bot", text: "Sorry, that took too long. Please try again.", ts: Date.now() }]);
    }, 15000);

    try {
      const history = messages.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n');
      const prompt = `You are KCF Bot, an AI assistant for the AI Resume Builder by Kindness Community Foundation (KCF LLC). Help users navigate the platform, answer questions about features (resume builder, ATS scanner, interview practice, cover letter AI, career roadmap, templates, job matching), and guide them to the right tools. Be concise and friendly.\n\nConversation so far:\n${history}\n\nUser: ${text.trim()}\n\nAssistant:`;

      const response = await fetch('/.netlify/functions/invoke-llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      const botReply = data?.text || "I'm here to help! Email contact@kindnesscommunityfoundation.com for assistance.";
      setMessages(prev => [...prev, { role: "bot", text: botReply, ts: Date.now() }]);
      if (!open) setUnread(u => u + 1);
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "Sorry, I ran into an issue. Please try again.", ts: Date.now() }]);
    } finally {
      clearTimeout(safetyTimer);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickPrompt = (prompt) => {
    sendMessage(prompt);
  };

  const handleReset = () => {
    setMessages([BOT_INTRO]);
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
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const showQuickPrompts = messages.length <= 2;

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => { setOpen(true); setMinimized(false); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-2xl shadow-emerald-500/40 flex items-center justify-center hover:scale-110 transition-transform duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{ display: open ? "none" : "flex" }}
        aria-label="Open KCF Bot"
      >
        <Bot className="w-7 h-7 text-black" />
        {unread > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-black flex items-center justify-center">
            {unread}
          </div>
        )}
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-[370px] max-w-[calc(100vw-24px)] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10"
            style={{ background: "linear-gradient(180deg, #0d1420 0%, #060b12 100%)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-600/20 to-cyan-600/10 border-b border-white/8">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-white text-sm">KCF Bot</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-medium">Online</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 truncate">AI Assistant · Kindness Community Foundation</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={handleReset} className="w-7 h-7 rounded-lg hover:bg-white/8 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors" title="Reset chat">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setMinimized(m => !m)} className="w-7 h-7 rounded-lg hover:bg-white/8 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors">
                  {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg hover:bg-white/8 flex items-center justify-center text-slate-500 hover:text-rose-400 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {!minimized && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  {/* Messages */}
                  <div className="h-[340px] overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
                    {messages.map((msg, i) => (
                      <MessageBubble key={i} msg={msg} />
                    ))}
                    {isLoading && <TypingIndicator />}
                    <div ref={bottomRef} />
                  </div>

                  {/* Quick Prompts */}
                  <AnimatePresence>
                    {showQuickPrompts && !isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="px-4 pb-2"
                      >
                        <p className="text-[10px] text-slate-600 mb-2 font-semibold uppercase tracking-wider">Quick questions</p>
                        <div className="flex flex-wrap gap-1.5">
                          {QUICK_PROMPTS.map(p => (
                            <button key={p} onClick={() => handleQuickPrompt(p)}
                              className="text-xs bg-slate-800/60 border border-white/8 text-slate-400 hover:text-emerald-300 hover:border-emerald-500/30 px-2.5 py-1 rounded-full transition-all">
                              {p}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Input */}
                  <div className="px-3 pb-3 pt-2 border-t border-white/5">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-slate-800/60 border border-white/10 rounded-xl px-3 py-2 focus-within:border-emerald-500/40 transition-colors">
                      <input
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask me anything…"
                        className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-600 focus:outline-none"
                        disabled={isLoading}
                      />
                      <button type="button" onClick={toggleVoice}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                          isListening ? "bg-red-500/20 text-red-400 animate-pulse" : "text-slate-500 hover:text-slate-300"
                        }`}>
                        {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      </button>
                      <button type="submit" disabled={!input.trim() || isLoading}
                        className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center disabled:opacity-40 transition-opacity flex-shrink-0 hover:from-emerald-400 hover:to-cyan-400">
                        <Send className="w-3.5 h-3.5 text-black" />
                      </button>
                    </form>
                    <p className="text-[10px] text-slate-700 text-center mt-1.5">
                      Free AI by <span className="text-emerald-600">KCF LLC</span> · Need more help? <a href="mailto:contact@kindnesscommunityfoundation.com" className="text-emerald-600 hover:text-emerald-500">Email us</a>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}