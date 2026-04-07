import React, { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Zap, Plus, X, Sparkles, GripVertical, Search, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

// Industry skills database for search suggestions
const INDUSTRY_SKILLS = {
  "Engineering": ["JavaScript", "TypeScript", "React", "Vue.js", "Node.js", "Python", "Java", "C++", "Go", "Rust", "Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "GraphQL", "REST APIs", "PostgreSQL", "MongoDB", "Redis", "Git", "Linux", "Microservices", "TDD"],
  "Design": ["Figma", "Adobe XD", "Sketch", "Illustrator", "Photoshop", "UI/UX", "Prototyping", "Wireframing", "User Research", "Design Systems", "Motion Design", "Typography", "Color Theory"],
  "Data": ["Python", "R", "SQL", "Tableau", "Power BI", "Machine Learning", "TensorFlow", "PyTorch", "Data Analysis", "Statistics", "Pandas", "NumPy", "Spark", "Hadoop", "ETL", "A/B Testing"],
  "Marketing": ["SEO", "Google Analytics", "HubSpot", "Salesforce", "Content Strategy", "Social Media", "Email Marketing", "PPC", "CRM", "Copywriting", "Brand Strategy", "Market Research"],
  "Management": ["Agile", "Scrum", "JIRA", "Roadmapping", "OKRs", "Stakeholder Management", "Budget Planning", "P&L Management", "Risk Assessment", "Change Management"],
  "Soft Skills": ["Leadership", "Communication", "Problem Solving", "Critical Thinking", "Collaboration", "Adaptability", "Time Management", "Mentoring", "Negotiation", "Presentation Skills", "Emotional Intelligence", "Decision Making", "Creativity", "Attention to Detail"],
};

const ALL_SKILLS = [...new Set(Object.values(INDUSTRY_SKILLS).flat())].sort();

// AI categorization: split skills into Hard vs Soft
async function categorizeSkillsWithAI(skills) {
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `Categorize these skills into exactly two groups: "Hard Skills" (technical, tools, measurable) and "Soft Skills" (interpersonal, behavioral). 
Skills: ${skills.join(", ")}
Return JSON with two arrays. Only include skills from the input list.`,
    response_json_schema: {
      type: "object",
      properties: {
        hard_skills: { type: "array", items: { type: "string" } },
        soft_skills: { type: "array", items: { type: "string" } },
      },
    },
  });
  return result;
}

const CategoryBadge = ({ category }) => {
  const colors = {
    "Hard Skills": "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
    "Soft Skills": "bg-violet-500/15 border-violet-500/30 text-violet-300",
    "Uncategorized": "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${colors[category] || colors["Uncategorized"]}`}>
      {category}
    </span>
  );
};

