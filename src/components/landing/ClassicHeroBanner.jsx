import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Award, Globe } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useCallback } from "react";

function TiltResumeCard() {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 });

  const handleMouse = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);
  
  const handleLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      className="w-[300px] lg:w-[340px] relative cursor-pointer select-none"
    >
      <div className="absolute -inset-4 bg-gradient-to-br from-slate-400/15 via-slate-300/8 to-slate-500/15 rounded-3xl blur-2xl" />

      <div className="relative bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl border border-slate-500/20 p-6 shadow-2xl" style={{ boxShadow: "0 0 30px rgba(232,232,232,0.15)" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">JD</div>
          <div>
            <div className="h-3 w-24 bg-slate-600 rounded-full mb-1.5" />
            <div className="h-2 w-16 bg-emerald-500/40 rounded-full" />
          </div>
          <div className="ml-auto bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full">ATS 98%</div>
        </div>

        <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">Experience</div>
        <div className="space-y-1.5 mb-4">
          {[100, 85, 92].map((w, i) => (
            <div key={i} className="h-2 rounded-full bg-slate-700" style={{ width: `${w}%` }}>
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${w}%` }}
                transition={{ delay: 0.8 + i * 0.15, duration: 1, ease: "easeOut" }}
              />
            </div>
          ))}
        </div>

        <div className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-2">Skills</div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {["React", "Python", "AI/ML", "Node.js", "AWS"].map(s => (
            <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300">{s}</span>
          ))}
        </div>

        <div className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Education</div>
        <div className="space-y-1">
          {[80, 60].map((w, i) => (
            <div key={i} className="h-2 rounded-full bg-slate-700" style={{ width: `${w}%` }}>
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400"
                initial={{ width: 0 }}
                animate={{ width: `${w}%` }}
                transition={{ delay: 1.2 + i * 0.15, duration: 1, ease: "easeOut" }}
              />
            </div>
          ))}
        </div>

        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)" }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="absolute -top-4 -right-6 bg-gradient-to-r from-slate-200 to-slate-100 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
        animate={{ y: [-4, 4] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
        style={{ translateZ: 40, boxShadow: "0 0 20px rgba(232,232,232,0.3)" }}
      >
        ✦ AI Generated
      </motion.div>

      <motion.div
        className="absolute -bottom-4 -left-6 bg-gradient-to-r from-slate-300 to-slate-200 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
        animate={{ y: [4, -4] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
        style={{ translateZ: 40, boxShadow: "0 0 20px rgba(232,232,232,0.25)" }}
      >
        ⚡ Job Match 94%
      </motion.div>
    </motion.div>
  );
}

function Orb({ className, size = 400, delay = 0, style = {} }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      style={{ width: size, height: size, ...style }}
    />
  );
}

export default function ClassicHeroBanner() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(42,42,42,0.5) 0%, rgba(26,26,26,0.6) 50%, rgba(15,15,15,0.5) 100%)" }}>
      <Orb className="opacity-25 top-[-100px] left-[-100px]" size={450} delay={0} style={{ background: "rgba(232,232,232,0.1)" }} />
      <Orb className="opacity-20 bottom-[-80px] right-[-80px]" size={400} delay={2} style={{ background: "rgba(232,232,232,0.08)" }} />

      {[...Array(3)].map((_, i) => (
         <motion.div
           key={i}
           className="absolute rounded-full"
           style={{
             width: 2,
             height: 2,
             left: `${20 + i * 30}%`,
             top: `${30 + i * 20}%`,
             background: "rgba(232,232,232,0.2)",
           }}
           animate={{ y: [-10, 10] }}
           transition={{ duration: 4, repeat: Infinity, delay: i * 0.5, repeatType: "reverse" }}
         />
       ))}

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 py-24">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="space-y-6 text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-slate-600/20 border border-slate-400/30 px-4 py-2 rounded-full text-slate-300 text-sm font-medium"
          >
            ✦ #1 AI Resume Builder — an Initiative by KCF LLC
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Get Hired Faster<br />with AI Power!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-base text-slate-400 leading-relaxed max-w-lg mx-auto lg:mx-0"
          >
            Create ATS-optimized resumes in minutes. Generate tailored content, get real-time job matching, and choose from professionally designed templates that help you stand out.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-slate-400"
          >
            {[
              { icon: Users, label: "50K+ Users" },
              { icon: Award, label: "94% Success Rate" },
              { icon: Globe, label: "120+ Countries" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-emerald-400" />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="inline-block"
          >
            <Link to={createPageUrl("Templates")}>
              <Button size="lg" className="bg-gradient-to-r from-slate-200 to-slate-100 hover:from-white hover:to-slate-200 text-slate-900 font-bold px-8 py-4 rounded-xl text-base shadow-lg hover:shadow-slate-400/40 transition-all duration-300 group" style={{ boxShadow: "0 0 30px rgba(232,232,232,0.2)" }}>
                Make Your Free AI Resume Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          className="hidden lg:flex items-center justify-center"
        >
          <TiltResumeCard />
        </motion.div>
      </div>
    </section>
  );
}