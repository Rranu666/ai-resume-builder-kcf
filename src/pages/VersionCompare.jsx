import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Target, SplitSquareHorizontal, Clock, GitBranch } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

function DiffValue({ v1Val, v2Val }) {
  const a = JSON.stringify(v1Val ?? "");
  const b = JSON.stringify(v2Val ?? "");
  const changed = a !== b;

  const display = (val) => {
    if (val === null || val === undefined || val === "") return <span className="text-gray-300 italic">empty</span>;
    if (Array.isArray(val)) return <span>{val.join(", ") || <span className="text-gray-300 italic">none</span>}</span>;
    if (typeof val === "object") return <span>{JSON.stringify(val)}</span>;
    return <span>{String(val)}</span>;
  };

  return (
    <div className={`rounded-lg px-3 py-2 text-sm ${changed ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50"}`}>
      {display(v1Val)}
      {changed && (
        <>
          <div className="text-yellow-500 text-xs font-bold my-1">→ changed</div>
          <div className="text-green-700">{display(v2Val)}</div>
        </>
      )}
    </div>
  );
}

function SectionPanel({ title, data, color }) {
  if (!data) return null;

  const renderValue = (val) => {
    if (val === null || val === undefined) return <span className="text-gray-300 italic text-xs">—</span>;
    if (Array.isArray(val)) {
      if (val.length === 0) return <span className="text-gray-300 italic text-xs">none</span>;
      if (typeof val[0] === "string") return <span className="text-sm text-gray-700">{val.join(", ")}</span>;
      return (
        <div className="space-y-2">
          {val.map((item, i) => (
            <div key={i} className="text-xs bg-white/60 rounded p-2 border">
              {Object.entries(item).filter(([,v]) => v !== null && v !== undefined && v !== "").map(([k, v]) => (
                <div key={k}><span className="font-medium text-gray-500">{k}:</span> <span className="text-gray-700">{String(v)}</span></div>
              ))}
            </div>
          ))}
        </div>
      );
    }
    if (typeof val === "object") {
      return (
        <div className="space-y-1">
          {Object.entries(val).filter(([,v]) => v !== null && v !== undefined && v !== "").map(([k, v]) => (
            <div key={k} className="text-xs"><span className="font-medium text-gray-500">{k}:</span> <span className="text-gray-700">{String(v)}</span></div>
          ))}
        </div>
      );
    }
    return <span className="text-sm text-gray-700">{String(val)}</span>;
  };

  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">{title}</h4>
      <div className="space-y-2">
        {typeof data === "object" && !Array.isArray(data)
          ? Object.entries(data).map(([k, v]) => (
              <div key={k}>
                <span className="text-xs font-medium text-gray-500 capitalize">{k.replace(/_/g, " ")}: </span>
                {renderValue(v)}
              </div>
            ))
          : renderValue(data)
        }
      </div>
    </div>
  );
}

