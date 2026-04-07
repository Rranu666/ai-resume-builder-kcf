import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { resumeId, targetRole, targetSalary } = await req.json();
    const resume = await base44.entities.Resume.get(resumeId);

    const prompt = `You are a career trajectory simulator with access to real labor market data. Simulate two career paths for this professional.

CURRENT PROFILE:
Name: ${resume?.personal_info?.full_name || user.full_name}
Current Role/Summary: ${resume?.personal_info?.summary || 'Not specified'}
Skills: ${resume?.skills?.join(', ') || 'Not specified'}
Experience: ${resume?.experience?.length || 0} roles
Education: ${JSON.stringify(resume?.education?.[0] || {})}
Target Role: ${targetRole}
Target Salary: ${targetSalary || 'Not specified'}

Generate two detailed career simulations:

PATH A (Takes Action - follows the roadmap):
- Year 1, Year 3, Year 5 projections (title, salary, skills acquired, key milestones)

PATH B (Status Quo - no significant changes):
- Year 1, Year 3, Year 5 projections

Include projected salary ranges, title progression, and the key decision points.`;

    const simulation = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          path_a: {
            type: "object",
            properties: {
              title: { type: "string" },
              year_1: { type: "object", properties: { title: { type: "string" }, salary: { type: "string" }, milestone: { type: "string" } } },
              year_3: { type: "object", properties: { title: { type: "string" }, salary: { type: "string" }, milestone: { type: "string" } } },
              year_5: { type: "object", properties: { title: { type: "string" }, salary: { type: "string" }, milestone: { type: "string" } } }
            }
          },
          path_b: {
            type: "object",
            properties: {
              title: { type: "string" },
              year_1: { type: "object", properties: { title: { type: "string" }, salary: { type: "string" }, milestone: { type: "string" } } },
              year_3: { type: "object", properties: { title: { type: "string" }, salary: { type: "string" }, milestone: { type: "string" } } },
              year_5: { type: "object", properties: { title: { type: "string" }, salary: { type: "string" }, milestone: { type: "string" } } }
            }
          },
          key_decisions: { type: "array", items: { type: "string" } },
          salary_gap_5yr: { type: "string" },
          motivational_message: { type: "string" }
        }
      }
    });

    return Response.json({ simulation });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});