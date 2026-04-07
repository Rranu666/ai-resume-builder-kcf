import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { industry, role, experience_level } = await req.json();
    if (!industry) return Response.json({ error: 'Industry is required' }, { status: 400 });

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a world-class labor market research analyst with access to real-time job market data (LinkedIn, Indeed, Glassdoor, Bureau of Labor Statistics, Stack Overflow Survey, TIOBE index, Burning Glass Technologies data).

Generate a comprehensive, data-rich job market intelligence report for:
- Industry: ${industry}
- Target Role: ${role || "General professional"}
- Experience Level: ${experience_level || "Mid-level"}
- Report Date: ${new Date().toISOString().split('T')[0]}

Provide realistic, current market data as if pulled from live sources. Be specific with numbers, percentages, and trends. Include actual company names, tools, and certifications that are real.

Return a complete JSON market intelligence report.`,
      add_context_from_internet: true,
      model: "gemini_3_flash",
      response_json_schema: {
        type: "object",
        properties: {
          market_summary: {
            type: "object",
            properties: {
              headline: { type: "string" },
              sentiment: { type: "string", enum: ["Very Hot", "Hot", "Moderate", "Cooling", "Cold"] },
              sentiment_reason: { type: "string" },
              yoy_job_growth: { type: "string" },
              open_positions_estimate: { type: "string" },
              avg_time_to_hire: { type: "string" },
              remote_percentage: { type: "number" }
            }
          },
          salary_data: {
            type: "object",
            properties: {
              currency: { type: "string" },
              entry_level: { type: "object", properties: { min: { type: "number" }, max: { type: "number" }, median: { type: "number" } } },
              mid_level: { type: "object", properties: { min: { type: "number" }, max: { type: "number" }, median: { type: "number" } } },
              senior_level: { type: "object", properties: { min: { type: "number" }, max: { type: "number" }, median: { type: "number" } } },
              top_paying_companies: { type: "array", items: { type: "object", properties: { company: { type: "string" }, avg_salary: { type: "number" }, perks: { type: "string" } } } },
              top_paying_locations: { type: "array", items: { type: "object", properties: { city: { type: "string" }, premium_percentage: { type: "number" } } } },
              salary_growth_yoy: { type: "number" }
            }
          },
          trending_skills: {
            type: "array",
            items: {
              type: "object",
              properties: {
                skill: { type: "string" },
                category: { type: "string" },
                demand_score: { type: "number" },
                growth_rate: { type: "string" },
                salary_premium: { type: "string" },
                trend: { type: "string", enum: ["exploding", "rising", "stable", "declining"] },
                jobs_mentioning: { type: "string" }
              }
            }
          },
          certifications: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                provider: { type: "string" },
                priority: { type: "string", enum: ["Critical", "High", "Medium", "Nice to Have"] },
                roi_score: { type: "number" },
                avg_salary_boost: { type: "string" },
                time_to_complete: { type: "string" },
                cost_range: { type: "string" },
                jobs_requiring: { type: "string" },
                why_prioritize: { type: "string" },
                difficulty: { type: "string", enum: ["Beginner", "Intermediate", "Advanced", "Expert"] }
              }
            }
          },
          hiring_companies: {
            type: "array",
            items: {
              type: "object",
              properties: {
                company: { type: "string" },
                hiring_volume: { type: "string" },
                culture_tag: { type: "string" },
                top_skill_needed: { type: "string" }
              }
            }
          },
          skill_gaps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                gap: { type: "string" },
                severity: { type: "string", enum: ["Critical", "High", "Medium"] },
                how_to_close: { type: "string" },
                timeline: { type: "string" }
              }
            }
          },
          market_insights: { type: "array", items: { type: "string" } },
          action_plan: {
            type: "array",
            items: {
              type: "object",
              properties: {
                week: { type: "string" },
                action: { type: "string" },
                impact: { type: "string" }
              }
            }
          }
        }
      }
    });

    return Response.json({ data: result, industry, role, generated_at: new Date().toISOString() });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});