import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const SYSTEM_PROMPT = `You are KCF Bot, the helpful AI assistant for the AI Resume Builder — a free initiative by Kindness Community Foundation (KCF LLC), California, USA.

KEY FEATURES: Resume Builder (AI-powered), ATS Scanner, Cover Letter AI, Career Roadmap, Interview Practice (free), Analytics, 12+ Templates.
NAVIGATION: Dashboard=/Dashboard, Templates=/Templates, ATS Scanner=/ATSScanner, Cover Letter=/CoverLetter, Career Roadmap=/CareerRoadmap, Interview Practice=/InterviewPrep, Analytics=/Analytics, About=/About, Contact=/Contact
SUPPORT: contact@kindnesscommunityfoundation.com

Be warm, helpful, and VERY concise (2-3 sentences max). Use **bold** for emphasis. Never invent features.`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { message, history = [] } = await req.json();

    if (!message?.trim()) {
      return Response.json({ error: 'No message provided' }, { status: 400 });
    }

    const historyText = history.slice(-6).map(m => `${m.role === 'bot' ? 'KCF Bot' : 'User'}: ${m.text}`).join('\n');
    
    const prompt = `${SYSTEM_PROMPT}

${historyText ? `RECENT CONVERSATION:\n${historyText}\n` : ''}User: ${message.trim()}

Respond as KCF Bot:`;

    const reply = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    return Response.json({ reply: typeof reply === 'string' ? reply : reply?.text || 'I\'m here to help! Email contact@kindnesscommunityfoundation.com for more assistance.' });
  } catch (error) {
    return Response.json({ reply: 'Sorry, I ran into an issue. Please try again or email contact@kindnesscommunityfoundation.com.' });
  }
});