export default function VersionCompare() {
  const urlParams = new URLSearchParams(window.location.search);
  const resumeId = urlParams.get("resume_id");
  const initV1 = urlParams.get("v1");
  const initV2 = urlParams.get("v2");

  const [allVersions, setAllVersions] = useState([]);
  const [selectedV1, setSelectedV1] = useState(initV1 || "");
  const [selectedV2, setSelectedV2] = useState(initV2 || "");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (resumeId) loadVersions();
  }, [resumeId]);

  const loadVersions = async () => {
    setIsLoading(true);
    try {
      const data = await base44.entities.ResumeVersion.filter({ resume_id: resumeId }, "-version_number");
      setAllVersions(data);
      if (!initV1 && data.length > 0) setSelectedV1(data[0].id);
      if (!initV2 && data.length > 1) setSelectedV2(data[1].id);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const v1 = allVersions.find(v => v.id === selectedV1);
  const v2 = allVersions.find(v => v.id === selectedV2);

  const scoreColor = (score) => {
    if (!score) return "text-gray-400";
    if (score >= 80) return "text-green-600 font-bold";
    if (score >= 60) return "text-yellow-600 font-bold";
    return "text-red-500 font-bold";
  };

  const getDiffFields = (snap1, snap2) => {
    if (!snap1 || !snap2) return [];
    const sections = ["personal_info", "experience", "education", "skills", "projects"];
    return sections.filter(s => JSON.stringify(snap1[s]) !== JSON.stringify(snap2[s]));
  };

  const changedSections = v1 && v2 ? getDiffFields(v1.snapshot, v2.snapshot) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-indigo-200/30 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link to={resumeId ? `${createPageUrl("Editor")}?id=${resumeId}` : createPageUrl("Dashboard")}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Editor
              </Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SplitSquareHorizontal className="w-6 h-6 text-indigo-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Version Comparison</h1>
                <p className="text-sm text-gray-500">Compare two snapshots side-by-side</p>
              </div>
            </div>
            {changedSections.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-500 self-center">Changed sections:</span>
                {changedSections.map(s => (
                  <Badge key={s} className="bg-yellow-100 text-yellow-700 border-yellow-200 capitalize text-xs">
                    {s.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">Loading versions...</div>
        ) : allVersions.length < 2 ? (
          <div className="text-center py-20">
            <GitBranch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">You need at least 2 saved snapshots to compare.</p>
            <Link to={resumeId ? `${createPageUrl("Editor")}?id=${resumeId}` : createPageUrl("Dashboard")}>
              <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">Go to Editor</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Version selectors */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: "Version A", value: selectedV1, onChange: setSelectedV1, color: "border-blue-300 bg-blue-50" },
                { label: "Version B", value: selectedV2, onChange: setSelectedV2, color: "border-green-300 bg-green-50" },
              ].map(({ label, value, onChange, color }) => {
                const ver = allVersions.find(v => v.id === value);
                return (
                  <div key={label} className={`rounded-xl border-2 p-4 ${color}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <span className="font-semibold text-gray-700">{label}</span>
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger className="w-full sm:w-48 h-8 text-xs">
                          <SelectValue placeholder="Select version" />
                        </SelectTrigger>
                        <SelectContent>
                          {allVersions.map(v => (
                            <SelectItem key={v.id} value={v.id} disabled={v.id === (label === "Version A" ? selectedV2 : selectedV1)}>
                              {v.label} (v{v.version_number})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {ver && (
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{format(new Date(ver.created_date), "MMM d, yyyy")}</span>
                        {ver.ats_score > 0 && (
                          <span className={`flex items-center gap-1 ${scoreColor(ver.ats_score)}`}>
                            <Target className="w-3 h-3" /> ATS: {ver.ats_score}%
                          </span>
                        )}
                        {ver.notes && <span className="italic text-gray-400 truncate max-w-xs">{ver.notes}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ATS Score comparison bar */}
            {v1?.ats_score > 0 && v2?.ats_score > 0 && (
              <div className="bg-white/80 rounded-xl border border-gray-200 p-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  ATS Score Comparison
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { ver: v1, color: "bg-blue-500" },
                    { ver: v2, color: "bg-green-500" },
                  ].map(({ ver, color }) => (
                    <div key={ver.id}>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{ver.label}</span>
                        <span className={`font-bold ${scoreColor(ver.ats_score)}`}>{ver.ats_score}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${ver.ats_score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                {v1.ats_score !== v2.ats_score && (
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    {v2.ats_score > v1.ats_score
                      ? `✅ Version B is ${v2.ats_score - v1.ats_score}% better in ATS score`
                      : `⬇️ Version A is ${v1.ats_score - v2.ats_score}% better in ATS score`}
                  </p>
                )}
              </div>
            )}

            {/* Side-by-side content */}
            {v1 && v2 && (
              <div className="space-y-4">
                {["personal_info", "experience", "education", "skills", "projects"].map((section) => {
                  const snap1 = v1.snapshot?.[section];
                  const snap2 = v2.snapshot?.[section];
                  const isDiff = JSON.stringify(snap1) !== JSON.stringify(snap2);
                  return (
                    <div key={section} className={`rounded-xl border overflow-hidden ${isDiff ? "border-yellow-300" : "border-gray-200"}`}>
                      <div className={`flex items-center justify-between px-4 py-2 text-sm font-semibold capitalize ${isDiff ? "bg-yellow-50 text-yellow-800" : "bg-gray-50 text-gray-600"}`}>
                        <span>{section.replace(/_/g, " ")}</span>
                        {isDiff && <Badge className="bg-yellow-200 text-yellow-800 text-xs">Changed</Badge>}
                      </div>
                      <div className="grid grid-cols-2 divide-x divide-gray-100">
                        <div className="p-4 bg-blue-50/30">
                          <SectionPanel title="" data={snap1} color="" />
                        </div>
                        <div className="p-4 bg-green-50/30">
                          <SectionPanel title="" data={snap2} color="" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}