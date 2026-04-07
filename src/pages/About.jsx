import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Target, Users, Sparkles, Award, Globe, Shield, Eye, Lightbulb, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AnimatedLogo from "@/components/common/AnimatedLogo";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">

      {/* ── Hero ── */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp(0)}>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-medium px-4 py-2 rounded-full mb-6 border border-green-200">
              <Heart className="w-4 h-4 text-red-500 fill-red-400" />
              An Initiative by KCF LLC
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              About Us —{" "}
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                AI Resume Builder
              </span>
            </h1>

            <p className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
              A Global Ecosystem Where Opportunity Meets Purpose
            </p>

            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              At AI Resume Builder — an initiative by KCF LLC, we believe the future of work is shaped by
              empowered individuals and compassionate innovation. Our mission is to help people unlock career
              opportunities through intelligent, AI-driven tools that simplify resume creation and elevate
              professional growth.
            </p>
          </motion.div>

          <motion.p {...fadeUp(0.15)} className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mt-4">
            We are building a global ecosystem where technology supports ambition, connects talent with
            opportunity, and scales impact through ethical and human-centered design.
          </motion.p>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="py-10 bg-white/70 backdrop-blur-sm border-y border-green-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50K+", label: "Resumes Created", icon: Award },
              { value: "120+", label: "Countries Reached", icon: Globe },
              { value: "98%", label: "ATS Pass Rate", icon: Target },
              { value: "4.9★", label: "User Rating", icon: Sparkles },
            ].map(({ value, label, icon: Icon }, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}>
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{value}</div>
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Vision ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp(0)}>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-5 border border-blue-100">
                <Eye className="w-4 h-4" />
                Our Vision
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Empowering Every Job Seeker, Everywhere
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We envision a world where every job seeker — regardless of background — has access to
                powerful tools that help them present their best self. By combining AI with purpose-driven
                innovation, we enable individuals to move forward with confidence and clarity.
              </p>
            </motion.div>

            <motion.div {...fadeUp(0.15)} className="grid grid-cols-2 gap-4">
              {[
                { icon: Lightbulb, title: "Purpose-Driven AI", desc: "Every feature is built with human benefit at its core.", color: "from-yellow-100 to-amber-100", iconColor: "text-amber-600" },
                { icon: Globe, title: "Global Reach", desc: "Serving job seekers across 120+ countries.", color: "from-blue-100 to-indigo-100", iconColor: "text-blue-600" },
                { icon: Shield, title: "Ethical by Design", desc: "Responsible AI use with transparent governance.", color: "from-green-100 to-emerald-100", iconColor: "text-green-600" },
                { icon: Users, title: "Community First", desc: "Built for people, powered by community insights.", color: "from-purple-100 to-pink-100", iconColor: "text-purple-600" },
              ].map(({ icon: Icon, title, desc, color, iconColor }, i) => (
                <div key={i} className={`bg-gradient-to-br ${color} rounded-2xl p-5 border border-white/60`}>
                  <Icon className={`w-6 h-6 ${iconColor} mb-3`} />
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Leadership ── */}
      <section className="py-20 px-6 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-medium px-4 py-2 rounded-full mb-4 border border-emerald-100">
              <Users className="w-4 h-4" />
              Leadership
            </div>
            <h2 className="text-4xl font-bold text-gray-900">Guided by Vision, Driven by Purpose</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Founder Card */}
            <motion.div {...fadeUp(0.1)}>
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 hover:shadow-xl transition-all duration-300 h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">Founder & Chief Visionary</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Mission-Driven Leadership</h3>
                  <p className="text-gray-600 leading-relaxed">
                    A mission-driven leader guiding KCF LLC toward scalable, global impact through ethical AI,
                    innovation, and community empowerment — building a future where technology serves humanity.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Advisory Card */}
            <motion.div {...fadeUp(0.2)}>
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 hover:shadow-xl transition-all duration-300 h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Advisory & Governance</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Global Expert Network</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our ecosystem is supported by a diverse network of global experts who ensure strategic
                    direction, ethical compliance, responsible AI use, and long-term sustainability.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Our Commitment ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-sm font-medium px-4 py-2 rounded-full mb-4 border border-orange-100">
              <Shield className="w-4 h-4" />
              Our Commitment
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Transparent. Accountable. Ethical.</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AI Resume Builder operates on the principles of trust, transparency, and measurable impact.
              Every feature, partnership, and decision is guided by ethical governance, legal compliance,
              and a commitment to empowering job seekers worldwide.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Transparent", desc: "We communicate openly about how our AI works, what data we use, and how decisions are made.", color: "from-green-500 to-emerald-600" },
              { icon: Target, title: "Accountable", desc: "We hold ourselves to the highest standards of performance and take responsibility for our impact.", color: "from-blue-500 to-indigo-600" },
              { icon: Heart, title: "Ethical", desc: "Human dignity, fairness, and inclusion are non-negotiable principles in everything we build.", color: "from-purple-500 to-pink-600" },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-7 shadow-md hover:shadow-xl transition-all duration-300 border border-white/60 text-center h-full">
                  <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Backed by Purpose ── */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-500 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-8 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-8 right-8 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp(0)}>
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/30">
              <Heart className="w-4 h-4 fill-white" />
              Backed by Purpose
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Kindness Community Foundation
            </h2>
            <p className="text-xl text-green-100 leading-relaxed mb-8 max-w-2xl mx-auto">
              As part of the broader vision of KCF LLC, we contribute to building sustainable systems that
              create meaningful, long-term community impact across the globe. Every resume built here
              is a step toward a more equitable world of work.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Dashboard")}>
                <Button size="lg" className="bg-white hover:bg-gray-50 text-green-700 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Building Your Resume
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button variant="outline" size="lg" className="border-2 border-white/40 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold transition-all duration-300">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}