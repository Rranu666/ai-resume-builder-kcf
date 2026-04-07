import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Send, Bot, User, TrendingUp, RotateCcw } from "lucide-react";

export default function SalaryNegotiator() {
  const [stage, setStage] = useState("setup"); // setup | chat
  const [config, setConfig] = useState({ role: "", companySize: "mid-size", currentOffer: "", targetSalary: "" });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const startNegotiation = async () => {
    const intro = `Welcome! I'm the hiring manager for the ${config.role} position. After reviewing your application, we're pleased to offer you a salary of ${config.currentOffer}. What are your thoughts?`;
    setMessages([{ role: "assistant", content: intro }]);
    setStage("chat");
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);
    try {
      const res = await base44.functions.invoke("salaryNegotiation", {
        role: config.role,
        companySize: config.companySize,
        currentOffer: config.currentOffer,
        targetSalary: config.targetSalary,
        userMessage: input,
        conversationHistory: messages.map(m => ({ role: m.role, content: m.content }))
      });
      setMessages(prev => [...prev, { role: "assistant", content: res.data.response }]);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const companySizes = ["startup (10-50)", "small (50-200)", "mid-size (200-1000)", "large (1000-10000)", "enterprise (10000+)"];

  return (
    <div className="min-h-screen bg-[#060b12] flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-4">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-medium">AI Negotiation Coach</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Salary Negotiator 💰</h1>
            <p className="text-slate-400 max-w-2xl mx-auto mb-2">Practice salary negotiations with an AI HR manager. Build confidence, refine your strategy, and close bigger deals.</p>
            <p className="text-slate-500 text-sm">Realistic negotiation scenarios tailored to your role and company size. Get instant feedback on every counteroffer.</p>
          </motion.div>

        <AnimatePresence mode="wait">
          {stage === "setup" ? (
            <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white/4 border border-white/8 rounded-2xl p-8 space-y-5">
              <div>
                <label className="text-slate-300 text-sm font-medium mb-2 block">Role you're negotiating for</label>
                <Input value={config.role} onChange={e => setConfig(p => ({ ...p, role: e.target.value }))} placeholder="e.g. Senior Software Engineer" className="bg-white/5 border-white/10 text-white placeholder-slate-500" />
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium mb-2 block">Company Size</label>
                <select value={config.companySize} onChange={e => setConfig(p => ({ ...p, companySize: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-green-500/50">
                  {companySizes.map(s => <option key={s} value={s} style={{ background: "#0d1420" }}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">Their Offer</label>
                  <Input value={config.currentOffer} onChange={e => setConfig(p => ({ ...p, currentOffer: e.target.value }))} placeholder="e.g. $85,000" className="bg-white/5 border-white/10 text-white placeholder-slate-500" />
                </div>
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">Your Target</label>
                  <Input value={config.targetSalary} onChange={e => setConfig(p => ({ ...p, targetSalary: e.target.value }))} placeholder="e.g. $100,000" className="bg-white/5 border-white/10 text-white placeholder-slate-500" />
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <h4 className="text-blue-300 font-medium mb-2">💡 Tips for this simulation:</h4>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• Be confident but professional</li>
                  <li>• Use data: mention market rates, your unique value</li>
                  <li>• Don't accept the first offer immediately</li>
                  <li>• Ask for feedback after 3-4 exchanges</li>
                </ul>
              </div>

              <Button onClick={startNegotiation} disabled={!config.role || !config.currentOffer} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold h-12">
                <DollarSign className="w-5 h-5 mr-2" /> Start Negotiation Practice
              </Button>
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[600px] bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
              {/* Chat header */}
              <div className="p-4 border-b border-white/8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">HR Manager — {config.role}</p>
                    <p className="text-emerald-400 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" /> Offer: {config.currentOffer} · Your target: {config.targetSalary}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => { setStage("setup"); setMessages([]); }} className="text-slate-400 hover:text-white">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-blue-600" : "bg-gradient-to-br from-green-600 to-emerald-600"}`}>
                      {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                    </div>
                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white/8 text-slate-200 rounded-tl-sm"}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div>
                    <div className="bg-white/8 rounded-2xl rounded-tl-sm p-3 flex gap-1">
                      {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/8 flex gap-3">
                <Textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Respond as the candidate... (Enter to send)"
                  className="bg-white/5 border-white/10 text-white placeholder-slate-500 resize-none min-h-[44px] max-h-[100px] rounded-xl"
                  rows={1}
                />
                <Button onClick={sendMessage} disabled={loading || !input.trim()} className="bg-green-600 hover:bg-green-500 text-white px-4 self-end">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        {/* SEO Content Footer */}
        <div className="bg-white/3 border-t border-white/5 py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Master Salary Negotiation Without the Risk</h2>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>Salary negotiation is one of the highest-ROI career skills, yet most people avoid practicing because it feels uncomfortable or high-stakes. The Salary Negotiator removes that risk by letting you rehearse with an AI HR manager who responds realistically to your tactics.</p>
              <p>Practice in a safe environment: respond to offers, make counteroffers, justify your worth, and handle pushback. Our AI provides feedback after each exchange, helping you refine your approach, avoid emotional reactions, and close with confidence.</p>
              <p>Every negotiation follows realistic market dynamics for your role and company size. Walk into your real negotiation with a proven playbook.</p>
            </div>
            <p className="text-slate-500 text-xs text-center mt-6">Powered by AI Resume Builder · A free initiative by Kindness Community Foundation (KCF LLC) · Built to empower users with intelligent, real-time assistance and meaningful interaction.</p>
          </div>
        </div>
      </div>
    </div>
  );
}