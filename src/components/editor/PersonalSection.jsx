import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User, Upload, X, Linkedin, Mic, MicOff, Sparkles } from "lucide-react";
import LinkedInImporter from "@/components/LinkedInImporter";

export default function PersonalSection({ data, onChange, onLinkedInImport }) {
  const [isUploading, setIsUploading] = useState(false);
  const [showLinkedIn, setShowLinkedIn] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const updateField = (field, value) => onChange({ ...data, [field]: value });

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const response = await base44.integrations.Core.UploadFile({ file });
      updateField("profile_photo", response.file_url);
    } catch (e) { console.error(e); }
    setIsUploading(false);
  };

  const generateSummary = async () => {
    if (!data.full_name) return;
    setIsGeneratingSummary(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Write a compelling 2-3 sentence professional summary for a resume.
Name: ${data.full_name}
Current summary hint: ${data.summary || "N/A"}
Make it ATS-friendly, confident, and specific.`,
        response_json_schema: { type: "object", properties: { summary: { type: "string" } } },
      });
      if (res.summary) updateField("summary", res.summary);
    } catch (e) { console.error(e); }
    setIsGeneratingSummary(false);
  };

  const inputCls = "bg-white/5 border-white/10 text-white placeholder-slate-600 focus:border-emerald-500/50";
  const labelCls = "text-slate-400 text-sm font-medium";

  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-400" />
          <h3 className="text-white font-semibold">Personal Information</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLinkedIn(true)}
          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 gap-2 text-xs"
        >
          <Linkedin className="w-3.5 h-3.5" />
          Import LinkedIn
        </Button>
      </div>

      <LinkedInImporter
        open={showLinkedIn}
        onClose={() => setShowLinkedIn(false)}
        onImport={(parsed) => {
          if (onLinkedInImport) onLinkedInImport(parsed);
          else if (parsed.personal_info) onChange(parsed.personal_info);
          setShowLinkedIn(false);
        }}
      />

      {/* Profile Photo */}
      <div className="flex items-center gap-5 mb-6 p-4 bg-white/3 rounded-xl border border-white/5">
        <div className="flex-shrink-0">
          {data.profile_photo ? (
            <div className="relative">
              <img src={data.profile_photo} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500/40" />
              <Button size="sm" variant="destructive" onClick={() => updateField("profile_photo", "")}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0">
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center">
              <User className="w-8 h-8 text-slate-600" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <Label className={labelCls}>Profile Photo (Optional)</Label>
          <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading}
            className="mt-1.5 bg-white/5 border-white/10 text-slate-400 text-sm file:bg-emerald-500/20 file:text-emerald-400 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-xs" />
          <p className="text-xs text-slate-600 mt-1">JPG, PNG · Max 5MB</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName" className={labelCls}>Full Name *</Label>
            <Input id="fullName" value={data.full_name || ""} onChange={e => updateField("full_name", e.target.value)}
              placeholder="Jane Smith" className={`mt-1 ${inputCls}`} />
          </div>
          <div>
            <Label htmlFor="email" className={labelCls}>Email *</Label>
            <Input id="email" type="email" value={data.email || ""} onChange={e => updateField("email", e.target.value)}
              placeholder="jane@example.com" className={`mt-1 ${inputCls}`} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone" className={labelCls}>Phone</Label>
            <Input id="phone" value={data.phone || ""} onChange={e => updateField("phone", e.target.value)}
              placeholder="+1 (555) 123-4567" className={`mt-1 ${inputCls}`} />
          </div>
          <div>
            <Label htmlFor="location" className={labelCls}>Location</Label>
            <Input id="location" value={data.location || ""} onChange={e => updateField("location", e.target.value)}
              placeholder="San Francisco, CA" className={`mt-1 ${inputCls}`} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="linkedin" className={labelCls}>LinkedIn</Label>
            <Input id="linkedin" value={data.linkedin || ""} onChange={e => updateField("linkedin", e.target.value)}
              placeholder="linkedin.com/in/janesmith" className={`mt-1 ${inputCls}`} />
          </div>
          <div>
            <Label htmlFor="website" className={labelCls}>Website / Portfolio</Label>
            <Input id="website" value={data.website || ""} onChange={e => updateField("website", e.target.value)}
              placeholder="janesmith.dev" className={`mt-1 ${inputCls}`} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="summary" className={labelCls}>Professional Summary</Label>
            <Button
              size="sm"
              variant="ghost"
              onClick={generateSummary}
              disabled={isGeneratingSummary || !data.full_name}
              className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 h-7 px-2 text-xs gap-1"
            >
              {isGeneratingSummary
                ? <div className="w-3 h-3 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
                : <Sparkles className="w-3 h-3" />
              }
              AI Write
            </Button>
          </div>
          <Textarea
            id="summary"
            value={data.summary || ""}
            onChange={e => updateField("summary", e.target.value)}
            placeholder="A brief professional summary highlighting your key strengths, achievements, and career objectives..."
            rows={4}
            className={inputCls}
          />
          <p className="text-xs text-slate-600 mt-1">Keep it 2–3 sentences. Click "AI Write" to auto-generate.</p>
        </div>
      </div>
    </div>
  );
}