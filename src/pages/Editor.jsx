import React, { useState, useEffect, useCallback } from "react";
import { Resume } from "@/entities/Resume";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Sparkles, Target, FileDown } from "lucide-react";
import VersionHistory from "../components/editor/VersionHistory";
import AuthPromptModal from "@/components/common/AuthPromptModal";
import PDFExportModal from "../components/editor/PDFExportModal";
import LinkedInExportButton from "../components/linkedin/LinkedInExportButton";

import PersonalSection from "../components/editor/PersonalSection";
import ExperienceSection from "../components/editor/ExperienceSection";
import EducationSection from "../components/editor/EducationSection";
import SkillsSection from "../components/editor/SkillsSection";
import ProjectsSection from "../components/editor/ProjectsSection";
import ResumePreview from "../components/editor/ResumePreview";
import AIAssistant from "../components/editor/AIAssistant";
import ATSSuggestions from "../components/editor/ATSSuggestions";
import ThemeEditor, { DEFAULT_THEME } from "../components/editor/ThemeEditor";
import ResumeLoader from "@/components/common/ResumeLoader";

export default function Editor() {
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting] = useState(false);
  const [isScoringATS, setIsScoringATS] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [authPrompt, setAuthPrompt] = useState({ open: false, reason: "", pendingAction: null });
  const [showExportModal, setShowExportModal] = useState(false);
  const [theme, setTheme] = useState(DEFAULT_THEME);

  const urlParams = new URLSearchParams(window.location.search);
  const resumeId = urlParams.get("id");

  const loadResume = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await Resume.list();
      const found = data.find(r => r.id === resumeId);
      if (found) setResume(found);
    } catch (e) { console.error(e); }
    setIsLoading(false);
  }, [resumeId]);

  useEffect(() => { if (resumeId) loadResume(); }, [resumeId, loadResume]);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user?.custom_theme) setTheme({ ...DEFAULT_THEME, ...user.custom_theme });
    }).catch(() => {});
  }, []);

  const requireAuth = async (reason, action) => {
    const authed = await base44.auth.isAuthenticated();
    if (authed) action();
    else setAuthPrompt({ open: true, reason, pendingAction: action });
  };

  const saveResume = () => {
    requireAuth("save your resume", async () => {
      setIsSaving(true);
      try { await Resume.update(resumeId, resume); } catch (e) { console.error(e); }
      setIsSaving(false);
    });
  };

  const exportResume = () => requireAuth("download your resume", () => setShowExportModal(true));

  const calculateATSScore = async () => {
    setIsScoringATS(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this resume for ATS optimization. Score 0-100. Consider: contact info completeness, keywords, quantified achievements, formatting, section organization.
Resume: ${JSON.stringify(resume)}
Return only a numeric score.`,
        response_json_schema: { type: "object", properties: { score: { type: "number", minimum: 0, maximum: 100 } } }
      });
      const updated = { ...resume, ats_score: response.score || 0 };
      setResume(updated);
      if (resumeId) await Resume.update(resumeId, updated);
    } catch (e) { console.error(e); }
    setIsScoringATS(false);
  };

  const updateResume = (section, data) => setResume(prev => ({ ...prev, [section]: data }));

  if (isLoading) return <ResumeLoader />;

  if (!resume) return (
    <div className="min-h-screen bg-[#060b12] flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-400 text-xl mb-4">Resume not found</p>
        <Button onClick={() => window.history.back()} variant="outline" className="border-white/10 text-white hover:bg-white/5">Go Back</Button>
      </div>
    </div>
  );

  const atsColor = (s) => s >= 80 ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" : s >= 60 ? "text-amber-400 border-amber-500/30 bg-amber-500/10" : "text-rose-400 border-rose-500/30 bg-rose-500/10";

  return (
    <div className="min-h-screen bg-[#060b12]">
      {/* Header */}
      <div className="bg-[#060b12]/95 backdrop-blur-xl border-b border-white/5 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">{resume.title}</h1>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="text-xs bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded-full capitalize">{resume.template} template</span>
              {resume.ats_score > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${atsColor(resume.ats_score)}`}>
                  ATS {resume.ats_score}%
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={calculateATSScore}
              disabled={isScoringATS}
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
            >
              {isScoringATS ? <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mr-1" /> : <Target className="w-4 h-4 mr-1.5" />}
              ATS Score
            </Button>
            <LinkedInExportButton resume={resume} />
            <Button
              variant="outline"
              size="sm"
              onClick={exportResume}
              disabled={isExporting}
              className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
            >
              {isExporting ? <div className="w-4 h-4 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin mr-1" /> : <FileDown className="w-4 h-4 mr-1.5" />}
              Export PDF
            </Button>
            <Button
              size="sm"
              onClick={saveResume}
              disabled={isSaving}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold shadow-lg shadow-emerald-500/20"
            >
              {isSaving ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1.5" />}
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-3 gap-6">
        {/* Editor Tabs */}
        <div className="lg:col-span-2">
          <Tabs value={activeSection} onValueChange={setActiveSection}>
            <TabsList className="grid w-full grid-cols-5 bg-white/5 border border-white/8 rounded-xl mb-5 p-1">
              {["personal", "experience", "education", "skills", "projects"].map(tab => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="capitalize text-xs rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-cyan-500 data-[state=active]:text-black data-[state=active]:font-bold text-slate-500 hover:text-slate-300 transition-all"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="personal">
              <PersonalSection
                data={resume.personal_info || {}}
                onChange={data => updateResume("personal_info", data)}
                onLinkedInImport={parsed => setResume(prev => ({
                  ...prev,
                  personal_info: parsed.personal_info || prev.personal_info,
                  experience: parsed.experience?.length ? parsed.experience : prev.experience,
                  education: parsed.education?.length ? parsed.education : prev.education,
                  skills: parsed.skills?.length ? parsed.skills : prev.skills,
                  projects: parsed.projects?.length ? parsed.projects : prev.projects,
                }))}
              />
            </TabsContent>
            <TabsContent value="experience">
              <ExperienceSection data={resume.experience || []} onChange={data => updateResume("experience", data)} />
            </TabsContent>
            <TabsContent value="education">
              <EducationSection data={resume.education || []} onChange={data => updateResume("education", data)} />
            </TabsContent>
            <TabsContent value="skills">
              <SkillsSection data={resume.skills || []} onChange={data => updateResume("skills", data)} />
            </TabsContent>
            <TabsContent value="projects">
              <ProjectsSection data={resume.projects || []} onChange={data => updateResume("projects", data)} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Side Panel */}
        <div className="space-y-5">
          <ResumePreview resume={resume} theme={theme} />
          <ThemeEditor theme={theme} onChange={setTheme} />
          <ATSSuggestions resume={resume} onUpdateResume={setResume} />
          <AIAssistant resume={resume} onUpdateResume={setResume} />
          <VersionHistory
            resume={resume}
            resumeId={resumeId}
            onRestore={snapshot => setResume(prev => ({ ...prev, ...snapshot }))}
          />
        </div>
      </div>

      <AuthPromptModal
        open={authPrompt.open}
        onClose={() => setAuthPrompt({ open: false, reason: "", pendingAction: null })}
        reason={authPrompt.reason}
      />
      <PDFExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        resume={resume}
      />
    </div>
  );
}