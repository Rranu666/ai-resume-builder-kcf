import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { action, points } = await req.json();
    const today = new Date().toISOString().split('T')[0];

    const BADGE_RULES = [
      { id: 'first_resume', label: '📄 Resume Creator', condition: (s) => s.total_points >= 10 },
      { id: 'streak_7', label: '🔥 Week Warrior', condition: (s) => s.current_streak >= 7 },
      { id: 'streak_30', label: '💎 Month Master', condition: (s) => s.current_streak >= 30 },
      { id: 'points_100', label: '⭐ Rising Star', condition: (s) => s.total_points >= 100 },
      { id: 'points_500', label: '🏆 Career Champion', condition: (s) => s.total_points >= 500 },
      { id: 'interview_warrior', label: '🎤 Interview Warrior', condition: (s) => s.total_points >= 150 },
    ];

    const existing = await base44.entities.CareerStreak.filter({ user_email: user.email });
    const earnedPoints = points || 10;
    let streakData;

    if (existing.length > 0) {
      const streak = existing[0];
      const lastDate = streak.last_activity_date;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = lastDate === today
        ? streak.current_streak
        : (lastDate === yesterday ? streak.current_streak + 1 : 1);

      const newTotal = (streak.total_points || 0) + earnedPoints;
      const currentBadges = streak.badges || [];
      const newBadges = BADGE_RULES
        .filter(b => !currentBadges.includes(b.id) && b.condition({ ...streak, current_streak: newStreak, total_points: newTotal }))
        .map(b => b.id);

      streakData = await base44.entities.CareerStreak.update(streak.id, {
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, streak.longest_streak || 0),
        last_activity_date: today,
        total_points: newTotal,
        career_tokens: Math.min((streak.career_tokens || 0) + 1, 50),
        badges: [...currentBadges, ...newBadges],
        daily_actions: [...(streak.daily_actions || []).slice(-29), { date: today, action, points: earnedPoints }]
      });

      return Response.json({ streak: streakData, newBadges: newBadges.map(id => BADGE_RULES.find(b => b.id === id)) });
    } else {
      streakData = await base44.entities.CareerStreak.create({
        user_email: user.email,
        current_streak: 1,
        longest_streak: 1,
        last_activity_date: today,
        total_points: earnedPoints,
        career_tokens: 11,
        badges: [],
        daily_actions: [{ date: today, action, points: earnedPoints }]
      });
      return Response.json({ streak: streakData, newBadges: [] });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});