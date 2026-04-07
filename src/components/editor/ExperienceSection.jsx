import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Briefcase, Plus, X } from "lucide-react";

const inputCls = "bg-white/5 border-white/10 text-white placeholder-slate-600 focus:border-emerald-500/50";
const labelCls = "text-slate-400 text-sm font-medium";

export default function ExperienceSection({ data, onChange }) {
  const addExperience = () => {
    const newExperience = {
      title: "",
      company: "",
      location: "",
      start_date: "",
      end_date: "",
      current: false,
      bullets: [""]
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateExperience = (index, field, value) => {
    const updated = data.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    onChange(updated);
  };

  const addBullet = (expIndex) => {
    const updated = data.map((exp, i) => 
      i === expIndex ? { ...exp, bullets: [...exp.bullets, ""] } : exp
    );
    onChange(updated);
  };

  const updateBullet = (expIndex, bulletIndex, value) => {
    const updated = data.map((exp, i) => {
      if (i === expIndex) {
        const newBullets = [...exp.bullets];
        newBullets[bulletIndex] = value;
        return { ...exp, bullets: newBullets };
      }
      return exp;
    });
    onChange(updated);
  };

  const removeBullet = (expIndex, bulletIndex) => {
    const updated = data.map((exp, i) => {
      if (i === expIndex) {
        return { ...exp, bullets: exp.bullets.filter((_, bi) => bi !== bulletIndex) };
      }
      return exp;
    });
    onChange(updated);
  };

  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-emerald-400" />
          <h3 className="text-white font-semibold">Work Experience</h3>
        </div>
        <Button onClick={addExperience} size="sm" className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" /> Add Experience
        </Button>
      </div>

      <div className="space-y-5">
        {data.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No experience yet. Click "Add Experience" to start.</p>
          </div>
        ) : data.map((experience, expIndex) => (
          <div key={expIndex} className="bg-white/3 border border-white/8 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Experience {expIndex + 1}</span>
              <Button onClick={() => removeExperience(expIndex)} size="sm" variant="ghost" className="text-rose-400 hover:bg-rose-500/10 h-7 w-7 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label className={labelCls}>Job Title</Label><Input value={experience.title || ""} onChange={e => updateExperience(expIndex, "title", e.target.value)} placeholder="Software Engineer" className={`mt-1 ${inputCls}`} /></div>
              <div><Label className={labelCls}>Company</Label><Input value={experience.company || ""} onChange={e => updateExperience(expIndex, "company", e.target.value)} placeholder="Tech Company Inc." className={`mt-1 ${inputCls}`} /></div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div><Label className={labelCls}>Location</Label><Input value={experience.location || ""} onChange={e => updateExperience(expIndex, "location", e.target.value)} placeholder="San Francisco, CA" className={`mt-1 ${inputCls}`} /></div>
              <div><Label className={labelCls}>Start Date</Label><Input type="month" value={experience.start_date || ""} onChange={e => updateExperience(expIndex, "start_date", e.target.value)} className={`mt-1 ${inputCls}`} /></div>
              <div><Label className={labelCls}>End Date</Label><Input type="month" value={experience.end_date || ""} onChange={e => updateExperience(expIndex, "end_date", e.target.value)} disabled={experience.current} className={`mt-1 ${inputCls} disabled:opacity-40`} /></div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id={`current-${expIndex}`} checked={experience.current || false} onChange={e => updateExperience(expIndex, "current", e.target.checked)} className="rounded accent-emerald-500" />
              <Label htmlFor={`current-${expIndex}`} className={labelCls}>Currently working here</Label>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className={labelCls}>Key Achievements</Label>
                <Button onClick={() => addBullet(expIndex)} size="sm" variant="ghost" className="text-emerald-400 hover:bg-emerald-500/10 h-7 text-xs gap-1 px-2">
                  <Plus className="w-3 h-3" /> Add Bullet
                </Button>
              </div>
              <div className="space-y-2">
                {(experience.bullets || []).map((bullet, bi) => (
                  <div key={bi} className="flex gap-2">
                    <Textarea value={bullet} onChange={e => updateBullet(expIndex, bi, e.target.value)} placeholder="Achieved 30% increase in team productivity by implementing..." rows={2} className={`flex-1 ${inputCls}`} />
                    <Button onClick={() => removeBullet(expIndex, bi)} size="sm" variant="ghost" className="text-rose-400 hover:bg-rose-500/10 h-auto px-2"><X className="w-3.5 h-3.5" /></Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}