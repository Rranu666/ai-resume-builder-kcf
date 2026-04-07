import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { challengeId, question, responseText } = await req.json();

    const prompt = `You are an expert interview coach. Evaluate this interview response.

Question: ${question}
Candidate's Answer: ${responseText}

Score on a scale of 0-100 and provide specific feedback on:
1. Content quality (relevance, depth, examples)
2. Structure (clear opening, body, conclusion)
3. Professionalism (appropriate language, confidence)

Return JSON with score (number 0-100) and feedback (2-3 sentences of specific, actionable feedback).`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          score: { type: "number" },
          feedback: { type: "string" }
        }
      }
    });

    const response = await base44.entities.ChallengeResponse.create({
      user_email: user.email,
      challenge_id: challengeId,
      challenge_date: new Date().toISOString().split('T')[0],
      response_text: responseText,
      ai_score: result.score,
      ai_feedback: result.feedback
    });

    // Award streak points
    const streaks = await base44.entities.CareerStreak.filter({ user_email: user.email });
    const today = new Date().toISOString().split('T')[0];

    if (streaks.length > 0) {
      const streak = streaks[0];
      const lastDate = streak.last_activity_date;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = lastDate === yesterday ? streak.current_streak + 1 : (lastDate === today ? streak.current_streak : 1);
      await base44.entities.CareerStreak.update(streak.id, {
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, streak.longest_streak || 0),
        last_activity_date: today,
        total_points: (streak.total_points || 0) + 15,
        career_tokens: (streak.career_tokens || 0) + 1
      });
    } else {
      await base44.entities.CareerStreak.create({
        user_email: user.email,
        current_streak: 1,
        longest_streak: 1,
        last_activity_date: today,
        total_points: 15,
        career_tokens: 11,
        badges: [],
        daily_actions: []
      });
    }

    return Response.json({ score: result.score, feedback: result.feedback, responseId: response.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});