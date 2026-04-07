import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const resumes = await base44.entities.Resume.filter({ created_by: user.email });
    const avgATS = resumes.length > 0
      ? Math.round(resumes.reduce((s, r) => s + (r.ats_score || 0), 0) / resumes.length)
      : 0;

    const prompt = `You are a career coach. Generate a personalized weekly career digest for a job seeker.
User: ${user.full_name}
Total Resumes: ${resumes.length}
Average ATS Score: ${avgATS}%
Top Skills: ${resumes[0]?.skills?.slice(0, 5).join(', ') || 'Not specified'}
Target Role: ${resumes[0]?.personal_info?.summary?.slice(0, 100) || 'Not specified'}

Generate:
1. A personalized motivational message
2. 3 trending skills in their field this week
3. 2 specific tips to improve their ATS score
4. 1 interview question to practice today
5. A weekly action item

Keep it concise, warm, and actionable.`;

    const digest = await base44.integrations.Core.InvokeLLM({ prompt });

    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject: `🚀 Your Weekly Career Digest - ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`,
      body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #060b12; color: #e2e8f0; padding: 32px; border-radius: 12px;">
        <h1 style="color: #34d399; font-size: 24px; margin-bottom: 8px;">Your Weekly Career Digest 🚀</h1>
        <p style="color: #94a3b8; margin-bottom: 24px;">Hi ${user.full_name}, here's your personalized update:</p>
        <div style="background: #0d1420; border: 1px solid rgba(52,211,153,0.2); border-radius: 8px; padding: 20px; margin-bottom: 16px;">
          <p style="white-space: pre-wrap; line-height: 1.7;">${digest}</p>
        </div>
        <div style="background: linear-gradient(135deg, #065f46, #0e7490); border-radius: 8px; padding: 16px; text-align: center;">
          <p style="margin: 0; font-weight: bold;">Your Current ATS Score: ${avgATS}%</p>
        </div>
        <p style="margin-top: 24px; color: #64748b; font-size: 12px;">KCF Resume Builder — Powered by Kindness Community Foundation</p>
      </div>`
    });

    return Response.json({ success: true, digest });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});