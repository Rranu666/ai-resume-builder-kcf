import { supabase } from './supabaseClient';

// Maps Supabase row fields to Base44-compatible field names
const toRecord = (row) => {
  if (!row) return null;
  const { created_at, updated_at, ...rest } = row;
  return {
    ...rest,
    created_date: created_at,
    updated_date: updated_at || created_at,
  };
};

const sortFieldMap = {
  updated_date: 'updated_at',
  '-updated_date': 'updated_at',
  created_date: 'created_at',
  '-created_date': 'created_at',
};

/**
 * Creates a Base44-compatible entity object backed by a Supabase table.
 * @param {string} tableName - The Supabase table name
 * @param {object} opts
 * @param {boolean} opts.userScoped - Whether rows are scoped to the current user (default true)
 */
export const createEntity = (tableName, { userScoped = true } = {}) => ({
  async list(sort = '-updated_date') {
    const ascending = !sort.startsWith('-');
    const sortKey = sort.startsWith('-') ? sort.slice(1) : sort;
    const dbField = sortFieldMap[sortKey] || sortFieldMap[`-${sortKey}`] || sortKey;

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order(dbField, { ascending });

    if (error) throw error;
    return (data || []).map(toRecord);
  },

  async get(id) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return toRecord(data);
  },

  async create(payload) {
    const { created_date, updated_date, ...insertData } = payload;

    if (userScoped) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) insertData.user_id = user.id;
    }

    const { data, error } = await supabase
      .from(tableName)
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return toRecord(data);
  },

  async update(id, payload) {
    const { created_date, updated_date, id: _id, user_id, ...updateData } = payload;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return toRecord(data);
  },

  async delete(id) {
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) throw error;
  },

  async filter(conditions) {
    let query = supabase.from(tableName).select('*');
    Object.entries(conditions).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(toRecord);
  },
});
