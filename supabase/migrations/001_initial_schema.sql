-- ============================================================
-- AI Resume Builder — Initial Supabase Schema
-- Run this in the Supabase SQL Editor for your new project
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES ────────────────────────────────────────────────────────────────
-- Extended user profile data (linked to auth.users)

CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  phone       TEXT,
  location    TEXT,
  bio         TEXT,
  avatar      TEXT,
  job_title   TEXT,
  company     TEXT,
  experience_years TEXT,
  skills      JSONB DEFAULT '[]',
  custom_theme JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─── RESUMES ─────────────────────────────────────────────────────────────────

CREATE TABLE public.resumes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL DEFAULT 'Untitled Resume',
  template      TEXT DEFAULT 'modern',
  personal_info JSONB DEFAULT '{}',
  experience    JSONB DEFAULT '[]',
  education     JSONB DEFAULT '[]',
  skills        JSONB DEFAULT '[]',
  projects      JSONB DEFAULT '[]',
  ats_score     NUMERIC DEFAULT 0,
  last_exported TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own resumes"
  ON public.resumes
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─── JOBS ────────────────────────────────────────────────────────────────────

CREATE TABLE public.jobs (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                TEXT NOT NULL,
  company              TEXT NOT NULL,
  location             TEXT NOT NULL,
  type                 TEXT DEFAULT 'full-time',
  experience_level     TEXT DEFAULT 'mid',
  salary_min           NUMERIC,
  salary_max           NUMERIC,
  description          TEXT NOT NULL,
  requirements         JSONB DEFAULT '[]',
  skills               JSONB DEFAULT '[]',
  benefits             JSONB DEFAULT '[]',
  posted_date          DATE,
  application_deadline DATE,
  company_logo         TEXT,
  is_trending          BOOLEAN DEFAULT FALSE,
  remote_friendly      BOOLEAN DEFAULT FALSE,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Jobs are public to read; only service role / admin can write
CREATE POLICY "Anyone can read jobs"
  ON public.jobs FOR SELECT
  USING (true);


-- ─── CAREER STREAKS ──────────────────────────────────────────────────────────

CREATE TABLE public.career_streaks (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email         TEXT,
  current_streak     INTEGER DEFAULT 0,
  longest_streak     INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_points       INTEGER DEFAULT 0,
  career_tokens      INTEGER DEFAULT 10,
  daily_actions      JSONB DEFAULT '[]',
  badges             JSONB DEFAULT '[]',
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.career_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own streak"
  ON public.career_streaks
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow filter by user_email (used in StreakWidget)
CREATE POLICY "Public read of career streaks by email"
  ON public.career_streaks FOR SELECT
  USING (true);


-- ─── DAILY CHALLENGES ────────────────────────────────────────────────────────

CREATE TABLE public.daily_challenges (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date  DATE NOT NULL,
  question        TEXT NOT NULL,
  category        TEXT,
  difficulty      TEXT DEFAULT 'medium',
  total_responses INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read daily challenges"
  ON public.daily_challenges FOR SELECT
  USING (true);


-- ─── CHALLENGE RESPONSES ─────────────────────────────────────────────────────

CREATE TABLE public.challenge_responses (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email       TEXT,
  challenge_id     UUID REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  challenge_date   DATE,
  response_text    TEXT,
  ai_score         NUMERIC,
  ai_feedback      TEXT,
  rank_percentile  NUMERIC,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.challenge_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own challenge responses"
  ON public.challenge_responses
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─── STORAGE BUCKET ──────────────────────────────────────────────────────────
-- Run this separately if the bucket does not already exist

INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view uploads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'uploads');

CREATE POLICY "Users can delete their own uploads"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
