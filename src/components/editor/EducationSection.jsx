import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GraduationCap, Plus, X } from "lucide-react";

const inputCls = "bg-white/5 border-white/10 text-white placeholder-slate-600 focus:border-emerald-500/50";
const labelCls = "text-slate-400 text-sm font-medium";

export default function EducationSection({ data, onChange }) {
  const addEducation = () => onChange([...data, { degree: "", institution: "", location: "", graduation_year: "", gpa: "" }]);
  const removeEducation = (i) => onChange(data.filter((_, idx) => idx !== i));
  const updateEducation = (i, field, value) => onChange(data.map((edu, idx) => idx === i ? { ...edu, [field]: value } : edu));

  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-emerald-400" />
          <h3 className="text-white font-semibold">Education</h3>
        </div>
        <Button onClick={addEducation} size="sm" className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" /> Add Education
        </Button>
      </div>

      <div className="space-y-5">
        {data.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No education yet. Click "Add Education" to start.</p>
          </div>
        ) : data.map((edu, i) => (
          <div key={i} className="bg-white/3 border border-white/8 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Education {i + 1}</span>
              <Button onClick={() => removeEducation(i)} size="sm" variant="ghost" className="text-rose-400 hover:bg-rose-500/10 h-7 w-7 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className={labelCls}>Degree</Label>
                <Input value={edu.degree || ""} onChange={e => updateEducation(i, "degree", e.target.value)} placeholder="Bachelor of Science in Computer Science" className={`mt-1 ${inputCls}`} />
              </div>
              <div>
                <Label className={labelCls}>Institution</Label>
                <Input value={edu.institution || ""} onChange={e => updateEducation(i, "institution", e.target.value)} placeholder="University of California" className={`mt-1 ${inputCls}`} />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label className={labelCls}>Location</Label>
                <Input value={edu.location || ""} onChange={e => updateEducation(i, "location", e.target.value)} placeholder="Berkeley, CA" className={`mt-1 ${inputCls}`} />
              </div>
              <div>
                <Label className={labelCls}>Graduation Year</Label>
                <Input value={edu.graduation_year || ""} onChange={e => updateEducation(i, "graduation_year", e.target.value)} placeholder="2023" className={`mt-1 ${inputCls}`} />
              </div>
              <div>
                <Label className={labelCls}>GPA (Optional)</Label>
                <Input value={edu.gpa || ""} onChange={e => updateEducation(i, "gpa", e.target.value)} placeholder="3.8/4.0" className={`mt-1 ${inputCls}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}