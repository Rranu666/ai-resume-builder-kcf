import { supabase } from './supabaseClient';

// Query helper (thin wrapper around supabase for raw queries)
export const Query = {
  async execute(table, options = {}) {
    let query = supabase.from(table).select(options.select || '*');
    if (options.filter) {
      Object.entries(options.filter).forEach(([k, v]) => { query = query.eq(k, v); });
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
};

// User auth accessor (used as base44.auth equivalent)
export const User = {
  async me() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Not authenticated');
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    return {
      id: user.id,
      email: user.email,
      ...user.user_metadata,
      ...(profile || {}),
    };
  },

  async updateMyUserData(data) {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Not authenticated');

    const { custom_theme, ...profileData } = data;

    // Update profile table
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...profileData, updated_at: new Date().toISOString() });
    if (profileError) throw profileError;

    // Update user_metadata for custom_theme
    if (custom_theme !== undefined) {
      await supabase.auth.updateUser({ data: { custom_theme } });
    }
  },
};
