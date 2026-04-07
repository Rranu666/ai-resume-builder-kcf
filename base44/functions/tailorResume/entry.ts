import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { resumeId, jobDescription, jobUrl } = await req.json();

    // If URL provided, fetch the page content
    let jdText = jobDescription || '';
    if (jobUrl && !jdText) {
      try {
        const response = await fetch(jobUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JobFetcher/1.0)' }
        });
        const html = await response.text();
        // Strip HTML tags and clean up
        jdText = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 8000); // cap at 8000 chars
      } catch (e) {
        return Response.json({ error: 'Could not fetch job URL. Please paste the job description directly.' }, { status: 400 });
      }
    }

    if (!jdText || jdText.length < 30) {
      return Response.json({ error: 'Job description is too short or empty.' }, { status: 400 });
    }

    const resume = await base44.entities.Resume.get(resumeId);
    if (!resume) return Response.json({ error: 'Resume not found' }, { status: 404 });

    const prompt = `You are a world-class resume writer and ATS optimization specialist with 15+ years of experience placing candidates at top companies.

TASK: Deeply analyze the gap between this resume and job description, then produce a fully tailored version.

═══ ORIGINAL RESUME ═══
Name: ${resume.personal_info?.full_name}
Summary: ${resume.personal_info?.summary}
Skills: ${resume.skills?.join(', ')}
Experience:
${(resume.experience || []).map((e, i) => `
Role ${i+1}: ${e.title} at ${e.company}
Bullets: ${(e.bullets || []).join(' | ')}`).join('\n')}
Education: ${(resume.education || []).map(e => `${e.degree} from ${e.institution}`).join(', ')}

═══ JOB DESCRIPTION ═══
${jdText}

═══ INSTRUCTIONS ═══
1. MISSING KEYWORDS: Identify important keywords/phrases in the JD NOT present in the resume
2. SKILLS GAP: Identify required skills in JD that are missing from resume
3. SKILLS TO ADD: Suggest skills the candidate should highlight or add (only if legitimately inferable)
4. REWRITE SUMMARY: Craft a compelling summary that mirrors JD language and addresses the exact role
5. REWRITE BULLETS: For EACH experience role, rewrite/rephrase bullets to:
   - Use JD keywords naturally
   - Lead with strong action verbs
   - Quantify achievements where possible
   - Remove irrelevant content
   - Keep factually accurate (no fabrication)
6. MATCH SCORE: Estimate ATS match percentage before and after tailoring
7. ROLE FIT ANALYSIS: 2-sentence assessment of how well this candidate fits the role

Return comprehensive JSON.`;

    const tailored = await base44.integrations.Core.InvokeLLM({
      prompt,
      model: 'claude_sonnet_4_6',
      response_json_schema: {
        type: "object",
        properties: {
          summary: { type: "string" },
          experience: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                company: { type: "string" },
                location: { type: "string" },
                start_date: { type: "string" },
                end_date: { type: "string" },
                current: { type: "boolean" },
                original_bullets: { type: "array", items: { type: "string" } },
                bullets: { type: "array", items: { type: "string" } }
              }
            }
          },
          skills: { type: "array", items: { type: "string" } },
          missing_keywords: { type: "array", items: { type: "string" } },
          keywords_added: { type: "array", items: { type: "string" } },
          skills_to_add: { type: "array", items: { type: "string" } },
          skills_gap: { type: "array", items: { type: "string" } },
          match_score_before: { type: "number" },
          match_score_after: { type: "number" },
          role_fit_analysis: { type: "string" },
          top_improvements: { type: "array", items: { type: "string" } }
        }
      }
    });

    // Merge original bullet data for side-by-side comparison
    const mergedExperience = (tailored.experience || []).map((tailoredExp, i) => {
      const original = resume.experience?.[i] || {};
      return {
        ...original,
        ...tailoredExp,
        original_bullets: tailoredExp.original_bullets || original.bullets || [],
        bullets: tailoredExp.bullets || original.bullets || []
      };
    });

    // Create a new tailored resume copy
    const newResume = await base44.entities.Resume.create({
      title: `${resume.title} — Tailored`,
      template: resume.template,
      personal_info: { ...resume.personal_info, summary: tailored.summary },
      experience: mergedExperience.map(e => ({
        title: e.title, company: e.company, location: e.location,
        start_date: e.start_date, end_date: e.end_date, current: e.current,
        bullets: e.bullets
      })),
      education: resume.education,
      skills: tailored.skills || resume.skills,
      projects: resume.projects,
      ats_score: tailored.match_score_after || tailored.match_score || resume.ats_score,
    });

    return Response.json({
      newResumeId: newResume.id,
      tailored: { ...tailored, experience: mergedExperience },
      matchScoreBefore: tailored.match_score_before,
      matchScoreAfter: tailored.match_score_after,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});