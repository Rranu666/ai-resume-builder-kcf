import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { role, companySize, currentOffer, targetSalary, userMessage, conversationHistory } = await req.json();

    const systemPrompt = `You are playing the role of a professional HR Manager at a ${companySize || 'mid-size'} company. You are negotiating salary with a candidate for the role of ${role || 'Software Engineer'}.

The current offer on the table is ${currentOffer || '$80,000'}.
You have some flexibility but will push back firmly. Be realistic and professional.

After 3-4 exchanges, if the negotiation is going well, offer a counter. 
After the negotiation ends (either deal made or candidate accepted/rejected), provide:
- NEGOTIATION_SCORE: X/100
- FEEDBACK: 2-3 sentences on what they did well and what to improve
- FINAL_OUTCOME: [DEAL_MADE/NO_DEAL/OFFER_ACCEPTED]

Stay in character as HR until explicitly asked for feedback.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: userMessage }
    ];

    const prompt = messages.map(m => `${m.role === 'user' ? 'Candidate' : m.role === 'system' ? 'System' : 'HR Manager'}: ${m.content}`).join('\n\n');

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: prompt + '\n\nHR Manager:'
    });

    return Response.json({ response: response.trim() });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});