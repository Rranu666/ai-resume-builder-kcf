import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { resumeId, targetRole, targetCompanies } = await req.json();
    const resume = resumeId ? await base44.entities.Resume.get(resumeId) : null;

    const prompt = `You are a LinkedIn growth strategist and personal branding expert. Create a 30-day LinkedIn content calendar for this professional.

Profile:
Name: ${resume?.personal_info?.full_name || user.full_name}
Role/Target: ${targetRole || resume?.personal_info?.summary || 'Career professional'}
Skills: ${resume?.skills?.slice(0, 8).join(', ') || 'Not specified'}
Target Companies: ${targetCompanies || 'Not specified'}

Generate a 30-day content plan with:
- Week 1: Establish expertise (4 posts)
- Week 2: Share insights (4 posts)  
- Week 3: Storytelling (4 posts)
- Week 4: Engagement & networking (4 posts)

For each post provide: day number, post type, hook (first line), key message, call to action, best time to post.
Also include: 5 profile optimization tips specific to their role.`;

    const plan = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          posts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                day: { type: "number" },
                type: { type: "string" },
                hook: { type: "string" },
                message: { type: "string" },
                cta: { type: "string" },
                best_time: { type: "string" }
              }
            }
          },
          profile_tips: { type: "array", items: { type: "string" } },
          headline_suggestions: { type: "array", items: { type: "string" } }
        }
      }
    });

    return Response.json({ plan });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});