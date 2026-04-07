import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Send, CheckCircle, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    try {
      await base44.integrations.Core.SendEmail({
        to: "contact@kindnesscommunityfoundation.com",
        subject: `Contact Form: ${formData.subject || "New Message"}`,
        body: `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error sending email:", error);
    }
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-emerald-500/20 border border-emerald-500/40 rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Message Sent!</h2>
          <p className="text-slate-400 mb-8">
            Thank you for reaching out. We'll get back to you as soon as possible.
          </p>
          <Button
            onClick={() => { setIsSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold hover:from-emerald-400 hover:to-cyan-400"
          >
            Send Another Message
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg">
      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
            <MessageSquare className="w-4 h-4" />
            Get In Touch
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Contact{" "}
            <span className="gradient-text-animated">Us</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            Have questions or need help? We'd love to hear from you. Reach out and our team will respond as soon as possible.
          </p>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm space-y-8">
              <h2 className="text-xl font-bold text-white">Contact Information</h2>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Email</p>
                  <a
                    href="mailto:contact@kindnesscommunityfoundation.com"
                    className="text-slate-200 hover:text-emerald-400 transition-colors break-all"
                  >
                    contact@kindnesscommunityfoundation.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Address</p>
                  <p className="text-slate-200">Newport Beach, California</p>
                  <p className="text-slate-200">USA 92660</p>
                </div>
              </div>
            </div>

            {/* Decorative card */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-8">
              <h3 className="font-semibold text-emerald-300 mb-3">🌍 Kindness Community Foundation</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                A California, USA company dedicated to empowering careers globally through AI-driven tools and community support.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-2">Send a Message</h2>
              <p className="text-slate-400 mb-8">Fill out the form below and we'll get back to you shortly.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="John Doe"
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-slate-300">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="What's this about?"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-300">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell us how we can help..."
                    rows={6}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-500/50 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold py-3 text-base disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}