import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { file_url } = await req.json();

    if (!file_url) {
      return Response.json({ error: 'file_url is required' }, { status: 400 });
    }

    // Use LLM to extract resume data from PDF
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a resume parser. Extract the following information from the resume PDF and return as JSON:
      - full_name: Full name of the candidate
      - email: Email address
      - phone: Phone number
      - location: Location/city
      - linkedin: LinkedIn profile URL (if available)
      - website: Personal website or portfolio (if available)
      - summary: Professional summary or objective (if available)
      - skills: Array of technical and professional skills
      - experience: Array of work experiences with { title, company, location, start_date, end_date, current, description }
      - education: Array of education entries with { degree, institution, graduation_year, gpa }
      
      Return ONLY valid JSON, no other text.`,
      file_urls: [file_url],
      response_json_schema: {
        type: 'object',
        properties: {
          full_name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          location: { type: 'string' },
          linkedin: { type: 'string' },
          website: { type: 'string' },
          summary: { type: 'string' },
          skills: { type: 'array', items: { type: 'string' } },
          experience: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                company: { type: 'string' },
                location: { type: 'string' },
                start_date: { type: 'string' },
                end_date: { type: 'string' },
                current: { type: 'boolean' },
                description: { type: 'string' }
              }
            }
          },
          education: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                degree: { type: 'string' },
                institution: { type: 'string' },
                graduation_year: { type: 'string' },
                gpa: { type: 'string' }
              }
            }
          }
        }
      }
    });

    return Response.json({
      success: true,
      data: result
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});