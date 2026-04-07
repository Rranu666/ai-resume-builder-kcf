import { supabase } from './supabaseClient';
import { createEntity } from './entityHelper';

// ─── Auth shim ────────────────────────────────────────────────────────────────

const formatUser = (supabaseUser) => ({
  id: supabaseUser.id,
  email: supabaseUser.email,
  custom_theme: supabaseUser.user_metadata?.custom_theme,
  ...supabaseUser.user_metadata,
});

const auth = {
  async isAuthenticated() {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  },

  async me() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Not authenticated');

    // Merge profile data from profiles table if available
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      ...formatUser(user),
      ...(profile || {}),
    };
  },

  async logout(redirectUrl) {
    await supabase.auth.signOut();
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  },

  redirectToLogin(returnUrl) {
    const params = returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : '';
    window.location.href = `/login${params}`;
  },
};

// ─── Integrations shim ────────────────────────────────────────────────────────

const callFunction = async (fnName, payload) => {
  const response = await fetch(`/.netlify/functions/${fnName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Function ${fnName} failed: ${text}`);
  }
  return response.json();
};

const Core = {
  async InvokeLLM(params) {
    return callFunction('invoke-llm', params);
  },

  async SendEmail(params) {
    return callFunction('send-email', params);
  },

  async SendSMS(params) {
    return callFunction('send-sms', params);
  },

  async GenerateImage(params) {
    return callFunction('generate-image', params);
  },

  async ExtractDataFromUploadedFile(params) {
    return callFunction('extract-data', params);
  },

  async UploadFile({ file }) {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'anon';
    const ext = file.name?.split('.').pop() || 'bin';
    const fileName = `${userId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('uploads')
      .upload(fileName, file, { upsert: true });
    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName);

    return { file_url: publicUrl };
  },
};

const integrations = { Core };

// ─── Entities shim (for components that access via base44.entities.*) ─────────

const entities = {
  CareerStreak: createEntity('career_streaks', { userScoped: false }),
  DailyChallenge: createEntity('daily_challenges', { userScoped: false }),
  ChallengeResponse: createEntity('challenge_responses', { userScoped: true }),
  Resume: createEntity('resumes', { userScoped: true }),
  Job: createEntity('jobs', { userScoped: false }),
};

// ─── App logs shim (no-op) ────────────────────────────────────────────────────

const appLogs = {
  logUserInApp: () => Promise.resolve(),
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const base44 = { auth, integrations, entities, appLogs };
