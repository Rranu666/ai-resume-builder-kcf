import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Code, Plus, X } from "lucide-react";

const inputCls = "bg-white/5 border-white/10 text-white placeholder-slate-600 focus:border-emerald-500/50";
const labelCls = "text-slate-400 text-sm font-medium";

export default function ProjectsSection({ data, onChange }) {
  const addProject = () => onChange([...data, { name: "", description: "", technologies: [], link: "" }]);
  const removeProject = (i) => onChange(data.filter((_, idx) => idx !== i));
  const updateProject = (i, field, value) => onChange(data.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  const addTech = (pi, tech) => {
    if (!tech.trim() || data[pi].technologies.includes(tech.trim())) return;
    onChange(data.map((p, i) => i === pi ? { ...p, technologies: [...p.technologies, tech.trim()] } : p));
  };
  const removeTech = (pi, tech) => onChange(data.map((p, i) => i === pi ? { ...p, technologies: p.technologies.filter(t => t !== tech) } : p));

  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-emerald-400" />
          <h3 className="text-white font-semibold">Projects</h3>
        </div>
        <Button onClick={addProject} size="sm" className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" /> Add Project
        </Button>
      </div>

      <div className="space-y-5">
        {data.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            <Code className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No projects yet. Showcase your best work!</p>
          </div>
        ) : data.map((project, i) => (
          <ProjectCard key={i} project={project} index={i} updateProject={updateProject} removeProject={removeProject} addTech={addTech} removeTech={removeTech} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, index, updateProject, removeProject, addTech, removeTech }) {
  const [newTech, setNewTech] = useState("");

  const handleAddTech = () => {
    if (newTech.trim()) { addTech(index, newTech); setNewTech(""); }
  };

  return (
    <div className="bg-white/3 border border-white/8 rounded-xl p-5 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Project {index + 1}</span>
        <Button onClick={() => removeProject(index)} size="sm" variant="ghost" className="text-rose-400 hover:bg-rose-500/10 h-7 w-7 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className={labelCls}>Project Name</Label>
          <Input value={project.name || ""} onChange={e => updateProject(index, "name", e.target.value)} placeholder="E-commerce Platform" className={`mt-1 ${inputCls}`} />
        </div>
        <div>
          <Label className={labelCls}>Link (Optional)</Label>
          <Input value={project.link || ""} onChange={e => updateProject(index, "link", e.target.value)} placeholder="https://github.com/..." className={`mt-1 ${inputCls}`} />
        </div>
      </div>
      <div>
        <Label className={labelCls}>Description</Label>
        <Textarea value={project.description || ""} onChange={e => updateProject(index, "description", e.target.value)} placeholder="Brief description of the project, key features, and your role..." rows={3} className={`mt-1 ${inputCls}`} />
      </div>
      <div>
        <Label className={labelCls}>Technologies Used</Label>
        <div className="flex gap-2 mt-1 mb-2">
          <Input value={newTech} onChange={e => setNewTech(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddTech()} placeholder="React, Node.js..." className={inputCls} />
          <Button onClick={handleAddTech} size="icon" className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"><Plus className="w-4 h-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(project.technologies || []).map((tech, ti) => (
            <span key={ti} className="flex items-center gap-1.5 bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs px-2.5 py-1 rounded-full">
              {tech}
              <button onClick={() => removeTech(index, tech)} className="text-blue-400 hover:text-rose-400 transition-colors"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}