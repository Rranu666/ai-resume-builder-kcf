import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Flame, Star, Coins, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const BADGE_META = {
  first_resume: { label: "Resume Creator", emoji: "📄" },
  streak_7: { label: "Week Warrior", emoji: "🔥" },
  streak_30: { label: "Month Master", emoji: "💎" },
  points_100: { label: "Rising Star", emoji: "⭐" },
  points_500: { label: "Career Champion", emoji: "🏆" },
  interview_warrior: { label: "Interview Warrior", emoji: "🎤" },
};

export default function StreakWidget({ userEmail }) {
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    if (!userEmail) return;
    base44.entities.CareerStreak.filter({ user_email: userEmail })
      .then(data => { if (data.length > 0) setStreak(data[0]); })
      .catch(console.error);
  }, [userEmail]);

  if (!streak) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" /> Career Streak
        </h3>
        <span className="text-slate-400 text-sm">Longest: {streak.longest_streak || 0} days</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-3xl font-black text-orange-400">{streak.current_streak || 0}</div>
          <p className="text-slate-400 text-xs">Day Streak 🔥</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-violet-400">{streak.total_points || 0}</div>
          <p className="text-slate-400 text-xs">Total Points ⭐</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-cyan-400">{streak.career_tokens || 0}</div>
          <p className="text-slate-400 text-xs">Tokens 🪙</p>
        </div>
      </div>

      {streak.badges?.length > 0 && (
        <div>
          <p className="text-slate-400 text-xs mb-2">Badges earned:</p>
          <div className="flex flex-wrap gap-2">
            {streak.badges.map(badgeId => {
              const meta = BADGE_META[badgeId];
              if (!meta) return null;
              return (
                <span key={badgeId} className="inline-flex items-center gap-1 bg-white/10 text-white text-xs px-2.5 py-1 rounded-full" title={meta.label}>
                  {meta.emoji} {meta.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}