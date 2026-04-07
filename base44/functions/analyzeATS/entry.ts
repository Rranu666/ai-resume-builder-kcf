import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { resumeId } = await req.json();
        
        if (!resumeId) {
            return Response.json({ error: 'Resume ID required' }, { status: 400 });
        }

        const resume = await base44.entities.Resume.get(resumeId);
        
        if (!resume) {
            return Response.json({ error: 'Resume not found' }, { status: 404 });
        }

        // Analyze resume using LLM
        const result = await base44.integrations.Core.InvokeLLM({
            prompt: `You are an ATS (Applicant Tracking System) expert analyzing a resume. Provide detailed analysis and scoring.

Resume Data:
- Title: ${resume.title}
- Summary: ${resume.personal_info?.summary || 'N/A'}
- Skills: ${(resume.skills || []).join(', ')}
- Experience: ${(resume.experience || []).map(e => `${e.title} at ${e.company} - ${(e.bullets || []).join('; ')}`).join(' | ')}
- Education: ${(resume.education || []).map(e => `${e.degree} from ${e.institution}`).join(' | ')}
- Projects: ${(resume.projects || []).map(p => `${p.name}: ${p.description}`).join(' | ')}

Analyze the following dimensions (score each 0-100):
1. KEYWORD_DENSITY: Are relevant industry keywords present? Are skills clearly highlighted?
2. FORMATTING: Is the structure ATS-friendly? Clear sections, standard headings, no complex formatting?
3. IMPACT: Do bullet points use action verbs and quantifiable achievements?
4. COMPLETENESS: Are all essential sections present (summary, experience, skills, education)?
5. RELEVANCE: Is content tailored and specific rather than generic?

Calculate overall STRENGTH_SCORE as weighted average:
- Keyword Density: 30%
- Formatting: 20%
- Impact: 30%
- Completeness: 10%
- Relevance: 10%

Provide specific, actionable recommendations for improvement.`,
            response_json_schema: {
                type: "object",
                properties: {
                    overall_score: { type: "number", description: "Overall ATS strength score 0-100" },
                    dimension_scores: {
                        type: "object",
                        properties: {
                            keyword_density: { type: "number" },
                            formatting: { type: "number" },
                            impact: { type: "number" },
                            completeness: { type: "number" },
                            relevance: { type: "number" }
                        }
                    },
                    analysis: {
                        type: "object",
                        properties: {
                            strengths: { type: "array", items: { type: "string" } },
                            weaknesses: { type: "array", items: { type: "string" } }
                        }
                    },
                    recommendations: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                category: { type: "string", enum: ["keywords", "formatting", "impact", "completeness", "relevance"] },
                                priority: { type: "string", enum: ["high", "medium", "low"] },
                                action: { type: "string" },
                                example: { type: "string" }
                            }
                        }
                    },
                    keyword_analysis: {
                        type: "object",
                        properties: {
                            missing_keywords: { type: "array", items: { type: "string" } },
                            overused_keywords: { type: "array", items: { type: "string" } },
                            suggested_keywords: { type: "array", items: { type: "string" } }
                        }
                    }
                },
                required: ["overall_score", "dimension_scores", "analysis", "recommendations"]
            },
        });

        // Update resume with new ATS score
        if (result.overall_score) {
            await base44.entities.Resume.update(resumeId, { 
                ats_score: result.overall_score 
            });
        }

        return Response.json({ analysis: result, resumeId });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});