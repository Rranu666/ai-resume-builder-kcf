import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { History, GitBranch, RotateCcw, SplitSquareHorizontal, Plus, Clock, Target, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function VersionHistory({ resume, resumeId, onRestore }) {
  const [versions, setVersions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [restoreConfirm, setRestoreConfirm] = useState(null);

  useEffect(() => {
    if (resumeId) loadVersions();
  }, [resumeId]);

  const loadVersions = async () => {
    setIsLoading(true);
    try {
      const data = await base44.entities.ResumeVersion.filter({ resume_id: resumeId }, "-version_number");
      setVersions(data);
    } catch (e) {
      console.error("Error loading versions:", e);
    }
    setIsLoading(false);
  };

  const saveSnapshot = async () => {
    if (!resume || !resumeId) return;
    setIsSaving(true);
    try {
      const nextNumber = versions.length > 0 ? (versions[0].version_number + 1) : 1;
      const label = newLabel.trim() || `Version ${nextNumber}`;
      await base44.entities.ResumeVersion.create({
        resume_id: resumeId,
        version_number: nextNumber,
        label,
        notes: newNotes.trim(),
        ats_score: resume.ats_score || 0,
        snapshot: {
          title: resume.title,
          template: resume.template,
          personal_info: resume.personal_info,
          experience: resume.experience,
          education: resume.education,
          skills: resume.skills,
          projects: resume.projects,
          ats_score: resume.ats_score,
        },
      });
      setNewLabel("");
      setNewNotes("");
      setShowSaveDialog(false);
      await loadVersions();
    } catch (e) {
      console.error("Error saving snapshot:", e);
    }
    setIsSaving(false);
  };

  const deleteVersion = async (versionId) => {
    try {
      await base44.entities.ResumeVersion.delete(versionId);
      setVersions(prev => prev.filter(v => v.id !== versionId));
    } catch (e) {
      console.error("Error deleting version:", e);
    }
  };

  const handleRestore = (version) => {
    setRestoreConfirm(version);
  };

  const confirmRestore = () => {
    if (restoreConfirm && onRestore) {
      onRestore(restoreConfirm.snapshot);
      setRestoreConfirm(null);
    }
  };

  const scoreColor = (score) => {
    if (!score) return "text-gray-400";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-500";
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-200/50 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">Version History</h3>
          <Badge variant="secondary" className="text-xs">{versions.length}</Badge>
        </div>
        <Button
          size="sm"
          onClick={() => setShowSaveDialog(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Save Snapshot
        </Button>
      </div>

      {/* Versions list */}
      <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="p-6 text-center text-gray-400 text-sm">Loading versions...</div>
        ) : versions.length === 0 ? (
          <div className="p-6 text-center">
            <GitBranch className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No snapshots yet.</p>
            <p className="text-xs text-gray-400 mt-1">Save your first version to start tracking changes.</p>
          </div>
        ) : (
          versions.map((version, idx) => (
            <div key={version.id} className="p-3 hover:bg-gray-50 transition-colors group">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900 truncate">{version.label}</span>
                    {idx === 0 && (
                      <Badge className="bg-indigo-100 text-indigo-700 text-xs px-1.5 py-0 h-4">Latest</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {format(new Date(version.created_date), "MMM d, yyyy h:mm a")}
                    </span>
                    {version.ats_score > 0 && (
                      <span className={`flex items-center gap-1 text-xs font-medium ${scoreColor(version.ats_score)}`}>
                        <Target className="w-3 h-3" />
                        {version.ats_score}%
                      </span>
                    )}
                  </div>
                  {version.notes && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{version.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-indigo-600 hover:bg-indigo-50"
                    onClick={() => handleRestore(version)}
                    title="Restore this version"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                  {versions.length > 1 && (
                    <Link
                      to={`${createPageUrl("VersionCompare")}?resume_id=${resumeId}&v1=${version.id}&v2=${versions.find(v => v.id !== version.id)?.id}`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-green-600 hover:bg-green-50"
                        title="Compare versions"
                      >
                        <SplitSquareHorizontal className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500 hover:bg-red-50"
                    onClick={() => deleteVersion(version.id)}
                    title="Delete version"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Compare link */}
      {versions.length >= 2 && (
        <div className="p-3 border-t border-gray-100">
          <Link to={`${createPageUrl("VersionCompare")}?resume_id=${resumeId}&v1=${versions[0]?.id}&v2=${versions[1]?.id}`}>
            <Button variant="outline" size="sm" className="w-full gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
              <SplitSquareHorizontal className="w-4 h-4" />
              Compare Latest Two Versions
            </Button>
          </Link>
        </div>
      )}

      {/* Save snapshot dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-600" />
              Save Version Snapshot
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Version Label</label>
              <Input
                placeholder={`Version ${versions.length + 1}`}
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Notes (optional)</label>
              <Textarea
                placeholder="What changed in this version? e.g. Added Google internship, rewrote summary..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
              <Target className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Current ATS score: <strong className={scoreColor(resume?.ats_score)}>{resume?.ats_score || 0}%</strong> will be saved with this snapshot.</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
            <Button
              onClick={saveSnapshot}
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isSaving ? "Saving..." : "Save Snapshot"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore confirm dialog */}
      <Dialog open={!!restoreConfirm} onOpenChange={() => setRestoreConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-orange-500" />
              Restore Version?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 py-2">
            This will overwrite your current resume content with <strong>"{restoreConfirm?.label}"</strong>. 
            Consider saving a snapshot first to preserve your current state.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreConfirm(null)}>Cancel</Button>
            <Button onClick={confirmRestore} className="bg-orange-500 hover:bg-orange-600 text-white">
              Restore Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}