export default function SkillsSection({ data, onChange }) {
  const [newSkill, setNewSkill] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [categorized, setCategorized] = useState(null); // { "Hard Skills": [], "Soft Skills": [] }
  const [isCategorizingAI, setIsCategorizingAI] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  // Build a flat ordered list for DnD (respects category order if categorized)
  const orderedSkills = showCategories && categorized
    ? [
        ...(categorized["Hard Skills"] || []),
        ...(categorized["Soft Skills"] || []),
        ...(categorized["Uncategorized"] || []),
      ].filter(s => data.includes(s))
    : data;

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !data.includes(trimmed)) {
      const updated = [...data, trimmed];
      onChange(updated);
      // Auto-add to categorized if active
      if (categorized) {
        setCategorized(prev => ({
          ...prev,
          "Uncategorized": [...(prev["Uncategorized"] || []), trimmed],
        }));
      }
    }
    setNewSkill("");
    setSearchQuery("");
    setShowSearch(false);
  };

  const removeSkill = (skill) => {
    onChange(data.filter(s => s !== skill));
    if (categorized) {
      const updated = {};
      for (const cat in categorized) {
        updated[cat] = categorized[cat].filter(s => s !== skill);
      }
      setCategorized(updated);
    }
  };

  const handleAICategorize = async () => {
    if (data.length === 0) return;
    setIsCategorizingAI(true);
    try {
      const result = await categorizeSkillsWithAI(data);
      const hardSkills = (result.hard_skills || []).filter(s => data.includes(s));
      const softSkills = (result.soft_skills || []).filter(s => data.includes(s));
      const categorizedSet = new Set([...hardSkills, ...softSkills]);
      const uncategorized = data.filter(s => !categorizedSet.has(s));
      setCategorized({
        "Hard Skills": hardSkills,
        "Soft Skills": softSkills,
        ...(uncategorized.length ? { "Uncategorized": uncategorized } : {}),
      });
      setShowCategories(true);
    } catch (e) {
      console.error("AI categorize failed:", e);
    }
    setIsCategorizingAI(false);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (showCategories && categorized) {
      // Find source category and destination category
      const srcCat = source.droppableId;
      const dstCat = destination.droppableId;
      const updated = { ...categorized };
      const [moved] = updated[srcCat].splice(source.index, 1);
      if (!updated[dstCat]) updated[dstCat] = [];
      updated[dstCat].splice(destination.index, 0, moved);
      setCategorized(updated);
      // Reconstruct flat data order
      const newOrder = [
        ...(updated["Hard Skills"] || []),
        ...(updated["Soft Skills"] || []),
        ...(updated["Uncategorized"] || []),
      ].filter(s => data.includes(s));
      onChange(newOrder);
    } else {
      // Simple flat reorder
      const reordered = Array.from(data);
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);
      onChange(reordered);
    }
  };

  const searchResults = searchQuery.length >= 1
    ? ALL_SKILLS.filter(s =>
        s.toLowerCase().includes(searchQuery.toLowerCase()) && !data.includes(s)
      ).slice(0, 8)
    : [];

  const getCategoryForSkill = (skill) => {
    if (!categorized) return null;
    for (const cat in categorized) {
      if (categorized[cat].includes(skill)) return cat;
    }
    return "Uncategorized";
  };

  const renderSkillChip = (skill, index, droppableId) => {
    const category = getCategoryForSkill(skill);
    const chipColor = showCategories && category === "Hard Skills"
      ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
      : showCategories && category === "Soft Skills"
      ? "bg-violet-500/15 border-violet-500/30 text-violet-300"
      : "bg-emerald-500/15 border-emerald-500/30 text-emerald-300";

    return (
      <Draggable key={skill} draggableId={skill} index={index}>
        {(provided, snapshot) => (
          <span
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`flex items-center gap-1 text-sm px-2.5 py-1 rounded-full border transition-all ${chipColor} ${snapshot.isDragging ? "opacity-80 scale-105 shadow-lg" : ""}`}
          >
            <span {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing opacity-40 hover:opacity-80 transition-opacity">
              <GripVertical className="w-3 h-3" />
            </span>
            {skill}
            <button onClick={() => removeSkill(skill)} className="hover:text-rose-400 transition-colors ml-0.5">
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
      </Draggable>
    );
  };

  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400" />
          <h3 className="text-white font-semibold">Skills</h3>
          {data.length > 0 && (
            <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{data.length}</span>
          )}
        </div>
        {data.length > 0 && (
          <Button
            size="sm"
            onClick={handleAICategorize}
            disabled={isCategorizingAI}
            className="bg-violet-500/20 border border-violet-500/30 text-violet-300 hover:bg-violet-500/30 text-xs h-7"
          >
            {isCategorizingAI ? (
              <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Categorizing...</>
            ) : (
              <><Sparkles className="w-3 h-3 mr-1" /> AI Categorize</>
            )}
          </Button>
        )}
      </div>

      {/* Add Skill Input */}
      <div className="flex gap-2 mb-2">
        <Input
          value={newSkill}
          onChange={e => setNewSkill(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addSkill(newSkill)}
          placeholder="Type a skill and press Enter..."
          className="flex-1 bg-white/5 border-white/10 text-white placeholder-slate-600"
        />
        <Button onClick={() => addSkill(newSkill)} size="icon" className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-5">
        <div
          className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 cursor-text"
          onClick={() => setShowSearch(true)}
        >
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
            placeholder="Search industry-standard skills..."
            className="flex-1 bg-transparent text-white text-sm placeholder-slate-600 outline-none"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); setShowSearch(false); }}>
              <X className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300" />
            </button>
          )}
        </div>
        {showSearch && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-[#111827] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            {searchResults.map(skill => (
              <button
                key={skill}
                onMouseDown={() => addSkill(skill)}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-500" />
                {skill}
              </button>
            ))}
          </div>
        )}
        {showSearch && searchQuery.length >= 1 && searchResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-[#111827] border border-white/10 rounded-xl shadow-2xl p-4 text-center text-sm text-slate-500">
            No suggestions found — press Enter to add "{searchQuery}"
          </div>
        )}
      </div>

      {/* Skills Display */}
      {data.length === 0 ? (
        <div className="text-center py-10 text-slate-600">
          <Zap className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Add your technical and soft skills above or search for industry skills.</p>
        </div>
      ) : showCategories && categorized ? (
        // Categorized View
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="space-y-4 mb-5">
            {Object.entries(categorized).map(([category, skills]) => skills.length > 0 && (
              <div key={category}>
                <div className="flex items-center gap-2 mb-2">
                  <CategoryBadge category={category} />
                  <span className="text-xs text-slate-600">({skills.length})</span>
                </div>
                <Droppable droppableId={category} direction="horizontal">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex flex-wrap gap-2 min-h-[36px] p-2 rounded-xl transition-colors ${snapshot.isDraggingOver ? "bg-white/5 border border-white/10" : ""}`}
                    >
                      {skills.map((skill, i) => renderSkillChip(skill, i, category))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
          <button onClick={() => setShowCategories(false)} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
            ↩ Show flat view
          </button>
        </DragDropContext>
      ) : (
        // Flat DnD View
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="skills" direction="horizontal">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-wrap gap-2 mb-5 min-h-[36px]">
                {data.map((skill, i) => renderSkillChip(skill, i, "skills"))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Quick-add row */}
      <div>
        <p className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wider">Popular Quick-Add</p>
        <div className="flex flex-wrap gap-1.5">
          {["JavaScript", "React", "Python", "Node.js", "AWS", "SQL", "Git", "Docker", "Leadership", "Communication"].map(skill => (
            <button key={skill} onClick={() => !data.includes(skill) && addSkill(skill)}
              disabled={data.includes(skill)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                data.includes(skill)
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 cursor-default"
                  : "bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10 hover:border-white/20"
              }`}>
              {data.includes(skill) ? "✓ " : "+ "}{skill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}