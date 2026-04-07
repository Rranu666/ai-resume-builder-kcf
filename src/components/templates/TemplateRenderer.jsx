import React from "react";

// Shared sample data for all previews
export const sampleData = {
  personal_info: {
    full_name: "Alexandra Chen",
    email: "alex.chen@email.com",
    phone: "+1 (415) 555-0192",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexchen",
    website: "alexchen.dev",
    summary: "Results-driven Senior Product Manager with 7+ years building user-centric software products. Led cross-functional teams to deliver features used by 5M+ users, driving 32% revenue growth. Passionate about data-informed decisions and inclusive design.",
  },
  experience: [
    {
      title: "Senior Product Manager",
      company: "Horizon Tech",
      location: "San Francisco, CA",
      start_date: "Jan 2022", end_date: "", current: true,
      bullets: [
        "Owned end-to-end roadmap for a SaaS analytics platform — grew ARR from $8M to $21M",
        "Led a 12-person cross-functional team through 3 major product releases on time & budget",
        "Reduced customer churn by 18% by implementing a proactive onboarding program",
      ],
    },
    {
      title: "Product Manager",
      company: "Nova Digital",
      location: "Austin, TX",
      start_date: "Mar 2019", end_date: "Dec 2021", current: false,
      bullets: [
        "Launched mobile app reaching 500K downloads within 6 months of release",
        "Defined and tracked KPIs leading to a 40% improvement in user retention",
      ],
    },
  ],
  education: [
    { degree: "MBA, Product & Strategy", institution: "UC Berkeley Haas", graduation_year: "2019", gpa: "3.9/4.0" },
    { degree: "B.S. Computer Science", institution: "UCLA", graduation_year: "2017", gpa: "" },
  ],
  skills: ["Product Strategy", "Agile / Scrum", "SQL & Analytics", "Figma", "Roadmapping", "Stakeholder Management", "A/B Testing", "Python"],
  projects: [
    { name: "OpenMetrics — Open-source Dashboard", description: "Built a real-time analytics dashboard with 2K+ GitHub stars, used by 300+ companies.", technologies: ["React", "D3.js", "Node.js", "PostgreSQL"], link: "github.com/alexchen/openmetrics" },
  ],
};

function SectionHeading({ label, accent, style = "bar" }) {
  if (style === "bar") return (
    <div className="flex items-center gap-3 mb-3">
      <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: accent }}>{label}</h2>
      <div className="flex-1 h-px" style={{ backgroundColor: `${accent}40` }} />
    </div>
  );
  if (style === "underline") return (
    <h2 className="text-sm font-bold pb-1 mb-3 border-b-2" style={{ color: accent, borderColor: accent }}>{label}</h2>
  );
  if (style === "filled") return (
    <h2 className="text-xs font-bold tracking-widest uppercase text-white px-3 py-1 rounded mb-3 inline-block" style={{ backgroundColor: accent }}>{label}</h2>
  );
  if (style === "side") return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-5 rounded-full" style={{ backgroundColor: accent }} />
      <h2 className="text-sm font-bold" style={{ color: accent }}>{label}</h2>
    </div>
  );
  return <h2 className="text-sm font-bold mb-3" style={{ color: accent }}>{label}</h2>;
}

