import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { resumeId } = await req.json();
    const resume = await base44.entities.Resume.get(resumeId);
    if (!resume) return Response.json({ error: 'Resume not found' }, { status: 404 });

    const prompt = `You are a HOSTILE ATS system and a skeptical senior recruiter who is looking for every possible reason to REJECT this resume. Be brutally honest, adversarial, and specific.

Resume Data:
Name: ${resume.personal_info?.full_name}
Summary: ${resume.personal_info?.summary}
Experience: ${JSON.stringify(resume.experience?.slice(0, 3))}
Education: ${JSON.stringify(resume.education)}
Skills: ${resume.skills?.join(', ')}

Generate a "Rejection Report" with:
1. Top 5 reasons an ATS would auto-reject this resume
2. Top 3 reasons a recruiter would toss it in 6 seconds
3. Specific weak words/phrases found and better alternatives
4. Missing critical keywords for this type of role
5. Formatting/structure issues that hurt parsing
6. Overall "Survivability Score" out of 100 (be harsh)
7. The 3 most critical fixes that would change the outcome

Be brutally honest but constructive. This helps the user improve.`;

    const report = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          ats_rejections: { type: "array", items: { type: "string" } },
          recruiter_rejections: { type: "array", items: { type: "string" } },
          weak_phrases: { type: "array", items: { type: "object", properties: { original: { type: "string" }, better: { type: "string" } } } },
          missing_keywords: { type: "array", items: { type: "string" } },
          formatting_issues: { type: "array", items: { type: "string" } },
          survivability_score: { type: "number" },
          critical_fixes: { type: "array", items: { type: "string" } },
          summary: { type: "string" }
        }
      }
    });

    return Response.json({ report });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});