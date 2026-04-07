import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const today = new Date().toISOString().split('T')[0];

    // Check if today's challenge exists
    const existing = await base44.asServiceRole.entities.DailyChallenge.filter({ challenge_date: today });
    if (existing.length > 0) {
      return Response.json({ challenge: existing[0] });
    }

    // Generate new challenge
    const categories = ['Behavioral', 'Technical', 'Leadership', 'Problem Solving', 'Culture Fit', 'Situational'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const difficulties = ['easy', 'medium', 'hard'];
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

    const prompt = `Generate 1 professional interview question for the category: ${category}, difficulty: ${difficulty}.
The question should be realistic, commonly asked in interviews, and thought-provoking.
Return only the question text, nothing else.`;

    const question = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    const challenge = await base44.asServiceRole.entities.DailyChallenge.create({
      challenge_date: today,
      question: question.trim(),
      category,
      difficulty,
      total_responses: 0
    });

    return Response.json({ challenge });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});