// 1. MODERN
function ModernTemplate({ data }) {
  const pi = data.personal_info;
  return (
    <div className="bg-white min-h-full font-sans text-[11px] leading-relaxed" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="px-8 py-6 border-b-2 border-emerald-500">
        <h1 className="text-2xl font-extrabold text-gray-900">{pi.full_name}</h1>
        <p className="text-emerald-600 text-xs font-semibold mt-0.5">{data.experience[0]?.title}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-gray-500 text-[10px]">
          {[pi.email, pi.phone, pi.location, pi.linkedin].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
        </div>
      </div>
      <div className="px-8 py-5 space-y-4">
        {pi.summary && <div><SectionHeading label="Summary" accent="#34d399" style="bar" /><p className="text-gray-600">{pi.summary}</p></div>}
        <div>
          <SectionHeading label="Experience" accent="#34d399" style="bar" />
          {data.experience.map((e, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between"><span className="font-bold text-gray-800">{e.title}</span><span className="text-gray-400">{e.start_date} – {e.current ? "Present" : e.end_date}</span></div>
              <p className="text-emerald-600 font-medium">{e.company} · {e.location}</p>
              <ul className="list-disc list-inside text-gray-600 mt-1 space-y-0.5">{e.bullets.map((b, bi) => <li key={bi}>{b}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <SectionHeading label="Education" accent="#34d399" style="bar" />
            {data.education.map((e, i) => <div key={i} className="mb-2"><p className="font-bold text-gray-800">{e.degree}</p><p className="text-gray-500">{e.institution} · {e.graduation_year}</p></div>)}
          </div>
          <div>
            <SectionHeading label="Skills" accent="#34d399" style="bar" />
            <div className="flex flex-wrap gap-1">{data.skills.map((s, i) => <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full">{s}</span>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. CREATIVE
function CreativeTemplate({ data }) {
  const pi = data.personal_info;
  return (
    <div className="bg-white min-h-full font-sans text-[11px] flex" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="w-2/5 bg-amber-500 text-white p-5 flex-shrink-0">
        <div className="mb-5">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-black mb-3">{pi.full_name?.charAt(0)}</div>
          <h1 className="text-base font-extrabold leading-tight">{pi.full_name}</h1>
          <p className="text-amber-100 text-[10px] mt-1">{data.experience[0]?.title}</p>
        </div>
        <div className="mb-5 space-y-1 text-[10px] text-amber-100"><p>{pi.email}</p><p>{pi.phone}</p><p>{pi.location}</p><p>{pi.linkedin}</p></div>
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/30 pb-1 mb-2">Skills</h2>
          <div className="space-y-1">{data.skills.map((s, i) => <div key={i} className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white/60 flex-shrink-0" /><span className="text-amber-100 text-[10px]">{s}</span></div>)}</div>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/30 pb-1 mb-2">Education</h2>
          {data.education.map((e, i) => <div key={i} className="mb-2"><p className="font-semibold text-[10px]">{e.degree}</p><p className="text-amber-200 text-[10px]">{e.institution} · {e.graduation_year}</p></div>)}
        </div>
      </div>
      <div className="flex-1 p-5 space-y-4">
        {pi.summary && <div><SectionHeading label="About Me" accent="#f59e0b" style="side" /><p className="text-gray-600">{pi.summary}</p></div>}
        <div>
          <SectionHeading label="Experience" accent="#f59e0b" style="side" />
          {data.experience.map((e, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between"><span className="font-bold text-gray-800">{e.title}</span><span className="text-gray-400 text-[10px]">{e.start_date} – {e.current ? "Present" : e.end_date}</span></div>
              <p className="text-amber-600 font-medium text-[10px]">{e.company} · {e.location}</p>
              <ul className="list-disc list-inside text-gray-600 mt-1 space-y-0.5">{e.bullets.map((b, bi) => <li key={bi}>{b}</li>)}</ul>
            </div>
          ))}
        </div>
        <div><SectionHeading label="Projects" accent="#f59e0b" style="side" />{data.projects.map((p, i) => <div key={i} className="mb-2"><p className="font-bold text-gray-800">{p.name}</p><p className="text-gray-600">{p.description}</p></div>)}</div>
      </div>
    </div>
  );
}

// 3. EXECUTIVE
function ExecutiveTemplate({ data }) {
  const pi = data.personal_info;
  return (
    <div className="bg-white min-h-full text-[11px]" style={{ fontFamily: "Georgia, serif" }}>
      <div className="bg-indigo-700 text-white px-8 py-6">
        <h1 className="text-2xl font-bold tracking-wide">{pi.full_name}</h1>
        <div className="flex flex-wrap gap-x-6 mt-2 text-indigo-200 text-[10px]">
          {[pi.email, pi.phone, pi.location, pi.linkedin].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
        </div>
      </div>
      <div className="px-8 py-5 space-y-4">
        {pi.summary && <div className="bg-indigo-50 border-l-4 border-indigo-500 pl-4 py-2 rounded-r"><p className="text-gray-700 italic">{pi.summary}</p></div>}
        <div>
          <SectionHeading label="Professional Experience" accent="#4f46e5" style="underline" />
          {data.experience.map((e, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline"><span className="font-bold text-gray-900 text-sm">{e.title}</span><span className="text-gray-400 text-[10px]">{e.start_date} – {e.current ? "Present" : e.end_date}</span></div>
              <p className="text-indigo-600 font-semibold">{e.company} | {e.location}</p>
              <ul className="list-disc list-inside text-gray-700 mt-1 space-y-0.5">{e.bullets.map((b, bi) => <li key={bi}>{b}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div><SectionHeading label="Education" accent="#4f46e5" style="underline" />{data.education.map((e, i) => <div key={i} className="mb-2"><p className="font-bold text-gray-800">{e.degree}</p><p className="text-gray-500">{e.institution} · {e.graduation_year}</p></div>)}</div>
          <div><SectionHeading label="Core Competencies" accent="#4f46e5" style="underline" /><div className="grid grid-cols-2 gap-1">{data.skills.map((s, i) => <span key={i} className="text-gray-700 flex items-center gap-1"><span className="text-indigo-500">▸</span>{s}</span>)}</div></div>
        </div>
      </div>
    </div>
  );
}

// 4. MINIMAL
function MinimalTemplate({ data }) {
  const pi = data.personal_info;
  return (
    <div className="bg-white min-h-full px-10 py-8 text-[11px]" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-light tracking-[0.1em] text-gray-900 uppercase">{pi.full_name}</h1>
        <div className="flex flex-wrap gap-x-4 mt-1 text-gray-400 text-[10px] tracking-wider">{[pi.email, pi.phone, pi.location].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}</div>
      </div>
      <div className="space-y-5">
        {pi.summary && <p className="text-gray-500 border-l-2 border-gray-200 pl-3">{pi.summary}</p>}
        <div>
          <p className="text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-2">Experience</p>
          {data.experience.map((e, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between"><span className="font-semibold text-gray-800">{e.title} — {e.company}</span><span className="text-gray-400">{e.start_date} – {e.current ? "Now" : e.end_date}</span></div>
              <ul className="mt-1 space-y-0.5 text-gray-500">{e.bullets.map((b, bi) => <li key={bi} className="flex gap-2"><span className="text-gray-300">—</span>{b}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><p className="text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-2">Education</p>{data.education.map((e, i) => <div key={i} className="mb-1"><p className="font-semibold text-gray-800">{e.institution}</p><p className="text-gray-400">{e.degree} · {e.graduation_year}</p></div>)}</div>
          <div className="col-span-2"><p className="text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-2">Skills</p><p className="text-gray-500">{data.skills.join(" · ")}</p></div>
        </div>
      </div>
    </div>
  );
}

// 5. TECH
function TechTemplate({ data }) {
  const pi = data.personal_info;
  return (
    <div className="bg-gray-950 min-h-full text-[11px]" style={{ fontFamily: "'Courier New', monospace" }}>
      <div className="bg-violet-600 px-7 py-5">
        <p className="text-violet-300 text-[10px] mb-1">{">>> resume.load()"}</p>
        <h1 className="text-xl font-bold text-white">{pi.full_name}</h1>
        <p className="text-violet-200 text-[10px] mt-1">{pi.email} | {pi.phone} | {pi.location}</p>
      </div>
      <div className="px-7 py-5 text-gray-300 space-y-4">
        {pi.summary && <div><p className="text-violet-400 text-[10px] mb-1">// summary</p><p className="text-gray-400">{pi.summary}</p></div>}
        <div>
          <p className="text-violet-400 text-[10px] mb-2">// experience</p>
          {data.experience.map((e, i) => (
            <div key={i} className="mb-3 border border-violet-900 rounded p-3">
              <div className="flex justify-between"><span className="text-white font-bold">{e.title}</span><span className="text-violet-400">{e.start_date} – {e.current ? "Present" : e.end_date}</span></div>
              <p className="text-violet-300">{e.company}</p>
              <ul className="mt-1 space-y-0.5 text-gray-400">{e.bullets.map((b, bi) => <li key={bi}>• {b}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-violet-400 text-[10px] mb-2">// skills</p><div className="flex flex-wrap gap-1">{data.skills.map((s, i) => <span key={i} className="bg-violet-900/50 text-violet-300 border border-violet-700 text-[10px] px-2 py-0.5 rounded">{s}</span>)}</div></div>
          <div><p className="text-violet-400 text-[10px] mb-2">// education</p>{data.education.map((e, i) => <div key={i} className="mb-1"><p className="text-white font-semibold">{e.institution}</p><p className="text-gray-400">{e.degree} · {e.graduation_year}</p></div>)}</div>
        </div>
      </div>
    </div>
  );
}

// 6. STARTUP
function StartupTemplate({ data }) {
  const pi = data.personal_info;
  return (
    <div className="bg-white min-h-full text-[11px]" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-7">
        <h1 className="text-2xl font-black text-white">{pi.full_name}</h1>
        <p className="text-pink-100 font-semibold mt-1">{data.experience[0]?.title}</p>
        <div className="flex flex-wrap gap-x-5 mt-2 text-pink-200 text-[10px]">{[pi.email, pi.phone, pi.location, pi.website].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}</div>
      </div>
      <div className="px-8 py-5 space-y-4">
        {pi.summary && <div className="bg-rose-50 rounded-xl p-3 border border-rose-100"><p className="text-gray-700">{pi.summary}</p></div>}
        <div>
          <SectionHeading label="Journey" accent="#f43f5e" style="filled" />
          {data.experience.map((e, i) => (
            <div key={i} className="mb-3 pl-3 border-l-2 border-rose-200">
              <div className="flex justify-between"><span className="font-black text-gray-900">{e.title}</span><span className="text-gray-400">{e.start_date} – {e.current ? "Now" : e.end_date}</span></div>
              <p className="text-rose-500 font-semibold">{e.company}</p>
              <ul className="list-disc list-inside text-gray-600 mt-1 space-y-0.5">{e.bullets.map((b, bi) => <li key={bi}>{b}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><SectionHeading label="Skills" accent="#f43f5e" style="filled" /><div className="flex flex-wrap gap-1">{data.skills.map((s, i) => <span key={i} className="bg-rose-50 text-rose-600 border border-rose-200 text-[10px] px-2 py-0.5 rounded-full">{s}</span>)}</div></div>
          <div><SectionHeading label="Education" accent="#f43f5e" style="filled" />{data.education.map((e, i) => <div key={i} className="mb-1"><p className="font-bold text-gray-800">{e.degree}</p><p className="text-gray-500">{e.institution} · {e.graduation_year}</p></div>)}</div>
        </div>
      </div>
    </div>
  );
}

// 7. HEALTHCARE
function HealthcareTemplate({ data }) {
  const pi = data.personal_info;
  return (
    <div className="bg-white min-h-full text-[11px]" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="flex items-center gap-4 px-7 py-5 bg-cyan-600 text-white">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-black flex-shrink-0">{pi.full_name?.charAt(0)}</div>
        <div><h1 className="text-lg font-bold">{pi.full_name}</h1><p className="text-cyan-200 text-[10px]">{pi.email} | {pi.phone} | {pi.location}</p></div>
        <div className="ml-auto text-right text-cyan-200 text-[10px]"><p>{pi.linkedin}</p></div>
      </div>
      <div className="px-7 py-5 space-y-4">
        {pi.summary && <div><SectionHeading label="Professional Profile" accent="#0891b2" style="underline" /><p className="text-gray-600">{pi.summary}</p></div>}
        <div><SectionHeading label="Clinical & Professional Experience" accent="#0891b2" style="underline" />
          {data.experience.map((e, i) => (
            <div key={i} className="mb-3 flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
              <div><div className="flex justify-between"><span className="font-bold text-gray-800">{e.title} · {e.company}</span><span className="text-gray-400">{e.start_date} – {e.current ? "Present" : e.end_date}</span></div>
              <ul className="text-gray-600 mt-1 space-y-0.5">{e.bullets.map((b, bi) => <li key={bi}>• {b}</li>)}</ul></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><SectionHeading label="Education & Credentials" accent="#0891b2" style="underline" />{data.education.map((e, i) => <div key={i} className="mb-2"><p className="font-bold text-gray-800">{e.degree}</p><p className="text-gray-500">{e.institution} · {e.graduation_year}</p></div>)}</div>
          <div><SectionHeading label="Competencies" accent="#0891b2" style="underline" /><div className="flex flex-wrap gap-1">{data.skills.map((s, i) => <span key={i} className="bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] px-2 py-0.5 rounded">{s}</span>)}</div></div>
        </div>
      </div>
    </div>
  );
}

// 8. ACADEMIC
function AcademicTemplate({ data }) {
  const pi = data.personal_info;
  return (
    <div className="bg-white min-h-full px-10 py-7 text-[11px]" style={{ fontFamily: "Georgia, serif" }}>
      <div className="text-center border-b-2 border-indigo-700 pb-4 mb-5">
        <h1 className="text-xl font-bold text-indigo-900">{pi.full_name}</h1>
        <div className="flex justify-center flex-wrap gap-x-4 mt-1 text-gray-500 text-[10px]">{[pi.email, pi.phone, pi.location, pi.linkedin].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}</div>
      </div>
      <div className="space-y-4">
        {pi.summary && <div><SectionHeading label="Research Interests & Profile" accent="#4338ca" style="underline" /><p className="text-gray-700 italic">{pi.summary}</p></div>}
        <div><SectionHeading label="Academic & Professional Experience" accent="#4338ca" style="underline" />
          {data.experience.map((e, i) => <div key={i} className="mb-3"><div className="flex justify-between items-baseline"><span className="font-bold text-gray-900">{e.title}, {e.company}</span><span className="text-gray-400 italic text-[10px]">{e.start_date} – {e.current ? "Present" : e.end_date}</span></div><ul className="list-disc list-inside text-gray-700 mt-1 space-y-0.5">{e.bullets.map((b, bi) => <li key={bi}>{b}</li>)}</ul></div>)}
        </div>
        <div><SectionHeading label="Education" accent="#4338ca" style="underline" />{data.education.map((e, i) => <div key={i} className="mb-2 flex justify-between"><div><p className="font-bold text-gray-800">{e.degree}</p><p className="text-gray-500 italic">{e.institution}{e.gpa && ` · GPA: ${e.gpa}`}</p></div><p className="text-gray-400">{e.graduation_year}</p></div>)}</div>
        <div><SectionHeading label="Skills & Methods" accent="#4338ca" style="underline" /><p className="text-gray-700">{data.skills.join(" · ")}</p></div>
      </div>
    </div>
  );
}

// 9. FINANCE
function FinanceTemplate({ data }) {
  const pi = data.personal_info;
  return (
    <div className="bg-white min-h-full text-[11px]" style={{ fontFamily: "'Times New Roman', serif" }}>
      <div className="bg-slate-800 px-8 py-5 text-white">
        <h1 className="text-2xl font-bold tracking-wide">{pi.full_name}</h1>
        <div className="w-12 h-0.5 bg-yellow-400 my-2" />
        <div className="flex flex-wrap gap-x-5 text-slate-300 text-[10px]">{[pi.email, pi.phone, pi.location, pi.linkedin].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}</div>
      </div>
      <div className="px-8 py-5 space-y-4">
        {pi.summary && <div className="border-l-4 border-yellow-400 pl-3"><p className="text-gray-700">{pi.summary}</p></div>}
        <div><h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-3">Professional Experience</h2>
          {data.experience.map((e, i) => <div key={i} className="mb-3"><div className="flex justify-between"><span className="font-bold text-gray-900">{e.title}</span><span className="text-gray-400">{e.start_date} – {e.current ? "Present" : e.end_date}</span></div><p className="text-yellow-700 font-semibold">{e.company} | {e.location}</p><ul className="list-disc list-inside text-gray-700 mt-1 space-y-0.5">{e.bullets.map((b, bi) => <li key={bi}>{b}</li>)}</ul></div>)}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-3">Education</h2>{data.education.map((e, i) => <div key={i} className="mb-2"><p className="font-bold text-gray-800">{e.degree}</p><p className="text-gray-500">{e.institution} · {e.graduation_year}</p></div>)}</div>
          <div><h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-3">Core Competencies</h2><div className="grid grid-cols-1 gap-0.5">{data.skills.map((s, i) => <span key={i} className="text-gray-700 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0" />{s}</span>)}</div></div>
        </div>
      </div>
    </div>
  );
}

// 10. DESIGNER
function DesignerTemplate({ data }) {
  const pi = data.personal_info;
  return (
    <div className="bg-white min-h-full flex text-[11px]" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="w-2/5 bg-purple-700 text-white p-5 flex-shrink-0 flex flex-col">
        <div className="mb-6"><div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-black mb-3">{pi.full_name?.charAt(0)}</div><h1 className="text-base font-extrabold leading-tight">{pi.full_name}</h1><p className="text-purple-200 text-[10px] mt-1">{data.experience[0]?.title}</p></div>
        <div className="mb-5 space-y-1 text-[10px] text-purple-200">{[pi.email, pi.phone, pi.location, pi.website].filter(Boolean).map((v, i) => <p key={i}>{v}</p>)}</div>
        <div className="mb-5"><h2 className="text-[10px] font-bold uppercase tracking-widest text-purple-300 mb-2">Tools & Skills</h2>{data.skills.map((s, i) => <div key={i} className="mb-1.5"><div className="flex justify-between text-[10px] mb-0.5"><span>{s}</span></div><div className="h-1 bg-purple-900 rounded-full"><div className="h-1 bg-white rounded-full" style={{ width: `${70 + (i % 3) * 10}%` }} /></div></div>)}</div>
        <div><h2 className="text-[10px] font-bold uppercase tracking-widest text-purple-300 mb-2">Education</h2>{data.education.map((e, i) => <div key={i} className="mb-2"><p className="font-bold text-[10px]">{e.degree}</p><p className="text-purple-200 text-[10px]">{e.institution} · {e.graduation_year}</p></div>)}</div>
      </div>
      <div className="flex-1 p-5 space-y-4">
        {pi.summary && <div><SectionHeading label="Profile" accent="#7c3aed" style="side" /><p className="text-gray-600">{pi.summary}</p></div>}
        <div><SectionHeading label="Experience" accent="#7c3aed" style="side" />{data.experience.map((e, i) => <div key={i} className="mb-3"><div className="flex justify-between"><span className="font-bold text-gray-800">{e.title}</span><span className="text-gray-400">{e.start_date} – {e.current ? "Present" : e.end_date}</span></div><p className="text-purple-600 font-medium">{e.company}</p><ul className="list-disc list-inside text-gray-600 mt-1 space-y-0.5">{e.bullets.map((b, bi) => <li key={bi}>{b}</li>)}</ul></div>)}</div>
        <div><SectionHeading label="Projects" accent="#7c3aed" style="side" />{data.projects.map((p, i) => <div key={i} className="mb-2"><p className="font-bold text-gray-800">{p.name}</p><p className="text-gray-500">{p.description}</p></div>)}</div>
      </div>
    </div>
  );
}

// 11. COMPACT
function CompactTemplate({ data }) {
  const pi = data.personal_info;
  return (
    <div className="bg-white min-h-full px-8 py-5 text-[10.5px]" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="flex justify-between items-start mb-3 border-b-2 border-teal-500 pb-3">
        <div><h1 className="text-lg font-black text-gray-900">{pi.full_name}</h1><p className="text-teal-600 font-semibold text-[10px]">{data.experience[0]?.title}</p></div>
        <div className="text-right text-gray-500 text-[10px] space-y-0.5"><p>{pi.email}</p><p>{pi.phone}</p><p>{pi.location}</p></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-3">
          {pi.summary && <p className="text-gray-600 text-[10px]">{pi.summary}</p>}
          <div><SectionHeading label="Experience" accent="#0d9488" style="bar" />{data.experience.map((e, i) => <div key={i} className="mb-2"><div className="flex justify-between"><span className="font-bold text-gray-800">{e.title} · {e.company}</span><span className="text-gray-400">{e.start_date} – {e.current ? "Now" : e.end_date}</span></div><ul className="text-gray-600 mt-0.5 space-y-0.5">{e.bullets.map((b, bi) => <li key={bi} className="flex gap-1.5"><span className="text-teal-400">›</span>{b}</li>)}</ul></div>)}</div>
        </div>
        <div className="space-y-3">
          <div><SectionHeading label="Skills" accent="#0d9488" style="bar" />{data.skills.map((s, i) => <p key={i} className="text-gray-600 py-0.5 border-b border-gray-100">{s}</p>)}</div>
          <div><SectionHeading label="Education" accent="#0d9488" style="bar" />{data.education.map((e, i) => <div key={i} className="mb-2"><p className="font-bold text-gray-800">{e.institution}</p><p className="text-gray-500">{e.degree}</p><p className="text-gray-400">{e.graduation_year}</p></div>)}</div>
        </div>
      </div>
    </div>
  );
}

// 12. INFOGRAPHIC
function InfographicTemplate({ data }) {
  const pi = data.personal_info;
  return (
    <div className="bg-gray-50 min-h-full text-[11px] flex" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="w-2/5 bg-orange-500 text-white p-5 flex-shrink-0">
        <div className="mb-5"><div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-black mb-3">{pi.full_name?.charAt(0)}</div><h1 className="text-base font-extrabold">{pi.full_name}</h1><p className="text-orange-100 text-[10px] mt-1">{data.experience[0]?.title}</p></div>
        <div className="mb-5 space-y-0.5 text-[10px] text-orange-100">{[pi.email, pi.phone, pi.location].filter(Boolean).map((v, i) => <p key={i}>{v}</p>)}</div>
        <div className="mb-4"><h2 className="text-[10px] font-bold uppercase tracking-widest text-orange-200 mb-2">Skills</h2>{data.skills.slice(0, 6).map((s, i) => <div key={i} className="mb-1.5"><div className="flex justify-between text-[10px] mb-0.5"><span>{s}</span><span>{75 + (i % 4) * 6}%</span></div><div className="h-1.5 bg-orange-700 rounded-full"><div className="h-1.5 bg-white rounded-full" style={{ width: `${75 + (i % 4) * 6}%` }} /></div></div>)}</div>
        <div><h2 className="text-[10px] font-bold uppercase tracking-widest text-orange-200 mb-2">Education</h2>{data.education.map((e, i) => <div key={i} className="mb-2"><p className="font-bold text-[10px]">{e.degree}</p><p className="text-orange-200 text-[10px]">{e.institution} · {e.graduation_year}</p></div>)}</div>
      </div>
      <div className="flex-1 bg-white p-5 space-y-4">
        {pi.summary && <div className="bg-orange-50 border border-orange-100 rounded-xl p-3"><p className="text-gray-700">{pi.summary}</p></div>}
        <div><SectionHeading label="Experience" accent="#f97316" style="side" />{data.experience.map((e, i) => <div key={i} className="mb-3 relative pl-4 border-l-2 border-orange-200"><div className="absolute -left-1.5 top-0.5 w-2.5 h-2.5 bg-orange-400 rounded-full" /><div className="flex justify-between"><span className="font-bold text-gray-800">{e.title}</span><span className="text-gray-400">{e.start_date} – {e.current ? "Now" : e.end_date}</span></div><p className="text-orange-600 font-medium">{e.company}</p><ul className="text-gray-600 mt-1 space-y-0.5">{e.bullets.map((b, bi) => <li key={bi}>• {b}</li>)}</ul></div>)}</div>
        <div><SectionHeading label="Projects" accent="#f97316" style="side" />{data.projects.map((p, i) => <div key={i} className="mb-2"><p className="font-bold text-gray-800">{p.name}</p><p className="text-gray-500">{p.description}</p></div>)}</div>
      </div>
    </div>
  );
}

// 13. GLASSMORPHISM (new — dark glass card style)
function GlassTemplate({ data }) {
  const pi = data.personal_info;
  return (
    <div className="min-h-full text-[11px]" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", fontFamily: "system-ui, sans-serif" }}>
      <div className="px-7 py-6" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <h1 className="text-2xl font-extrabold text-white">{pi.full_name}</h1>
        <p className="text-cyan-300 font-semibold text-xs mt-0.5">{data.experience[0]?.title}</p>
        <div className="flex flex-wrap gap-x-4 mt-2 text-blue-200 text-[10px]">{[pi.email, pi.phone, pi.location, pi.linkedin].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}</div>
      </div>
      <div className="px-7 py-5 space-y-4">
        {pi.summary && (
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "12px" }}>
            <p className="text-blue-100 text-[10px] font-semibold uppercase tracking-wider mb-1">Profile</p>
            <p className="text-slate-300">{pi.summary}</p>
          </div>
        )}
        <div>
          <p className="text-cyan-300 text-[10px] font-bold uppercase tracking-widest mb-2">Experience</p>
          {data.experience.map((e, i) => (
            <div key={i} className="mb-3 pl-3" style={{ borderLeft: "2px solid rgba(34,211,238,0.4)" }}>
              <div className="flex justify-between"><span className="font-bold text-white">{e.title}</span><span className="text-blue-300 text-[10px]">{e.start_date} – {e.current ? "Present" : e.end_date}</span></div>
              <p className="text-cyan-400 font-medium">{e.company}</p>
              <ul className="mt-1 space-y-0.5 text-slate-400">{e.bullets.map((b, bi) => <li key={bi} className="flex gap-1.5"><span className="text-cyan-500">›</span>{b}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-cyan-300 text-[10px] font-bold uppercase tracking-widest mb-2">Education</p>
            {data.education.map((e, i) => <div key={i} className="mb-2"><p className="font-bold text-white">{e.degree}</p><p className="text-blue-300">{e.institution} · {e.graduation_year}</p></div>)}
          </div>
          <div>
            <p className="text-cyan-300 text-[10px] font-bold uppercase tracking-widest mb-2">Skills</p>
            <div className="flex flex-wrap gap-1">{data.skills.map((s, i) => <span key={i} style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.25)", color: "#67e8f9", borderRadius: "999px", padding: "1px 8px", fontSize: "10px" }}>{s}</span>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 14. NEON / CYBERPUNK (new)
function NeonTemplate({ data }) {
  const pi = data.personal_info;
  const neon = "#00ff87";
  const neon2 = "#60efff";
  return (
    <div className="min-h-full text-[11px]" style={{ background: "#0a0a0f", fontFamily: "'Courier New', monospace" }}>
      <div className="px-7 py-6" style={{ borderBottom: `2px solid ${neon}`, boxShadow: `0 0 20px ${neon}30` }}>
        <div className="flex items-center gap-3 mb-2">
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: neon, boxShadow: `0 0 8px ${neon}` }} />
          <span style={{ color: neon, fontSize: 10, letterSpacing: "0.2em" }}>ACTIVE CANDIDATE</span>
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: "#fff", textShadow: `0 0 20px ${neon}60` }}>{pi.full_name}</h1>
        <p style={{ color: neon2, fontSize: 11, fontWeight: 600, marginTop: 2 }}>{data.experience[0]?.title}</p>
        <div className="flex flex-wrap gap-x-4 mt-2" style={{ color: "#6b7280", fontSize: 10 }}>{[pi.email, pi.phone, pi.location].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}</div>
      </div>
      <div className="px-7 py-5 space-y-4">
        {pi.summary && <div style={{ borderLeft: `3px solid ${neon}`, paddingLeft: 10 }}><p style={{ color: "#9ca3af" }}>{pi.summary}</p></div>}
        <div>
          <p style={{ color: neon, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Experience</p>
          {data.experience.map((e, i) => (
            <div key={i} className="mb-3" style={{ border: `1px solid ${neon}25`, borderRadius: 8, padding: 10, background: `${neon}05` }}>
              <div className="flex justify-between"><span style={{ color: "#fff", fontWeight: 700 }}>{e.title}</span><span style={{ color: neon2, fontSize: 10 }}>{e.start_date} – {e.current ? "Now" : e.end_date}</span></div>
              <p style={{ color: neon, fontWeight: 600, fontSize: 10 }}>{e.company}</p>
              <ul className="mt-1 space-y-0.5">{e.bullets.map((b, bi) => <li key={bi} style={{ color: "#6b7280" }}>⟩ {b}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p style={{ color: neon, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Education</p>
            {data.education.map((e, i) => <div key={i} className="mb-2"><p style={{ color: "#fff", fontWeight: 700 }}>{e.degree}</p><p style={{ color: "#6b7280" }}>{e.institution} · {e.graduation_year}</p></div>)}
          </div>
          <div>
            <p style={{ color: neon, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Skills</p>
            <div className="flex flex-wrap gap-1">{data.skills.map((s, i) => <span key={i} style={{ border: `1px solid ${neon}50`, color: neon2, borderRadius: 4, padding: "1px 7px", fontSize: 10 }}>{s}</span>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 15. BOLD SPLIT (new — large left color block with name only, detailed right)
function BoldSplitTemplate({ data }) {
  const pi = data.personal_info;
  return (
    <div className="min-h-full text-[11px] flex" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="w-1/3 flex-shrink-0 flex flex-col items-center justify-start pt-8 px-4 text-white" style={{ background: "linear-gradient(180deg, #7c3aed 0%, #4c1d95 100%)" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, marginBottom: 12 }}>{pi.full_name?.charAt(0)}</div>
        <h1 className="text-sm font-extrabold text-center leading-tight mb-1">{pi.full_name}</h1>
        <p style={{ color: "#c4b5fd", fontSize: 10, textAlign: "center", marginBottom: 16 }}>{data.experience[0]?.title}</p>
        <div style={{ width: "100%", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 12, marginBottom: 12 }}>
          <p style={{ color: "#a78bfa", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6, fontWeight: 700 }}>Contact</p>
          {[pi.email, pi.phone, pi.location].filter(Boolean).map((v, i) => <p key={i} style={{ color: "#ddd6fe", fontSize: 9, marginBottom: 3, wordBreak: "break-all" }}>{v}</p>)}
        </div>
        <div style={{ width: "100%" }}>
          <p style={{ color: "#a78bfa", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6, fontWeight: 700 }}>Skills</p>
          {data.skills.map((s, i) => <div key={i} style={{ marginBottom: 6 }}><p style={{ color: "#ede9fe", fontSize: 10 }}>{s}</p><div style={{ height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 2 }}><div style={{ height: 3, background: "rgba(255,255,255,0.7)", borderRadius: 2, width: `${65 + (i * 7) % 30}%` }} /></div></div>)}
        </div>
      </div>
      <div className="flex-1 bg-white p-5 space-y-3">
        {pi.summary && <div><p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "#7c3aed", fontWeight: 700, marginBottom: 4 }}>About</p><p style={{ color: "#4b5563", borderLeft: "3px solid #7c3aed", paddingLeft: 8 }}>{pi.summary}</p></div>}
        <div><p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "#7c3aed", fontWeight: 700, marginBottom: 6 }}>Experience</p>
          {data.experience.map((e, i) => <div key={i} className="mb-3"><div className="flex justify-between"><span style={{ fontWeight: 700, color: "#111" }}>{e.title}</span><span style={{ color: "#9ca3af", fontSize: 10 }}>{e.start_date} – {e.current ? "Now" : e.end_date}</span></div><p style={{ color: "#7c3aed", fontSize: 10 }}>{e.company}</p><ul style={{ marginTop: 4 }}>{e.bullets.map((b, bi) => <li key={bi} style={{ color: "#6b7280", display: "flex", gap: 6 }}><span style={{ color: "#7c3aed" }}>▸</span>{b}</li>)}</ul></div>)}
        </div>
        <div><p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "#7c3aed", fontWeight: 700, marginBottom: 6 }}>Education</p>
          {data.education.map((e, i) => <div key={i} className="mb-2"><p style={{ fontWeight: 700, color: "#111" }}>{e.degree}</p><p style={{ color: "#6b7280" }}>{e.institution} · {e.graduation_year}</p></div>)}
        </div>
      </div>
    </div>
  );
}

// 16. TIMELINE (new — vertical timeline left column)
function TimelineTemplate({ data }) {
  const pi = data.personal_info;
  return (
    <div className="bg-white min-h-full text-[11px]" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ background: "linear-gradient(90deg, #0f172a 0%, #1e3a5f 100%)", padding: "20px 28px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{pi.full_name}</h1>
        <p style={{ color: "#38bdf8", fontSize: 11, fontWeight: 600, marginTop: 2 }}>{data.experience[0]?.title}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0 16px", marginTop: 6, color: "#94a3b8", fontSize: 10 }}>
          {[pi.email, pi.phone, pi.location, pi.linkedin].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
        </div>
      </div>
      <div style={{ display: "flex", gap: 0 }}>
        {/* Timeline column */}
        <div style={{ width: 120, flexShrink: 0, background: "#f8fafc", borderRight: "1px solid #e2e8f0", padding: "16px 12px" }}>
          <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "#94a3b8", fontWeight: 700, marginBottom: 10 }}>Timeline</p>
          {data.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 14, position: "relative", paddingLeft: 14 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#38bdf8", position: "absolute", left: 0, top: 2 }} />
              <div style={{ position: "absolute", left: 3.5, top: 10, bottom: -10, width: 1, background: "#e2e8f0" }} />
              <p style={{ fontSize: 10, fontWeight: 700, color: "#1e293b" }}>{e.start_date}</p>
              <p style={{ fontSize: 9, color: "#94a3b8" }}>{e.current ? "Present" : e.end_date}</p>
            </div>
          ))}
        </div>
        {/* Main content */}
        <div style={{ flex: 1, padding: "16px 20px" }}>
          {pi.summary && <div style={{ marginBottom: 12, borderLeft: "3px solid #38bdf8", paddingLeft: 10 }}><p style={{ color: "#475569" }}>{pi.summary}</p></div>}
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "#38bdf8", fontWeight: 700, marginBottom: 6 }}>Experience</p>
            {data.experience.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><p style={{ fontWeight: 700, color: "#0f172a" }}>{e.title} — <span style={{ color: "#38bdf8" }}>{e.company}</span></p><ul style={{ marginTop: 4 }}>{e.bullets.map((b, bi) => <li key={bi} style={{ color: "#475569", display: "flex", gap: 6 }}><span style={{ color: "#38bdf8" }}>›</span>{b}</li>)}</ul></div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "#38bdf8", fontWeight: 700, marginBottom: 6 }}>Education</p>{data.education.map((e, i) => <div key={i} style={{ marginBottom: 6 }}><p style={{ fontWeight: 700, color: "#0f172a" }}>{e.degree}</p><p style={{ color: "#94a3b8" }}>{e.institution} · {e.graduation_year}</p></div>)}</div>
            <div><p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "#38bdf8", fontWeight: 700, marginBottom: 6 }}>Skills</p><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{data.skills.map((s, i) => <span key={i} style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", borderRadius: 4, padding: "1px 7px", fontSize: 10 }}>{s}</span>)}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 17. ELEGANT SERIF (new — luxury magazine style)
function ElegantTemplate({ data }) {
  const pi = data.personal_info;
  return (
    <div className="bg-white min-h-full px-10 py-8 text-[11px]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <div style={{ textAlign: "center", borderBottom: "2px solid #1a1a1a", paddingBottom: 16, marginBottom: 16 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "0.08em", color: "#1a1a1a", textTransform: "uppercase" }}>{pi.full_name}</h1>
        <p style={{ color: "#9ca3af", letterSpacing: "0.3em", fontSize: 9, textTransform: "uppercase", marginTop: 6 }}>{data.experience[0]?.title}</p>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0 20px", marginTop: 6, color: "#6b7280", fontSize: 10 }}>{[pi.email, pi.phone, pi.location, pi.linkedin].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}</div>
      </div>
      {pi.summary && <div style={{ textAlign: "center", color: "#4b5563", fontStyle: "italic", borderBottom: "1px solid #e5e7eb", paddingBottom: 12, marginBottom: 16 }}>{pi.summary}</div>}
      <div style={{ marginBottom: 14 }}>
        <p style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: 9, color: "#1a1a1a", fontWeight: 700, borderBottom: "1px solid #1a1a1a", paddingBottom: 4, marginBottom: 10 }}>Professional Experience</p>
        {data.experience.map((e, i) => <div key={i} style={{ marginBottom: 12 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 700, color: "#1a1a1a", fontSize: 12 }}>{e.title}</span><span style={{ color: "#9ca3af", fontStyle: "italic" }}>{e.start_date} – {e.current ? "Present" : e.end_date}</span></div><p style={{ color: "#6b7280", fontStyle: "italic" }}>{e.company}, {e.location}</p><ul style={{ marginTop: 4 }}>{e.bullets.map((b, bi) => <li key={bi} style={{ color: "#4b5563", display: "flex", gap: 8 }}><span>•</span>{b}</li>)}</ul></div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <p style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: 9, color: "#1a1a1a", fontWeight: 700, borderBottom: "1px solid #1a1a1a", paddingBottom: 4, marginBottom: 8 }}>Education</p>
          {data.education.map((e, i) => <div key={i} style={{ marginBottom: 8 }}><p style={{ fontWeight: 700, color: "#1a1a1a" }}>{e.degree}</p><p style={{ color: "#6b7280", fontStyle: "italic" }}>{e.institution}, {e.graduation_year}</p></div>)}
        </div>
        <div>
          <p style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: 9, color: "#1a1a1a", fontWeight: 700, borderBottom: "1px solid #1a1a1a", paddingBottom: 4, marginBottom: 8 }}>Expertise</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{data.skills.map((s, i) => <span key={i} style={{ border: "1px solid #d1d5db", color: "#374151", borderRadius: 4, padding: "2px 8px", fontSize: 10 }}>{s}</span>)}</div>
        </div>
      </div>
    </div>
  );
}

// 18. GRADIENT HERO (new — full-bleed gradient header, white body)
function GradientHeroTemplate({ data }) {
  const pi = data.personal_info;
  return (
    <div className="bg-white min-h-full text-[11px]" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)", padding: "28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ position: "absolute", bottom: -30, left: 60, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", position: "relative" }}>{pi.full_name}</h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 600, marginTop: 2, position: "relative" }}>{data.experience[0]?.title}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0 16px", marginTop: 8, color: "rgba(255,255,255,0.75)", fontSize: 10, position: "relative" }}>{[pi.email, pi.phone, pi.location, pi.linkedin].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}</div>
      </div>
      <div style={{ padding: "16px 24px", display: "flex", gap: 16 }}>
        <div style={{ flex: 2 }}>
          {pi.summary && <div style={{ marginBottom: 12, background: "#fef3c7", borderRadius: 10, padding: 10 }}><p style={{ color: "#78350f" }}>{pi.summary}</p></div>}
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "#ef4444", fontWeight: 700, marginBottom: 6 }}>Experience</p>
            {data.experience.map((e, i) => <div key={i} style={{ marginBottom: 10, borderLeft: "3px solid #fbbf24", paddingLeft: 10 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 700, color: "#111" }}>{e.title}</span><span style={{ color: "#9ca3af", fontSize: 10 }}>{e.start_date} – {e.current ? "Now" : e.end_date}</span></div><p style={{ color: "#f59e0b", fontWeight: 600 }}>{e.company}</p><ul style={{ marginTop: 3 }}>{e.bullets.map((b, bi) => <li key={bi} style={{ color: "#4b5563" }}>• {b}</li>)}</ul></div>)}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "#ef4444", fontWeight: 700, marginBottom: 6 }}>Skills</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>{data.skills.map((s, i) => <span key={i} style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a", borderRadius: 999, padding: "2px 8px", fontSize: 10 }}>{s}</span>)}</div>
          <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "#ef4444", fontWeight: 700, marginBottom: 6 }}>Education</p>
          {data.education.map((e, i) => <div key={i} style={{ marginBottom: 6 }}><p style={{ fontWeight: 700, color: "#111" }}>{e.institution}</p><p style={{ color: "#6b7280" }}>{e.degree}</p><p style={{ color: "#9ca3af" }}>{e.graduation_year}</p></div>)}
        </div>
      </div>
    </div>
  );
}

// 19. TWO-TONE (new — split top/bottom background)
function TwoToneTemplate({ data }) {
  const pi = data.personal_info;
  return (
    <div className="min-h-full text-[11px]" style={{ fontFamily: "system-ui, sans-serif", background: "#fff" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100%" }}>
        {/* Left dark panel */}
        <div style={{ background: "#0f172a", padding: "24px 20px", color: "#fff" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, marginBottom: 12 }}>{pi.full_name?.charAt(0)}</div>
          <h1 style={{ fontSize: 16, fontWeight: 900, marginBottom: 2 }}>{pi.full_name}</h1>
          <p style={{ color: "#a78bfa", fontSize: 10, marginBottom: 12 }}>{data.experience[0]?.title}</p>
          <div style={{ marginBottom: 12 }}>
            <p style={{ color: "#6366f1", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 6 }}>Contact</p>
            {[pi.email, pi.phone, pi.location].filter(Boolean).map((v, i) => <p key={i} style={{ color: "#94a3b8", fontSize: 10, marginBottom: 2 }}>{v}</p>)}
          </div>
          <div style={{ marginBottom: 12 }}>
            <p style={{ color: "#6366f1", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 6 }}>Skills</p>
            {data.skills.map((s, i) => <div key={i} style={{ marginBottom: 5 }}><p style={{ color: "#e2e8f0", fontSize: 10 }}>{s}</p><div style={{ height: 3, background: "#1e293b", borderRadius: 2 }}><div style={{ height: 3, background: "linear-gradient(90deg,#6366f1,#a855f7)", borderRadius: 2, width: `${60 + (i * 8) % 35}%` }} /></div></div>)}
          </div>
          <div>
            <p style={{ color: "#6366f1", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 6 }}>Education</p>
            {data.education.map((e, i) => <div key={i} style={{ marginBottom: 6 }}><p style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 10 }}>{e.institution}</p><p style={{ color: "#94a3b8", fontSize: 10 }}>{e.degree}</p></div>)}
          </div>
        </div>
        {/* Right light panel */}
        <div style={{ background: "#f8fafc", padding: "24px 20px" }}>
          {pi.summary && <div style={{ marginBottom: 12, borderLeft: "3px solid #6366f1", paddingLeft: 10 }}><p style={{ color: "#475569" }}>{pi.summary}</p></div>}
          <div>
            <p style={{ color: "#6366f1", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 8 }}>Experience</p>
            {data.experience.map((e, i) => <div key={i} style={{ marginBottom: 12 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 700, color: "#1e293b" }}>{e.title}</span><span style={{ color: "#94a3b8", fontSize: 10 }}>{e.start_date} – {e.current ? "Now" : e.end_date}</span></div><p style={{ color: "#6366f1", fontWeight: 600, fontSize: 10 }}>{e.company}</p><ul style={{ marginTop: 4 }}>{e.bullets.map((b, bi) => <li key={bi} style={{ color: "#475569", display: "flex", gap: 6 }}><span style={{ color: "#6366f1" }}>▸</span>{b}</li>)}</ul></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// 20. PHOTO CARD (new — large profile photo card style)
function PhotoCardTemplate({ data }) {
  const pi = data.personal_info;
  return (
    <div className="bg-white min-h-full text-[11px]" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg,#059669,#0891b2)", padding: "20px 24px", display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900, color: "#fff", flexShrink: 0, border: "3px solid rgba(255,255,255,0.4)" }}>{pi.full_name?.charAt(0)}</div>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{pi.full_name}</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 600 }}>{data.experience[0]?.title}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0 14px", marginTop: 4, color: "rgba(255,255,255,0.7)", fontSize: 10 }}>{[pi.email, pi.phone, pi.location].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        <div style={{ padding: "16px 20px", borderRight: "1px solid #e2e8f0" }}>
          {pi.summary && <div style={{ marginBottom: 12 }}><p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "#059669", fontWeight: 700, marginBottom: 4 }}>About</p><p style={{ color: "#4b5563" }}>{pi.summary}</p></div>}
          <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "#059669", fontWeight: 700, marginBottom: 6 }}>Experience</p>
          {data.experience.map((e, i) => <div key={i} style={{ marginBottom: 10 }}><p style={{ fontWeight: 700, color: "#111" }}>{e.title}</p><p style={{ color: "#059669", fontWeight: 600 }}>{e.company} · {e.start_date} – {e.current ? "Now" : e.end_date}</p><ul style={{ marginTop: 3 }}>{e.bullets.slice(0, 2).map((b, bi) => <li key={bi} style={{ color: "#6b7280" }}>• {b}</li>)}</ul></div>)}
        </div>
        <div style={{ padding: "16px 20px" }}>
          <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "#0891b2", fontWeight: 700, marginBottom: 6 }}>Skills</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>{data.skills.map((s, i) => <span key={i} style={{ background: "#ecfdf5", color: "#065f46", border: "1px solid #6ee7b7", borderRadius: 999, padding: "2px 8px", fontSize: 10 }}>{s}</span>)}</div>
          <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "#0891b2", fontWeight: 700, marginBottom: 6 }}>Education</p>
          {data.education.map((e, i) => <div key={i} style={{ marginBottom: 8 }}><p style={{ fontWeight: 700, color: "#111" }}>{e.degree}</p><p style={{ color: "#6b7280" }}>{e.institution} · {e.graduation_year}</p></div>)}
          {data.projects.length > 0 && <>
            <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "#0891b2", fontWeight: 700, marginBottom: 6, marginTop: 8 }}>Projects</p>
            {data.projects.map((p, i) => <div key={i} style={{ marginBottom: 6 }}><p style={{ fontWeight: 700, color: "#111" }}>{p.name}</p><p style={{ color: "#6b7280" }}>{p.description}</p></div>)}
          </>}
        </div>
      </div>
    </div>
  );
}

// Registry
const TEMPLATE_MAP = {
  modern: ModernTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
  minimal: MinimalTemplate,
  tech: TechTemplate,
  startup: StartupTemplate,
  healthcare: HealthcareTemplate,
  academic: AcademicTemplate,
  finance: FinanceTemplate,
  designer: DesignerTemplate,
  compact: CompactTemplate,
  infographic: InfographicTemplate,
  glass: GlassTemplate,
  neon: NeonTemplate,
  bold_split: BoldSplitTemplate,
  timeline: TimelineTemplate,
  elegant: ElegantTemplate,
  gradient_hero: GradientHeroTemplate,
  two_tone: TwoToneTemplate,
  photo_card: PhotoCardTemplate,
};

export default function TemplateRenderer({ templateId, data = sampleData }) {
  const Component = TEMPLATE_MAP[templateId] || ModernTemplate;
  return <Component data={data} />;
}

export { TEMPLATE_MAP };