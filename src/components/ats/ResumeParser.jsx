import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function ResumeParser({ onParseSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Upload PDF to storage
      const uploadResponse = await base44.integrations.Core.UploadFile({
        file: file
      });

      // Parse resume using AI
      const parseResponse = await base44.functions.invoke('parseResumePDF', {
        file_url: uploadResponse.file_url
      });

      if (parseResponse.data.success) {
        setParsedData(parseResponse.data.data);
        setSuccess(true);
        onParseSuccess?.(parseResponse.data.data);
      } else {
        setError('Failed to parse resume');
      }
    } catch (err) {
      setError(err.message || 'Error uploading and parsing resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-emerald-500/20">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Resume Parser</h3>
        </div>

        {!success ? (
          <div className="space-y-3">
            <label className="block">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={loading}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold rounded-lg cursor-pointer hover:from-emerald-400 hover:to-cyan-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Parsing resume...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload PDF Resume
                  </>
                )}
              </label>
            </label>

            {error && (
              <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <p className="text-xs text-slate-400 text-center">
              Upload a PDF resume to automatically extract skills, experience, education, and contact information.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <p className="text-sm font-medium text-emerald-300">Resume parsed successfully!</p>
            </div>

            {parsedData && (
              <div className="space-y-3 text-sm text-slate-300">
                {parsedData.full_name && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Name</p>
                    <p className="font-semibold text-white">{parsedData.full_name}</p>
                  </div>
                )}
                {parsedData.email && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Email</p>
                    <p className="text-emerald-300">{parsedData.email}</p>
                  </div>
                )}
                {parsedData.skills && parsedData.skills.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Skills</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {parsedData.skills.slice(0, 6).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded text-xs text-emerald-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {parsedData.skills.length > 6 && (
                        <span className="px-2 py-1 text-xs text-slate-400">
                          +{parsedData.skills.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={() => {
                setSuccess(false);
                setParsedData(null);
              }}
              variant="outline"
              className="w-full text-slate-300 hover:text-white"
            >
              Parse Another Resume
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}