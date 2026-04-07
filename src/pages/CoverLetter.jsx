import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import CoverLetterSetup from "@/components/coverletter/CoverLetterSetup";
import CoverLetterOutput from "@/components/coverletter/CoverLetterOutput";
import { motion } from "framer-motion";
import { FileText, Sparkles, Shield, Zap, Users, Heart } from "lucide-react";

const STATS = [
  { icon: FileText, value: "50K+", label: "Letters Generated", color: "text-violet-400" },
  { icon: Zap, value: "< 30s", label: "Generation Time", color: "text-pink-400" },
  { icon: Shield, value: "ATS", label: "Optimized Output", color: "text-cyan-400" },
  { icon: Heart, value: "100%", label: "Free Forever", color: "text-emerald-400" },
];

export default function CoverLetter() {
  const [result, setResult] = useState(null);
  const [lastParams, setLastParams] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  const buildPrompt = ({ selectedResume, jobTitle, companyName, jobDescription, tone, industry, experienceLevel, extraContext, hiringManager }) => {
    const resumeText = selectedResume ? `
CANDIDATE RESUME:
Name: ${selectedResume.personal_info?.full_name || ""}
Summary: ${selectedResume.personal_info?.summary || ""}
Experience:
${(selectedResume.experience || []).map(e => `- ${e.title} at ${e.company} (${e.start_date}–${e.current ? "Present" : e.end_date}): ${(e.bullets || []).join("; ")}`).join("\n")}
Skills: ${(selectedResume.skills || []).join(", ")}
Education: ${(selectedResume.education || []).map(e => `${e.degree} at ${e.institution}`).join("; ")}
Projects: ${(selectedResume.projects || []).map(p => `${p.name}: ${p.description}`).join("; ")}
` : "";

    return `You are an elite career coach and professional cover letter writer used by Fortune 500 recruiters.

Write a highly personalized, compelling, ATS-optimized cover letter for the following job application.

${resumeText}

JOB TITLE: ${jobTitle || "Not specified"}
COMPANY: ${companyName || "Not specified"}
INDUSTRY: ${industry || "General"}
EXPERIENCE LEVEL: ${experienceLevel || "Mid-level"}
HIRING MANAGER: ${hiringManager || "Unknown"}

JOB DESCRIPTION:
${jobDescription}

${extraContext ? `ADDITIONAL CONTEXT FROM CANDIDATE:\n${extraContext}` : ""}

TONE: ${tone}

Instructions:
- Match the candidate's actual experiences and skills to job requirements (be hyper-specific, not generic)
- Mirror the language and vocabulary used in the job description
- Highlight 2-3 most relevant experiences or achievements with measurable impact where possible
- Show genuine enthusiasm for this specific company — mention something specific about them if possible
- Keep it to 3-4 concise, powerful paragraphs (max 350 words)
- Open with a compelling hook — NOT "I am writing to apply for…"
- If hiring manager name is given, use "Dear [Name]," otherwise "Dear Hiring Manager,"
- End with a confident, clear call to action
- Do NOT include header/address block — start directly from the salutation
- Use industry-appropriate language for ${industry || "the field"}
- Incorporate keywords naturally from the job description for ATS optimization

Also return:
- key_matches: 6-10 specific keywords/skills from JD that match the candidate
- missing_keywords: 3-5 important JD keywords NOT in the resume that could be added
- tips: 3-4 specific tips to further strengthen this letter
- tone_analysis: one sentence about how well the tone fits the role
- ats_score: estimated ATS friendliness score 0-100
- word_count: approximate word count of the letter`;
  };

  const buildRefinePrompt = ({ currentLetter, instruction, jobTitle, companyName }) => {
    return `You are an expert cover letter editor. The user wants to refine their cover letter.

CURRENT COVER LETTER:
${currentLetter}

JOB: ${jobTitle || ""} at ${companyName || ""}

USER'S REFINEMENT REQUEST:
${instruction}

Please rewrite the cover letter incorporating their request while keeping it professional, ATS-friendly, and compelling. Keep the same format (salutation, 3-4 paragraphs, closing).

Return the refined letter as plain text only — no commentary, no explanation.`;
  };

  const generate = async (params) => {
    setIsLoading(true);
    setLastParams(params);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: buildPrompt(params),
      model: "claude_sonnet_4_6",
      response_json_schema: {
        type: "object",
        properties: {
          cover_letter: { type: "string" },
          key_matches: { type: "array", items: { type: "string" } },
          missing_keywords: { type: "array", items: { type: "string" } },
          tips: { type: "array", items: { type: "string" } },
          tone_analysis: { type: "string" },
          ats_score: { type: "number" },
          word_count: { type: "number" },
        },
        required: ["cover_letter"]
      }
    });
    setResult(res);
    setIsLoading(false);
  };

  const refine = async (currentLetter, instruction) => {
    setIsRefining(true);
    const refined = await base44.integrations.Core.InvokeLLM({
      prompt: buildRefinePrompt({ currentLetter, instruction, jobTitle: lastParams?.jobTitle, companyName: lastParams?.companyName }),
      model: "claude_sonnet_4_6",
    });
    setIsRefining(false);
    return typeof refined === "string" ? refined : refined?.cover_letter || refined;
  };

  const handleGenerate = async (params) => { await generate(params); };
  const handleRegenerate = async () => { if (lastParams) await generate(lastParams); };
  const handleReset = () => { setResult(null); setLastParams(null); };

  return (
    <div className="min-h-screen bg-[#060b12] text-white">
      {/* Hero Banner */}
      {!result && (
        <div className="relative overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/25 via-[#060b12] to-pink-900/15" />
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-pink-500/8 rounded-full blur-3xl" />
          <div className="relative max-w-4xl mx-auto px-6 py-12 text-center">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 px-4 py-1.5 rounded-full text-violet-300 text-xs font-bold mb-5">
              <Heart className="w-3.5 h-3.5 text-pink-400" /> A Free Initiative by Kindness Community Foundation
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              AI Cover Letter{" "}
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Generator</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
              Craft personalized, ATS-optimized cover letters in seconds. Powered by advanced AI that analyzes job descriptions, matches your skills, and generates job-winning letters with multiple tone options.
            </p>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {STATS.map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="bg-white/4 border border-white/8 rounded-xl p-3">
                  <Icon className={`w-5 h-5 mx-auto mb-1.5 ${color}`} />
                  <p className={`text-xl font-black ${color}`}>{value}</p>
                  <p className="text-slate-500 text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-10">
        {!result ? (
          <CoverLetterSetup onGenerate={handleGenerate} isLoading={isLoading} />
        ) : (
          <CoverLetterOutput
            result={result}
            jobTitle={lastParams?.jobTitle}
            companyName={lastParams?.companyName}
            onReset={handleReset}
            onRegenerate={handleRegenerate}
            onRefine={refine}
            isLoading={isLoading}
            isRefining={isRefining}
          />
        )}
      </div>
    </div>
  );
}