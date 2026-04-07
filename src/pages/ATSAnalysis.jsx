import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, RotateCcw, Target, FileText, TrendingUp, 
  CheckCircle, Star, AlertCircle, Lightbulb, Zap, Brain
} from "lucide-react";
import ATSScoreGauge from "@/components/ats/ATSScoreGauge";
import DimensionCard from "@/components/ats/DimensionCard";
import RecommendationList from "@/components/ats/RecommendationList";
import ATSExportButton from "@/components/ats/ATSExportButton";

export default function ATSAnalysis() {
  const { resumeId } = useParams();
  const queryClient = useQueryClient();
  const [analysis, setAnalysis] = useState(null);

  const { data: resume, isLoading: resumeLoading } = useQuery({
    queryKey: ['resume', resumeId],
    queryFn: () => base44.entities.Resume.get(resumeId),
  });

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const result = await base44.functions.invoke('analyzeATS', { resumeId });
      return result.data;
    },
    onSuccess: (data) => {
      setAnalysis(data.analysis);
      queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
    },
  });

  useEffect(() => {
    if (resume?.ats_score) {
      // Load existing analysis if available
      analyzeMutation.mutate();
    }
  }, [resume]);

  const handleReanalyze = () => {
    analyzeMutation.mutate();
  };

  if (resumeLoading) {
    return (
      <div className="min-h-screen bg-[#060b12] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060b12] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#060b12]/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/Dashboard">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">{resume?.title}</h1>
                <p className="text-sm text-slate-500">ATS Analysis & Optimization</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {analysis && <ATSExportButton resume={resume} />}
              <Button 
                onClick={handleReanalyze}
                disabled={analyzeMutation.isPending}
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white gap-2"
              >
                <RotateCcw className={`w-4 h-4 ${analyzeMutation.isPending ? 'animate-spin' : ''}`} />
                {analyzeMutation.isPending ? 'Analyzing...' : 'Re-analyze'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!analysis ? (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Brain className="w-10 h-10 text-violet-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">ATS Strength Analysis</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
                Get a comprehensive analysis of your resume's ATS compatibility with specific recommendations to improve your chances of getting noticed.
              </p>
              <Button
                onClick={handleReanalyze}
                size="lg"
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-bold px-8 py-4 text-base"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start ATS Analysis
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Overall Score Section */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Score Card */}
                <Card className="lg:col-span-1 bg-gradient-to-br from-violet-950/50 to-purple-950/50 border-violet-500/30">
                  <CardContent className="p-6 space-y-4">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-white mb-2">Overall Strength Score</h3>
                      <ATSScoreGauge score={analysis.overall_score} size="large" />
                    </div>
                    <div className="space-y-2 pt-4 border-t border-white/10">
                      {analysis.overall_score >= 85 && (
                        <div className="flex items-center gap-2 text-emerald-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Excellent! Your resume is highly ATS-friendly</span>
                        </div>
                      )}
                      {analysis.overall_score >= 70 && analysis.overall_score < 85 && (
                        <div className="flex items-center gap-2 text-cyan-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Good score! A few improvements can boost it further</span>
                        </div>
                      )}
                      {analysis.overall_score >= 50 && analysis.overall_score < 70 && (
                        <div className="flex items-center gap-2 text-amber-400 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>Average score. Several improvements recommended</span>
                        </div>
                      )}
                      {analysis.overall_score < 50 && (
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>Needs significant improvement for ATS compatibility</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Dimension Scores */}
                <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
                  <DimensionCard
                    name="Keyword Density"
                    score={analysis.dimension_scores.keyword_density}
                    dimensionKey="keyword_density"
                    color="emerald"
                    description="Industry keywords & skills"
                  />
                  <DimensionCard
                    name="Formatting"
                    score={analysis.dimension_scores.formatting}
                    dimensionKey="formatting"
                    color="cyan"
                    description="ATS-friendly structure"
                  />
                  <DimensionCard
                    name="Impact"
                    score={analysis.dimension_scores.impact}
                    dimensionKey="impact"
                    color="violet"
                    description="Action verbs & achievements"
                  />
                  <DimensionCard
                    name="Completeness"
                    score={analysis.dimension_scores.completeness}
                    dimensionKey="completeness"
                    color="amber"
                    description="Essential sections present"
                  />
                  <DimensionCard
                    name="Relevance"
                    score={analysis.dimension_scores.relevance}
                    dimensionKey="relevance"
                    color="pink"
                    description="Tailored & specific content"
                  />
                </div>
              </div>

              {/* Analysis Summary */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-emerald-950/20 border-emerald-500/30">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-lg font-bold text-white">Strengths</h3>
                    </div>
                    <ul className="space-y-2">
                      {analysis.analysis.strengths?.map((strength, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-2 text-sm text-slate-300"
                        >
                          <span className="text-emerald-400 mt-1">✓</span>
                          {strength}
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-amber-950/20 border-amber-500/30">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                      <h3 className="text-lg font-bold text-white">Areas for Improvement</h3>
                    </div>
                    <ul className="space-y-2">
                      {analysis.analysis.weaknesses?.map((weakness, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-2 text-sm text-slate-300"
                        >
                          <span className="text-amber-400 mt-1">!</span>
                          {weakness}
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Keyword Analysis */}
              {analysis.keyword_analysis && (
                <Card className="bg-cyan-950/20 border-cyan-500/30">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-lg font-bold text-white">Keyword Analysis</h3>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {analysis.keyword_analysis.missing_keywords?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Missing Keywords</p>
                          <div className="flex flex-wrap gap-2">
                            {analysis.keyword_analysis.missing_keywords.slice(0, 5).map((kw, i) => (
                              <Badge key={i} className="bg-red-500/20 border-red-500/40 text-red-400 text-xs">
                                {kw}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysis.keyword_analysis.suggested_keywords?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">Suggested Keywords</p>
                          <div className="flex flex-wrap gap-2">
                            {analysis.keyword_analysis.suggested_keywords.slice(0, 5).map((kw, i) => (
                              <Badge key={i} className="bg-cyan-500/20 border-cyan-500/40 text-cyan-400 text-xs">
                                {kw}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              <Card className="bg-white/3 border border-white/8">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-white">Actionable Recommendations</h3>
                  </div>
                  <RecommendationList recommendations={analysis.recommendations} />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}